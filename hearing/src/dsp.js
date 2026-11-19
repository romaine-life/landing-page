// The page's sound math, kept free of browser APIs so `node --test` checks it.

// Where along the cochlea a frequency peaks, as a fraction of its length from the
// apex (0, low notes) to the base (1, high notes, next to the middle ear).
// Greenwood (1990), human constants: f = A (10^(a x) - k).
const GREENWOOD = { A: 165.4, a: 2.1, k: 0.88 };

export function cochleaPosition(frequency) {
  const { A, a, k } = GREENWOOD;
  return Math.log10(frequency / A + k) / a;
}

export function cochleaFrequency(position) {
  const { A, a, k } = GREENWOOD;
  return A * (10 ** (a * position) - k);
}

// The width of the ear's frequency "filter" around a frequency, in Hz:
// the equivalent rectangular bandwidth of Glasberg and Moore (1990).
export function erb(frequency) {
  return 24.7 * (4.37 * frequency / 1000 + 1);
}

const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

export function midiFromFrequency(frequency) {
  return 69 + 12 * Math.log2(frequency / 440);
}

export function frequencyFromMidi(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

// The nearest note's name with its octave, and how far off it is in cents.
export function noteName(frequency) {
  const midi = midiFromFrequency(frequency);
  const nearest = Math.round(midi);
  return {
    name: `${NOTE_NAMES[((nearest % 12) + 12) % 12]}${Math.floor(nearest / 12) - 1}`,
    cents: Math.round((midi - nearest) * 100),
  };
}

// The partials of a harmonic tone: n × the fundamental, with amplitude falling as
// `rolloff` ** (n - 1). Sethares' examples use 0.88.
export function harmonicPartials(fundamental, count, rolloff = 0.88) {
  return Array.from({ length: count }, (_, i) => ({
    frequency: fundamental * (i + 1),
    amplitude: rolloff ** i,
    harmonic: i + 1,
  }));
}

// How much two pure tones rub, by Sethares' (1993, 2005) fit to Plomp and Levelt's
// (1965) listening data: zero at unison, a peak about a quarter of a critical band
// apart, falling back toward zero once they're well separated.
const PL = { dStar: 0.24, s1: 0.0207, s2: 18.96, b1: 3.51, b2: 5.75 };

export function pairRoughness(f1, a1, f2, a2) {
  const low = Math.min(f1, f2);
  const s = PL.dStar / (PL.s1 * low + PL.s2);
  const gap = Math.abs(f2 - f1);
  return Math.min(a1, a2) * (Math.exp(-PL.b1 * s * gap) - Math.exp(-PL.b2 * s * gap));
}

// Every pair of partials across two sounds (and within each), with its roughness.
export function roughPairs(partialsA, partialsB) {
  const all = [...partialsA.map((p) => ({ ...p, voice: 0 })), ...partialsB.map((p) => ({ ...p, voice: 1 }))];
  const pairs = [];
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const r = pairRoughness(all[i].frequency, all[i].amplitude, all[j].frequency, all[j].amplitude);
      pairs.push({ a: all[i], b: all[j], roughness: r });
    }
  }
  return pairs;
}

export function totalRoughness(partialsA, partialsB) {
  return roughPairs(partialsA, partialsB).reduce((sum, pair) => sum + pair.roughness, 0);
}

// Roughness of two harmonic tones across a span of intervals, in cents above `base`.
export function roughnessCurve(base, partialCount, fromCents, toCents, steps, rolloff = 0.88) {
  const lower = harmonicPartials(base, partialCount, rolloff);
  return Array.from({ length: steps + 1 }, (_, i) => {
    const cents = fromCents + ((toCents - fromCents) * i) / steps;
    const upper = harmonicPartials(base * 2 ** (cents / 1200), partialCount, rolloff);
    return { cents, roughness: totalRoughness(lower, upper) };
  });
}

