(function (root) {
  'use strict';
  function createEngine(Tone, samples, baseUrl, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
      let bus, guitar, click, timer;
      let settled = false;
      function fail() {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        [guitar, click, bus].forEach((node) => { if (node) node.dispose(); });
        reject(new Error('Rekaman gitar akustik belum bisa dimuat. Periksa koneksi, lalu coba tombol suara lagi.'));
      }
      function ready() {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({
          bus, guitar, click,
          pluck(midi, time) {
            const frequency = Tone.Frequency(midi, 'midi').toFrequency();
            guitar.triggerRelease(frequency, time);
            guitar.triggerAttackRelease(frequency, 2.5, time);
          }
        });
      }
      try {
        bus = new Tone.Gain(.55).toDestination();
        click = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: .001, decay: .03, sustain: 0, release: .01 }, volume: -16 }).connect(bus);
        // One polyphonic sampler shares the recordings across all six strings.
        guitar = new Tone.Sampler({
          urls: samples, baseUrl, volume: -12, attack: .002, release: .35,
          onload: () => queueMicrotask(ready), onerror: fail
        }).connect(bus);
        timer = setTimeout(fail, timeoutMs);
      } catch (_) { fail(); }
    });
  }
  const api = { createEngine };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StorygroveGuitarAudio = api;
})(typeof window === 'object' ? window : globalThis);
