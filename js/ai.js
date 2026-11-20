/* ============================================================
   CadetToCSP — Gemini AI client (js/ai.js)
   Plain <script> file (NO ES modules) so the site works from
   file:// as well as from any static host.
   Loaded BEFORE js/quiz.js (and on dashboard.html for the
   key settings). Exposes window.CadetAI.

   BRING YOUR OWN KEY: no API key is bundled or hard-coded
   anywhere in this project. The user pastes their own FREE
   Google Gemini key (from Google AI Studio) in the Dashboard
   settings; it is stored only in their browser (localStorage
   key 'geminiApiKey') and sent only to Google's Gemini API.
   The key is never logged, never embedded in code, and never
   sent anywhere else.

   API (verified against Google's official Gemini API docs,
   Nov 2026):
   - REST endpoint: POST
     https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key=KEY
   - Body: { contents: [{ parts: [{ text }] }],
             generationConfig: { responseMimeType: "application/json",
                                 responseSchema: {...} } }
   - Response: { candidates: [{ content: { parts: [{ text }] } }] }
     where the text is the JSON string.
   - Primary model: gemini-2.5-flash (free tier). If Google
     reports it as not found (404), we retry once with
     gemini-3-flash-preview.
   - Free-tier limits are small and change often (a few requests
     per minute / per day). A 429 means the free quota is used up
     for now — the quiz falls back to the built-in bank.
   ============================================================ */

