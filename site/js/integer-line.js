(function () {
  'use strict';

  var app = document.querySelector('[data-integer-app]');
  if (!app) return;

  var controls = app.querySelector('[data-integer-controls]');
  var form = app.querySelector('[data-integer-form]');
  var answerInput = form.querySelector('input');
  var checkButton = app.querySelector('[data-check-integer]');
  var nextButton = app.querySelector('[data-next-integer]');
  var resetButton = app.querySelector('[data-reset-integer]');
  var questionEl = app.querySelector('[data-integer-question]');
  var numberLine = app.querySelector('[data-number-line]');
  var hint = app.querySelector('[data-integer-hint]');
  var stepsEl = app.querySelector('[data-integer-steps]');
  var feedback = app.querySelector('[data-integer-feedback]');
  var countEl = app.querySelector('[data-integer-count]');
  var correctEl = app.querySelector('[data-integer-correct]');
  var scoreEl = app.querySelector('[data-integer-score]');

  var state = {
    question: null,
    count: 1,
    attempted: 0,
    correct: 0
  };

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function range() {
    var value = controls.elements.difficulty.value;
    if (value === 'easy') return 10;
    if (value === 'hard') return 50;
    return 20;
  }

  function formatNumber(value) {
    return value < 0 ? '-' + Math.abs(value) : String(value);
  }

  function signedNumber(value) {
    return value < 0 ? '(' + formatNumber(value) + ')' : formatNumber(value);
  }

  function moveValueFor(question) {
    return question.op === '+' ? question.b : -question.b;
  }

  function operationRule(question) {
    if (question.op === '+' && question.b >= 0) return 'Menambah bilangan positif berarti bergerak ke kanan.';
    if (question.op === '+' && question.b < 0) return 'Menambah bilangan negatif berarti bergerak ke kiri.';
    if (question.op === '-' && question.b >= 0) return 'Mengurangi bilangan positif berarti bergerak ke kiri.';
    return 'Mengurangi bilangan negatif berarti berbalik menjadi gerak ke kanan.';
  }

  function makeQuestion() {
    var limit = range();
    var mode = controls.elements.operation.value;
    var a;
    var b;
    var op;
    var result;

    do {
      a = rand(-limit, limit);
      b = rand(-limit, limit);
      op = mode === 'mixed' ? (Math.random() < 0.5 ? '+' : '-') : (mode === 'add' ? '+' : '-');
      result = op === '+' ? a + b : a - b;
    } while (b === 0 || Math.abs(result) > limit * 1.7);

    state.question = { a: a, b: b, op: op, result: result };
    questionEl.textContent = formatNumber(a) + ' ' + op + ' ' + signedNumber(b) + ' = ?';
    hint.textContent = 'Tentukan posisi akhir pada garis bilangan.';
    stepsEl.innerHTML = renderSteps(false);
    feedback.textContent = '';
    feedback.className = '';
    answerInput.value = '';
    answerInput.disabled = false;
    checkButton.classList.remove('is-hidden');
    nextButton.classList.add('is-hidden');
    drawLine(false);
    updateStats();
    answerInput.focus();
  }

  function moveValue() {
    return moveValueFor(state.question);
  }

  function drawLine(showAnswer) {
    var q = state.question;
    var move = moveValue();
    var start = q.a;
    var end = q.result;
    var min = Math.min(start, end) - 3;
    var max = Math.max(start, end) + 3;
    var span;
    var step;

    if (max - min < 10) {
      var middle = (max + min) / 2;
      min = Math.floor(middle - 5);
      max = Math.ceil(middle + 5);
    }

    span = max - min;
    step = span > 32 ? 5 : span > 18 ? 2 : 1;

    function pos(value) {
      return ((value - min) / (max - min)) * 94 + 3;
    }

    var html = '<div class="number-axis"></div>';
    if (min <= 0 && max >= 0) {
      html += '<div class="number-zero" style="left:' + pos(0) + '%">0</div>';
    }
    for (var n = Math.ceil(min / step) * step; n <= max; n += step) {
      html += '<div class="number-tick" style="left:' + pos(n) + '%"><i></i><span>' + formatNumber(n) + '</span></div>';
    }

    html += '<div class="number-point number-point--start" style="left:' + pos(start) + '%"></div>';
    html += '<div class="number-label" style="left:' + pos(start) + '%">Mulai</div>';

    if (showAnswer) {
      var left = Math.min(pos(start), pos(end));
      var width = Math.max(Math.abs(pos(end) - pos(start)), 3);
      html += '<div class="number-jump ' + (move < 0 ? 'number-jump--left' : '') + '" style="left:' + left + '%;width:' + width + '%"><span>' + (move >= 0 ? 'kanan' : 'kiri') + ' ' + Math.abs(move) + '</span></div>';
      html += '<div class="number-runner" style="--from:' + pos(start) + '%;--to:' + pos(end) + '%"><span>' + (move >= 0 ? '→' : '←') + '</span></div>';
      html += '<div class="number-point number-point--end" style="left:' + pos(end) + '%"></div>';
      html += '<div class="number-result" style="left:' + pos(end) + '%">' + formatNumber(end) + '</div>';
    }

    numberLine.innerHTML = html;
  }

  function explanation() {
    var q = state.question;
    var move = moveValue();
    var direction = move >= 0 ? 'kanan' : 'kiri';
    var rule = operationRule(q);

    hint.innerHTML = 'Mulai dari <b>' + formatNumber(q.a) + '</b>, bergerak <b>' + Math.abs(move) + ' langkah ke ' + direction + '</b>, lalu berhenti di <b>' + formatNumber(q.result) + '</b>. ' + rule;
    stepsEl.innerHTML = renderSteps(true);
  }

  function renderSteps(showAnswer) {
    var q = state.question;
    if (!q) return '';
    var move = moveValueFor(q);
    var direction = move >= 0 ? 'kanan' : 'kiri';
    var steps = [
      ['Mulai', 'Letakkan titik di angka ' + formatNumber(q.a) + '.'],
      ['Arah', operationRule(q) + ' Jadi bergerak ' + Math.abs(move) + ' langkah ke ' + direction + '.'],
      ['Hasil', showAnswer ? 'Titik berhenti di angka ' + formatNumber(q.result) + '.' : 'Jawab dulu, nanti posisi akhirnya akan bergerak di garis bilangan.']
    ];
    return steps.map(function (step, index) {
      return '<div class="integer-step ' + (showAnswer ? 'is-active' : '') + '"><b>' + (index + 1) + '</b><span><strong>' + step[0] + '</strong>' + step[1] + '</span></div>';
    }).join('');
  }

  function updateStats() {
    countEl.textContent = state.count;
    correctEl.textContent = state.correct;
    scoreEl.textContent = state.attempted ? Math.round(state.correct / state.attempted * 100) + '%' : '0%';
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (answerInput.disabled) return;

    var value = Number(answerInput.value);
    if (answerInput.value.trim() === '') {
      feedback.textContent = 'Tulis jawaban dulu, ya.';
      feedback.className = 'is-bad';
      return;
    }

    state.attempted += 1;
    if (value === state.question.result) {
      state.correct += 1;
      feedback.textContent = 'Benar. Lihat gerak titiknya di garis bilangan.';
      feedback.className = 'is-good';
    } else {
      feedback.textContent = 'Belum tepat. Jawaban yang benar adalah ' + formatNumber(state.question.result) + '. Perhatikan arah geraknya.';
      feedback.className = 'is-bad';
    }

    answerInput.disabled = true;
    checkButton.classList.add('is-hidden');
    nextButton.classList.remove('is-hidden');
    drawLine(true);
    explanation();
    updateStats();
  });

  nextButton.addEventListener('click', function () {
    state.count += 1;
    makeQuestion();
  });

  resetButton.addEventListener('click', function () {
    state.count = 1;
    state.attempted = 0;
    state.correct = 0;
    makeQuestion();
  });

  controls.addEventListener('change', function () {
    state.count = 1;
    state.attempted = 0;
    state.correct = 0;
    makeQuestion();
  });

  makeQuestion();
})();
