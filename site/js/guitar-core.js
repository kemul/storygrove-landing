(function (root) {
  'use strict';
  const strings = [
    { number: 6, name: 'E', midi: 40, label: 'Paling tebal' },
    { number: 5, name: 'A', midi: 45, label: '' },
    { number: 4, name: 'D', midi: 50, label: '' },
    { number: 3, name: 'G', midi: 55, label: '' },
    { number: 2, name: 'B', midi: 59, label: '' },
    { number: 1, name: 'E', midi: 64, label: 'Paling tipis' }
  ];
  const chords = {
    Em: { name: 'E minor', frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], strum: 'Petik keenam senar' },
    Am: { name: 'A minor', frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], strum: 'Mulai dari senar 5 (A)' },
    G: { name: 'G mayor', frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], strum: 'Petik keenam senar' },
    D: { name: 'D mayor', frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], strum: 'Mulai dari senar 4 (D)' }
  };
  const progressions = { easy: ['Em', 'Am', 'Em', 'Am'], next: ['Em', 'G', 'D', 'Am'] };
  const acousticSamples = {
    40: 'E2.mp3', 43: 'G2.mp3', 45: 'A2.mp3', 47: 'B2.mp3',
    50: 'D3.mp3', 52: 'E3.mp3', 55: 'G3.mp3', 57: 'A3.mp3',
    59: 'B3.mp3', 60: 'C4.mp3', 62: 'D4.mp3', 64: 'E4.mp3',
    66: 'Fs4.mp3', 67: 'G4.mp3'
  };
  function notesForChord(name, direction = 'down') {
    const chord = chords[name];
    if (!chord) return [];
    const notes = strings.flatMap((string, index) => chord.frets[index] < 0 ? [] : [{ string: index, midi: string.midi + chord.frets[index] }]);
    return direction === 'up' ? notes.reverse() : notes;
  }
  function fingersForChord(name) {
    return chords[name].fingers.flatMap((finger, index) => finger ? [{ finger, string: strings[index].number, note: strings[index].name, fret: chords[name].frets[index] }] : []).sort((a, b) => a.finger - b.finger);
  }
  function rhythmAt(tick, pattern) {
    const eighth = tick % 8;
    return { beat: Math.floor(eighth / 2), eighth, direction: eighth % 2 === 0 ? 'down' : pattern === 'alternate' ? 'up' : null };
  }
  function practiceAt(tick, progression) {
    if (tick < 8) return { preparing: true, beat: Math.floor(tick / 2), bar: 0, chord: progression[0], done: false };
    const playTick = tick - 8;
    const bar = Math.floor(playTick / 8);
    return { preparing: false, beat: Math.floor((playTick % 8) / 2), bar, chord: progression[bar] || null, done: bar >= progression.length };
  }
  const api = { strings, chords, progressions, acousticSamples, notesForChord, fingersForChord, rhythmAt, practiceAt };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StorygroveGuitar = api;
})(typeof window === 'object' ? window : globalThis);
