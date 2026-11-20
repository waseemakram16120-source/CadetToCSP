# CadetToCSP — PPSC, FPSC & Armed Forces Test Preparation

A free, **static** exam-preparation website for Pakistani competitive exams:
PPSC / FPSC one-paper tests, PMA / PAF / Navy initial tests, and the long road
from Cadet to CSS (CSP officer).

No paid services. All progress is stored in the visitor's own browser
(`localStorage`) by default — or, once a free Firebase project is connected
(see below), in real Firebase accounts with cloud sync across devices.

## What's inside

| Page | Purpose |
| --- | --- |
| `index.html` | Professional landing page — exam modes, subjects, features, Cadet → CSP roadmap |
| `auth.html` | Real login / register with Firebase Auth (email + password, email verification, password reset) — or guest/demo mode when Firebase is not connected yet |
| `dashboard.html` | Exam-mode selector, 7 subjects, Mixed Mock Test (20 Qs), AI topic quiz (topic, difficulty, count), Gemini key settings, daily streak, per-subject accuracy, weak-area hints, test history, CSS-section card, signed-in user + cloud sync status, logout |
| `quiz.html` | Timed quiz engine — question palette, mark-for-review, question count (5/10/15), shuffle, elapsed timer, confirm-before-exit, full answer review |
| `exams.html` | Real exam patterns & syllabus: PPSC one-paper, FPSC CSS, PMA Long Course, PAF, Pakistan Navy |
| `css.html` | Full CSS (Central Superior Services) section — exam structure, compulsory & optional subjects, eligibility, essay practice (20 topics + 3-hour timer), précis practice, interview guidance, past papers 2020–2025 |
| `css/style.css` | Shared army design system (olive drab, khaki, gold `#c9a227`, charcoal, paper) |
| `js/data.js` | All question banks (plain script, no modules — works from `file://`) |
| `js/ai.js` | Gemini client — live question generation, strict response validation, bring-your-own-key storage, connection test (plain script, no modules) |
| `js/firebase-config.js` | Your Firebase project's Web-app config — **placeholders until you paste your own values** (see "Real accounts & backend" below) |
| `js/firebase.js` | Firebase client — Auth (signup/login/logout/password reset), Firestore sync of test history + streak + profile, one-time local → cloud migration, guest-mode fallback (plain script, no modules) |
| `firestore.rules` | Security rules: each user can read/write only their own `users/{uid}` document; everything else denied |
| `js/quiz.js` | Quiz engine — marking rules, timers, palette, results, history, streak (+ cloud sync after each finished test when signed in) |

## Question banks

| Subject / Topic | Questions |
| --- | --- |
| History & Pak Studies | 15 |
| General Knowledge | 15 |
| Everyday Science | 15 |
| English & Grammar | 10 |
| Islamiat & Pakistan Affairs | 10 |
| CSS Compulsory MCQs | 15 |
| English Précis & Composition | 15 |
| **Subject total** | **95** |
| AI topics (built-in) | 8 topics × 5 = 40 |
| Mughal Empire, 1973 Constitution, Human Vitamins, Pakistan Movement, Islamic History, Geography of Pakistan, Computer & IT Basics, World Geography | |
| **Grand total** | **135** |

Every question carries a short, factual explanation. All questions are
past-paper style (PPSC / FPSC pattern).

## CSS Section (`css.html`)

The full Central Superior Services road map, linked from the nav of every
page and from the FPSC part of `exams.html`:

- **Exam overview** — MPT (200 MCQs, 33% to pass, qualifying only), written
  1,200 marks (600 compulsory + 600 optional), medical, psychological
  assessment (qualifying only), viva voce 300 marks (100 to pass);
  1,500 total, max 3 attempts.
- **Compulsory subjects** — all 6 × 100 marks, with qualifying marks
  (40% compulsory, 33% optional, 50% aggregate).
- **Optional subjects** — all 7 groups with subjects and marks, plus the
  selection rules (exactly 600 marks, max 200 per group) and a
  choosing strategy.
- **Eligibility** — degree (second division), age generally 21–30 with
  relaxation under the rules, nationality, attempts; disclaimer to confirm
  from the official FPSC advertisement.
