/* ============================================================
   CadetToCSP — Firebase backend client (js/firebase.js)
   Plain <script> file (NO ES modules) so the site works from
   file:// as well as from any static host.
   Loaded AFTER the Firebase compat SDK scripts and AFTER
   js/firebase-config.js. Exposes window.CadetBackend.

   Firebase JS SDK (compat builds, verified against Google's
   official docs, Nov 2026 — version 12.11.0):
   - https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js
   - https://www.gstatic.com/firebasejs/12.11.0/firebase-auth-compat.js
   - https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore-compat.js
   Compat API: firebase.initializeApp(config),
   firebase.auth().createUserWithEmailAndPassword /
   signInWithEmailAndPassword / signOut /
   sendPasswordResetEmail / onAuthStateChanged,
   firebase.firestore().collection('users').doc(uid).set/get.

   GUEST MODE: if js/firebase-config.js still holds the
   "YOUR_..." placeholders (or the SDK fails to load), every
   method below is a safe no-op and the site keeps working
   exactly as before — accounts and progress in localStorage
   only. Nothing here ever logs a password, API key or token.

   Data model (Cloud Firestore, one document per user):
   users/{uid} = {
     profile:    { name, email, createdAt, updatedAt },
     testHistory: [ {subject, mode, netScore, total, accuracy,
                    correct, wrong, date} ],   // newest first, max 10
     streak:     { lastDate: "YYYY-MM-DD", count: N },
     updatedAt:  serverTimestamp
   }
   Local storage (localStorage) stays the live mirror: the
   dashboard and quiz engine keep reading testHistory /
   cadetStreak / userName / userEmail from localStorage, and
   this module syncs that mirror to Firestore when a user is
   signed in.
   ============================================================ */

