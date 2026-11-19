// Canvas helpers shared by the three sections.

export const COLORS = {
  ink: '#e8eaee',
  dim: 'rgba(232, 234, 238, 0.45)',
  faint: 'rgba(232, 234, 238, 0.12)',
  grid: 'rgba(232, 234, 238, 0.07)',
  wave: '#7cc4ff',
  membrane: '#ffb454',
  voiceA: '#7cc4ff',
  voiceB: '#ff8fb1',
  rub: '#ff5a4f',
  match: '#7ee08a',
  heard: '#ffe27a',
};

// Keeps a canvas's pixels matched to its CSS size and the screen's density, and calls
// `draw(ctx, width, height)` in CSS pixels whenever it changes size.
export function fitCanvas(canvas, draw) {
  const ctx = canvas.getContext('2d');
  let size = { width: 0, height: 0 };
  const redraw = () => {
    if (!size.width || !size.height) return;
    const ratio = window.devicePixelRatio || 1;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, size.width, size.height);
    draw(ctx, size.width, size.height);
  };
  new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    size = { width, height };
    redraw();
  }).observe(canvas);
  return redraw;
}

// A log-frequency axis across [left, right].
export function logAxis(fMin, fMax, left, right) {
  const span = Math.log(fMax / fMin);
  return {
    x: (f) => left + ((right - left) * Math.log(f / fMin)) / span,
    f: (x) => fMin * Math.exp(((x - left) / (right - left)) * span),
  };
}

export function formatHz(f) {
  if (f >= 1000) return `${(f / 1000).toFixed(f >= 10000 ? 0 : 1).replace(/\.0$/, '')} kHz`;
  return `${Math.round(f)} Hz`;
}

const TICKS = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];

export function drawFrequencyTicks(ctx, toX, fMin, fMax, top, bottom) {
  ctx.save();
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (const f of TICKS) {
    if (f < fMin || f > fMax) continue;
    const x = Math.round(toX(f)) + 0.5;
    ctx.strokeStyle = COLORS.grid;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();
    // A label at either edge is kept whole inside the canvas.
    const text = formatHz(f);
    const half = ctx.measureText(text).width / 2;
    const edge = ctx.canvas.width / (window.devicePixelRatio || 1);
    ctx.fillStyle = COLORS.dim;
    ctx.fillText(text, Math.min(Math.max(x, half + 2), edge - half - 2), bottom + 4);
  }
  ctx.restore();
}

// A signal as a line, starting at a rising zero crossing so a steady tone stands still.
export function drawWave(ctx, samples, left, top, width, height, { color = COLORS.wave, span = samples.length, align = true } = {}) {
  let start = 0;
  if (align) {
    for (let i = 1; i < samples.length - span; i++) {
      if (samples[i - 1] <= 0 && samples[i] > 0) {
        start = i;
        break;
      }
    }
  }
  let peak = 0;
  for (let i = start; i < start + span && i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]));
  const scale = peak > 0.02 ? 1 / peak : 1 / 0.02; // quiet input stays small rather than blown up from noise
  const mid = top + height / 2;
  ctx.save();
  ctx.strokeStyle = COLORS.faint;
  ctx.beginPath();
  ctx.moveTo(left, mid + 0.5);
  ctx.lineTo(left + width, mid + 0.5);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.6;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  const count = Math.min(span, samples.length - start);
  for (let i = 0; i < count; i++) {
    const x = left + (width * i) / (count - 1);
    const y = mid - (samples[start + i] * scale * height * 0.45);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
  return start;
}

export function label(ctx, text, x, y, { color = COLORS.dim, align = 'left', baseline = 'top', font = '12px system-ui, sans-serif' } = {}) {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(text, x, y);
  ctx.restore();
}