- **Essay practice** — 20 topics: 14 verified past-paper topics (CSS 2025
  × 10, CSS 2024 × 4) + 6 clearly labelled practice topics, each with a
  2–3 line outline hint; a 3-hour practice timer (start/pause/reset) and a
  writing checklist (~2,500–3,000 words).
- **Précis practice** — 3 original passages with model précis (word counts
  verified: 150→52, 149→52, 143→52) and the précis rules.
- **Interview guidance** — psychological assessment and viva voce explained,
  20 common interview questions with answer guidance, practical tips.
- **Past papers** — compulsory papers by year, 2020–2025, with a link only
  to the official FPSC homepage (https://www.fpsc.gov.pk) — no invented
  download links.

## Exam rules (built into the engine — do not change casually)

| Mode | Correct | Wrong | Skipped | Time / question |
| --- | --- | --- | --- | --- |
| **PPSC / FPSC** one-paper | +1.00 | **−0.25** | 0 | 60 s |
| **Armed Forces** (PMA / PAF / Navy) | +1.00 | 0 | 0 | 30 s |

## How to run

**Option 1 — open directly (works, no server needed):**
Double-click `index.html`. Everything is static; `js/data.js` is loaded with a
plain `<script>` tag (no ES modules), so `file://` works.

**Option 2 — local server (recommended):**
```bash
cd CadetToCSP
python3 -m http.server 8000
# then open http://localhost:8000
```

## Real AI quizzes — Google Gemini (bring your own key)

The AI topic quiz can generate fresh questions live with Google Gemini, or
work offline from the built-in bank (8 topics). No key is bundled with the
site — you paste your own free key in the Dashboard:

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/)
   (sign in with a Google account → "Get API key" → "Create API key").
2. On the Dashboard, open **Gemini API Key**, paste the key and press
   **Save Key**. Press **Test Connection** to check it works.
3. Pick a topic (any topic, not just the 8 built-in ones), a difficulty
   (Easy / Medium / Hard) and a question count (5 / 10 / 15), then press
   **Generate AI Quiz**.

How it works: `js/ai.js` calls the Gemini `generateContent` REST endpoint
(model `gemini-2.5-flash`, with `gemini-3-flash-preview` as a fallback if the
first model is unavailable) with `responseMimeType: "application/json"` and a
strict JSON schema, then validates every question (exactly 4 options, one
correct answer, short explanation) before it reaches the quiz engine. The
generated quiz runs through the normal engine — same timers, palette,
mark-for-review and PPSC / Armed Forces marking rules.

**If anything fails** (no key, bad key, quota used up, network error, or a
bad response), the quiz falls back to the built-in bank and shows an honest
notice explaining why — the test still runs. If the topic isn't in the bank,
mixed questions from all subjects are used instead.

**Privacy:** the key is stored only in your browser (`localStorage` key
`geminiApiKey`) and is sent only to Google's Gemini API. It is never logged,
never committed to the repository, and never sent anywhere else. Use **Remove
Key** on the Dashboard to delete it at any time.

**Free-tier limits:** Google's free tier allows only a small number of
Gemini requests per day (and per minute), and the limits change from time to
time — if you get a quota error (HTTP 429), wait and try again later, or use
the built-in bank. See Google's official Gemini API rate-limits documentation
for current numbers.

## Real accounts & backend — Firebase (Auth + Firestore)

`auth.html` now uses **real accounts**: email + password signup and login
through Firebase Authentication, with email verification on signup and a
"Forgot password?" reset link. Test history, daily streak and profile sync
to Cloud Firestore (`users/{uid}`), so progress follows the user across
devices. **Until you connect your own Firebase project, everything still
works in guest mode** — accounts and progress stay in the browser only
(localStorage), exactly as before.

### Set it up (free — about 10 minutes, one time)

1. **Create a Firebase project** — go to
   [Firebase Console](https://console.firebase.google.com/), click "Add
   project", give it a name (e.g. `cadettocsp`) and create it (Google
   Analytics is optional — you can skip it).
2. **Enable Email/Password sign-in** — in the console, go to **Build →
   Authentication → Sign-in method**, enable **Email/Password**, and save.
