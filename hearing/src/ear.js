// Section 1: one wave reaches the ear; the cochlea spreads it out by frequency.

import { audio, claim, release, glide } from './audio.js';
import { cochleaPosition, cochleaFrequency, erb, detectPitch, noteName, pluck } from './dsp.js';
import { COLORS, fitCanvas, drawWave, drawFrequencyTicks, label } from './draw.js';

const STRINGS = [
  { name: 'E2', frequency: 82.41 },
  { name: 'A2', frequency: 110 },
  { name: 'D3', frequency: 146.83 },
  { name: 'G3', frequency: 196 },
  { name: 'B3', frequency: 246.94 },
  { name: 'E4', frequency: 329.63 },
];
const TONE_LEVEL = { sine: 0.35, sawtooth: 0.16, square: 0.13 };
const PLUCK_LEVEL = 0.55;
const PLUCK_SECONDS = 4;
// The part of the cochlea shown: 30 Hz to 12 kHz, where guitars and voices live.
const F_MIN = 30;
const F_MAX = 12000;
const POS_MIN = cochleaPosition(F_MIN);
const POS_MAX = cochleaPosition(F_MAX);
// The membrane view shows this far below the loudest point. The ear's filters overlap,
// so neighbouring harmonics are only about 15-20 dB apart in between: a wider range
// would hide the peaks the cochlea does resolve.
const RANGE_DB = 35;

