// The idea in one picture: the same playing seen through a normal pickup (one summed signal)
// and through a hexaphonic pickup and String Box (six signals, one per string).

const canvas = document.getElementById('scope')
const ctx = canvas.getContext('2d')

// Open strings, high e at the top as in tab; frequencies in Hz.
const STRINGS = [
  { name: 'e', hz: 329.63, color: '#b197fc' },
  { name: 'B', hz: 246.94, color: '#4dabf7' },
  { name: 'G', hz: 196.0, color: '#38d9a9' },
  { name: 'D', hz: 146.83, color: '#ffd43b' },
  { name: 'A', hz: 110.0, color: '#ffa94d' },
  { name: 'E', hz: 82.41, color: '#ff6b6b' },
]
const SLOW = 25        // slow motion, so a string's vibration is visible
const WINDOW = 1.6     // seconds of (slowed) signal across the scope
const DECAY = 1.1      // seconds for a pluck to fall to 1/e
const BAR = 7.2        // seconds before the pattern repeats

// One bar of playing: a strum, single notes picked one at a time, a partial strum.
// Each entry is [time in the bar, string index, strength]; indexes count from high e.
const PATTERN = [
  ...[5, 4, 3, 2, 1, 0].map((s, i) => [0.0 + i * 0.07, s, 1]),
  [1.6, 5, 1], [2.3, 3, 0.9], [3.0, 1, 0.9], [3.7, 0, 1],
  ...[3, 2, 1, 0].map((s, i) => [4.6 + i * 0.07, s, 0.8]),
  [6.0, 4, 1],
]

function plucksBefore(t) {
  const out = []
  const bar = Math.floor(t / BAR)
  for (let b = bar - 1; b <= bar; b++) {
    for (const [at, s, a] of PATTERN) {
      const t0 = b * BAR + at
      if (t0 <= t && t - t0 < WINDOW + 5 * DECAY) out.push([t0, s, a])
    }
  }
  return out
}

// Signal of one string at time t (seconds of the slowed clock).
function stringAt(plucks, s, t) {
  let v = 0
  for (const [t0, si, a] of plucks) {
    if (si !== s || t < t0) continue
    const age = t - t0
    v += a * Math.exp(-age / DECAY) * Math.sin(2 * Math.PI * (STRINGS[s].hz / SLOW) * age)
  }
  return v
}

let w = 0, h = 0
function resize() {
  const r = Math.min(devicePixelRatio, 2)
  w = canvas.clientWidth
  h = canvas.clientHeight
  canvas.width = Math.round(w * r)
  canvas.height = Math.round(h * r)
  ctx.setTransform(r, 0, 0, r, 0, 0)
}

function label(text, x, y, size, alpha, weight = 400) {
  ctx.fillStyle = `rgba(232,234,238,${alpha})`
  ctx.font = `${weight} ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`
  ctx.fillText(text, x, y)
}

function trace(x0, x1, mid, amp, color, width, fn) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  for (let x = x0; x <= x1; x += 1.5) {
    const y = mid - amp * fn((x - x0) / (x1 - x0))
    if (x === x0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

function draw(now) {
  ctx.clearRect(0, 0, w, h)
  const plucks = plucksBefore(now)
  const pad = 18
  const narrow = w < 560
  const gutter = narrow ? 34 : 120
  const x0 = pad + gutter, x1 = w - pad
  const at = f => now - WINDOW * (1 - f)   // f: 0 at the left edge (oldest) to 1 (now)

  // Top: what a normal pickup gives, all six summed.
  const topH = h * 0.3
  label('Normal pickup', pad, pad + 14, 14, 0.9, 600)
  if (!narrow) label('one signal', pad, pad + 32, 12, 0.5)
  const mixMid = pad + topH / 2 + 10
  trace(x0, x1, mixMid, topH * 0.17, 'rgba(232,234,238,.85)', 1.6,
    f => { const t = at(f); let v = 0; for (let s = 0; s < 6; s++) v += stringAt(plucks, s, t); return v })

  // Bottom: String Box, one lane per string.
  const top = pad + topH + 28
  label('String Box', pad, top + 14, 14, 0.9, 600)
  if (!narrow) label('six signals', pad, top + 32, 12, 0.5)
  const laneTop = top + (narrow ? 26 : 8)
  const lane = (h - laneTop - pad) / 6
  STRINGS.forEach((str, s) => {
    const mid = laneTop + lane * (s + 0.5)
    label(str.name, narrow ? pad : pad + gutter - 26, mid + 5, 14, 0.85, 600)
    ctx.strokeStyle = 'rgba(232,234,238,.07)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(x0, mid); ctx.lineTo(x1, mid); ctx.stroke()
    trace(x0, x1, mid, lane * 0.42, str.color, 1.8, f => stringAt(plucks, s, at(f)))
  })

  // The divider between the two views.
  ctx.strokeStyle = 'rgba(232,234,238,.1)'
  ctx.beginPath(); ctx.moveTo(pad, top - 12); ctx.lineTo(w - pad, top - 12); ctx.stroke()
}

const still = matchMedia('(prefers-reduced-motion: reduce)').matches
let visible = false
let clock = 0.5
let last = null

function frame(ms) {
  if (!visible) { last = null; return }
  if (last !== null) clock += Math.min((ms - last) / 1000, 0.1)
  last = ms
  draw(clock)
  requestAnimationFrame(frame)
}

new IntersectionObserver(([e]) => {
  const was = visible
  visible = e.isIntersecting && !still
  if (visible && !was) requestAnimationFrame(frame)
}).observe(canvas)

new ResizeObserver(() => {
  resize()
  draw(still ? 1.2 : clock)   // a strum in full ring when motion is reduced
}).observe(canvas)
