import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  cochleaPosition, cochleaFrequency, erb, noteName, harmonicPartials, pairRoughness,
  roughnessCurve, detectPitch, pluck, nearestInterval,
} from './dsp.js';

const RATE = 48000;

function tone(partials, seconds = 0.1) {
  const out = new Float32Array(Math.floor(RATE * seconds));
  for (const { frequency, amplitude } of partials) {
    for (let n = 0; n < out.length; n++) out[n] += amplitude * Math.sin((2 * Math.PI * frequency * n) / RATE);
  }
  return out;
}

function seeded(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const cents = (a, b) => 1200 * Math.log2(a / b);

test('the cochlea map runs from about 20 Hz at the apex to about 20 kHz at the base', () => {
  assert.ok(Math.abs(cochleaFrequency(0) - 20) < 1);
  assert.ok(Math.abs(cochleaFrequency(1) - 20677) < 50);
  for (const f of [50, 440, 3000, 12000]) assert.ok(Math.abs(cochleaFrequency(cochleaPosition(f)) - f) < 1e-6);
  assert.ok(cochleaPosition(1000) > cochleaPosition(500));
});

test('critical bandwidth matches Glasberg and Moore at 1 kHz', () => {
  assert.ok(Math.abs(erb(1000) - 132.639) < 0.01);
});

test('note names and cents', () => {
  assert.deepEqual(noteName(440), { name: 'A4', cents: 0 });
  assert.deepEqual(noteName(82.41), { name: 'E2', cents: 0 });
  assert.equal(noteName(261.63).name, 'C4');
  assert.equal(noteName(445).cents, 20);
});

test('harmonic partials are whole-number multiples, falling in loudness', () => {
  const p = harmonicPartials(110, 4);
  assert.deepEqual(p.map((x) => x.frequency), [110, 220, 330, 440]);
  assert.ok(p[0].amplitude > p[3].amplitude);
});

test('two pure tones rub most a fraction of a critical band apart, and not at all in unison', () => {
  assert.equal(pairRoughness(440, 1, 440, 1), 0);
  const close = pairRoughness(440, 1, 460, 1);
  const far = pairRoughness(440, 1, 880, 1);
  // The fit peaks at about 0.18 for two full-strength partials.
  assert.ok(close > 0.15, `close pair: ${close}`);
  assert.ok(far < close / 100, `octave apart: ${far}`);
});

test('for harmonic tones, the fifth and octave are smoother than their neighbours; for pure tones they are not', () => {
  const at = (curve, c) => curve.find((p) => Math.abs(p.cents - c) < 1e-9).roughness;
  const rich = roughnessCurve(220, 6, 0, 1200, 120);
  assert.ok(at(rich, 700) < at(rich, 650) && at(rich, 700) < at(rich, 750));
  assert.ok(at(rich, 1200) < at(rich, 1150));
  assert.ok(at(rich, 100) > at(rich, 700));
  const pure = roughnessCurve(220, 1, 0, 1200, 120);
  assert.ok(Math.abs(at(pure, 700) - at(pure, 750)) < 0.01);
});

test('pitch of a pure tone', () => {
  const found = detectPitch(tone([{ frequency: 220, amplitude: 1 }]), RATE);
  assert.ok(Math.abs(cents(found.frequency, 220)) < 2, `${found.frequency}`);
});

test('the missing fundamental: harmonics 2 to 6 of 110 Hz read as 110 Hz', () => {
  const partials = harmonicPartials(110, 6).slice(1);
  const found = detectPitch(tone(partials), RATE);
  assert.ok(Math.abs(cents(found.frequency, 110)) < 5, `${found.frequency}`);
});

test('the residue: harmonics 4, 5 and 6 of 100 Hz alone still read as 100 Hz', () => {
  const partials = [400, 500, 600].map((frequency) => ({ frequency, amplitude: 1 }));
  const found = detectPitch(tone(partials), RATE);
  assert.ok(Math.abs(cents(found.frequency, 100)) < 5, `${found.frequency}`);
});

test('silence and noise have no pitch', () => {
  assert.equal(detectPitch(new Float32Array(4096), RATE), null);
  const random = seeded(7);
  const noise = Float32Array.from({ length: 4096 }, () => random() * 2 - 1);
  assert.equal(detectPitch(noise, RATE), null);
});

test('a plucked string sounds at its pitch, for every open guitar string', () => {
  for (const f of [82.41, 110, 146.83, 196, 246.94, 329.63]) {
    const sound = pluck(f, RATE, 0.3, { random: seeded(3) });
    const found = detectPitch(sound.subarray(2400, 2400 + 4096), RATE);
    assert.ok(found, `no pitch for ${f}`);
    assert.ok(Math.abs(cents(found.frequency, f)) < 5, `${f} read as ${found.frequency}`);
  }
});

test('a pluck is normalized and dies away', () => {
  const sound = pluck(110, RATE, 2, { random: seeded(5) });
  const peak = (from, to) => sound.subarray(from, to).reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  assert.ok(Math.abs(peak(0, sound.length) - 1) < 1e-6);
  assert.ok(peak(RATE * 1.8, RATE * 2) < peak(0, RATE * 0.2) / 3);
});

test('nearest named interval', () => {
  assert.equal(nearestInterval(702).name, 'perfect 5th');
  assert.equal(nearestInterval(1190).name, 'octave');
});