(function () {
  'use strict';

  var MODEL_PRIMARY = 'gemini-2.5-flash';
  var MODEL_FALLBACK = 'gemini-3-flash-preview';
  var API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/';
  var KEY_STORAGE = 'geminiApiKey';
  var REQUEST_TIMEOUT_MS = 60000;

  /* ---------- Key storage (browser only) ---------- */
  function getApiKey() {
    try {
      return (localStorage.getItem(KEY_STORAGE) || '').trim();
    } catch (e) {
      return '';
    }
  }

  function hasApiKey() {
    return getApiKey().length > 0;
  }

  function saveApiKey(key) {
    var k = (key || '').trim();
    if (!k) return false;
    try {
      localStorage.setItem(KEY_STORAGE, k);
      return true;
    } catch (e) {
      return false;
    }
  }

  function removeApiKey() {
    try {
      localStorage.removeItem(KEY_STORAGE);
    } catch (e) { /* storage unavailable: nothing to remove */ }
  }

  /* Masked display only — never the real key. */
  function maskKey(key) {
    var k = (key || '').trim();
    if (k.length <= 4) return '••••';
    return '••••••••' + k.slice(-4);
  }

  /* ---------- Errors ---------- */
  function aiError(code, message, detail) {
    var err = new Error(message);
    err.code = code;
    if (detail) err.detail = detail;
    return err;
  }

  /* Plain-English message for each failure, for the UI. */
  function friendlyMessage(err) {
    if (!err) return 'Something went wrong with the AI request.';
    switch (err.code) {
      case 'NO_KEY':
        return 'No Gemini API key is saved. Add your free key in the Dashboard settings, or keep using the built-in bank.';
      case 'BAD_KEY':
        return 'Google rejected the API key (invalid key, or the Gemini API is not enabled for it). Check the key in the Dashboard settings.';
      case 'QUOTA':
        return 'The free Gemini quota is used up for now. Try again later, or keep using the built-in bank.';
      case 'MODEL_NOT_FOUND':
        return 'Google no longer offers the Gemini model this app uses. The built-in bank is being used instead.';
      case 'NETWORK':
        return 'Could not reach Google Gemini — check your internet connection and try again.';
      case 'BAD_RESPONSE':
        return 'Gemini answered, but the questions came back in an unexpected format.';
      default:
        return err.message || 'Something went wrong with the AI request.';
    }
  }

  /* ---------- Prompt ---------- */
  function buildPrompt(topic, count, difficulty) {
    var level = (difficulty || 'Medium').toLowerCase();
    var levelGuide = level === 'easy'
      ? 'Easy: direct factual recall — well-known facts a first-time aspirant should know.'
      : level === 'hard'
        ? 'Hard: tricky options with close distractors — deeper knowledge, dates and fine distinctions.'
        : 'Medium: a mix of recall and application — slightly deeper facts, not just the obvious ones.';
    return [
      'You are writing multiple-choice questions for Pakistani competitive exams',
      '(PPSC / FPSC one-paper tests and PMA / PAF / Navy initial tests).',
      '',
      'Write exactly ' + count + ' multiple-choice questions on the topic "' + topic + '".',
      'Difficulty: ' + difficulty + '. ' + levelGuide,
      '',
      'Rules:',
      '- Each question has exactly 4 options and exactly one correct answer.',
      '- The correct answer must be factually accurate — double-check dates, names and numbers.',
      '- The 4 options must be distinct from each other.',
      '- Each question has a short explanation (1-2 sentences) that states the correct fact.',
      '- Keep questions and options concise (one line each where possible).',
      '- Return ONLY a JSON array. No markdown fences, no commentary, no extra text.',
      '  Each item: {"q": "...", "options": ["...", "...", "...", "..."], "answer": 0, "explanation": "..."}',
      '  where "answer" is the index (0-3) of the correct option.'
    ].join('\n');
  }

  /* ---------- Response schema (Gemini REST structured output) ---------- */
  var QUESTION_SCHEMA = {
    type: 'ARRAY',
    items: {
      type: 'OBJECT',
      properties: {
        q: { type: 'STRING' },
        options: { type: 'ARRAY', items: { type: 'STRING' } },
        answer: { type: 'INTEGER' },
        explanation: { type: 'STRING' }
      },
      required: ['q', 'options', 'answer', 'explanation'],
      propertyOrdering: ['q', 'options', 'answer', 'explanation']
    }
  };

  /* ---------- Validation (bank format) ---------- */
  function validateQuestions(raw, expectedCount) {
    if (!Array.isArray(raw)) {
      throw aiError('BAD_RESPONSE', 'Gemini returned questions in an unexpected format.');
    }
    var valid = [];
    for (var i = 0; i < raw.length; i++) {
      var item = raw[i];
      if (!item || typeof item !== 'object') continue;
      var q = typeof item.q === 'string' ? item.q.trim() : '';
      var options = Array.isArray(item.options)
        ? item.options.map(function (o) { return typeof o === 'string' ? o.trim() : ''; })
        : [];
      var answer = item.answer;
      var explanation = typeof item.explanation === 'string' ? item.explanation.trim() : '';
      if (!q) continue;
      if (options.length !== 4) continue;
      if (options.some(function (o) { return !o; })) continue;
      if (new Set(options).size !== 4) continue; // options must be distinct
      if (!Number.isInteger(answer) || answer < 0 || answer > 3) continue;
      if (!explanation) explanation = 'See the correct option above.';
      valid.push({ q: q, options: options, answer: answer, explanation: explanation });
    }
    if (!valid.length) {
      throw aiError('BAD_RESPONSE', 'Gemini returned no usable questions.');
    }
    return valid.slice(0, expectedCount);
  }

  /* ---------- Low-level call ---------- */
  async function callGemini(apiKey, model, body) {
    var url = API_BASE + encodeURIComponent(model) + ':generateContent?key=' + encodeURIComponent(apiKey);
    var res;
    try {
      var ctrl = new AbortController();
      var timer = setTimeout(function () { ctrl.abort(); }, REQUEST_TIMEOUT_MS);
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: ctrl.signal
      });
      clearTimeout(timer);
    } catch (e) {
      // Network failure or timeout. Never log the URL (it carries the key).
      throw aiError('NETWORK', 'Could not reach Google Gemini. Check your internet connection and try again.');
    }

    var data = null;
    try { data = await res.json(); } catch (e) { /* non-JSON error body */ }

    if (!res.ok) {
      var detail = (data && data.error && data.error.message) ? String(data.error.message) : '';
      if (res.status === 400 || res.status === 403) {
        throw aiError('BAD_KEY', 'The API key was rejected by Google (invalid key or API not enabled).', detail);
      }
      if (res.status === 404) {
        throw aiError('MODEL_NOT_FOUND', 'The Gemini model was not found.', detail);
      }
      if (res.status === 429) {
        throw aiError('QUOTA', 'Free-tier quota used up for now. Try again later or use the built-in bank.', detail);
      }
      throw aiError('HTTP_' + res.status, 'Gemini returned an unexpected error (HTTP ' + res.status + ').', detail);
    }
    return data;
  }

  function extractText(data) {
    try {
      var parts = data.candidates[0].content.parts;
      var text = parts.map(function (p) { return p.text || ''; }).join('');
      return text.replace(/```json|```/g, '').trim();
    } catch (e) {
      throw aiError('BAD_RESPONSE', 'Gemini returned an empty response.');
    }
  }

  /* ---------- Public: generate questions ---------- */
  async function generateQuestions(opts) {
    opts = opts || {};
    var key = (opts.apiKey || getApiKey() || '').trim();
    if (!key) {
      throw aiError('NO_KEY', 'No Gemini API key saved.');
    }
    var count = Math.min(15, Math.max(1, parseInt(opts.count, 10) || 5));
    var difficulty = opts.difficulty || 'Medium';
    var topic = String(opts.topic || '').trim();
    if (!topic) {
      throw aiError('BAD_RESPONSE', 'No topic given for the AI quiz.');
    }

    var body = {
      contents: [{ parts: [{ text: buildPrompt(topic, count, difficulty) }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: QUESTION_SCHEMA,
        temperature: 0.7,
        maxOutputTokens: 4096
      }
    };

    var data;
    try {
      data = await callGemini(key, MODEL_PRIMARY, body);
    } catch (err) {
      // Model retired/renamed by Google? Retry once with the fallback model.
      if (err.code === 'MODEL_NOT_FOUND') {
        data = await callGemini(key, MODEL_FALLBACK, body);
      } else {
        throw err;
      }
    }

    var parsed;
    try {
      parsed = JSON.parse(extractText(data));
    } catch (e) {
      throw aiError('BAD_RESPONSE', 'Gemini returned text that was not valid JSON.');
    }
    return validateQuestions(parsed, count);
  }

  /* ---------- Public: test the saved key with one tiny call ---------- */
  async function testConnection(apiKey) {
    var key = (apiKey || getApiKey() || '').trim();
    if (!key) {
      throw aiError('NO_KEY', 'No Gemini API key saved yet.');
    }
    var body = {
      contents: [{ parts: [{ text: 'Reply with exactly this word and nothing else: OK' }] }],
      generationConfig: { maxOutputTokens: 16, temperature: 0 }
    };
    var data;
    try {
      data = await callGemini(key, MODEL_PRIMARY, body);
    } catch (err) {
      if (err.code === 'MODEL_NOT_FOUND') {
        data = await callGemini(key, MODEL_FALLBACK, body);
      } else {
        throw err;
      }
    }
    var text = extractText(data).trim();
    if (!/OK/i.test(text)) {
      throw aiError('BAD_RESPONSE', 'Gemini responded, but with unexpected text.');
    }
    return true;
  }

  window.CadetAI = {
    MODEL_PRIMARY: MODEL_PRIMARY,
    MODEL_FALLBACK: MODEL_FALLBACK,
    KEY_STORAGE: KEY_STORAGE,
    getApiKey: getApiKey,
    hasApiKey: hasApiKey,
    saveApiKey: saveApiKey,
    removeApiKey: removeApiKey,
    maskKey: maskKey,
    friendlyMessage: friendlyMessage,
    generateQuestions: generateQuestions,
    testConnection: testConnection,
    /* Exposed for testing only: */
    _internals: {
      validateQuestions: validateQuestions,
      buildPrompt: buildPrompt,
      extractText: extractText,
      QUESTION_SCHEMA: QUESTION_SCHEMA
    }
  };
})();
