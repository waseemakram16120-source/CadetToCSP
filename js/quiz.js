// CadetToCSP — Quiz Engine
// Uses question banks from js/data.js (loaded before this file).
// Exam rules (do NOT change): PPSC = +1.00 / -0.25, 60s per question.
// Armed Forces = +1.00, no negative marking, 30s per question.
// localStorage keys preserved: userName, userEmail, examMode, quizType,
// selectedSubject, aiCustomTopic, testHistory.

// Live AI generation lives in js/ai.js (window.CadetAI).
// The user's own Gemini API key is stored in localStorage ('geminiApiKey')
// via the Dashboard settings — never hard-coded here.

// ---------- Banks (from js/data.js) ----------
const questionBank = window.CADET_QUESTION_BANK || {};
const aiTopicBank = window.CADET_AI_TOPIC_BANK || {};

// ---------- Session config (localStorage, keys preserved) ----------
let examMode = localStorage.getItem('examMode') || 'PPSC';
let quizType = localStorage.getItem('quizType') || 'CATEGORY';
let selectedSubject = localStorage.getItem('selectedSubject') || 'History';
let aiCustomTopic = localStorage.getItem('aiCustomTopic') || 'Mughal Empire';

let activeQuizTitle = quizType === 'AI' ? `AI Topic: ${aiCustomTopic}`
  : quizType === 'MIXED' ? 'Mixed Mock Test'
  : selectedSubject;

// ---------- State ----------
let questions = [];
let currentIndex = 0;
let selectedOption = null;
let userAnswers = [];          // number = answered, null = skipped, undefined = not visited
let markedForReview = new Set();
let timerInterval = null;
let elapsedInterval = null;
let timePerQuestion = examMode === 'PPSC' ? 60 : 30;
let timeLeft = timePerQuestion;
let elapsedSeconds = 0;
let testActive = false;
let questionCount = 10;        // default; selectable 5 / 10 / 15
let aiFallbackUsed = false;
let aiErrorMessage = '';       // friendly reason when live generation fails
let aiQuizCount = Math.min(15, Math.max(1, parseInt(localStorage.getItem('aiQuizCount') || '5', 10) || 5));
let aiQuizDifficulty = localStorage.getItem('aiQuizDifficulty') || 'Medium';

// ---------- Helpers ----------
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sampleFromBank(bank, n) {
  return shuffle(bank).slice(0, Math.min(n, bank.length));
}

function mixedQuestions(n) {
  // Even spread across all five subjects, then shuffled.
  const keys = Object.keys(questionBank);
  const per = Math.max(1, Math.floor(n / keys.length));
  let out = [];
  keys.forEach(k => { out = out.concat(sampleFromBank(questionBank[k], per)); });
  // Top up if rounding left us short (e.g. odd counts)
  let i = 0;
  while (out.length < n && keys.length) {
    const k = keys[i % keys.length];
    const extra = shuffle(questionBank[k]).find(q => !out.includes(q));
    if (!extra) break;
    out.push(extra);
    i++;
  }
  return shuffle(out).slice(0, n);
}

