/* ============================================================
   CadetToCSP — Analytics & leaderboard helpers (js/analytics.js)
   Plain <script> file (NO ES modules) so the site works from
   file:// as well as from any static host.
   Loaded BEFORE js/firebase.js on dashboard.html / quiz.html /
   leaderboard.html. Exposes window.CadetAnalytics.

   PURE functions only: no DOM, no Firebase, no localStorage.
   Everything is computed from a testHistory array (entries shaped
   like js/quiz.js saves them: {subject, mode, netScore, total,
   accuracy, correct, wrong, date, ts?}) plus a streak object
   ({lastDate, count}). Safe to call with [] or missing fields.

   Stars rule (used by the dashboard totals AND the leaderboard,
   so both always agree):
     accuracy >= 90% -> 3 stars
     accuracy >= 70% -> 2 stars
     accuracy >= 50% -> 1 star
     otherwise       -> 0 stars
   ============================================================ */

(function () {
  'use strict';

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function toNum(v, fallback) {
    var n = parseFloat(v);
    return isNaN(n) ? (fallback || 0) : n;
  }

  function clampPct(n) {
    if (isNaN(n)) return 0;
    return Math.max(0, Math.min(100, n));
  }

  /* ---------- Stars ---------- */
  function starsFor(accuracy) {
    var a = toNum(accuracy, 0);
    if (a >= 90) return 3;
    if (a >= 70) return 2;
    if (a >= 50) return 1;
    return 0;
  }

  /* ---------- Totals ---------- */
  function computeTotals(history, streak) {
    var h = Array.isArray(history) ? history : [];
    var totalScore = 0;
    var totalStars = 0;
    var totalQuestions = 0;
    var bestScore = 0;
    var accSum = 0;
    var i;
    for (i = 0; i < h.length; i++) {
      var e = h[i] || {};
      totalScore += toNum(e.netScore, 0);
      totalStars += starsFor(e.accuracy);
      totalQuestions += toNum(e.total, 0);
      var acc = clampPct(toNum(e.accuracy, 0));
      if (acc > bestScore) bestScore = acc;
      accSum += acc;
    }
    return {
      testsTaken: h.length,
      totalScore: Math.round(totalScore * 100) / 100,
      totalStars: totalStars,
      bestScore: bestScore,
      avgAccuracy: h.length ? Math.round(accSum / h.length) : 0,
      totalQuestions: totalQuestions,
      streak: (streak && streak.count) || 0
    };
  }

  /* ---------- Per-subject accuracy ---------- */
  function perSubjectStats(history, subjects) {
    var list = Array.isArray(subjects) ? subjects : [];
    var h = Array.isArray(history) ? history : [];
    var out = {};
    var i, j;
    for (i = 0; i < list.length; i++) {
      out[list[i].key] = { key: list[i].key, name: list[i].name, icon: list[i].icon || '', correct: 0, total: 0, tests: 0, accuracy: 0 };
    }
    for (j = 0; j < h.length; j++) {
      var e = h[j] || {};
      var s = out[e.subject];
      if (!s) continue; // AI topics & mixed mock are not single subjects
      var total = toNum(e.total, 0);
      var correct = (typeof e.correct === 'number')
        ? e.correct
        : Math.round(toNum(e.accuracy, 0) * total / 100);
      s.correct += correct;
      s.total += total;
      s.tests += 1;
    }
    Object.keys(out).forEach(function (k) {
      var s = out[k];
      s.accuracy = s.total ? Math.round(s.correct / s.total * 100) : 0;
    });
    return out;
  }

  function strongestWeakest(perSubject) {
    var attempted = Object.keys(perSubject || {})
      .map(function (k) { return perSubject[k]; })
      .filter(function (s) { return s.tests > 0 && s.total > 0; });
    if (!attempted.length) return { strongest: null, weakest: null };
    var strongest = attempted[0];
    var weakest = attempted[0];
    attempted.forEach(function (s) {
      if (s.accuracy > strongest.accuracy) strongest = s;
      if (s.accuracy < weakest.accuracy) weakest = s;
    });
    return {
      strongest: strongest,
      weakest: attempted.length > 1 ? weakest : null
    };
  }

  /* ---------- Score trend (last N tests, chronological) ---------- */
  function scoreTrend(history, n) {
    var h = Array.isArray(history) ? history : [];
    var count = Math.max(1, n || 7);
    var last = h.slice(0, count).reverse(); // history is newest-first
    return last.map(function (e, idx) {
      return {
        index: idx + 1,
        subject: e.subject || 'Test',
        accuracy: clampPct(toNum(e.accuracy, 0)),
        netScore: toNum(e.netScore, 0),
        total: toNum(e.total, 0),
        date: e.date || ''
      };
    });
  }

  /* ---------- 7-day activity ---------- */
  function dateKey(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /* History entries saved before Step 4 have no ts; their date is a
     display string like "12 Nov". Parse it (current year assumed). */
  function entryDate(e) {
    if (!e || typeof e !== 'object') return null;
    if (typeof e.ts === 'number' && e.ts > 0) {
      var d = new Date(e.ts);
      return isNaN(d.getTime()) ? null : d;
    }
    if (typeof e.date === 'string') {
      var m = e.date.trim().match(/^(\d{1,2})\s+([A-Za-z]{3})/);
      if (m) {
        var month = MONTHS.indexOf(m[2].charAt(0).toUpperCase() + m[2].slice(1).toLowerCase());
        if (month >= 0) {
          var parsed = new Date(new Date().getFullYear(), month, parseInt(m[1], 10));
          return isNaN(parsed.getTime()) ? null : parsed;
        }
      }
    }
    return null;
  }

  function activityLast7Days(history, now) {
    var today = now instanceof Date ? new Date(now.getFullYear(), now.getMonth(), now.getDate()) : (function () { var t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); })();
    var days = [];
    var i;
    for (i = 6; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push({ key: dateKey(d), label: WEEKDAYS[d.getDay()] + ' ' + d.getDate(), count: 0 });
    }
    var byKey = {};
    days.forEach(function (d) { byKey[d.key] = d; });
    (Array.isArray(history) ? history : []).forEach(function (e) {
      var d = entryDate(e);
      if (!d) return;
      var k = dateKey(d);
      if (byKey[k]) byKey[k].count += 1;
    });
    return days;
  }

  /* ---------- Leaderboard entry (PUBLIC fields only) ----------
     NEVER includes email or any private field. displayName only. */
  function buildLeaderboardEntry(displayName, history, streak) {
    var totals = computeTotals(history, streak);
    return {
      displayName: (displayName || 'Aspirant').toString().slice(0, 40),
      totalScore: totals.totalScore,
      totalStars: totals.totalStars,
      testsTaken: totals.testsTaken,
      bestScore: totals.bestScore,
      streak: totals.streak,
      updatedAt: new Date().toISOString()
    };
  }

  /* Rank order: totalScore desc, then totalStars desc, then testsTaken desc. */
  function sortLeaderboard(entries) {
    return (Array.isArray(entries) ? entries.slice() : []).sort(function (a, b) {
      var d = toNum(b.totalScore, 0) - toNum(a.totalScore, 0);
      if (d !== 0) return d;
      d = toNum(b.totalStars, 0) - toNum(a.totalStars, 0);
      if (d !== 0) return d;
      return toNum(b.testsTaken, 0) - toNum(a.testsTaken, 0);
    });
  }

  window.CadetAnalytics = {
    starsFor: starsFor,
    computeTotals: computeTotals,
    perSubjectStats: perSubjectStats,
    strongestWeakest: strongestWeakest,
    scoreTrend: scoreTrend,
    activityLast7Days: activityLast7Days,
    buildLeaderboardEntry: buildLeaderboardEntry,
    sortLeaderboard: sortLeaderboard,
    /* Exposed for testing only: */
    _internals: {
      entryDate: entryDate,
      dateKey: dateKey,
      toNum: toNum
    }
  };
})();