// The pitch a periodic signal is heard at, by the YIN method (de Cheveigné and
// Kawahara, 2002): find the shortest lag at which the signal best repeats itself.
// That lag is the period whether or not any energy sits at its frequency, which is
// why a tone with its fundamental removed still reads at the fundamental.
// Returns { frequency, clarity } (clarity 0 to 1), or null for no clear pitch.
export function detectPitch(samples, sampleRate, { minFrequency = 40, maxFrequency = 1600, threshold = 0.15 } = {}) {
  const maxLag = Math.min(Math.floor(sampleRate / minFrequency), Math.floor(samples.length / 2));
  const minLag = Math.max(2, Math.floor(sampleRate / maxFrequency));
  const window = samples.length - maxLag;
  if (window < minLag * 2) return null;

  let energy = 0;
  for (let i = 0; i < window; i++) energy += samples[i] * samples[i];
  if (energy / window < 1e-7) return null; // silence

  const diff = new Float64Array(maxLag + 1);
  for (let lag = 1; lag <= maxLag; lag++) {
    let sum = 0;
    for (let i = 0; i < window; i++) {
      const d = samples[i] - samples[i + lag];
      sum += d * d;
    }
    diff[lag] = sum;
  }

  // Cumulative mean normalized difference: 1 means no better than average, 0 a perfect repeat.
  const cmnd = new Float64Array(maxLag + 1);
  cmnd[0] = 1;
  let running = 0;
  for (let lag = 1; lag <= maxLag; lag++) {
    running += diff[lag];
    cmnd[lag] = running > 0 ? (diff[lag] * lag) / running : 1;
  }

  let best = -1;
  for (let lag = minLag; lag <= maxLag; lag++) {
    if (cmnd[lag] < threshold) {
      while (lag + 1 <= maxLag && cmnd[lag + 1] < cmnd[lag]) lag++;
      best = lag;
      break;
    }
  }
  if (best < 0) return null;

  // Parabolic interpolation between neighbouring lags for a sub-sample period.
  let period = best;
  if (best > 1 && best < maxLag) {
    const [a, b, c] = [cmnd[best - 1], cmnd[best], cmnd[best + 1]];
    const denom = a - 2 * b + c;
    if (denom !== 0) period = best + (a - c) / (2 * denom);
  }
  return { frequency: sampleRate / period, clarity: Math.max(0, Math.min(1, 1 - cmnd[best])) };
}

// A plucked string, by the Karplus-Strong method: a burst of noise circulating in a
// delay line one period long, averaged a little each pass, so the high partials die
// first as on a real string. `random` is injectable so tests are repeatable.
export function pluck(frequency, sampleRate, seconds, { brightness = 0.5, random = Math.random } = {}) {
  const out = new Float32Array(Math.floor(sampleRate * seconds));
  // Averaging each sample with the one after it shortens the loop by half a sample, so
  // the line plus the allpass's fraction, kept between 0.1 and 1.1 samples where the
  // allpass stays smooth, makes up the rest of the period.
  const period = sampleRate / frequency;
  const length = Math.floor(period + 0.4);
  const fraction = period + 0.5 - length;
  const allpass = (1 - fraction) / (1 + fraction);
  const line = new Float32Array(length);
  for (let i = 0; i < length; i++) line[i] = random() * 2 - 1;
  // A softer pick: low-pass the starting burst (a one-pole filter, run three times),
  // then take out its average so the string doesn't start with an offset.
  const coefficient = 0.08 + 0.9 * brightness;
  for (let pass = 0; pass < 3; pass++) {
    let previous = line[length - 1];
    for (let i = 0; i < length; i++) {
      previous += coefficient * (line[i] - previous);
      line[i] = previous;
    }
  }
  const mean = line.reduce((sum, v) => sum + v, 0) / length;
  for (let i = 0; i < length; i++) line[i] -= mean;
  let index = 0;
  let apIn = 0;
  let apOut = 0;
  const decay = 0.996;
  for (let n = 0; n < out.length; n++) {
    const current = line[index];
    const next = line[(index + 1) % length];
    const averaged = decay * 0.5 * (current + next);
    const tuned = allpass * averaged + apIn - allpass * apOut;
    apIn = averaged;
    apOut = tuned;
    line[index] = tuned;
    out[n] = current;
    index = (index + 1) % length;
  }
  let peak = 0;
  for (const v of out) peak = Math.max(peak, Math.abs(v));
  if (peak > 0) for (let n = 0; n < out.length; n++) out[n] /= peak;
  return out;
}

// Named intervals within an octave, in equal-tempered cents.
export const INTERVALS = [
  { cents: 0, name: 'unison', short: 'U' },
  { cents: 100, name: 'minor 2nd', short: 'm2' },
  { cents: 200, name: 'major 2nd', short: 'M2' },
  { cents: 300, name: 'minor 3rd', short: 'm3' },
  { cents: 400, name: 'major 3rd', short: 'M3' },
  { cents: 500, name: 'perfect 4th', short: '4' },
  { cents: 600, name: 'tritone', short: 'TT' },
  { cents: 700, name: 'perfect 5th', short: '5' },
  { cents: 800, name: 'minor 6th', short: 'm6' },
  { cents: 900, name: 'major 6th', short: 'M6' },
  { cents: 1000, name: 'minor 7th', short: 'm7' },
  { cents: 1100, name: 'major 7th', short: 'M7' },
  { cents: 1200, name: 'octave', short: '8ve' },
];

export function nearestInterval(cents) {
  return INTERVALS.reduce((best, iv) => (Math.abs(iv.cents - cents) < Math.abs(best.cents - cents) ? iv : best));
}