function formatElapsed(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function localDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ---------- Init / setup screen ----------
window.onload = () => {
  document.getElementById('quizSubHeader').textContent = `${activeQuizTitle} • ${examMode} Mode`;

  const ruleBadge = document.getElementById('markingRuleBadge');
  if (examMode === 'PPSC') {
    ruleBadge.textContent = "PPSC Rule: +1.00 | -0.25 Negative Marking";
  } else {
    ruleBadge.textContent = "Armed Forces Rule: +1.00 | No Negative Marking";
  }

  // Setup screen content
  document.getElementById('setupTitle').textContent = activeQuizTitle;
  document.getElementById('setupModeLine').textContent =
    examMode === 'PPSC'
      ? "PPSC / FPSC One-Paper pattern — 60 seconds per question, −0.25 for each wrong answer, 0 for skipped."
      : "Armed Forces initial-test pattern — 30 seconds per question, no negative marking, 0 for skipped.";

  const countRow = document.getElementById('countRow');
  const countNote = document.getElementById('countNote');
  if (quizType === 'AI') {
    countRow.classList.add('hidden');
    questionCount = aiQuizCount; // 5 / 10 / 15, chosen on the Dashboard
    const keyNote = (window.CadetAI && window.CadetAI.hasApiKey())
      ? "Live Gemini generation is on — fresh questions will be generated for this topic."
      : "No Gemini key saved — the built-in bank (8 topics) will be used; other topics get mixed practice questions.";
    countNote.textContent = `AI quiz: ${questionCount} question(s) requested on "${aiCustomTopic}" (${aiQuizDifficulty}). ${keyNote}`;
  } else if (quizType === 'MIXED') {
    countRow.classList.add('hidden');
    countNote.textContent = "Mixed Mock Test: 20 questions — drawn from all 7 subjects.";
    questionCount = 20;
  } else {
    const bankSize = (questionBank[selectedSubject] || []).length;
    countNote.textContent = `${selectedSubject} bank: ${bankSize} questions available. Pick how many to attempt.`;
    // Cap the 15-option if the bank is smaller (it isn't for the 15-question banks)
    document.querySelectorAll('.count-btn').forEach(btn => {
      const n = parseInt(btn.dataset.count, 10);
      if (n > bankSize) btn.disabled = true;
    });
  }

  // Data file missing? Fail honestly instead of a blank quiz.
  if (!Object.keys(questionBank).length) {
    document.getElementById('setupTitle').textContent = "Question bank failed to load";
    document.getElementById('setupModeLine').textContent =
      "js/data.js could not be loaded. Check that the file exists next to js/quiz.js and reload the page.";
    document.getElementById('startTestBtn').disabled = true;
  }
};

function setQuestionCount(n, btn) {
  questionCount = n;
  document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

// ---------- Build questions & start ----------
async function startTest() {
  const setupBox = document.getElementById('setupBox');
  const loadingBox = document.getElementById('loadingBox');
  const quizBox = document.getElementById('quizBox');

  if (quizType === 'AI') {
    setupBox.classList.add('hidden');
    loadingBox.classList.remove('hidden');
    document.getElementById('loadingTopicText').textContent =
      `Generating PPSC & Armed Forces MCQs on "${aiCustomTopic}"...`;
    await prepareAIQuestions(aiCustomTopic);
    loadingBox.classList.add('hidden');
  } else if (quizType === 'MIXED') {
    questions = mixedQuestions(20);
  } else {
    const bank = questionBank[selectedSubject] || questionBank["History"] || [];
    questions = sampleFromBank(bank, questionCount);
  }

  if (!questions.length) {
    setupBox.classList.remove('hidden');
    loadingBox.classList.add('hidden');
    alert("No questions could be loaded for this test. Please go back to the dashboard and try again.");
    return;
  }

  setupBox.classList.add('hidden');
  quizBox.classList.remove('hidden');
  document.getElementById('palettePanel').classList.remove('hidden');

  // Honest AI notices: live generation failed, or the topic isn't in the bank.
  const notice = document.getElementById('aiNotice');
  const noticeText = document.getElementById('aiNoticeText');
  if (quizType === 'AI' && (aiFallbackUsed || aiErrorMessage)) {
    if (noticeText) {
      if (aiErrorMessage && aiFallbackUsed) {
        noticeText.innerHTML = `<strong>Live AI generation failed</strong> — ${aiErrorMessage} This topic also isn't in the built-in bank, so practising mixed questions from all subjects instead.`;
      } else if (aiErrorMessage) {
        noticeText.innerHTML = `<strong>Live AI generation failed</strong> — ${aiErrorMessage} Using the built-in bank instead.`;
      } else {
        noticeText.innerHTML = `<strong>This topic isn't in the built-in bank yet</strong> — practising mixed questions from all subjects instead. Add the topic to the bank or set a Gemini API key for live generation.`;
      }
    }
    notice.classList.remove('hidden');
  } else {
    notice.classList.add('hidden');
  }

  currentIndex = 0;
  userAnswers = new Array(questions.length).fill(undefined);
  markedForReview = new Set();
  elapsedSeconds = 0;
  testActive = true;

  document.getElementById('totalQLabel').textContent = questions.length;
  renderPalette();
  loadQuestion();
  startElapsedTimer();
}

// ---------- AI topic generation ----------
async function prepareAIQuestions(topic) {
  aiErrorMessage = '';
  // Live generation first, when the user has saved their own Gemini key.
  if (window.CadetAI && window.CadetAI.hasApiKey()) {
    try {
      const generated = await window.CadetAI.generateQuestions({
        topic,
        count: questionCount,
        difficulty: aiQuizDifficulty
      });
      questions = generated;
      aiFallbackUsed = false;
      return;
    } catch (err) {
      console.warn("Gemini generation failed, using built-in bank:", err && err.code ? err.code : err);
      aiErrorMessage = window.CadetAI.friendlyMessage(err);
      // Fall through to the built-in bank below.
    }
  } else {
    // Short delay so the loading screen reads naturally
    await new Promise(resolve => setTimeout(resolve, 900));
  }
  questions = getFallbackAIQuestions(topic);
}

function getFallbackAIQuestions(topic) {
  const t = topic.toLowerCase().trim();
  for (const key in aiTopicBank) {
    const k = key.toLowerCase();
    if (t.includes(k) || k.includes(t)) {
      aiFallbackUsed = false;
      return aiTopicBank[key].slice();
    }
  }
  // Topic is NOT in the built-in bank: say so honestly, then run mixed questions.
  aiFallbackUsed = true;
  return mixedQuestions(questionCount);
}

// ---------- Question rendering ----------
function loadQuestion() {
  selectedOption = (typeof userAnswers[currentIndex] === 'number') ? userAnswers[currentIndex] : null;
  updateNavButtons();

  const currentQ = questions[currentIndex];
  document.getElementById('questionCounter').textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  document.getElementById('progressBar').style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
  document.getElementById('questionText').textContent = currentQ.q;

  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';

  currentQ.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = "option-btn" + (selectedOption === idx ? " selected" : "");
    btn.innerHTML = `
      <span class="option-key">${String.fromCharCode(65 + idx)}</span>
      <span class="font-medium">${opt}</span>`;
    btn.onclick = () => selectOption(idx, btn);
    container.appendChild(btn);
  });

  updateMarkButton();
  renderPalette();
  startTimer();
}

