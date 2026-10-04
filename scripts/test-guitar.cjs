const test = require('node:test');
const assert = require('node:assert/strict');
const guitar = require('../site/js/guitar-core.js');
const audio = require('../site/js/guitar-audio.js');
const fs = require('node:fs');
const path = require('node:path');

test('Standard open strings run from low E2 to high E4', () => {
  assert.deepEqual(guitar.strings.map(s => s.midi), [40, 45, 50, 55, 59, 64]);
  assert.deepEqual(guitar.strings.map(s => s.number), [6, 5, 4, 3, 2, 1]);
});

test('Chord diagrams and audio describe the same major/minor notes', () => {
  const expected = { Em: [4, 7, 11], Am: [0, 4, 9], G: [2, 7, 11], D: [2, 6, 9] };
  for (const [name, classes] of Object.entries(expected)) {
    const notes = guitar.notesForChord(name);
    assert.deepEqual([...new Set(notes.map(n => n.midi % 12))].sort((a, b) => a - b), classes);
    assert.deepEqual(guitar.notesForChord(name, 'up'), [...notes].reverse());
    const fingers = guitar.fingersForChord(name);
    assert.equal(new Set(fingers.map(f => f.finger)).size, fingers.length);
    for (const step of fingers) assert.equal(guitar.chords[name].frets[6 - step.string], step.fret);
  }
  assert.equal(guitar.notesForChord('Em').length, 6);
  assert.equal(guitar.notesForChord('Am').length, 5);
  assert.equal(guitar.notesForChord('D').length, 4);
});

test('Down pattern strums only quarter notes, alternate includes the up strokes', () => {
  assert.deepEqual(Array.from({ length: 8 }, (_, i) => guitar.rhythmAt(i, 'down').direction), ['down', null, 'down', null, 'down', null, 'down', null]);
  assert.deepEqual(Array.from({ length: 8 }, (_, i) => guitar.rhythmAt(i, 'alternate').direction), ['down', 'up', 'down', 'up', 'down', 'up', 'down', 'up']);
  assert.equal(guitar.rhythmAt(8, 'down').beat, 0);
});

test('Practice has four count-in beats and exactly four four-beat bars', () => {
  for (const sequence of Object.values(guitar.progressions)) {
    const steps = Array.from({ length: 41 }, (_, i) => guitar.practiceAt(i, sequence));
    assert.ok(steps.slice(0, 8).every(s => s.preparing && !s.done));
    assert.deepEqual([8, 16, 24, 32].map(i => steps[i].chord), sequence);
    assert.ok(steps.slice(8, 40).every(s => !s.preparing && !s.done));
    assert.equal(steps[39].beat, 3);
    assert.equal(steps[40].done, true);
    assert.equal(steps[40].chord, null);
  }
});

test('All open strings and chord pitches have a local acoustic recording', () => {
  const notes = [...guitar.strings.map(s => s.midi), ...Object.keys(guitar.chords).flatMap(name => guitar.notesForChord(name).map(n => n.midi))];
  for (const midi of new Set(notes)) {
    assert.ok(guitar.acousticSamples[midi], `Missing recording for MIDI ${midi}`);
    const file = path.join(__dirname, '../site/assets/audio/guitar-acoustic', guitar.acousticSamples[midi]);
    assert.ok(fs.statSync(file).size > 1000, `Empty acoustic recording: ${file}`);
  }
});

function fakeTone() {
  const nodes = [];
  class Node {
    constructor(options) { this.options = options; this.calls = []; this.gain = { value: options }; nodes.push(this); }
    toDestination() { return this; }
    connect() { return this; }
    dispose() { this.disposed = true; }
    triggerRelease(...args) { this.calls.push(['release', ...args]); }
    triggerAttackRelease(...args) { this.calls.push(['play', ...args]); }
  }
  class Sampler extends Node {
    load() { this.loaded = true; this.options.onload(); }
    fail() { this.options.onerror(new Error('Sample download failed')); }
  }
  return { nodes, Gain: Node, Synth: Node, Sampler, Frequency: (midi) => ({ toFrequency: () => 440 * 2 ** ((midi - 69) / 12) }) };
}

test('Acoustic sampler waits for recordings, then plays the requested pitch', async () => {
  const Tone = fakeTone();
  const pending = audio.createEngine(Tone, guitar.acousticSamples, '/audio/');
  const sampler = Tone.nodes.find(node => node instanceof Tone.Sampler);
  assert.deepEqual(sampler.options.urls, guitar.acousticSamples);
  assert.equal(sampler.options.baseUrl, '/audio/');
  sampler.load();
  const engine = await pending;
  engine.pluck(40, 1.25);
  assert.deepEqual(sampler.calls, [['release', 82.40688922821748, 1.25], ['play', 82.40688922821748, 2.5, 1.25]]);
  assert.equal(Tone.nodes.filter(node => node instanceof Tone.Sampler).length, 1);
});

test('Failed downloads dispose audio nodes and a later load can retry', async () => {
  const Tone = fakeTone();
  const failed = audio.createEngine(Tone, guitar.acousticSamples, '/audio/');
  Tone.nodes.find(node => node instanceof Tone.Sampler).fail();
  await assert.rejects(failed, /Rekaman gitar akustik/);
  assert.ok(Tone.nodes.every(node => node.disposed));
  const retried = audio.createEngine(Tone, guitar.acousticSamples, '/audio/');
  const sampler = Tone.nodes.filter(node => node instanceof Tone.Sampler).at(-1);
  sampler.load();
  assert.equal((await retried).guitar, sampler);
});

test('A stalled recording load times out without leaving audio nodes active', async () => {
  const Tone = fakeTone();
  await assert.rejects(audio.createEngine(Tone, guitar.acousticSamples, '/audio/', 5), /Rekaman gitar akustik/);
  assert.ok(Tone.nodes.every(node => node.disposed));
});