(function () {
  'use strict';

  var CONFIG = window.CADET_FIREBASE_CONFIG || {};
  var MIGRATED_KEY = 'cadetCloudMigratedUid';
  var OPTIN_KEY = 'cadetLeaderboardOptIn'; // local cache: '1' = show me, '0' = hidden
  var LEADERBOARD_COLLECTION = 'leaderboard';
  var MAX_HISTORY = 10;

  var auth = null;
  var db = null;
  var currentUser = null;
  var authKnown = false;      // onAuthStateChanged has fired at least once
  var initState = 'unknown';  // 'ready' | 'not-configured' | 'no-sdk' | 'error'
  var initError = null;
  var listeners = [];

  /* ---------- Config detection (pure, tested) ---------- */
  function isPlaceholder(v) {
    return !v || typeof v !== 'string' || v.indexOf('YOUR_') === 0;
  }

  function isConfigured() {
    return !isPlaceholder(CONFIG.apiKey) &&
      !isPlaceholder(CONFIG.projectId) &&
      !isPlaceholder(CONFIG.appId);
  }

  /* ---------- Local mirror helpers ---------- */
  function readLocalHistory() {
    try {
      var h = JSON.parse(localStorage.getItem('testHistory') || '[]');
      return Array.isArray(h) ? h : [];
    } catch (e) { return []; }
  }

  function writeLocalHistory(history) {
    try {
      localStorage.setItem('testHistory', JSON.stringify((history || []).slice(0, MAX_HISTORY)));
    } catch (e) { /* storage unavailable */ }
  }

  function readLocalStreak() {
    try {
      var s = JSON.parse(localStorage.getItem('cadetStreak') || 'null');
      return (s && typeof s === 'object') ? s : { lastDate: null, count: 0 };
    } catch (e) { return { lastDate: null, count: 0 }; }
  }

  function writeLocalStreak(streak) {
    try {
      localStorage.setItem('cadetStreak', JSON.stringify(streak || { lastDate: null, count: 0 }));
    } catch (e) { /* storage unavailable */ }
  }

  function getMigratedUid() {
    try { return localStorage.getItem(MIGRATED_KEY) || ''; } catch (e) { return ''; }
  }

  function setMigratedUid(uid) {
    try { localStorage.setItem(MIGRATED_KEY, uid); } catch (e) { /* ignore */ }
  }

  /* ---------- Leaderboard opt-in (local cache; default: shown) ---------- */
  function getLeaderboardOptIn() {
    try {
      var v = localStorage.getItem(OPTIN_KEY);
      return v === null ? true : v === '1';
    } catch (e) { return true; }
  }

  function setOptInLocal(on) {
    try { localStorage.setItem(OPTIN_KEY, on ? '1' : '0'); } catch (e) { /* ignore */ }
  }

  function displayNameFor(user) {
    if (!user) return 'Aspirant';
    try {
      var local = localStorage.getItem('userName') || '';
      if (local) return local;
    } catch (e) { /* ignore */ }
    return (user.displayName || (user.email || '').split('@')[0] || 'Aspirant');
  }

  /* Minimal fallback for the leaderboard totals, used only when
     js/analytics.js failed to load. Same stars rule — keep in sync
     with js/analytics.js (accuracy >= 90 -> 3, >= 70 -> 2, >= 50 -> 1). */
  function computeEntryFallback(displayName, history, streak) {
    var h = Array.isArray(history) ? history : [];
    var totalScore = 0;
    var totalStars = 0;
    var bestScore = 0;
    var i;
    for (i = 0; i < h.length; i++) {
      var e = h[i] || {};
      var acc = parseFloat(e.accuracy);
      if (isNaN(acc)) acc = 0;
      acc = Math.max(0, Math.min(100, acc));
      totalScore += (parseFloat(e.netScore) || 0);
      totalStars += acc >= 90 ? 3 : acc >= 70 ? 2 : acc >= 50 ? 1 : 0;
      if (acc > bestScore) bestScore = acc;
    }
    return {
      displayName: (displayName || 'Aspirant').toString().slice(0, 40),
      totalScore: Math.round(totalScore * 100) / 100,
      totalStars: totalStars,
      testsTaken: h.length,
      bestScore: bestScore,
      streak: (streak && streak.count) || 0,
      updatedAt: new Date().toISOString()
    };
  }

  /* ---------- Merge logic (pure, tested) ---------- */
  function entryKey(e) {
    if (!e || typeof e !== 'object') return '';
    return [e.subject, e.mode, e.netScore, e.total, e.date].join('|');
  }

  /* Cloud first (newest first), then local-only entries, capped at 10. */
  function mergeHistory(cloudHistory, localHistory) {
    var cloud = Array.isArray(cloudHistory) ? cloudHistory : [];
    var local = Array.isArray(localHistory) ? localHistory : [];
    var seen = {};
    var out = [];
    var i;
    for (i = 0; i < cloud.length; i++) {
      var k = entryKey(cloud[i]);
      if (k && !seen[k]) { seen[k] = true; out.push(cloud[i]); }
    }
    for (i = 0; i < local.length; i++) {
      var k2 = entryKey(local[i]);
      if (k2 && !seen[k2]) { seen[k2] = true; out.push(local[i]); }
    }
    return out.slice(0, MAX_HISTORY);
  }

  /* Keep the stronger streak: higher count wins; on a tie, later date wins. */
  function mergeStreak(cloudStreak, localStreak) {
    var c = (cloudStreak && typeof cloudStreak === 'object') ? cloudStreak : { lastDate: null, count: 0 };
    var l = (localStreak && typeof localStreak === 'object') ? localStreak : { lastDate: null, count: 0 };
    var cCount = c.count || 0;
    var lCount = l.count || 0;
    if (lCount > cCount) return { lastDate: l.lastDate || null, count: lCount };
    if (cCount > lCount) return { lastDate: c.lastDate || null, count: cCount };
    var cDate = c.lastDate || '';
    var lDate = l.lastDate || '';
    return (lDate >= cDate)
      ? { lastDate: l.lastDate || null, count: lCount }
      : { lastDate: c.lastDate || null, count: cCount };
  }

  function serverTimestamp() {
    try {
      if (window.firebase && window.firebase.firestore && window.firebase.firestore.FieldValue) {
        return window.firebase.firestore.FieldValue.serverTimestamp();
      }
    } catch (e) { /* fall through */ }
    return new Date().toISOString();
  }

  function buildUserDoc(user, history, streak) {
    return {
      profile: {
        name: (user && (user.displayName || user.email || '').split('@')[0]) || 'Aspirant',
        email: (user && user.email) || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      testHistory: (history || []).slice(0, MAX_HISTORY),
      streak: streak || { lastDate: null, count: 0 },
      leaderboardOptIn: true, // default: this user appears on the leaderboard
      updatedAt: serverTimestamp()
    };
  }

  /* ---------- Friendly auth errors ---------- */
  function friendlyAuthMessage(err) {
    if (!err) return 'Something went wrong. Please try again.';
    switch (err.code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Try signing in instead.';
      case 'auth/invalid-email':
        return 'That email address doesn\u2019t look valid. Check it and try again.';
      case 'auth/weak-password':
        return 'Password is too weak — use at least 6 characters.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Wrong email or password. Check both and try again.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Wait a while and try again.';
      case 'auth/network-request-failed':
        return 'Could not reach Firebase — check your internet connection and try again.';
      case 'auth/operation-not-allowed':
        return 'Email/password sign-in is not enabled in this Firebase project. Enable it in the Firebase Console (Authentication → Sign-in method).';
      case 'auth/requires-recent-login':
        return 'For safety, please sign in again and retry.';
      case 'not-configured':
        return 'Firebase is not set up yet — paste your project config into js/firebase-config.js (see README). Guest mode still works.';
      case 'no-sdk':
        return 'The Firebase SDK could not be loaded — check your internet connection and reload the page.';
      default:
        return (err.message && String(err.message)) || 'Something went wrong. Please try again.';
    }
  }

  function backendError(code, message) {
    var err = new Error(message);
    err.code = code;
    return err;
  }

  /* ---------- Listeners ---------- */
  function notify() {
    var snapshot = listeners.slice();
    snapshot.forEach(function (cb) {
      try { cb(currentUser); } catch (e) { /* listener error: ignore */ }
    });
  }

  function onAuthChange(cb) {
    if (typeof cb !== 'function') return function () {};
    listeners.push(cb);
    if (authKnown) {
      try { cb(currentUser); } catch (e) { /* ignore */ }
    }
    return function () {
      var i = listeners.indexOf(cb);
      if (i >= 0) listeners.splice(i, 1);
    };
  }

  /* ---------- Init ---------- */
  function init() {
    if (!isConfigured()) {
      initState = 'not-configured';
      authKnown = true; // no auth will ever arrive; pages may render guest UI now
      notify();
      return;
    }
    if (typeof window.firebase === 'undefined' ||
        !window.firebase.initializeApp ||
        !window.firebase.auth ||
        !window.firebase.firestore) {
      initState = 'no-sdk';
      initError = backendError('no-sdk', 'Firebase SDK failed to load.');
      authKnown = true;
      notify();
      return;
    }
    try {
      if (!window.firebase.apps || !window.firebase.apps.length) {
        window.firebase.initializeApp(CONFIG);
      }
      auth = window.firebase.auth();
      db = window.firebase.firestore();
      initState = 'ready';
      auth.onAuthStateChanged(function (user) {
        currentUser = user || null;
        authKnown = true;
        if (user) {
          syncNameToLocal(user);
          // Load + merge cloud data, then notify AGAIN so pages re-render
          // from the synced localStorage mirror (e.g. tests taken on
          // another device). The first notify below already showed the
          // signed-in state immediately.
          loadCloudData()
            .then(function () { notify(); })
            .catch(function () { /* cloud load is best-effort; local mirror stays */ });
        }
        notify();
      });
    } catch (e) {
      initState = 'error';
      initError = e;
      authKnown = true;
      notify();
    }
  }

  function ensureReady() {
    if (initState === 'not-configured') throw backendError('not-configured', friendlyAuthMessage({ code: 'not-configured' }));
    if (initState === 'no-sdk') throw backendError('no-sdk', friendlyAuthMessage({ code: 'no-sdk' }));
    if (!auth || !db) throw backendError('not-ready', 'Firebase is not ready yet. Reload the page and try again.');
  }

  function syncNameToLocal(user, nameOverride) {
    if (!user) return;
    var name = (nameOverride && nameOverride.trim()) ||
      user.displayName || (user.email || '').split('@')[0] || 'Aspirant';
    try {
      localStorage.setItem('userName', name);
      if (user.email) localStorage.setItem('userEmail', user.email);
    } catch (e) { /* storage unavailable */ }
  }

  /* ---------- Auth ---------- */
  async function signUp(email, password, displayName) {
    ensureReady();
    var cred = await auth.createUserWithEmailAndPassword(email, password);
    var user = cred.user;
    var name = (displayName || '').trim() || email.split('@')[0];
    try { await user.updateProfile({ displayName: name }); } catch (e) { /* non-fatal */ }
    var verificationSent = false;
    try { await user.sendEmailVerification(); verificationSent = true; } catch (e) { /* non-fatal */ }
    currentUser = user;
    syncNameToLocal(user, name);
    // First cloud document for this user, seeded with any local progress.
    try {
      await db.collection('users').doc(user.uid).set(
        buildUserDoc(user, readLocalHistory(), readLocalStreak()), { merge: true });
      setMigratedUid(user.uid);
    } catch (e) { /* cloud write is best-effort; local mirror stays */ }
    notify();
    return { user: user, verificationSent: verificationSent };
  }

  async function logIn(email, password) {
    ensureReady();
    var cred = await auth.signInWithEmailAndPassword(email, password);
    currentUser = cred.user;
    syncNameToLocal(currentUser);
    notify();
    return currentUser;
  }

  async function logOut() {
    if (auth) {
      try { await auth.signOut(); } catch (e) { /* ignore */ }
    }
    currentUser = null;
    try {
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
    } catch (e) { /* ignore */ }
    notify();
  }

  async function resetPassword(email) {
    ensureReady();
    await auth.sendPasswordResetEmail(email);
    return true;
  }

  /* ---------- Cloud data ---------- */
  async function loadCloudData() {
    if (!currentUser || !db) return null;
    var ref = db.collection('users').doc(currentUser.uid);
    var snap = await ref.get();
    if (!snap.exists) {
      // First login for this account: seed the cloud doc with local progress.
      var fresh = buildUserDoc(currentUser, readLocalHistory(), readLocalStreak());
      await ref.set(fresh);
      setMigratedUid(currentUser.uid);
      return fresh;
    }
    var cloud = snap.data() || {};
    // The cloud document is the source of truth for the leaderboard
    // opt-in flag; keep the local cache in step with it.
    if (typeof cloud.leaderboardOptIn === 'boolean') setOptInLocal(cloud.leaderboardOptIn);
    var mergedHistory = mergeHistory(cloud.testHistory || [], readLocalHistory());
    var mergedStreak = mergeStreak(cloud.streak || null, readLocalStreak());
    writeLocalHistory(mergedHistory);
    writeLocalStreak(mergedStreak);
    // Push the merged result back so other devices converge on the same data.
    await ref.set({
      testHistory: mergedHistory,
      streak: mergedStreak,
      updatedAt: serverTimestamp()
    }, { merge: true });
    setMigratedUid(currentUser.uid);
    return { profile: cloud.profile || null, testHistory: mergedHistory, streak: mergedStreak };
  }

  /* Best-effort upload of the local mirror. Never throws. */
  async function syncLocal() {
    if (initState !== 'ready' || !currentUser || !db) return { synced: false, reason: initState };
    try {
      await db.collection('users').doc(currentUser.uid).set({
        testHistory: readLocalHistory(),
        streak: readLocalStreak(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { synced: true };
    } catch (e) {
      return { synced: false, reason: 'write-failed' };
    }
  }

  async function clearCloudData() {
    if (initState !== 'ready' || !currentUser || !db) return false;
    try {
      await db.collection('users').doc(currentUser.uid).set({
        testHistory: [],
        streak: { lastDate: null, count: 0 },
        updatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---------- Leaderboard (Step 4) ----------
     Public entries live in `leaderboard/{uid}` and contain ONLY
     {displayName, totalScore, totalStars, testsTaken, bestScore,
     streak, updatedAt} — NEVER an email or any private field.
     Guests never publish anything. Every call is best-effort and
     never throws, so the quiz/dashboard can never break on it. */
  function buildEntry() {
    var history = readLocalHistory();
    var streak = readLocalStreak();
    var name = displayNameFor(currentUser);
    var entry;
    if (window.CadetAnalytics && window.CadetAnalytics.buildLeaderboardEntry) {
      entry = window.CadetAnalytics.buildLeaderboardEntry(name, history, streak);
    } else {
      entry = computeEntryFallback(name, history, streak);
    }
    entry.updatedAt = serverTimestamp();
    return entry;
  }

  /* Publish (or refresh) this user's public leaderboard entry. */
  async function publishLeaderboard() {
    if (initState !== 'ready' || !currentUser || !db) return { published: false, reason: initState };
    if (!getLeaderboardOptIn()) {
      // Opted out: make sure no stale public entry remains.
      await unpublishLeaderboard();
      return { published: false, reason: 'opted-out' };
    }
    try {
      await db.collection(LEADERBOARD_COLLECTION).doc(currentUser.uid).set(buildEntry());
      return { published: true };
    } catch (e) {
      return { published: false, reason: 'write-failed' };
    }
  }

  /* Remove this user's public leaderboard entry. Never throws. */
  async function unpublishLeaderboard() {
    if (initState !== 'ready' || !currentUser || !db) return false;
    try {
      await db.collection(LEADERBOARD_COLLECTION).doc(currentUser.uid).delete();
      return true;
    } catch (e) {
      return false;
    }
  }

  /* Opt in / out of the public leaderboard. Persists the choice in the
     user document; opting out deletes the public entry immediately. */
  async function setLeaderboardOptIn(on) {
    var wanted = !!on;
    setOptInLocal(wanted);
    if (initState === 'ready' && currentUser && db) {
      try {
        await db.collection('users').doc(currentUser.uid).set(
          { leaderboardOptIn: wanted, updatedAt: serverTimestamp() }, { merge: true });
      } catch (e) { /* flag is cached locally; cloud write is best-effort */ }
      if (wanted) {
        return publishLeaderboard();
      }
      await unpublishLeaderboard();
      return { published: false, reason: 'opted-out' };
    }
    return { published: false, reason: initState };
  }

  /* Read the public board, best first. Signed-in users only (see
     firestore.rules); throws a friendly error otherwise. */
  async function fetchLeaderboard(limit) {
    ensureReady();
    if (!currentUser) throw backendError('not-signed-in', 'Sign in to see the leaderboard.');
    var n = Math.max(1, Math.min(100, limit || 50));
    var snap = await db.collection(LEADERBOARD_COLLECTION)
      .orderBy('totalScore', 'desc').limit(n).get();
    var out = [];
    snap.forEach(function (doc) {
      var d = doc.data() || {};
      out.push({
        uid: doc.id,
        displayName: (d.displayName || 'Aspirant').toString().slice(0, 40),
        totalScore: (typeof d.totalScore === 'number') ? d.totalScore : 0,
        totalStars: (typeof d.totalStars === 'number') ? d.totalStars : 0,
        testsTaken: (typeof d.testsTaken === 'number') ? d.testsTaken : 0,
        bestScore: (typeof d.bestScore === 'number') ? d.bestScore : 0,
        streak: (typeof d.streak === 'number') ? d.streak : 0
      });
    });
    // Stable rank order for ties (totalScore, then stars, then tests).
    if (window.CadetAnalytics && window.CadetAnalytics.sortLeaderboard) {
      return window.CadetAnalytics.sortLeaderboard(out);
    }
    return out;
  }

  function getUser() { return currentUser; }
  function isLoggedIn() { return !!currentUser; }
  function getInitState() { return initState; }

  /* 'cloud' | 'guest' | 'not-configured' | 'no-sdk' | 'error' */
  function getSyncStatus() {
    if (initState === 'not-configured') return 'not-configured';
    if (initState === 'no-sdk') return 'no-sdk';
    if (initState === 'error') return 'error';
    if (currentUser) return 'cloud';
    return 'guest';
  }

  init();

  window.CadetBackend = {
    isConfigured: isConfigured,
    getInitState: getInitState,
    getSyncStatus: getSyncStatus,
    getUser: getUser,
    isLoggedIn: isLoggedIn,
    onAuthChange: onAuthChange,
    signUp: signUp,
    logIn: logIn,
    logOut: logOut,
    resetPassword: resetPassword,
    loadCloudData: loadCloudData,
    syncLocal: syncLocal,
    clearCloudData: clearCloudData,
    getLeaderboardOptIn: getLeaderboardOptIn,
    setLeaderboardOptIn: setLeaderboardOptIn,
    publishLeaderboard: publishLeaderboard,
    unpublishLeaderboard: unpublishLeaderboard,
    fetchLeaderboard: fetchLeaderboard,
    friendlyAuthMessage: friendlyAuthMessage,
    /* Exposed for testing only: */
    _internals: {
      isPlaceholder: isPlaceholder,
      entryKey: entryKey,
      mergeHistory: mergeHistory,
      mergeStreak: mergeStreak,
      buildUserDoc: buildUserDoc,
      readLocalHistory: readLocalHistory,
      readLocalStreak: readLocalStreak,
      computeEntryFallback: computeEntryFallback,
      displayNameFor: displayNameFor,
      OPTIN_KEY: OPTIN_KEY,
      MIGRATED_KEY: MIGRATED_KEY
    }
  };
})();
