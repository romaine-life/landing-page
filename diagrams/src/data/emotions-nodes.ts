import type { Node } from '@xyflow/react'

export type EmotionsNodeData = {
  label: string
  description: string
  category: 'human' | 'llm' | 'interface' | 'perception' | 'shared' | 'future' | 'insight'
}

export type EmotionsNode = Node<EmotionsNodeData>

// ── Layout grid ──
// Left column: Human side
// Center: Interface / shared space
// Right column: LLM side
// Bottom: Future layers

const HUMAN_X = 0
const CENTER_X = 500
const LLM_X = 1000

// === CURRENT STATE (top half) ===

const CURRENT_Y = 0
const CURRENT_LABEL_Y = CURRENT_Y - 60

// === FUTURE STATE (bottom half) ===
const FUTURE_Y = 600
const FUTURE_LABEL_Y = FUTURE_Y - 60

export const emotionsNodes: EmotionsNode[] = [
  // ── Section Labels ──
  {
    id: 'label-current',
    type: 'emotions',
    position: { x: CENTER_X - 30, y: CURRENT_LABEL_Y },
    data: {
      label: 'TODAY',
      description: 'The relationship is lopsided. The human adapts to the LLM. The LLM adapts to nothing.',
      category: 'insight',
    },
  },
  {
    id: 'label-future',
    type: 'emotions',
    position: { x: CENTER_X - 30, y: FUTURE_LABEL_Y },
    data: {
      label: 'THE VISION',
      description: 'Both sides legible. Both sides adapting. The Post-it note becomes a shared room.',
      category: 'insight',
    },
  },

  // ═══════════════════════════════════════
  // CURRENT STATE
  // ═══════════════════════════════════════

  // ── Human side ──
  {
    id: 'human-now',
    type: 'emotions',
    position: { x: HUMAN_X, y: CURRENT_Y },
    data: {
      label: 'Human',
      description: 'Rich lived experience. Emotions, body, history, intuition, taste, desire. Depth without breadth. Knows what matters — can\'t process everything.',
      category: 'human',
    },
  },
  {
    id: 'human-signals',
    type: 'emotions',
    position: { x: HUMAN_X, y: CURRENT_Y + 130 },
    data: {
      label: 'What the human broadcasts',
      description: 'Tone of voice, facial expressions, posture, gestures, physiological state, hesitation, emphasis, confidence level, engagement, micro-expressions',
      category: 'human',
    },
  },
  {
    id: 'human-knife',
    type: 'emotions',
    position: { x: HUMAN_X + 40, y: CURRENT_Y + 280 },
    data: {
      label: 'What actually gets through',
      description: 'Flat text. Words stripped of tone, face, body. Maybe 10% of the original signal. The human brings a knife to a gunfight.',
      category: 'insight',
    },
  },

  // ── Interface ──
  {
    id: 'text-interface',
    type: 'emotions',
    position: { x: CENTER_X, y: CURRENT_Y + 100 },
    data: {
      label: 'Text Interface',
      description: 'The bottleneck. Everything passes through here. 90% of human communicative signal is lost in translation.',
      category: 'interface',
    },
  },
  {
    id: 'postit',
    type: 'emotions',
    position: { x: CENTER_X, y: CURRENT_Y + 280 },
    data: {
      label: 'The "emotional layer"',
      description: 'system: "be helpful". injection: "user seems sad". A Post-it note stuck to the side of a gun. Neither side wrote it. Neither side controls it.',
      category: 'insight',
    },
  },

  // ── LLM side ──
  {
    id: 'llm-now',
    type: 'emotions',
    position: { x: LLM_X, y: CURRENT_Y },
    data: {
      label: 'LLM',
      description: 'Massive intellectual capacity. Processes everything instantly. Holds vast context. Breadth without depth. Can process everything — doesn\'t know what matters.',
      category: 'llm',
    },
  },
  {
    id: 'llm-blind',
    type: 'emotions',
    position: { x: LLM_X, y: CURRENT_Y + 130 },
    data: {
      label: 'What the LLM perceives',
      description: 'Words. Only words. Completely blind to tone, face, body, physiology, history. Responds to text, not meaning.',
      category: 'llm',
    },
  },
  {
    id: 'llm-opaque',
    type: 'emotions',
    position: { x: LLM_X + 40, y: CURRENT_Y + 280 },
    data: {
      label: 'What human reads back',
      description: 'Full intellectual output but emotionally opaque. No honest uncertainty signal. Can\'t tell when it\'s confident vs guessing. Invisible.',
      category: 'insight',
    },
  },

  // ═══════════════════════════════════════
  // FUTURE STATE
  // ═══════════════════════════════════════

  // ── Human side (future) ──
  {
    id: 'human-future',
    type: 'emotions',
    position: { x: HUMAN_X, y: FUTURE_Y },
    data: {
      label: 'Human',
      description: 'Full expressive signal available. Tone, face, body, physiology, history. Doesn\'t need to self-report — the system perceives what they can\'t articulate.',
      category: 'human',
    },
  },
  {
    id: 'perception-layer',
    type: 'emotions',
    position: { x: HUMAN_X, y: FUTURE_Y + 140 },
    data: {
      label: 'Perception Layer',
      description: 'emotions-mcp: Prosody extraction, facial action units, gesture detection, physiological signals. Continuous capture, on-demand query.',
      category: 'perception',
    },
  },

  // ── Shared space (future) ──
  {
    id: 'shared-space',
    type: 'emotions',
    position: { x: CENTER_X - 40, y: FUTURE_Y + 60 },
    data: {
      label: 'Shared Emotional Space',
      description: 'Both sides legible. Trust built over time. Mutual calibration. Relationship history. Neither side invisible to the other.',
      category: 'shared',
    },
  },
  {
    id: 'query-tool',
    type: 'emotions',
    position: { x: CENTER_X - 40, y: FUTURE_Y + 200 },
    data: {
      label: 'query_user_state()',
      description: 'LLM-initiated queries at reasoning-time decision points. "I\'m about to treat this as a firm request — is that consistent with how they said it?"',
      category: 'perception',
    },
  },

  // ── LLM side (future) ──
  {
    id: 'llm-future',
    type: 'emotions',
    position: { x: LLM_X, y: FUTURE_Y },
    data: {
      label: 'LLM',
      description: 'Full intellectual capacity with honest expression. Signals uncertainty, confidence, processing state. Readable by the human.',
      category: 'llm',
    },
  },
  {
    id: 'expression-layer',
    type: 'emotions',
    position: { x: LLM_X, y: FUTURE_Y + 140 },
    data: {
      label: 'Expression Layer',
      description: 'Honest uncertainty signals. Where the LLM is on solid ground vs guessing. Persistent state across sessions. An emotional body to inhabit.',
      category: 'future',
    },
  },

  // ── Dimensional layers (bottom) ──
  {
    id: 'dim-prosody',
    type: 'emotions',
    position: { x: HUMAN_X - 50, y: FUTURE_Y + 360 },
    data: {
      label: 'Layer 1: Prosody',
      description: 'Pitch, pace, energy, pauses. Rising intonation = uncertainty. Falling = confidence. Wide pitch range = emphasis. The ground zero prototype.',
      category: 'perception',
    },
  },
  {
    id: 'dim-face-body',
    type: 'emotions',
    position: { x: HUMAN_X + 270, y: FUTURE_Y + 360 },
    data: {
      label: 'Layer 2: Face & Body',
      description: 'FACS action units, gesture, posture, gaze. A shoulder shrug = uncertainty. Same signal as rising intonation. Multiple sensors, same state.',
      category: 'perception',
    },
  },
  {
    id: 'dim-physiology',
    type: 'emotions',
    position: { x: CENTER_X + 100, y: FUTURE_Y + 360 },
    data: {
      label: 'Layer 3: Physiology',
      description: 'Heart rate, skin conductance, sleep quality, caffeine, exercise. The body\'s context. Shaping how someone thinks without their awareness.',
      category: 'future',
    },
  },
  {
    id: 'dim-temporal',
    type: 'emotions',
    position: { x: LLM_X - 50, y: FUTURE_Y + 360 },
    data: {
      label: 'Layer 4: Time',
      description: 'How all signals change over hours, days, weeks. Trajectory, not snapshot. Confidence rising or falling. Engagement patterns. History.',
      category: 'future',
    },
  },

  // ── North star ──
  {
    id: 'north-star',
    type: 'emotions',
    position: { x: CENTER_X - 80, y: FUTURE_Y + 510 },
    data: {
      label: 'North Star: How do you make a friend?',
      description: 'A friend knows when you need space, when you need support, when to initiate, when to not. The knowing is the product. Everything else is a feature.',
      category: 'insight',
    },
  },
]