function selectOption(idx, clickedBtn) {
  selectedOption = idx;
  userAnswers[currentIndex] = idx;
  document.getElementById('nextBtn').disabled = false;

  const allBtns = document.getElementById('optionsContainer').children;
  for (const btn of allBtns) btn.classList.remove('selected');
  clickedBtn.classList.add('selected');
  renderPalette();
}

function updateNavButtons() {
  document.getElementById('prevBtn').disabled = currentIndex === 0;
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = currentIndex === questions.length - 1 ? "Submit Test ✓" : "Next Question →";
  nextBtn.disabled = selectedOption === null;
  document.getElementById('submitBtn').classList.toggle('hidden', currentIndex !== questions.length - 1);
}

function updateMarkButton() {
  const btn = document.getElementById('markBtn');
  const marked = markedForReview.has(currentIndex);
  btn.textContent = marked ? "★ Marked for Review — Unmark" : "☆ Mark for Review";
  btn.classList.toggle('marked-on', marked);
}

function toggleMarkForReview() {
  if (markedForReview.has(currentIndex)) {
    markedForReview.delete(currentIndex);
  } else {
    markedForReview.add(currentIndex);
  }
  updateMarkButton();
  renderPalette();
}

// ---------- Palette ----------
function renderPalette() {
  const grid = document.getElementById('paletteGrid');
  if (!grid) return;
  grid.innerHTML = '';
  questions.forEach((_, idx) => {
    const btn = document.createElement('button');
    const ans = userAnswers[idx];
    let cls = "palette-btn";
    if (idx === currentIndex) cls += " current";
    if (typeof ans === 'number') cls += " answered";
    else if (ans === null) cls += " skipped";
    if (markedForReview.has(idx)) cls += " marked";
    btn.className = cls;
    btn.textContent = idx + 1;
    btn.title = `Question ${idx + 1}` +
      (typeof ans === 'number' ? " — Answered" : ans === null ? " — Skipped" : " — Not visited") +
      (markedForReview.has(idx) ? " — Marked for review" : "");
    btn.onclick = () => jumpToQuestion(idx);
    grid.appendChild(btn);
  });

  const answered = userAnswers.filter(a => typeof a === 'number').length;
  document.getElementById('paletteSummary').textContent =
    `${answered} answered • ${markedForReview.size} marked • ${questions.length - answered} remaining`;
}

