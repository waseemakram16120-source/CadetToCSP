/* ============================================================
   CadetToCSP — Firebase project config (js/firebase-config.js)
   Plain <script> file (NO ES modules) so the site works from
   file:// as well as from any static host.

   >>> FILL THIS IN FROM YOUR OWN FIREBASE CONSOLE <<<
   1. Go to https://console.firebase.google.com and create a
      free project (or open an existing one).
   2. In the console, go to Project settings (gear icon) →
      "Your apps" → click the Web icon (</>) to add a Web app.
   3. Copy the firebaseConfig object Firebase shows you and
      paste its values below, replacing every "YOUR_..." value.

   These values are PUBLIC client identifiers, not secrets —
   they only tell the Firebase SDK which project to talk to.
   Your data is protected by Firestore security rules
   (see firestore.rules), not by hiding these values.
   Never put a private key, service-account file or admin
   credential in this file (or anywhere in this website).

   Until this file is filled in, the site runs in GUEST MODE:
   accounts and progress stay in the browser only
   (localStorage), exactly as before. Nothing breaks.
   ============================================================ */

window.CADET_FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
