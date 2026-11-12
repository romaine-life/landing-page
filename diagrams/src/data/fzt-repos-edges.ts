import type { Edge } from '@xyflow/react'

const INTERNAL = { stroke: '#38bdf8', strokeWidth: 1.5 }     // blue: within-repo
const CROSS = { stroke: '#a78bfa', strokeWidth: 2 }          // purple: cross-repo import
const STYLE_DEP = { stroke: '#f472b6', strokeWidth: 1.5, strokeDasharray: '4 2' } // pink: style dep
const CONSUMES = { stroke: '#4ade80', strokeWidth: 1.5 }     // green: tool imports
const labelStyle = { fill: '#94a3b8', fontSize: 9 }

export const fztReposEdges: Edge[] = [
  // ── Within romaine-life/fzt ────────────────────────────────────
  { id: 'i-tree-scorer', source: 'pkg-tree', target: 'pkg-scorer', style: INTERNAL },
  { id: 'i-input-tree', source: 'pkg-input', target: 'pkg-tree', style: INTERNAL },
  { id: 'i-input-scorer', source: 'pkg-input', target: 'pkg-scorer', style: INTERNAL },
  { id: 'i-render-tree', source: 'pkg-render', target: 'pkg-tree', style: INTERNAL },
  { id: 'i-render-input', source: 'pkg-render', target: 'pkg-input', style: INTERNAL },

  // ── Within fzt-style ──────────────────────────────────────
  { id: 'i-style-sync', source: 'pkg-style-css', target: 'pkg-style-go', style: INTERNAL, label: 'same values', labelStyle },

  // ── Within fzt-frontend ───────────────────────────────────
  { id: 'i-palette-identity', source: 'pkg-palette', target: 'pkg-identity', style: INTERNAL },

  // ── fzt-frontend → fzt (cross-repo) ───────────────────────
  { id: 'x-palette-tree', source: 'pkg-palette', target: 'pkg-tree', style: CROSS, label: 'injects : folder', labelStyle },
  { id: 'x-identity-tree', source: 'pkg-identity', target: 'pkg-tree', style: CROSS, label: 'sets name/ver', labelStyle },
  { id: 'x-actions-input', source: 'pkg-actions', target: 'pkg-input', style: CROSS, label: 'action dispatch', labelStyle },

  // ── Renderers → fzt (cross-repo) ──────────────────────────
  { id: 'x-terminal-render', source: 'pkg-terminal', target: 'pkg-render', style: CROSS },
  { id: 'x-browser-render', source: 'pkg-browser', target: 'pkg-render', style: CROSS },
  { id: 'x-wasm-render', source: 'pkg-wasm', target: 'pkg-render', style: CROSS },

  // ── Renderers → fzt-style (cross-repo) ────────────────────
  { id: 'x-terminal-style', source: 'pkg-terminal', target: 'pkg-style-go', style: STYLE_DEP, label: 'colors', labelStyle },
  { id: 'x-browser-style', source: 'pkg-browser', target: 'pkg-style-css', style: STYLE_DEP, label: 'CSS vars', labelStyle },

  // ── Tools → what they import ──────────────────────────────

  // at: terminal tool with frontend
  { id: 'c-at-terminal', source: 'repo-at', target: 'pkg-terminal', style: CONSUMES },
  { id: 'c-at-frontend', source: 'repo-at', target: 'pkg-palette', style: CONSUMES, label: 'commands', labelStyle },
  { id: 'c-at-identity', source: 'repo-at', target: 'pkg-identity', style: CONSUMES, label: 'name/ver', labelStyle },
  { id: 'c-at-provider', source: 'repo-at', target: 'pkg-provider', style: CONSUMES, label: 'YAML', labelStyle },

  // homepage: browser tool with frontend
  { id: 'c-homepage-wasm', source: 'repo-homepage', target: 'pkg-wasm', style: CONSUMES },
  { id: 'c-homepage-browser', source: 'repo-homepage', target: 'pkg-browser', style: CONSUMES },
  { id: 'c-homepage-palette', source: 'repo-homepage', target: 'pkg-palette', style: CONSUMES, label: 'addCommands', labelStyle },
  { id: 'c-homepage-style', source: 'repo-homepage', target: 'pkg-style-css', style: STYLE_DEP },

  // showcase: browser tool, no frontend layer
  { id: 'c-showcase-wasm', source: 'repo-showcase', target: 'pkg-wasm', style: CONSUMES },
  { id: 'c-showcase-browser', source: 'repo-showcase', target: 'pkg-browser', style: CONSUMES },
  { id: 'c-showcase-style', source: 'repo-showcase', target: 'pkg-style-css', style: STYLE_DEP },

  // picker: terminal tool with frontend + DirProvider
  { id: 'c-picker-terminal', source: 'repo-picker', target: 'pkg-terminal', style: CONSUMES },
  { id: 'c-picker-frontend', source: 'repo-picker', target: 'pkg-palette', style: CONSUMES },
  { id: 'c-picker-provider', source: 'repo-picker', target: 'pkg-provider', style: CONSUMES, label: 'DirProvider', labelStyle },

  // future: minimal — just the engine directly
  { id: 'c-future-scorer', source: 'repo-future', target: 'pkg-scorer', style: CONSUMES, label: 'just scoring', labelStyle },
]
