// Section 2: pitch is the period the brain finds, whether or not anything sounds there.

import { audio, claim, release, glide } from './audio.js';
import { detectPitch, noteName } from './dsp.js';
import { COLORS, fitCanvas, logAxis, drawFrequencyTicks, drawWave, label, formatHz } from './draw.js';

const COUNT = 10;
const BASES = [
  { name: 'A2', frequency: 110 },
  { name: 'D3', frequency: 146.83 },
  { name: 'A3', frequency: 220 },
];
const PRESETS = [
  { name: 'All ten', on: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { name: 'Take away the fundamental', on: [2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { name: 'Only 4, 5 and 6', on: [4, 5, 6] },
  { name: 'Only the fundamental', on: [1] },
  { name: 'Odd ones only', on: [1, 3, 5, 7, 9] },
];
const RATE = 48000; // for the drawn and measured copy; the speakers use the device's own rate
const LEVEL = 0.5;

const amplitude = (n) => 1 / n;

export function setupPitch(root, { onError }) {
  const baseRow = root.querySelector('.bases');
  const harmonicRow = root.querySelector('.harmonics');
  const presetRow = root.querySelector('.presets');
  const playButton = root.querySelector('[data-play]');
  const readout = root.querySelector('.readout');

  const state = {
    base: BASES[0],
    on: new Set(PRESETS[0].on),
    voices: null, // [{ oscillator, gain }] while playing
    samples: null,
    pitch: null,
  };
  const owner = { stop: () => stop() };

  function button(text, onClick, data = {}) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = text;
    Object.assign(b.dataset, data);
    b.addEventListener('click', onClick);
    return b;
  }

  for (const base of BASES) {
    baseRow.append(button(`${base.name} · ${Math.round(base.frequency)} Hz`, () => {
      state.base = base;
      update();
    }, { base: base.name }));
  }
  for (let n = 1; n <= COUNT; n++) {
    harmonicRow.append(button(n === 1 ? '×1 (fundamental)' : `×${n}`, () => {
      if (state.on.has(n)) state.on.delete(n);
      else state.on.add(n);
      update();
    }, { harmonic: String(n) }));
  }
  for (const preset of PRESETS) {
    presetRow.append(button(preset.name, () => {
      state.on = new Set(preset.on);
      update();
    }));
  }

  function gainsNow() {
    // Keep the overall level about the same however many harmonics are on.
    let total = 0;
    for (const n of state.on) total += amplitude(n);
    const scale = total > 0 ? LEVEL / Math.max(1, total) : 0;
    return Array.from({ length: COUNT }, (_, i) => (state.on.has(i + 1) ? amplitude(i + 1) * scale : 0));
  }

  function play() {
    const { context, output } = audio();
    claim(owner);
    const gains = gainsNow();
    state.voices = gains.map((g, i) => {
      const oscillator = context.createOscillator();
      oscillator.frequency.value = state.base.frequency * (i + 1);
      const gain = context.createGain();
      gain.gain.value = 0;
      oscillator.connect(gain).connect(output);
      oscillator.start();
      glide(gain.gain, g, 0.05);
      return { oscillator, gain };
    });
    sync();
  }

  function stop() {
    if (!state.voices) return;
    for (const { oscillator, gain } of state.voices) {
      glide(gain.gain, 0, 0.05);
      oscillator.stop(oscillator.context.currentTime + 0.1);
    }
    state.voices = null;
    release(owner);
    sync();
  }

  playButton.addEventListener('click', () => {
    onError(root, null);
    try {
      if (state.voices) stop();
      else play();
    } catch (error) {
      onError(root, error.message);
    }
  });

  function sync() {
    playButton.textContent = state.voices ? 'Stop' : 'Play';
    playButton.setAttribute('aria-pressed', String(Boolean(state.voices)));
    for (const b of baseRow.children) b.setAttribute('aria-pressed', String(b.dataset.base === state.base.name));
    for (const b of harmonicRow.children) b.setAttribute('aria-pressed', String(state.on.has(Number(b.dataset.harmonic))));
  }

  // Everything drawn comes from a copy of the tone built here and measured with the same
  // pitch finder as the rest of the page, so it shows without sound too.
  function update() {
    const samples = new Float32Array(4096);
    for (const n of state.on) {
      const f = state.base.frequency * n;
      const a = amplitude(n);
      for (let i = 0; i < samples.length; i++) samples[i] += a * Math.sin((2 * Math.PI * f * i) / RATE);
    }
    state.samples = samples;
    state.pitch = state.on.size ? detectPitch(samples, RATE, { minFrequency: 40 }) : null;

    if (state.voices) {
      const gains = gainsNow();
      state.voices.forEach(({ oscillator, gain }, i) => {
        oscillator.frequency.setTargetAtTime(state.base.frequency * (i + 1), oscillator.context.currentTime, 0.01);
        glide(gain.gain, gains[i], 0.05);
      });
    }

    const p = state.pitch;
    if (!state.on.size) readout.textContent = 'Nothing on: silence.';
    else if (!p) readout.textContent = 'No single repeating period, so no clear pitch.';
    else {
      const heard = noteName(p.frequency);
      const missing = !state.on.has(1) && Math.abs(p.frequency - state.base.frequency) < state.base.frequency * 0.03;
      readout.innerHTML = `Repeats every ${(1000 / p.frequency).toFixed(2)} ms, so the pitch is <b>${heard.name}</b> · ${p.frequency.toFixed(1)} Hz`
        + (missing ? '. Nothing is sounding at that frequency.' : '.');
    }
    sync();
    redrawBars();
    redrawWave();
  }

  const redrawBars = fitCanvas(root.querySelector('.bars'), (ctx, w, h) => {
    const left = 10;
    const right = w - 10;
    const top = 30;
    const bottom = h - 24;
    const fMin = 50;
    const fMax = 2600;
    const axis = logAxis(fMin, fMax, left, right);
    drawFrequencyTicks(ctx, axis.x, fMin, fMax, top, bottom);
    label(ctx, 'What is sounding', left, 8);

    for (let n = 1; n <= COUNT; n++) {
      const f = state.base.frequency * n;
      const x = Math.round(axis.x(f));
      const height = (bottom - top - 18) * amplitude(n);
      const on = state.on.has(n);
      ctx.save();
      if (on) {
        ctx.fillStyle = COLORS.wave;
        ctx.fillRect(x - 3, bottom - height, 6, height);
      } else {
        ctx.strokeStyle = COLORS.faint;
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(x - 3 + 0.5, bottom - height + 0.5, 6, height);
      }
      ctx.restore();
    }

    const p = state.pitch;
    if (p) {
      const x = Math.round(axis.x(p.frequency)) + 0.5;
      ctx.save();
      ctx.strokeStyle = COLORS.heard;
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, top - 6);
      ctx.lineTo(x, bottom);
      ctx.stroke();
      ctx.restore();
      label(ctx, `pitch heard: ${formatHz(p.frequency)}`, x + 6, top - 10, { color: COLORS.heard });
    }
  });

  const redrawWave = fitCanvas(root.querySelector('.period'), (ctx, w, h) => {
    label(ctx, 'The wave: where it starts over', 10, 8);
    if (!state.samples || !state.on.size) return;
    const span = Math.round(RATE * 0.03);
    label(ctx, '30 milliseconds', w - 10, 8, { align: 'right' });
    // Every harmonic starts at phase zero together, so the wave repeats from sample 0.
    drawWave(ctx, state.samples, 10, 26, w - 20, h - 34, { span, align: false });
    const p = state.pitch;
    if (!p) return;
    const period = RATE / p.frequency;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 226, 122, 0.5)';
    ctx.setLineDash([2, 4]);
    for (let s = 0; s <= span; s += period) {
      const x = Math.round(10 + ((w - 20) * s) / span) + 0.5;
      ctx.beginPath();
      ctx.moveTo(x, 24);
      ctx.lineTo(x, h - 6);
      ctx.stroke();
    }
    ctx.restore();
  });

  update();
}
