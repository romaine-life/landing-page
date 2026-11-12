import type { Edge } from '@xyflow/react'

const ECO = { stroke: '#f59e0b', strokeWidth: 2 }
const TOOL = { stroke: '#4ade80', strokeWidth: 1.5 }
const INTERNAL = { stroke: '#475569', strokeWidth: 1 }
const labelStyle = { fill: '#94a3b8', fontSize: 9 }

export const fztFinalEdges: Edge[] = [
  // ── Engine internals ───────────────────────────────────────
  { id: 'tree-scorer', source: 'pkg-tree', target: 'pkg-scorer', style: INTERNAL },
  { id: 'fzt-scorer', source: 'bin-fzt', target: 'pkg-scorer', style: INTERNAL, label: 'stdin → score → stdout', labelStyle },

  // ── Ecosystem imports engine ───────────────────────────────
  { id: 'term-tree', source: 'pkg-term-render', target: 'pkg-tree', style: ECO },
  { id: 'browser-tree', source: 'pkg-browser-render', target: 'pkg-tree', style: ECO },
  { id: 'frontend-tree', source: 'pkg-frontend', target: 'pkg-tree', style: ECO, label: 'injects : folder', labelStyle },

  // ── Ecosystem internals ────────────────────────────────────
  { id: 'term-frontend', source: 'pkg-term-render', target: 'pkg-frontend', style: INTERNAL },
  { id: 'browser-frontend', source: 'pkg-browser-render', target: 'pkg-frontend', style: INTERNAL },

  // ── Tools import ecosystem ─────────────────────────────────
  { id: 'auto-term', source: 'tool-automate', target: 'pkg-term-render', style: TOOL },
  { id: 'auto-providers', source: 'tool-automate', target: 'pkg-providers', style: TOOL, label: 'YAML', labelStyle },

  { id: 'picker-term', source: 'tool-picker', target: 'pkg-term-render', style: TOOL },
  { id: 'picker-providers', source: 'tool-picker', target: 'pkg-providers', style: TOOL, label: 'DirProvider', labelStyle },

  { id: 'home-browser', source: 'tool-homepage', target: 'pkg-browser-render', style: TOOL },
  { id: 'home-providers', source: 'tool-homepage', target: 'pkg-providers', style: TOOL, label: 'YAML', labelStyle },

  { id: 'show-browser', source: 'tool-showcase', target: 'pkg-browser-render', style: TOOL },
]
