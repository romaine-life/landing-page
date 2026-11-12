import type { Edge } from '@xyflow/react'

const USES = { stroke: '#4ade80', strokeWidth: 1.5 }
const INTERNAL = { stroke: '#475569', strokeWidth: 1 }
const labelStyle = { fill: '#94a3b8', fontSize: 9 }

export const fztSharedEdges: Edge[] = [
  // ── Tools → Renderers (each tool picks its platform) ───────
  { id: 'auto-terminal', source: 'tool-automate', target: 'render-terminal', style: USES },
  { id: 'picker-terminal', source: 'tool-picker', target: 'render-terminal', style: USES },
  { id: 'home-browser', source: 'tool-homepage', target: 'render-browser', style: USES },
  { id: 'show-browser', source: 'tool-showcase', target: 'render-browser', style: USES },

  // ── Tools → Frontend (showcase skips this layer) ───────────
  { id: 'auto-palette', source: 'tool-automate', target: 'fe-palette', style: USES },
  { id: 'auto-identity', source: 'tool-automate', target: 'fe-identity', style: USES },
  { id: 'auto-actions', source: 'tool-automate', target: 'fe-actions', style: USES },
  { id: 'picker-palette', source: 'tool-picker', target: 'fe-palette', style: USES },
  { id: 'picker-identity', source: 'tool-picker', target: 'fe-identity', style: USES },
  { id: 'picker-actions', source: 'tool-picker', target: 'fe-actions', style: USES },
  { id: 'home-palette', source: 'tool-homepage', target: 'fe-palette', style: USES },
  { id: 'home-identity', source: 'tool-homepage', target: 'fe-identity', style: USES },
  { id: 'home-actions', source: 'tool-homepage', target: 'fe-actions', style: USES },
  { id: 'show-palette', source: 'tool-showcase', target: 'fe-palette', style: USES },
  { id: 'show-identity', source: 'tool-showcase', target: 'fe-identity', style: USES },
  { id: 'show-actions', source: 'tool-showcase', target: 'fe-actions', style: USES },

  // ── Tools → Providers (direct, tool-specific data source) ──
  { id: 'auto-providers', source: 'tool-automate', target: 'engine-providers', style: USES, label: 'YAML', labelStyle },
  { id: 'picker-providers', source: 'tool-picker', target: 'engine-providers', style: USES, label: 'DirProvider', labelStyle },
  { id: 'home-providers', source: 'tool-homepage', target: 'engine-providers', style: USES, label: 'YAML', labelStyle },
  { id: 'show-providers', source: 'tool-showcase', target: 'engine-providers', style: USES, label: 'YAML', labelStyle },

  // ── Layer internals (downward only) ────────────────────────

  // Renderers → Style
  { id: 'terminal-colors', source: 'render-terminal', target: 'style-colors', style: INTERNAL },
  { id: 'terminal-font', source: 'render-terminal', target: 'style-font', style: INTERNAL },
  { id: 'browser-colors', source: 'render-browser', target: 'style-colors', style: INTERNAL },
  { id: 'browser-font', source: 'render-browser', target: 'style-font', style: INTERNAL },
  { id: 'browser-crt', source: 'render-browser', target: 'style-crt', style: INTERNAL },

  // Renderers → Engine
  { id: 'terminal-tree', source: 'render-terminal', target: 'engine-tree', style: INTERNAL },
  { id: 'browser-tree', source: 'render-browser', target: 'engine-tree', style: INTERNAL },

  // Frontend → Engine
  { id: 'palette-tree', source: 'fe-palette', target: 'engine-tree', style: INTERNAL, label: 'injects :', labelStyle },

  // Engine internal
  { id: 'tree-scorer', source: 'engine-tree', target: 'engine-scorer', style: INTERNAL },
]