3. **Create the Firestore database** — go to **Build → Firestore
   Database → Create database**. Choose **Start in production mode**
   (denies everything until your rules are published), pick a location
   (it can't be changed later), and create it.
4. **Add a Web app and copy the config** — go to **Project settings**
   (gear icon) → **Your apps** → click the **Web** icon (`</>`), give the
   app a nickname, and copy the `firebaseConfig` object Firebase shows.
   Paste its values into `js/firebase-config.js`, replacing every
   `"YOUR_..."` value. These values are public client identifiers, not
   secrets — they only tell the SDK which project to talk to.
5. **Publish the security rules** — in the console, go to **Build →
   Firestore Database → Rules**, delete the rules shown there, paste the
   whole contents of `firestore.rules` from this project, and click
   **Publish**. (Or use the Firebase CLI: `firebase deploy --only
   firestore:rules`.)
6. **Test it** — open `auth.html`, create an account, and check the
   Firebase Console (Authentication → Users, and Firestore Database →
   `users/{uid}`) to see the account and the synced test history appear
   after your first quiz. The Dashboard shows "☁️ Synced to cloud" when
   you are signed in.

### How it works

- `js/firebase.js` (`window.CadetBackend`) initialises Firebase only when
  `js/firebase-config.js` is filled in; otherwise it reports
  "not-configured" and every call is a safe no-op.
- **Signup** creates the Firebase Auth user, sends a verification email
  (shown as a notice — it does **not** block login), and creates the
  `users/{uid}` document. **Login** restores the session automatically on
  every page load (`onAuthStateChanged`).
- **Data model** — one document per user:
  `users/{uid} = { profile: {name, email, createdAt, updatedAt}, testHistory: [...] (newest first, max 10), streak: {lastDate, count}, updatedAt }`.
- **Sync** — localStorage stays the live mirror the dashboard and quiz
  engine read from. After every finished test, `js/quiz.js` calls
  `CadetBackend.syncLocal()` to upload the mirror; on login the cloud
  document is merged with the local mirror (cloud first, then local-only
  entries) and written back, so other devices converge.
- **One-time migration** — if you practised as a guest first, your local
  test history and streak are uploaded into your new cloud document on
  your first sign-in, and the migration is marked done
  (localStorage `cadetCloudMigratedUid`).
- **Security rules** (`firestore.rules`) — a signed-in user can read and
  write only their own `users/{uid}` document; everything else is denied
  by default, including listing the users collection.
- **Privacy** — no password, API key or token is ever logged or stored in
  the repository. The Firebase config values are public identifiers; the
  real protection is the security rules. "Continue as Guest" stays
  local-only, and **Logout** signs out of Firebase and clears the local
  name/email.

**If anything fails** (config not filled in, SDK can't load, no internet,
wrong password, email already in use), the page shows a plain-English
reason and guest mode keeps working — the quiz never breaks because of
the cloud.

## Accounts & privacy — please read

**Guest mode (no Firebase connected):** this is a demo portal with no
server. "Accounts" created on `auth.html` are saved only in the visitor's
own browser (`localStorage` keys `userName`, `userEmail`). There is no real
password protection — **do not reuse a password you use anywhere else**.
Test history (`testHistory`), exam mode (`examMode`), quiz settings and
the daily streak (`cadetStreak`) are likewise stored locally and never
leave the device. Clearing browser data erases them.

**Signed-in mode (Firebase connected):** accounts are real Firebase Auth
users and test history, streak and profile sync to Cloud Firestore under
`users/{uid}` (see "Real accounts & backend" above). Each user can only
access their own document. Signing out clears the local name/email; the
cloud copy stays in your Firebase project until you delete it from the
Firebase Console. Your password is handled by Firebase — never reuse a
password you use anywhere else, and never put a Firebase config value
other than the public Web-app config in this site.

## Roadmap

- [ ] More questions per subject (target: 50+ each) + past-paper tagging by year
- [ ] Intelligence / non-verbal reasoning section for initial tests
- [ ] Printable revision sheets (workbook style)
- [ ] Teacher / parent view of a student's progress
- [x] Real accounts + backend (Firebase Auth + Firestore) — Step 3, done; needs your own free Firebase project + config to go live
- [ ] Leaderboard + detailed analytics (Step 4)

## Disclaimer

CadetToCSP is an independent practice tool. It is not affiliated with PPSC,
FPSC, Pakistan Army, PAF or Pakistan Navy. Exam patterns, eligibility and
syllabi change — always confirm details from the official advertisement before
applying.
