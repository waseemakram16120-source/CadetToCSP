# CadetToCSP — PPSC, FPSC & Armed Forces Test Preparation

A free, **static** exam-preparation website for Pakistani competitive exams:
PPSC / FPSC one-paper tests, PMA / PAF / Navy initial tests, and the long road
from Cadet to CSS (CSP officer).

No backend, no database, no paid services. All progress is stored in the
visitor's own browser (`localStorage`).

## What's inside

| Page | Purpose |
| --- | --- |
| `index.html` | Professional landing page — exam modes, subjects, features, Cadet → CSP roadmap |
| `auth.html` | Login / Register / Guest demo (localStorage only — see note below) |
| `dashboard.html` | Exam-mode selector, 7 subjects, Mixed Mock Test (20 Qs), AI topic quiz, daily streak, per-subject accuracy, weak-area hints, test history, CSS-section card |
| `quiz.html` | Timed quiz engine — question palette, mark-for-review, question count (5/10/15), shuffle, elapsed timer, confirm-before-exit, full answer review |
| `exams.html` | Real exam patterns & syllabus: PPSC one-paper, FPSC CSS, PMA Long Course, PAF, Pakistan Navy |
| `css.html` | Full CSS (Central Superior Services) section — exam structure, compulsory & optional subjects, eligibility, essay practice (20 topics + 3-hour timer), précis practice, interview guidance, past papers 2020–2025 |
| `css/style.css` | Shared army design system (olive drab, khaki, gold `#c9a227`, charcoal, paper) |
| `js/data.js` | All question banks (plain script, no modules — works from `file://`) |
| `js/quiz.js` | Quiz engine — marking rules, timers, palette, results, history, streak |

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

## Optional: live AI questions (Google Gemini)

The AI topic quiz works out of the box from the built-in bank (8 topics).
To generate questions live for *any* topic with Google Gemini:

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/).
2. Open `js/quiz.js` and paste it into:
   ```js
   const GEMINI_API_KEY = "YOUR_KEY_HERE";
   ```
3. If the key is empty, invalid, or the request fails, the app silently falls
   back to the built-in bank. If the topic isn't in the bank, the quiz shows
   an honest notice and runs mixed questions from all subjects.

> ⚠ Never commit a real API key to a public repository. The key lives in the
> browser and is visible to anyone who opens the page source.

## Accounts & privacy — please read

This is a **demo portal with no server**. "Accounts" created on `auth.html`
are saved only in the visitor's own browser (`localStorage` keys `userName`,
`userEmail`). There is no real password protection — **do not reuse a password
you use anywhere else**. Test history (`testHistory`), exam mode (`examMode`),
quiz settings and the daily streak (`cadetStreak`) are likewise stored locally
and never leave the device. Clearing browser data erases them.

## Roadmap

- [ ] More questions per subject (target: 50+ each) + past-paper tagging by year
- [ ] Intelligence / non-verbal reasoning section for initial tests
- [ ] Printable revision sheets (workbook style)
- [ ] Teacher / parent view of a student's progress
- [ ] Optional Firebase/Supabase backend for real accounts (only if a server is wanted)

## Disclaimer

CadetToCSP is an independent practice tool. It is not affiliated with PPSC,
FPSC, Pakistan Army, PAF or Pakistan Navy. Exam patterns, eligibility and
syllabi change — always confirm details from the official advertisement before
applying.
