// Section 3: two notes, their overtones, and where they rub.

import { audio, claim, release, glide } from './audio.js';
import { harmonicPartials, roughPairs, totalRoughness, roughnessCurve, INTERVALS, nearestInterval } from './dsp.js';
import { COLORS, fitCanvas, logAxis, drawFrequencyTicks, label } from './draw.js';

const BASE = 220; // A3
const RICH = 6;
const LEVEL = 0.32;
const PEAK_PAIR = 0.18; // the most two full-strength partials can rub, by the fit used
// Partials closer than this beat slower than three times a second: a slow swell, not
// roughness. Equal tuning's fifth puts A3's third harmonic 0.7 Hz from E4's second.
const MATCH_HZ = 3;

export function setupRub(root, { onError }) {
  const slider = root.querySelector('input[type=range]');
  const intervalRow = root.querySelector('.intervals');
  const overtoneButtons = [...root.querySelectorAll('[data-overtones]')];
  const playButton = root.querySelector('[data-play]');
  const readout = root.querySelector('.readout');

  const state = {
    cents: 700,
    partials: RICH,
    voices: null, // [{ oscillator, gain, voice, harmonic }]
  };
  const owner = { stop: () => stop() };
  const curves = new Map(); // partial count -> roughness curve, computed once

  for (const iv of INTERVALS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = iv.short;
    b.title = iv.name;
    b.dataset.cents = String(iv.cents);
    b.addEventListener('click', () => setCents(iv.cents));
    intervalRow.append(b);
  }

  const upper = () => BASE * 2 ** (state.cents / 1200);
  const partialsOf = (f) => harmonicPartials(f, state.partials);

  function curve(count) {
    if (!curves.has(count)) curves.set(count, roughnessCurve(BASE, count, 0, 1200, 600));
    return curves.get(count);
  }

  function setCents(cents) {
    state.cents = cents;
    slider.value = String(cents);
    update();
  }

  slider.addEventListener('input', () => {
    state.cents = Number(slider.value);
    update();
  });

  for (const b of overtoneButtons) {
    b.addEventListener('click', () => {
      state.partials = Number(b.dataset.overtones);
      if (state.voices) {
        stop();
        play();
      }
      update();
    });
  }

  function play() {
    const { context, output } = audio();
    claim(owner);
    state.voices = [];
    for (const [voice, f] of [[0, BASE], [1, upper()]]) {
      for (const p of partialsOf(f)) {
        const oscillator = context.createOscillator();
        oscillator.frequency.value = p.frequency;
        const gain = context.createGain();
        gain.gain.value = 0;
        oscillator.connect(gain).connect(output);
        oscillator.start();
        glide(gain.gain, (p.amplitude * LEVEL) / state.partials ** 0.5, 0.05);
        state.voices.push({ oscillator, gain, voice, harmonic: p.harmonic });
      }
    }
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
    playButton.textContent = state.voices ? 'Stop' : 'Play both notes';
    playButton.setAttribute('aria-pressed', String(Boolean(state.voices)));
    for (const b of overtoneButtons) b.setAttribute('aria-pressed', String(Number(b.dataset.overtones) === state.partials));
    for (const b of intervalRow.children) b.setAttribute('aria-pressed', String(Number(b.dataset.cents) === state.cents));
  }

  function update() {
    if (state.voices) {
      const f = upper();
      for (const v of state.voices) {
        if (v.voice === 1) v.oscillator.frequency.setTargetAtTime(f * v.harmonic, v.oscillator.context.currentTime, 0.01);
      }
    }
    const roughness = totalRoughness(partialsOf(BASE), partialsOf(upper()));
    const iv = nearestInterval(state.cents);
    const offBy = state.cents - iv.cents;
    const where = offBy === 0 ? `a ${iv.name}` : `${Math.abs(offBy)} cents ${offBy > 0 ? 'above' : 'below'} a ${iv.name}`;
    readout.innerHTML = `A3 and a note ${state.cents} cents up: <b>${where}</b>. Roughness ${roughness.toFixed(2)}.`;
    sync();
    redrawPartials();
    redrawCurve();
  }

  const redrawPartials = fitCanvas(root.querySelector('.partials'), (ctx, w, h) => {
    const left = 10;
    const right = w - 10;
    const fMin = 180;
    const fMax = 3000;
    const axis = logAxis(fMin, fMax, left, right);
    const rowA = 44;
    const rowB = h - 60;
    const tickBottom = h - 24;
    drawFrequencyTicks(ctx, axis.x, fMin, fMax, 26, tickBottom);
    label(ctx, 'Low note (A3) and its overtones', left, 8, { color: COLORS.voiceA });
    label(ctx, 'High note and its overtones', left, rowB + 18, { color: COLORS.voiceB });

    const a = partialsOf(BASE);
    const b = partialsOf(upper());
    // A pair that rubs is drawn as a red band between its two partials; one that lines
    // up, or so nearly that it only swells slowly, green.
    for (const pair of roughPairs(a, b)) {
      if (pair.a.voice === pair.b.voice) continue;
      const xa = axis.x(pair.a.frequency);
      const xb = axis.x(pair.b.frequency);
      const strength = pair.roughness / PEAK_PAIR;
      ctx.save();
      if (Math.abs(pair.a.frequency - pair.b.frequency) < MATCH_HZ) {
        ctx.strokeStyle = COLORS.match;
        ctx.globalAlpha = 0.8;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xa, rowA + 8);
        ctx.lineTo(xb, rowB - 8);
        ctx.stroke();
      } else if (strength > 0.05) {
        ctx.fillStyle = COLORS.rub;
        ctx.globalAlpha = Math.min(0.85, strength);
        ctx.beginPath();
        ctx.moveTo(xa - 2, rowA + 8);
        ctx.lineTo(xa + 2, rowA + 8);
        ctx.lineTo(xb + 2, rowB - 8);
        ctx.lineTo(xb - 2, rowB - 8);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
    for (const [partials, y, color] of [[a, rowA, COLORS.voiceA], [b, rowB, COLORS.voiceB]]) {
      for (const p of partials) {
        if (p.frequency > fMax) continue;
        const x = Math.round(axis.x(p.frequency)) + 0.5;
        const half = 4 + 10 * p.amplitude;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y - half);
        ctx.lineTo(x, y + half);
        ctx.stroke();
        ctx.restore();
      }
    }
  });

  const redrawCurve = fitCanvas(root.querySelector('.curve'), (ctx, w, h) => {
    const left = 56;
    const right = w - 14;
    const top = 28;
    const bottom = h - 30;
    const x = (cents) => left + ((right - left) * cents) / 1200;
    const shown = curve(state.partials);
    const other = curve(state.partials === 1 ? RICH : 1);
    const max = Math.max(...curve(RICH).map((p) => p.roughness), ...curve(1).map((p) => p.roughness));
    const y = (r) => bottom - ((bottom - top) * r) / max;

    label(ctx, 'Roughness at every interval within an octave', left, 8);
    label(ctx, 'rough', left - 6, top, { align: 'right', font: '11px system-ui, sans-serif' });
    label(ctx, 'smooth', left - 6, bottom, { align: 'right', baseline: 'bottom', font: '11px system-ui, sans-serif' });

    ctx.save();
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (const iv of INTERVALS) {
      const px = Math.round(x(iv.cents)) + 0.5;
      ctx.strokeStyle = COLORS.grid;
      ctx.beginPath();
      ctx.moveTo(px, top);
      ctx.lineTo(px, bottom);
      ctx.stroke();
      ctx.fillStyle = COLORS.dim;
      ctx.fillText(iv.short, px, bottom + 6);
    }
    ctx.restore();

    for (const [points, style, width] of [[other, COLORS.faint, 1.2], [shown, COLORS.rub, 2]]) {
      ctx.save();
      ctx.strokeStyle = style;
      ctx.lineWidth = width;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      points.forEach((p, i) => (i ? ctx.lineTo(x(p.cents), y(p.roughness)) : ctx.moveTo(x(p.cents), y(p.roughness))));
      ctx.stroke();
      ctx.restore();
    }

    const here = totalRoughness(partialsOf(BASE), partialsOf(upper()));
    ctx.save();
    ctx.fillStyle = COLORS.heard;
    ctx.beginPath();
    ctx.arc(x(state.cents), y(here), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    label(ctx, state.partials === 1 ? 'grey: with overtones' : 'grey: pure tones, no overtones', right, 8, { align: 'right' });
  });

  update();
}