export function setupEar(root, { onError }) {
  const sourceButtons = [...root.querySelectorAll('[data-source]')];
  const noteRow = root.querySelector('.notes');
  const stopButton = root.querySelector('[data-stop]');
  const readout = root.querySelector('.readout');

  const state = {
    source: null, // 'pluck' | 'sine' | 'sawtooth' | 'square' | 'mic'
    note: STRINGS[1],
    analyser: null,
    input: null, // gain every source feeds; the analyser listens here, before the volume
    oscillator: null,
    oscillatorGain: null,
    pluckNode: null,
    plucks: new Map(), // frequency -> AudioBuffer
    mic: null, // { stream, node }
    liveUntil: 0,
    frame: 0,
    looping: false,
    time: null,
    freq: null,
    pitch: null,
    filters: null, // the cochlea view's filter weights, per column
  };

  for (const s of STRINGS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = s.name;
    b.dataset.note = s.name;
    b.addEventListener('click', () => chooseNote(s));
    noteRow.append(b);
  }
  const noteButtons = [...noteRow.querySelectorAll('button')];

  const owner = { stop: () => stop() };

  function wire() {
    const { context, output } = audio();
    if (!state.analyser) {
      state.input = context.createGain();
      state.analyser = context.createAnalyser();
      state.analyser.fftSize = 8192;
      state.analyser.smoothingTimeConstant = 0.5;
      state.input.connect(state.analyser);
      state.input.connect(output);
      state.time = new Float32Array(state.analyser.fftSize);
      state.freq = new Float32Array(state.analyser.frequencyBinCount);
    }
    return context;
  }

  function syncButtons() {
    for (const b of sourceButtons) b.setAttribute('aria-pressed', String(b.dataset.source === state.source));
    for (const b of noteButtons) b.setAttribute('aria-pressed', String(b.dataset.note === state.note.name));
    noteRow.toggleAttribute('data-disabled', state.source === 'mic');
    stopButton.disabled = !state.source;
  }

  function stopOscillator() {
    if (!state.oscillator) return;
    const { oscillator, oscillatorGain } = state;
    glide(oscillatorGain.gain, 0, 0.05);
    oscillator.stop(oscillator.context.currentTime + 0.1);
    state.oscillator = null;
    state.oscillatorGain = null;
  }

  function stopMic() {
    if (!state.mic) return;
    state.mic.node.disconnect();
    for (const track of state.mic.stream.getTracks()) track.stop();
    state.mic = null;
  }

  function stopPluck() {
    if (!state.pluckNode) return;
    const { node, gain } = state.pluckNode;
    glide(gain.gain, 0, 0.05);
    node.stop(node.context.currentTime + 0.1);
    state.pluckNode = null;
    state.liveUntil = performance.now() + 150;
  }

  function stop() {
    stopPluck();
    stopOscillator();
    stopMic();
    state.source = null;
    release(owner);
    syncButtons();
  }

  function playPluck() {
    const context = wire();
    claim(owner);
    stopOscillator();
    stopMic();
    stopPluck(); // a string picked again stops ringing first, as on a guitar
    let buffer = state.plucks.get(state.note.frequency);
    if (!buffer) {
      const samples = pluck(state.note.frequency, context.sampleRate, PLUCK_SECONDS, { brightness: 0.1 });
      buffer = context.createBuffer(1, samples.length, context.sampleRate);
      buffer.copyToChannel(samples, 0);
      state.plucks.set(state.note.frequency, buffer);
    }
    const node = context.createBufferSource();
    node.buffer = buffer;
    const gain = context.createGain();
    gain.gain.value = PLUCK_LEVEL;
    node.connect(gain).connect(state.input);
    node.start();
    node.addEventListener('ended', () => {
      if (state.pluckNode?.node === node) state.pluckNode = null;
    });
    state.pluckNode = { node, gain };
    state.source = 'pluck';
    state.liveUntil = performance.now() + PLUCK_SECONDS * 1000;
    syncButtons();
    loop();
  }

  function playTone(type) {
    const context = wire();
    claim(owner);
    stopMic();
    stopPluck();
    if (state.oscillator && state.oscillator.type === type) return;
    stopOscillator();
    const oscillator = context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = state.note.frequency;
    const gain = context.createGain();
    gain.gain.value = 0;
    oscillator.connect(gain).connect(state.input);
    oscillator.start();
    glide(gain.gain, TONE_LEVEL[type], 0.04);
    state.oscillator = oscillator;
    state.oscillatorGain = gain;
    state.source = type;
    syncButtons();
    loop();
  }

  async function startMic() {
    wire();
    claim(owner);
    stopOscillator();
    stopPluck();
    if (!navigator.mediaDevices?.getUserMedia) {
      onError(root, 'This browser gives the page no microphone access (it needs a secure https page).');
      return;
    }
    let stream;
    try {
      // Music, not a call: no echo cancelling, noise suppression or automatic gain,
      // which would reshape exactly what this view is showing.
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch (error) {
      const message = {
        NotAllowedError: 'The microphone is blocked for this page. Allow it from the icon at the left of the address bar, then press Microphone again.',
        NotFoundError: 'No microphone was found. Plug one in, then press Microphone again.',
        NotReadableError: 'The microphone is in use by another program or couldn\'t be opened.',
      }[error.name] || `The microphone couldn't be opened: ${error.message}`;
      onError(root, message);
      stop();
      return;
    }
    const { context } = audio();
    // The microphone feeds the analyser only, never the speakers, so it can't feed back.
    const node = context.createMediaStreamSource(stream);
    node.connect(state.analyser);
    state.mic = { stream, node };
    for (const track of stream.getTracks()) {
      track.addEventListener('ended', () => {
        if (state.mic?.stream === stream) {
          onError(root, 'The microphone stopped (it was unplugged or taken by another program).');
          stop();
        }
      });
    }
    state.source = 'mic';
    onError(root, null);
    syncButtons();
    loop();
  }

  function chooseNote(s) {
    state.note = s;
    if (state.oscillator) state.oscillator.frequency.setTargetAtTime(s.frequency, state.oscillator.context.currentTime, 0.01);
    else if (state.source === 'pluck' || !state.source) {
      try {
        playPluck();
      } catch (error) {
        onError(root, error.message);
      }
    }
    syncButtons();
  }

  for (const b of sourceButtons) {
    b.addEventListener('click', () => {
      onError(root, null);
      try {
        const source = b.dataset.source;
        if (source === 'pluck') playPluck();
        else if (source === 'mic') {
          if (state.source === 'mic') stop();
          else startMic();
        } else if (state.source === source) stop();
        else playTone(source);
      } catch (error) {
        onError(root, error.message);
      }
    });
  }
  stopButton.addEventListener('click', () => stop());

  // Drawing runs only while something is sounding, and stops by itself after.
  function live() {
    return state.source === 'mic' || state.oscillator || performance.now() < state.liveUntil;
  }

  function loop() {
    if (state.looping) return;
    state.looping = true;
    const step = () => {
      state.analyser.getFloatTimeDomainData(state.time);
      state.analyser.getFloatFrequencyData(state.freq);
      if (state.frame++ % 2 === 0) {
        const rate = state.analyser.context.sampleRate;
        const recent = state.time.subarray(state.time.length - Math.round(rate * 0.05));
        state.pitch = detectPitch(recent, rate, { minFrequency: 60, maxFrequency: 1400 });
        showPitch();
      }
      redrawWave();
      redrawCochlea();
      if (live()) requestAnimationFrame(step);
      else {
        state.looping = false;
        if (state.source === 'pluck') {
          state.source = null;
          release(owner);
          syncButtons();
        }
      }
    };
    requestAnimationFrame(step);
  }

  function showPitch() {
    const p = state.pitch;
    if (p && p.clarity > 0.7) {
      const { name, cents } = noteName(p.frequency);
      const off = cents === 0 ? '' : ` (${cents > 0 ? '+' : ''}${cents} cents)`;
      readout.innerHTML = `Pitch your ear would give it: <b>${name}</b> · ${p.frequency.toFixed(1)} Hz${off}`;
    } else {
      readout.textContent = live() ? 'No single pitch in this sound right now.' : '';
    }
  }

  const redrawWave = fitCanvas(root.querySelector('.wave'), (ctx, w, h) => {
    label(ctx, 'The air pressure reaching your ear: one line', 10, 8);
    if (!state.time) {
      label(ctx, 'Pick a sound above.', w / 2, h / 2, { align: 'center', baseline: 'middle' });
      return;
    }
    const rate = state.analyser.context.sampleRate;
    const span = Math.round(rate * 0.04);
    label(ctx, '40 milliseconds', w - 10, 8, { align: 'right' });
    drawWave(ctx, state.time, 10, 26, w - 20, h - 34, { span });
  });

  const redrawCochlea = fitCanvas(root.querySelector('.cochlea'), (ctx, w, h) => {
    const left = 10;
    const right = w - 10;
    const top = 26;
    const curveBottom = h - 70;
    const stripTop = h - 60;
    const stripBottom = h - 26;
    const toX = (f) => left + ((cochleaPosition(f) - POS_MIN) / (POS_MAX - POS_MIN)) * (right - left);
    const toF = (x) => cochleaFrequency(POS_MIN + ((x - left) / (right - left)) * (POS_MAX - POS_MIN));

    drawFrequencyTicks(ctx, toX, F_MIN, F_MAX, top, stripBottom);
    label(ctx, 'apex: low notes', left, 8);
    label(ctx, 'base: high notes', right, 8, { align: 'right' });

    const columns = Math.max(2, Math.floor(right - left));
    const levels = new Float32Array(columns);
    let loudest = -Infinity;
    if (state.freq) {
      // Each spot on the membrane responds to the frequencies near its own, falling off
      // with distance as Patterson's rounded-exponential filter, about one critical band
      // wide: a column's level is the sound's power weighted by that filter.
      const binHz = state.analyser.context.sampleRate / state.analyser.fftSize;
      const key = `${columns}:${binHz}`;
      if (state.filters?.key !== key) {
        // The weights depend only on the canvas width and the sample rate: made once.
        state.filters = {
          key,
          bank: Array.from({ length: columns }, (_, c) => {
            const f = toF(left + c);
            const band = erb(f);
            const p = (4 * f) / band;
            const from = Math.max(1, Math.floor((f - 2 * band) / binHz));
            const to = Math.min(state.freq.length - 1, Math.ceil((f + 2 * band) / binHz));
            const weights = new Float32Array(Math.max(0, to - from + 1));
            for (let k = from; k <= to; k++) {
              const g = Math.abs(k * binHz - f) / f;
              weights[k - from] = (1 + p * g) * Math.exp(-p * g);
            }
            return { from, weights };
          }),
        };
      }
      const power = state.freq.map((db) => 10 ** (db / 10));
      state.filters.bank.forEach(({ from, weights }, c) => {
        let sum = 0;
        for (let i = 0; i < weights.length; i++) sum += power[from + i] * weights[i];
        levels[c] = 10 * Math.log10(Math.max(sum, 1e-12));
        loudest = Math.max(loudest, levels[c]);
      });
    }
    const ceiling = Math.max(loudest, -45); // near silence shows as floor, not as amplified noise
    const level01 = (db) => Math.max(0, Math.min(1, (db - (ceiling - RANGE_DB)) / RANGE_DB));

    // The response along the membrane.
    ctx.save();
    const gradient = ctx.createLinearGradient(0, top, 0, curveBottom);
    gradient.addColorStop(0, 'rgba(255, 180, 84, 0.55)');
    gradient.addColorStop(1, 'rgba(255, 180, 84, 0.04)');
    ctx.beginPath();
    ctx.moveTo(left, curveBottom);
    for (let c = 0; c < columns; c++) ctx.lineTo(left + c, curveBottom - level01(levels[c]) * (curveBottom - top));
    ctx.lineTo(left + columns - 1, curveBottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = COLORS.membrane;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let c = 0; c < columns; c++) {
      const y = curveBottom - level01(levels[c]) * (curveBottom - top);
      if (c === 0) ctx.moveTo(left, y);
      else ctx.lineTo(left + c, y);
    }
    ctx.stroke();
    ctx.restore();

    // The membrane itself, unrolled: wider at the apex than at the base, lit where it moves.
    const stripMid = (stripTop + stripBottom) / 2;
    for (let c = 0; c < columns; c++) {
      const t = c / (columns - 1);
      const half = ((stripBottom - stripTop) / 2) * (1 - 0.6 * t);
      const glow = level01(levels[c]);
      ctx.fillStyle = `rgba(255, ${Math.round(120 + 100 * glow)}, ${Math.round(60 + 40 * glow)}, ${0.1 + 0.9 * glow})`;
      ctx.fillRect(left + c, stripMid - half, 1, half * 2);
    }

    // The harmonic series of the pitch heard, marked where each harmonic should land.
    const p = state.pitch;
    if (p && p.clarity > 0.7 && live()) {
      let lastX = -Infinity;
      ctx.save();
      for (let n = 1; n * p.frequency < F_MAX && n <= 16; n++) {
        const x = Math.round(toX(n * p.frequency)) + 0.5;
        ctx.strokeStyle = 'rgba(255, 226, 122, 0.35)';
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(x, top + 14);
        ctx.lineTo(x, curveBottom);
        ctx.stroke();
        if (x - lastX > 22) {
          label(ctx, `×${n}`, x, top, { color: COLORS.heard, align: 'center', font: '11px system-ui, sans-serif' });
          lastX = x;
        }
      }
      ctx.restore();
    }
    if (!state.freq) label(ctx, 'Where the membrane moves shows here.', w / 2, (top + curveBottom) / 2, { align: 'center', baseline: 'middle' });
  });

  syncButtons();
}
