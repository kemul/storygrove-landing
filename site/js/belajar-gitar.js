(function () {
  'use strict';
  const core = window.StorygroveGuitar;
  if (!core) return;
  const $ = (id) => document.getElementById(id);
  const lessons = ['kenali', 'senar', 'chord', 'irama', 'main'];
  const storageKey = 'storygrove-guitar-progress-v1';
  const parts = [
    ['Pemutar senar', 'Tempat mengatur nada', 'Pemutar di kepala gitar mengubah ketegangan senar. Putar sedikit demi sedikit sambil memakai tuner; minta pendamping membantu saat pertama kali menyetem.'],
    ['Nut', 'Awal panjang senar yang bergetar', 'Nut adalah penyangga kecil antara kepala dan leher gitar. Senar melewatinya sebelum masuk ke area fret. Senar terbuka berbunyi tanpa ditekan jari.'],
    ['Fret & leher', 'Tempat jari membentuk nada', 'Kawat fret membagi leher gitar. Fret 1 adalah ruang pertama setelah nut. Tekan senar di ruangnya, dekat di belakang kawat fret, agar nada terdengar jelas.'],
    ['Senar', 'Enam jalur bunyi', 'Petik senar untuk membuatnya bergetar. Senar 6 paling tebal dan bernada rendah; senar 1 paling tipis dan bernada tinggi. Tangan kiri dapat mengubah nada dengan menekan fret.'],
    ['Lubang suara', 'Bunyi dari badan gitar', 'Getaran senar diteruskan ke badan gitar. Badan dan lubang suara membantu bunyi gitar akustik terdengar. Petik atau genjreng dengan santai di sekitar bagian ini.'],
    ['Bridge', 'Tempat senar bertumpu', 'Bridge menahan ujung senar pada badan gitar dan membantu meneruskan getarannya. Tidak perlu dilepas atau diubah untuk latihan hari ini.']
  ];
  let currentLesson = 'kenali';
  let chordName = 'Em';
  let selectedFinger = null;
  let pattern = 'down';
  let completed = [];
  let engine = null;
  let enginePromise = null;
  let audioLoading = false;
  let loop = null;
  let activeMode = null;
  let pendingMode = null;
  let audioToken = 0;
  let finished = false;
  const ticks = { rhythm: 0, practice: 0 };

  function icons() {
    if (window.lucide) window.lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) completed = lessons.filter((id) => saved.includes(id));
  } catch (_) { /* The exercises still work when storage is unavailable. */ }

  function saveProgress() {
    try { localStorage.setItem(storageKey, JSON.stringify(completed)); }
    catch (_) { document.querySelector('.local-note').textContent = 'Catatan hanya berlaku selama halaman ini terbuka'; }
  }

  function renderProgress() {
    $('course-progress').value = completed.length;
    $('progress-label').textContent = `${completed.length} dari 5 langkah sudah dicoba`;
    document.querySelectorAll('.lesson-tab').forEach((tab) => tab.classList.toggle('is-complete', completed.includes(tab.dataset.lesson)));
    $('lesson-complete').checked = completed.includes(currentLesson);
  }

  function activateLesson(id, focusHeading = false, updateHash = true) {
    if (!lessons.includes(id)) id = 'kenali';
    stopPlayback(false);
    currentLesson = id;
    document.querySelectorAll('.lesson-tab').forEach((tab) => {
      const selected = tab.dataset.lesson === id;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    lessons.forEach((lesson) => { $(lesson).hidden = lesson !== id; });
    const nextNames = ['Ke senar', 'Ke chord', 'Ke irama', 'Main bersama', 'Kembali ke Jejak Tumbuh'];
    $('next-lesson').querySelector('span').textContent = nextNames[lessons.indexOf(id)];
    renderProgress();
    if (updateHash) {
      try { history.replaceState(null, '', `#${id}`); } catch (_) { /* File previews may restrict history. */ }
    }
    if (focusHeading) {
      const heading = $(id).querySelector('h2');
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      if (window.innerWidth <= 800) heading.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }

  document.querySelectorAll('.lesson-tab').forEach((tab) => {
    tab.addEventListener('click', () => activateLesson(tab.dataset.lesson));
    tab.addEventListener('keydown', (event) => {
      const direction = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
      if (!direction && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? 4 : (lessons.indexOf(tab.dataset.lesson) + direction + 5) % 5;
      activateLesson(lessons[index]);
      $(`tab-${lessons[index]}`).focus();
    });
  });
  window.addEventListener('hashchange', () => {
    if (lessons.includes(location.hash.slice(1))) activateLesson(location.hash.slice(1), false, false);
  });
  $('next-lesson').addEventListener('click', () => {
    const next = lessons.indexOf(currentLesson) + 1;
    if (next < lessons.length) activateLesson(lessons[next], true);
    else location.href = '../index.html';
  });
  $('lesson-complete').addEventListener('change', () => {
    completed = $('lesson-complete').checked ? [...new Set([...completed, currentLesson])] : completed.filter((id) => id !== currentLesson);
    saveProgress();
    renderProgress();
  });

  document.querySelectorAll('[data-part]').forEach((button) => button.addEventListener('click', () => {
    const index = Number(button.dataset.part);
    document.querySelectorAll('[data-part]').forEach((item) => item.setAttribute('aria-pressed', String(Number(item.dataset.part) === index)));
    [$('part-name'), $('part-title'), $('part-description')].forEach((element, field) => { element.textContent = parts[index][field]; });
  }));

  // All chord positions use strings 6 -> 1, matching the front-view diagram.
  function diagram(name, prefix, highlight = null) {
    const chord = core.chords[name];
    const description = core.strings.map((string, i) => `senar ${string.number} ${chord.frets[i] < 0 ? 'tidak dipetik' : chord.frets[i] === 0 ? 'terbuka' : `fret ${chord.frets[i]}, jari ${chord.fingers[i]}`}`).join('; ');
    let svg = `<svg class="chord-svg" viewBox="0 0 235 292" role="img" aria-labelledby="${prefix}-title ${prefix}-desc"><title id="${prefix}-title">Chord ${name}, ${chord.name}</title><desc id="${prefix}-desc">${description}. Senar paling tebal di kiri.</desc><text x="115" y="27" text-anchor="middle" font-size="22" fill="#193e35" font-weight="650">${name}</text>`;
    for (let fret = 0; fret <= 4; fret++) {
      const y = 72 + fret * 40;
      svg += `<line x1="35" x2="185" y1="${y}" y2="${y}" stroke="#8a9d92" stroke-width="${fret === 0 ? 5 : 1.3}"/>`;
      if (fret < 4) svg += `<text x="210" y="${y + 25}" text-anchor="middle" font-size="11" fill="#63736d">${fret + 1}</text>`;
    }
    core.strings.forEach((string, i) => {
      const x = 35 + i * 30;
      svg += `<line x1="${x}" x2="${x}" y1="72" y2="232" stroke="#8a9d92" stroke-width="${2.8 - i * .3}"/><text x="${x}" y="255" text-anchor="middle" font-size="11" fill="#63736d">${string.number}</text><text x="${x}" y="278" text-anchor="middle" font-size="12" fill="#193e35">${string.name}</text>`;
      const fret = chord.frets[i];
      if (fret <= 0) svg += `<text x="${x}" y="57" text-anchor="middle" font-size="16" fill="#193e35">${fret < 0 ? 'X' : 'O'}</text>`;
      else {
        const y = 72 + (fret - .5) * 40;
        const isSelected = highlight === string.number;
        const opacity = highlight !== null && !isSelected ? .35 : 1;
        svg += `<g opacity="${opacity}"><circle cx="${x}" cy="${y}" r="12" fill="${isSelected ? '#bc643b' : '#326852'}"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="12" font-weight="600" fill="white">${chord.fingers[i]}</text></g>`;
      }
    });
    return svg + '</svg>';
  }

  function renderChord() {
    $('chord-diagram').innerHTML = diagram(chordName, 'learn-chord', selectedFinger);
    $('chord-name').textContent = chordName;
    $('chord-strum').textContent = core.chords[chordName].strum;
    document.querySelectorAll('[data-chord]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.chord === chordName)));
    $('finger-steps').innerHTML = core.fingersForChord(chordName).map((step) => `<li><button type="button" data-finger-string="${step.string}" aria-pressed="${selectedFinger === step.string}"><span class="finger-badge">${step.finger}</span><span>Senar ${step.string} (${step.note}), fret ${step.fret}</span></button></li>`).join('');
    $('finger-steps').querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
      const number = Number(button.dataset.fingerString);
      selectedFinger = selectedFinger === number ? null : number;
      renderChord();
      // Keep keyboard focus on the rebuilt step instead of losing it to the page.
      $('finger-steps').querySelector(`[data-finger-string="${number}"]`).focus({ preventScroll: true });
    }));
  }
  document.querySelectorAll('[data-chord]').forEach((button) => button.addEventListener('click', () => {
    chordName = button.dataset.chord;
    selectedFinger = null;
    renderChord();
  }));

  $('string-instrument').innerHTML = core.strings.map((string, index) => `<button class="string-row" type="button" data-string="${index}" aria-label="Dengarkan senar ${string.number}, nada ${string.name}${string.label ? ', ' + string.label.toLowerCase() : ''}"><span class="string-label"><span>Senar ${string.number}</span><strong>${string.name}</strong></span><span class="string-wire" style="--thickness:${5 - index * .7}px" aria-hidden="true"></span><small>${string.label}</small><i data-lucide="volume-2" aria-hidden="true"></i></button>`).join('');

  function showAudioLoading(loading) {
    audioLoading = loading;
    $('guitar-sound-state').textContent = loading ? 'Menyiapkan gitar akustik...' : engine ? 'Gitar akustik siap' : 'Gitar akustik';
    document.querySelectorAll('.string-row, #hear-chord').forEach((button) => {
      button.disabled = loading;
      button.setAttribute('aria-busy', String(loading));
    });
    updatePlaybackButtons();
  }

  async function ensureAudio() {
    if (!window.Tone || !window.StorygroveGuitarAudio) throw new Error('Audio belum tersedia. Muat ulang halaman, lalu coba tombol suara lagi.');
    await Tone.start();
    if (!engine) {
      if (!enginePromise) {
        showAudioLoading(true);
        const baseUrl = new URL('../../assets/audio/guitar-acoustic/', document.baseURI).href;
        enginePromise = window.StorygroveGuitarAudio.createEngine(Tone, core.acousticSamples, baseUrl)
          .then((loaded) => { engine = loaded; return loaded; })
          .finally(() => { enginePromise = null; showAudioLoading(false); });
      }
      await enginePromise;
    }
    if (Tone.getContext().state !== 'running') throw new Error('Browser belum mengizinkan suara. Tekan tombol suara lagi untuk melanjutkan.');
    $('audio-error').hidden = true;
    return engine;
  }

  function audioError(error) {
    $('audio-error').textContent = error.message || 'Suara belum bisa diputar. Diagram dan latihan visual tetap bisa digunakan.';
    $('audio-error').hidden = false;
  }
  function strum(name, time, direction = 'down') {
    core.notesForChord(name, direction).forEach((note, index) => engine.pluck(note.midi, time + index * .025));
  }

  async function playReference(action) {
    stopPlayback(false);
    const token = ++audioToken;
    try {
      await ensureAudio();
      if (token !== audioToken) return;
      engine.bus.gain.value = .55;
      action(Tone.now() + .025);
    } catch (error) { if (token === audioToken) audioError(error); }
  }
  $('string-instrument').querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
    const index = Number(button.dataset.string);
    playReference((time) => {
      engine.pluck(core.strings[index].midi, time);
      document.querySelectorAll('.string-row').forEach((row) => row.classList.remove('is-sounding'));
      button.classList.add('is-sounding');
      setTimeout(() => button.classList.remove('is-sounding'), 750);
    });
  }));
  $('hear-chord').addEventListener('click', () => playReference((time) => strum(chordName, time)));

  function renderPattern() {
    $('strum-pattern').setAttribute('aria-label', pattern === 'down' ? 'Genjreng turun pada ketukan 1, 2, 3, 4' : 'Genjreng turun pada tiap ketukan dan naik di sela ketukan');
    $('strum-pattern').innerHTML = Array.from({ length: 8 }, (_, tick) => {
      const step = core.rhythmAt(tick, pattern);
      return `<span class="strum-step${step.direction ? '' : ' rest'}" data-eighth="${tick}"><i data-lucide="${step.direction === 'up' ? 'arrow-up' : step.direction ? 'arrow-down' : 'minus'}" aria-hidden="true"></i><span>${tick % 2 === 0 ? step.beat + 1 : '&'}</span></span>`;
    }).join('');
    icons();
  }
  document.querySelectorAll('[data-pattern]').forEach((button) => button.addEventListener('click', () => {
    stopPlayback(true, 'rhythm');
    pattern = button.dataset.pattern;
    document.querySelectorAll('[data-pattern]').forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.pattern === pattern)));
    renderPattern();
  }));

  function progression() { return core.progressions[$('practice-progression').value] || core.progressions.easy; }
  function renderPractice(bar = 0, beat = -1, preparing = false) {
    const sequence = progression();
    const safeBar = Math.min(bar, sequence.length - 1);
    const name = sequence[safeBar];
    $('progression-track').innerHTML = sequence.map((chord, i) => `<span class="${!preparing && i === safeBar ? 'is-active' : ''}">${chord}<small>Birama ${i + 1} · 4 ketukan</small></span>`).join('');
    $('practice-diagram').innerHTML = diagram(name, 'practice-chord');
    $('practice-chord-caption').textContent = `${preparing || beat < 0 ? 'Siapkan' : 'Mainkan'} ${name}`;
    $('bar-label').textContent = preparing ? 'Bersiap: hitung empat ketukan' : `Birama ${safeBar + 1} dari 4`;
    $('practice-next').textContent = preparing ? `Mulai dengan ${sequence[0]}` : sequence[safeBar + 1] ? `Berikutnya: ${sequence[safeBar + 1]}` : 'Birama terakhir';
    highlightBeat('practice-beats', beat);
  }
  $('practice-progression').addEventListener('change', () => { stopPlayback(true, 'practice'); renderPractice(); });

  function highlightBeat(id, beat) {
    $(id).querySelectorAll('span').forEach((element, index) => element.classList.toggle('is-active', index === beat));
  }
  function updatePlaybackButtons() {
    ['rhythm', 'practice'].forEach((mode) => {
      const button = $(`${mode}-play`);
      const playing = activeMode === mode;
      button.disabled = pendingMode !== null || audioLoading;
      button.setAttribute('aria-pressed', String(playing));
      const label = pendingMode === mode ? 'Menyiapkan suara' : playing ? 'Jeda' : mode === 'practice' && finished ? 'Main lagi' : ticks[mode] > 0 ? 'Lanjutkan' : mode === 'rhythm' ? 'Mulai ketukan' : 'Main bersama';
      button.innerHTML = `<i data-lucide="${playing ? 'pause' : 'play'}" aria-hidden="true"></i><span>${label}</span>`;
    });
    icons();
  }

  function stopPlayback(reset = false, resetMode = null) {
    const stoppedMode = activeMode || pendingMode;
    ++audioToken;
    activeMode = null;
    pendingMode = null;
    if (window.Tone) {
      Tone.Transport.stop();
      Tone.Transport.cancel(0);
      Tone.Draw.cancel(0);
    }
    if (loop) { loop.dispose(); loop = null; }
    if (engine) {
      engine.guitar.releaseAll();
      engine.bus.gain.value = 0;
    }
    if (stoppedMode) $(`${stoppedMode}-status`).textContent = 'Dijeda. Lanjutkan saat kamu siap.';
    if (reset) {
      const mode = resetMode || stoppedMode;
      if (mode) {
        ticks[mode] = 0;
        if (mode === 'practice') {
          finished = false;
          renderPractice();
          $('practice-status').textContent = 'Empat ketukan persiapan, lalu empat birama latihan.';
        } else {
          highlightBeat('rhythm-beats', -1);
          $('strum-pattern').querySelectorAll('.strum-step').forEach((step) => step.classList.remove('is-active'));
          $('rhythm-status').textContent = 'Siap di ketukan 1.';
        }
      }
    }
    updatePlaybackButtons();
  }

  async function startPlayback(mode) {
    if (activeMode === mode) { stopPlayback(false); return; }
    stopPlayback(false);
    if (mode === 'practice' && finished) { ticks.practice = 0; finished = false; renderPractice(); }
    const token = ++audioToken;
    pendingMode = mode;
    updatePlaybackButtons();
    try {
      await ensureAudio();
      if (token !== audioToken) return;
      pendingMode = null;
      activeMode = mode;
      engine.bus.gain.value = .55;
      Tone.Transport.bpm.value = Number($(`${mode}-tempo`).value);
      let ending = false;
      // Tone's audio clock schedules sound; Draw aligns the visuals to that clock.
      loop = new Tone.Loop((time) => {
        if (ending) return;
        const tick = ticks[mode];
        const rhythm = core.rhythmAt(tick, pattern);
        const practice = mode === 'practice' ? core.practiceAt(tick, progression()) : null;
        if (practice && practice.done) {
          ending = true;
          Tone.Draw.schedule(() => {
            if (token !== audioToken) return;
            stopPlayback(false);
            finished = true;
            highlightBeat('practice-beats', -1);
            $('practice-chord-caption').textContent = 'Latihan selesai';
            $('practice-status').textContent = 'Selesai satu putaran. Ambil napas, lalu coba lagi jika kamu ingin.';
            $('practice-next').textContent = 'Kamu sudah mencoba empat birama.';
            updatePlaybackButtons();
          }, time);
          return;
        }
        if (tick % 2 === 0) {
          const beat = practice ? practice.beat : rhythm.beat;
          engine.click.triggerAttackRelease(beat === 0 ? 'C6' : 'G5', .035, time);
        }
        if (mode === 'rhythm' && rhythm.direction) strum('Em', time, rhythm.direction);
        if (practice && !practice.preparing && tick % 2 === 0 && $('play-chords').checked) strum(practice.chord, time);
        Tone.Draw.schedule(() => {
          if (token !== audioToken || activeMode !== mode) return;
          if (mode === 'rhythm') {
            highlightBeat('rhythm-beats', rhythm.beat);
            $('strum-pattern').querySelectorAll('.strum-step').forEach((step) => step.classList.toggle('is-active', Number(step.dataset.eighth) === rhythm.eighth));
          } else {
            renderPractice(practice.bar, practice.beat, practice.preparing);
            if (tick === 8) $('practice-status').textContent = 'Latihan berjalan. Ikuti empat ketukan pada setiap chord.';
          }
        }, time);
        ticks[mode]++;
      }, '8n').start(0);
      $(`${mode}-status`).textContent = mode === 'rhythm' ? 'Ketukan berjalan. Genjreng perlahan mengikuti arah panah.' : ticks.practice < 8 ? 'Bersiap. Hitung satu, dua, tiga, empat.' : 'Latihan dilanjutkan.';
      Tone.Transport.start('+0.08');
      updatePlaybackButtons();
    } catch (error) {
      if (token !== audioToken) return;
      stopPlayback(false);
      audioError(error);
    }
  }
  ['rhythm', 'practice'].forEach((mode) => {
    $(`${mode}-play`).addEventListener('click', () => startPlayback(mode));
    $(`${mode}-reset`).addEventListener('click', () => stopPlayback(true, mode));
    $(`${mode}-tempo`).addEventListener('input', (event) => {
      const value = Number(event.target.value);
      $(`${mode}-tempo-value`).value = value;
      if (activeMode === mode) Tone.Transport.bpm.value = value;
    });
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopPlayback(false); });
  window.addEventListener('pagehide', () => stopPlayback(false));

  renderChord();
  renderPattern();
  renderPractice();
  activateLesson(location.hash.slice(1), false, false);
  icons();
})();
