(function () {
  'use strict';

  var bank = window.JEJAK_TUMBUH_MATH_6;
  var app = document.querySelector('[data-quiz-app]');
  if (!app || !bank) return;

  var screens = {
    setup: app.querySelector('[data-screen="setup"]'),
    quiz: app.querySelector('[data-screen="quiz"]'),
    result: app.querySelector('[data-screen="result"]')
  };
  var setupForm = app.querySelector('[data-setup-form]');
  var totalTime = app.querySelector('[data-total-time]');
  var questionTime = app.querySelector('[data-question-time]');
  var progressLabel = app.querySelector('[data-progress-label]');
  var progressBar = app.querySelector('[data-progress-bar]');
  var questionMap = app.querySelector('[data-question-map]');
  var topic = app.querySelector('[data-question-topic]');
  var title = app.querySelector('[data-question-title]');
  var context = app.querySelector('[data-question-context]');
  var prompt = app.querySelector('[data-question-text]');
  var visual = app.querySelector('[data-question-visual]');
  var answerList = app.querySelector('[data-answer-list]');
  var practiceFeedback = app.querySelector('[data-practice-feedback]');
  var studentBadge = app.querySelector('[data-student-badge]');
  var prevButton = app.querySelector('[data-prev]');
  var nextButton = app.querySelector('[data-next]');
  var finishButton = app.querySelector('[data-finish]');
  var resultTitle = app.querySelector('[data-result-title]');
  var scorePercent = app.querySelector('[data-score-percent]');
  var scoreDetail = app.querySelector('[data-score-detail]');
  var topicSummary = app.querySelector('[data-topic-summary]');
  var reviewList = app.querySelector('[data-review-list]');
  var reviewButton = app.querySelector('[data-review-mode]');
  var restartSameButton = app.querySelector('[data-restart-same]');
  var restartNewButton = app.querySelector('[data-restart-new]');

  var state = {
    studentName: '',
    questions: [],
    answers: {},
    current: 0,
    durationSeconds: 0,
    totalRemaining: 0,
    perQuestionSeconds: 0,
    questionRemaining: 0,
    timer: null,
    finished: false,
    slotStatus: [],
    attempts: [],
    mistakes: [],
    feedback: []
  };

  function showScreen(name) {
    Object.keys(screens).forEach(function (key) {
      screens[key].classList.toggle('is-hidden', key !== name);
    });
  }

  function formatTime(seconds) {
    var safeSeconds = Math.max(0, seconds);
    var mins = Math.floor(safeSeconds / 60);
    var secs = safeSeconds % 60;
    return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  }

  function resetRuntime(keepQuestions) {
    window.clearInterval(state.timer);
    state.answers = {};
    state.slotStatus = [];
    state.attempts = [];
    state.mistakes = [];
    state.feedback = [];
    state.current = 0;
    state.finished = false;
    state.totalRemaining = state.durationSeconds;
    state.perQuestionSeconds = Math.max(30, Math.floor(state.durationSeconds / state.questions.length));
    state.questionRemaining = state.perQuestionSeconds;
    if (!keepQuestions) state.questions = bank.buildSet(state.questions.length || 20);
    state.questions.forEach(function () {
      state.slotStatus.push('pending');
      state.attempts.push(0);
      state.mistakes.push([]);
      state.feedback.push(null);
    });
  }

  function startQuiz(options) {
    state.studentName = options.studentName || 'Jejak Tumbuh';
    state.questions = bank.buildSet(options.questionCount);
    state.durationSeconds = options.durationMinutes * 60;
    resetRuntime(true);
    studentBadge.textContent = state.studentName;
    showScreen('quiz');
    renderQuestion();
    state.timer = window.setInterval(tick, 1000);
  }

  function tick() {
    if (state.finished) return;
    state.totalRemaining -= 1;
    state.questionRemaining -= 1;
    updateTimers();

    if (state.totalRemaining <= 0) {
      finishQuiz();
      return;
    }

    if (state.questionRemaining <= 0) {
      markCurrentTimeout();
      advanceAfterCompletedSlot();
    }
  }

  function updateTimers() {
    totalTime.textContent = formatTime(state.totalRemaining);
    questionTime.textContent = formatTime(state.questionRemaining);
  }

  function renderQuestion() {
    var item = state.questions[state.current];
    var slotStatus = state.slotStatus[state.current];
    var feedback = state.feedback[state.current];
    topic.textContent = item.topic;
    title.textContent = 'Soal ' + (state.current + 1);
    context.textContent = item.context;
    prompt.textContent = item.prompt;
    visual.innerHTML = renderVisual(item.visual);
    answerList.innerHTML = '';
    practiceFeedback.innerHTML = '';
    practiceFeedback.classList.add('is-hidden');

    item.options.forEach(function (option) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-option';
      if (state.answers[state.current] === option.id) button.classList.add('is-selected');
      if (feedback && feedback.selectedId === option.id) button.classList.add('is-wrong');
      if (feedback && item.answer === option.id) button.classList.add('is-correct');
      if (slotStatus !== 'pending' || feedback) button.disabled = true;
      button.innerHTML = '<b>' + option.id + '</b><span>' + option.text + '</span>';
      button.addEventListener('click', function () {
        handleAnswer(option.id);
      });
      answerList.appendChild(button);
    });

    if (feedback) renderPracticeFeedback(feedback);

    prevButton.disabled = true;
    var isLastQuestion = state.current === state.questions.length - 1;
    var canMoveForward = slotStatus === 'correct' || slotStatus === 'timeout';
    nextButton.classList.toggle('is-hidden', isLastQuestion || !canMoveForward);
    finishButton.classList.toggle('is-hidden', !isLastQuestion || !canMoveForward);
    nextButton.textContent = 'Berikutnya →';
    progressLabel.textContent = 'Soal ' + (state.current + 1) + ' dari ' + state.questions.length + ' · Percobaan ' + (state.attempts[state.current] + 1);
    progressBar.style.width = ((state.current + 1) / state.questions.length * 100) + '%';
    updateTimers();
    renderMap();
  }

  function handleAnswer(answerId) {
    var item = state.questions[state.current];
    if (state.slotStatus[state.current] !== 'pending' || state.feedback[state.current]) return;

    state.attempts[state.current] += 1;
    if (answerId === item.answer) {
      state.answers[state.current] = answerId;
      state.slotStatus[state.current] = 'correct';
      state.feedback[state.current] = {
        type: 'correct',
        title: 'Benar. Nomor ini selesai.',
        explanation: 'Kamu sudah menemukan cara hitung yang tepat. Lanjutkan ke nomor berikutnya sebelum waktu habis.',
        question: item
      };
      renderQuestion();
      return;
    }

    var selected = item.options.find(function (option) { return option.id === answerId; });
    var correct = item.options.find(function (option) { return option.id === item.answer; });
    var mistake = {
      type: 'wrong',
      selectedId: answerId,
      selectedText: selected ? selected.text : 'Tidak ada jawaban',
      correctText: correct ? correct.text : item.correctText,
      explanation: item.explanation,
      question: item
    };
    state.mistakes[state.current].push(mistake);
    state.feedback[state.current] = mistake;
    renderQuestion();
  }

  function renderSolutionSteps(question) {
    var steps = question.solutionSteps && question.solutionSteps.length ? question.solutionSteps : [question.explanation];
    return '<ol class="practice-steps">' + steps.map(function (step) {
      return '<li>' + step.replace(/\.$/, '') + '</li>';
    }).join('') + '</ol>';
  }

  function renderPracticeFeedback(feedback) {
    var title = feedback.type === 'correct' ? feedback.title : 'Belum tepat. Lihat cara benarnya dulu.';
    var action = feedback.type === 'correct'
      ? ''
      : '<button class="learning-button" type="button" data-retry-equivalent>Coba soal setara</button><p class="practice-feedback__hint">Nomor soal tetap sama. Waktu soal ini tetap berjalan.</p>';

    practiceFeedback.classList.remove('is-hidden');
    practiceFeedback.innerHTML =
      '<div class="practice-feedback__copy">' +
        '<h4>' + title + '</h4>' +
        (feedback.type === 'wrong' ? '<p><strong>Jawaban kamu:</strong> ' + feedback.selectedText + '</p>' : '') +
        (feedback.type === 'wrong' ? '<p><strong>Jawaban benar:</strong> ' + feedback.correctText + '</p>' : '') +
        '<div class="practice-feedback__method"><strong>Cara hitung</strong>' + renderSolutionSteps(feedback.question) + '</div>' +
        action +
      '</div>' +
      '<div class="practice-feedback__visual">' + renderVisual(feedback.question.visual) + '</div>';

    var retryButton = practiceFeedback.querySelector('[data-retry-equivalent]');
    if (retryButton) {
      retryButton.addEventListener('click', function () {
        state.questions[state.current] = bank.makeVariant(state.questions[state.current]);
        state.feedback[state.current] = null;
        state.answers[state.current] = null;
        renderQuestion();
      });
    }
  }

  function renderMap() {
    questionMap.innerHTML = '';
    state.questions.forEach(function (_item, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = index + 1;
      if (index === state.current) button.classList.add('is-current');
      if (state.slotStatus[index] === 'correct') button.classList.add('is-answered');
      if (state.slotStatus[index] === 'timeout') button.classList.add('is-timeout');
      if (index !== state.current) button.disabled = true;
      questionMap.appendChild(button);
    });
  }

  function markCurrentTimeout() {
    if (state.slotStatus[state.current] === 'pending') {
      state.slotStatus[state.current] = 'timeout';
      state.answers[state.current] = '__timeout';
      state.feedback[state.current] = null;
    }
  }

  function advanceAfterCompletedSlot() {
    if (state.current < state.questions.length - 1) {
      state.current += 1;
      state.questionRemaining = state.perQuestionSeconds;
      renderQuestion();
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    state.finished = true;
    window.clearInterval(state.timer);
    showScreen('result');
    renderResult();
  }

  function getScore() {
    var correct = 0;
    state.questions.forEach(function (_item, index) {
      if (state.slotStatus[index] === 'correct') correct += 1;
    });
    return correct;
  }

  function renderResult() {
    var correct = getScore();
    var percent = Math.round(correct / state.questions.length * 100);
    resultTitle.textContent = percent >= 80 ? 'Bagus, kamu sudah kuat di banyak topik.' : 'Sesi selesai. Kita lihat bagian yang perlu dilatih lagi.';
    scorePercent.textContent = percent + '%';
    scoreDetail.textContent = correct + ' dari ' + state.questions.length + ' benar';
    renderTopicSummary();
    renderReviewList(false);
  }

  function renderTopicSummary() {
    var byTopic = {};
    state.questions.forEach(function (item, index) {
      if (!byTopic[item.topic]) byTopic[item.topic] = { total: 0, correct: 0 };
      byTopic[item.topic].total += 1;
      if (state.slotStatus[index] === 'correct') byTopic[item.topic].correct += 1;
    });
    topicSummary.innerHTML = Object.keys(byTopic).sort().map(function (name) {
      var row = byTopic[name];
      var percent = Math.round(row.correct / row.total * 100);
      return '<div class="topic-row"><div class="topic-row__top"><span>' + name + '</span><span>' + row.correct + '/' + row.total + '</span></div><div class="topic-meter"><i style="width:' + percent + '%"></i></div></div>';
    }).join('');
  }

  function renderReviewList(showAll) {
    var rows = state.questions.map(function (item, index) {
      var isCorrect = state.slotStatus[index] === 'correct';
      var lastMistake = state.mistakes[index][state.mistakes[index].length - 1];
      var correctOption = item.options.find(function (option) { return option.id === item.answer; });
      var reviewedPrompt = lastMistake ? lastMistake.question.prompt : item.prompt;
      var reviewedAnswer = lastMistake ? lastMistake.correctText : (correctOption ? correctOption.text : item.correctText);
      var reviewedExplanation = lastMistake ? lastMistake.explanation : item.explanation;
      if (!showAll && isCorrect && !state.mistakes[index].length) return '';
      return '<article class="review-item ' + (isCorrect ? 'is-correct' : '') + '"><h4>Soal ' + (index + 1) + ' · ' + item.topic + '</h4><p><strong>Status:</strong> ' + (isCorrect ? 'Benar' : 'Waktu habis / belum selesai') + ' · Percobaan: ' + state.attempts[index] + '</p><p><strong>Pertanyaan yang direview:</strong> ' + reviewedPrompt + '</p><p><strong>Jawaban terakhir yang salah:</strong> ' + (lastMistake ? lastMistake.selectedText : '-') + '</p><p><strong>Jawaban benar:</strong> ' + reviewedAnswer + '</p><p>' + reviewedExplanation + '</p></article>';
    }).join('');
    reviewList.innerHTML = rows || '<article class="review-item is-correct"><h4>Semua jawaban benar.</h4><p>Kamu bisa membuat set berbeda untuk latihan variasi soal berikutnya.</p></article>';
  }

  function renderVisual(data) {
    if (!data) return '';
    if (data.type === 'stats') {
      return '<div class="visual-card"><h4>' + data.title + '</h4><div class="visual-stats">' + data.stats.map(function (stat) {
        return '<div><b>' + stat[0] + '</b><span>' + stat[1] + '</span></div>';
      }).join('') + '</div></div>';
    }
    if (data.type === 'equation') {
      return '<div class="visual-card"><h4>' + data.title + '</h4><div class="visual-equation">' + data.html + '</div></div>';
    }
    if (data.type === 'fraction') {
      return '<div class="visual-card"><h4>' + data.title + '</h4><div class="fraction-visual">' + Array.from({ length: 12 }).map(function (_, index) {
        return '<i style="opacity:' + (index < 8 ? 1 : .45) + '"></i>';
      }).join('') + '</div></div>';
    }
    if (data.type === 'ratio') {
      var total = data.widths[0] + data.widths[1];
      return '<div class="visual-card"><h4>' + data.title + '</h4><div class="ratio-bars">' + data.labels.map(function (label, index) {
        return '<div class="ratio-row"><span>' + label + '</span><i style="width:' + (data.widths[index] / total * 100) + '%"></i></div>';
      }).join('') + '</div></div>';
    }
    if (data.type === 'bar') {
      return '<div class="visual-card"><h4>' + data.title + '</h4><div class="ratio-bars">' + data.segments.map(function (label, index) {
        return '<div class="ratio-row"><span>' + label + '</span><i style="width:' + (42 + index * 9) + '%"></i></div>';
      }).join('') + '</div></div>';
    }
    if (data.type === 'coordinate') {
      return '<div class="visual-card chart-visual"><h4>' + data.title + '</h4><svg viewBox="0 0 280 220" role="img" aria-label="Bidang koordinat"><rect width="280" height="220" rx="18" fill="#fffdf7"/><path d="M30 110H250M140 20V200" stroke="#153a34" stroke-width="2"/><path d="M65 65H215V155H65Z" fill="#d9efeb" stroke="#0c5d58" stroke-width="4"/><circle cx="65" cy="65" r="6" fill="#ee7740"/><circle cx="65" cy="155" r="6" fill="#ee7740"/><circle cx="215" cy="155" r="6" fill="#ee7740"/><circle cx="215" cy="65" r="6" fill="#f4c64d"/><text x="52" y="57" font-size="14" font-weight="800">A</text><text x="52" y="177" font-size="14" font-weight="800">B</text><text x="220" y="177" font-size="14" font-weight="800">C</text><text x="220" y="57" font-size="14" font-weight="800">D</text></svg></div>';
    }
    if (data.type === 'shape') {
      return '<div class="visual-card shape-visual"><h4>' + data.title + '</h4><svg viewBox="0 0 280 220" role="img" aria-label="Ilustrasi bangun datar"><rect width="280" height="220" rx="18" fill="#fffdf7"/><path d="M140 26L224 110L140 194L56 110Z" fill="#d9efeb" stroke="#0c5d58" stroke-width="5"/><path d="M56 110H224M140 26V194" stroke="#153a34" stroke-dasharray="8 8" stroke-width="2"/><circle cx="140" cy="110" r="8" fill="#ee7740"/></svg></div>';
    }
    if (data.type === 'circle') {
      return '<div class="visual-card shape-visual"><h4>' + data.title + '</h4><svg viewBox="0 0 280 220" role="img" aria-label="Lingkaran dengan diameter"><rect width="280" height="220" rx="18" fill="#fffdf7"/><circle cx="140" cy="110" r="72" fill="#d9efeb" stroke="#0c5d58" stroke-width="5"/><path d="M68 110H212" stroke="#153a34" stroke-dasharray="9 7" stroke-width="4"/><circle cx="140" cy="110" r="5" fill="#ee7740"/></svg></div>';
    }
    if (data.type === 'cylinder') {
      return '<div class="visual-card shape-visual"><h4>' + data.title + '</h4><svg viewBox="0 0 280 220" role="img" aria-label="Tabung"><rect width="280" height="220" rx="18" fill="#fffdf7"/><path d="M80 65C80 43 200 43 200 65V155C200 178 80 178 80 155Z" fill="#d9efeb" stroke="#0c5d58" stroke-width="5"/><ellipse cx="140" cy="65" rx="60" ry="21" fill="#fffdf7" stroke="#0c5d58" stroke-width="5"/><path d="M99 65H181" stroke="#153a34" stroke-width="3"/><text x="120" y="58" font-size="14" font-weight="900">14 cm</text></svg></div>';
    }
    if (data.type === 'cube') {
      return '<div class="visual-card shape-visual"><h4>' + data.title + '</h4><svg viewBox="0 0 280 220" role="img" aria-label="Kubus"><rect width="280" height="220" rx="18" fill="#fffdf7"/><path d="M82 82H166V166H82Z" fill="#d9efeb" stroke="#0c5d58" stroke-width="5"/><path d="M166 82L207 50V133L166 166ZM82 82L123 50H207M123 50V133L82 166" fill="none" stroke="#153a34" stroke-width="4"/><text x="107" y="187" font-size="15" font-weight="900">sisi sama</text></svg></div>';
    }
    if (data.type === 'table') {
      return '<div class="visual-card table-visual"><h4>' + data.title + '</h4><table><thead><tr><th>Bulan</th><th>Ton</th></tr></thead><tbody>' + data.rows.map(function (row) {
        return '<tr><td>' + row[0] + '</td><td>' + row[1] + '</td></tr>';
      }).join('') + '</tbody></table></div>';
    }
    if (data.type === 'pie') {
      var sport = data.sportPercent || 30;
      var dance = 10;
      var paint = 20;
      var sing = 100 - sport - dance - paint;
      var singEnd = sing;
      var danceEnd = singEnd + dance;
      var sportEnd = danceEnd + sport;
      var bg = 'conic-gradient(var(--teal) 0 ' + singEnd + '%, var(--yellow) ' + singEnd + '% ' + danceEnd + '%, var(--leaf) ' + danceEnd + '% ' + sportEnd + '%, var(--orange) ' + sportEnd + '% 100%)';
      return '<div class="visual-card pie-visual"><div class="pie" style="background:' + bg + '"></div><div class="pie-legend"><span><i></i>Menyanyi ' + sing + '%</span><span><i></i>Menari ' + dance + '%</span><span><i></i>Olahraga ' + sport + '%</span><span><i></i>Melukis ' + paint + '%</span></div></div>';
    }
    return '';
  }

  setupForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var data = new FormData(setupForm);
    startQuiz({
      studentName: String(data.get('studentName') || '').trim(),
      durationMinutes: Number(data.get('duration') || bank.defaultDurationMinutes),
      questionCount: Number(data.get('questionCount') || 20)
    });
  });

  prevButton.addEventListener('click', function () {
    renderQuestion();
  });

  nextButton.addEventListener('click', function () {
    if (state.slotStatus[state.current] === 'correct' || state.slotStatus[state.current] === 'timeout') advanceAfterCompletedSlot();
  });

  finishButton.addEventListener('click', finishQuiz);
  reviewButton.addEventListener('click', function () { renderReviewList(true); });
  restartSameButton.addEventListener('click', function () {
    resetRuntime(true);
    showScreen('quiz');
    renderQuestion();
    state.timer = window.setInterval(tick, 1000);
  });
  restartNewButton.addEventListener('click', function () {
    resetRuntime(false);
    showScreen('quiz');
    renderQuestion();
    state.timer = window.setInterval(tick, 1000);
  });
})();