function jumpToQuestion(idx) {
  if (idx === currentIndex) return;
  clearInterval(timerInterval);
  currentIndex = idx;
  loadQuestion();
}

// ---------- Navigation ----------
function nextQuestion() {
  if (currentIndex === questions.length - 1) {
    confirmSubmit();
    return;
  }
  if (selectedOption === null && userAnswers[currentIndex] === undefined) {
    userAnswers[currentIndex] = null; // moving on without answering = skipped
  }
  moveTo(currentIndex + 1);
}

function prevQuestion() {
  if (currentIndex === 0) return;
  moveTo(currentIndex - 1);
}

function skipQuestion() {
  userAnswers[currentIndex] = null;
  selectedOption = null;
  if (currentIndex === questions.length - 1) {
    confirmSubmit();
  } else {
    moveTo(currentIndex + 1);
  }
}

function moveTo(idx) {
  clearInterval(timerInterval);
  currentIndex = idx;
  loadQuestion();
}

function confirmSubmit() {
  const answered = userAnswers.filter(a => typeof a === 'number').length;
  const unanswered = questions.length - answered;
  const msg = unanswered > 0
    ? `You have answered ${answered} of ${questions.length} questions.\n${unanswered} question(s) are unanswered and will count as skipped (0 marks).\n\nSubmit the test now?`
    : `You have answered all ${questions.length} questions.\n\nSubmit the test now?`;
  if (window.confirm(msg)) showResults();
}

// ---------- Timers ----------
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = timePerQuestion;
  const timerBox = document.getElementById('timerBox');
  const timerText = document.getElementById('timerText');
  timerText.textContent = `${timeLeft}s`;
  timerBox.classList.remove('low');

  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.textContent = `${timeLeft}s`;
    if (timeLeft <= 10) timerBox.classList.add('low');
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      // Time up on this question: counts as skipped, auto-advance.
      userAnswers[currentIndex] = null;
      selectedOption = null;
      if (currentIndex === questions.length - 1) {
        showResults();
      } else {
        moveTo(currentIndex + 1);
      }
    }
  }, 1000);
}

function startElapsedTimer() {
  clearInterval(elapsedInterval);
  const el = document.getElementById('elapsedText');
  el.textContent = "00:00";
  elapsedInterval = setInterval(() => {
    elapsedSeconds++;
    el.textContent = formatElapsed(elapsedSeconds);
  }, 1000);
}

// ---------- Exit / safety ----------
function exitTest() {
  if (testActive) {
    if (!window.confirm("Exit the test? Your progress on this attempt will be lost.")) return;
  }
  testActive = false;
  window.location.href = 'dashboard.html';
}

window.addEventListener('beforeunload', (e) => {
  if (testActive) {
    e.preventDefault();
    e.returnValue = "";
  }
});

function retryTest() {
  testActive = false;
  window.location.reload();
}

