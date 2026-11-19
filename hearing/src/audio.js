// One AudioContext for the page, made on the first click (browsers keep audio
// silent until a person interacts), and one section sounding at a time.

let context = null;
let master = null;
let volume = 0.5;
let current = null; // { stop } of the section now sounding

export class AudioUnavailable extends Error {}

export function audio() {
  if (!context) {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) throw new AudioUnavailable('This browser has no Web Audio, so the page can draw but not play.');
    context = new Context({ latencyHint: 'interactive' });
    master = context.createGain();
    master.gain.value = volume;
    // A limiter, so stacking harmonics or two notes can't clip.
    const limiter = context.createDynamicsCompressor();
    limiter.threshold.value = -6;
    limiter.knee.value = 0;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.1;
    master.connect(limiter).connect(context.destination);
  }
  if (context.state === 'suspended') context.resume();
  return { context, output: master };
}

export function setVolume(value) {
  volume = value;
  if (master) master.gain.setTargetAtTime(value, context.currentTime, 0.02);
}

// A section claims the speakers; whoever had them is told to stop.
export function claim(owner) {
  if (current && current !== owner) current.stop();
  current = owner;
}

export function release(owner) {
  if (current === owner) current = null;
}

// A ramp to a new gain without clicks.
export function glide(param, value, seconds = 0.03) {
  param.cancelScheduledValues(context.currentTime);
  param.setTargetAtTime(value, context.currentTime, seconds / 3);
}