// ---------- Results ----------
function showResults() {
  clearInterval(timerInterval);
  clearInterval(elapsedInterval);
  testActive = false;

  document.getElementById('quizBox').classList.add('hidden');
  document.getElementById('palettePanel').classList.add('hidden');
  document.getElementById('resultBox').classList.remove('hidden');
  document.getElementById('resultModeSub').textContent = `${activeQuizTitle} (${examMode} Pattern) • Time taken ${formatElapsed(elapsedSeconds)}`;

  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  let penalty = 0;

  const reviewContainer = document.getElementById('reviewContainer');
  reviewContainer.innerHTML = '';

  questions.forEach((q, idx) => {
    const userAns = userAnswers[idx];
    let statusBadge = '';

    if (userAns === null || userAns === undefined) {
      skipped++;
      statusBadge = `<span class="text-xs bg-[#33362a] text-[#cfd2bd] px-2.5 py-1 rounded whitespace-nowrap">Skipped (0.00)</span>`;
    } else if (userAns === q.answer) {
      correct++;
      statusBadge = `<span class="text-xs bg-[rgba(201,162,39,.15)] text-[#e3c766] border border-[rgba(201,162,39,.4)] px-2.5 py-1 rounded whitespace-nowrap">Correct (+1.00)</span>`;
    } else {
      wrong++;
      if (examMode === 'PPSC') {
        penalty += 0.25;
        statusBadge = `<span class="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded whitespace-nowrap">Wrong (−0.25)</span>`;
      } else {
        statusBadge = `<span class="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded whitespace-nowrap">Wrong (0.00)</span>`;
      }
    }

    const markedTag = markedForReview.has(idx)
      ? `<span class="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded whitespace-nowrap">★ Marked</span>`
      : '';

    const yourAnswerLine = (userAns === null || userAns === undefined)
      ? `<p class="text-sm text-[#a9ad97] mt-2">Your answer: <em>Not attempted</em></p>`
      : `<p class="text-sm mt-2 ${userAns === q.answer ? 'text-[#e3c766]' : 'text-red-400'}">Your answer: ${q.options[userAns]}</p>`;

    const reviewItem = document.createElement('div');
    reviewItem.className = "bg-[#1c1e1a] border border-[#33362a] p-4 rounded-xl";
    reviewItem.innerHTML = `
      <div class="flex justify-between items-start gap-4 flex-wrap">
        <p class="font-bold text-white">${idx + 1}. ${q.q}</p>
        <span class="flex gap-2">${markedTag}${statusBadge}</span>
      </div>
      ${yourAnswerLine}
      <p class="text-sm text-[#e3c766] mt-1">✔ Correct Answer: ${q.options[q.answer]}</p>
      <p class="text-xs text-[#a9ad97] mt-1.5 bg-[#26281f] p-2.5 rounded-lg border border-[#33362a]">
        💡 <strong>Explanation:</strong> ${q.explanation}
      </p>`;
    reviewContainer.appendChild(reviewItem);
  });

  const finalScore = Math.max(0, (correct - penalty)).toFixed(2);
  const accuracy = Math.round((correct / questions.length) * 100);

  document.getElementById('resCorrect').textContent = correct;
  document.getElementById('resWrong').textContent = wrong;
  document.getElementById('resSkipped').textContent = skipped;
  document.getElementById('resPenalty').textContent = `-${penalty.toFixed(2)}`;
  document.getElementById('resFinalScore').textContent = `${finalScore} / ${questions.length}`;
  document.getElementById('resAccuracy').textContent = `${accuracy}%`;
  document.getElementById('resTime').textContent = formatElapsed(elapsedSeconds);

  // Save score to localStorage so Dashboard updates automatically
  saveScoreToHistory(activeQuizTitle, examMode, finalScore, questions.length, accuracy, correct, wrong);
}

function saveScoreToHistory(subject, mode, netScore, total, accuracy, correct, wrong) {
  const history = JSON.parse(localStorage.getItem('testHistory') || '[]');
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });

  history.unshift({
    subject,
    mode,
    netScore,
    total,
    accuracy,
    correct: correct || 0,
    wrong: wrong || 0,
    date: dateStr
  });

  localStorage.setItem('testHistory', JSON.stringify(history.slice(0, 10)));
  updateStreak();

  // Step 3 — cloud sync (best-effort, never blocks the result screen):
  // when a Firebase user is signed in, the local mirror (history + streak)
  // is uploaded to Firestore; when logged out or not configured this is a
  // no-op and the local behaviour above is unchanged.
  try {
    if (window.CadetBackend) {
      window.CadetBackend.syncLocal().catch(function () { /* offline / not configured */ });
    }
  } catch (e) { /* cloud sync must never break the quiz */ }
}

function updateStreak() {
  // Daily streak, keyed by calendar date (local time).
  let streak = { lastDate: null, count: 0 };
  try { streak = JSON.parse(localStorage.getItem('cadetStreak') || 'null') || streak; } catch (e) { /* corrupted value: reset */ }

  const today = new Date();
  const todayKey = localDateKey(today);
  if (streak.lastDate === todayKey) return; // already counted today

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  streak.count = (streak.lastDate === localDateKey(yesterday)) ? (streak.count || 0) + 1 : 1;
  streak.lastDate = todayKey;
  localStorage.setItem('cadetStreak', JSON.stringify(streak));
}
