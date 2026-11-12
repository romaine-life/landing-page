import type { Edge } from '@xyflow/react'

// Edge styles by relationship type
const ENGINE = { stroke: '#38bdf8', strokeWidth: 2 }        // blue: engine internals
const LAYER = { stroke: '#a78bfa', strokeWidth: 2 }         // purple: layer dependency
const FRONTEND = { stroke: '#f59e0b', strokeWidth: 1.5 }    // amber: frontend logic
const STYLE = { stroke: '#f472b6', strokeWidth: 1.5, strokeDasharray: '4 2' } // pink dashed: theme
const CONSUMES = { stroke: '#4ade80', strokeWidth: 1.5 }    // green: consumer imports

const labelStyle = { fill: '#94a3b8', fontSize: 9 }

export const fztProposedEdges: Edge[] = [
  // ── Engine internal deps ───────────────────────────────────
  {
    id: 'input-state',
    source: 'core-input',
    target: 'core-state',
    style: ENGINE,
  },
  {
    id: 'input-scorer',
    source: 'core-input',
    target: 'core-scorer',
    style: ENGINE,
  },

  // ── Rendering depends on engine ────────────────────────────
  {
    id: 'canvas-state',
    source: 'render-canvas',
    target: 'core-state',
    style: LAYER,
  },
  {
    id: 'session-input',
    source: 'render-session',
    target: 'core-input',
    style: LAYER,
    label: 'delegates key handling',
    labelStyle,
  },
  {
    id: 'session-canvas',
    source: 'render-session',
    target: 'render-canvas',
    style: ENGINE,
  },

  // ── Frontend logic depends on engine + render ──────────────
  {
    id: 'palette-state',
    source: 'frontend-palette',
    target: 'core-state',
    style: FRONTEND,
    label: 'injects : folder',
    labelStyle,
  },
  {
    id: 'identity-state',
    source: 'frontend-identity',
    target: 'core-state',
    style: FRONTEND,
    label: 'sets name/version',
    labelStyle,
  },
  {
    id: 'actions-input',
    source: 'frontend-actions',
    target: 'core-input',
    style: FRONTEND,
    label: 'action dispatch',
    labelStyle,
  },

  // ── Platform renderers consume style + render ──────────────
  {
    id: 'terminal-canvas',
    source: 'terminal',
    target: 'render-canvas',
    style: LAYER,
  },
  {
    id: 'terminal-style',
    source: 'terminal',
    target: 'theme',
    style: STYLE,
    label: 'colors',
    labelStyle,
  },
  {
    id: 'browser-canvas',
    source: 'browser',
    target: 'render-canvas',
    style: LAYER,
  },
  {
    id: 'browser-style',
    source: 'browser',
    target: 'theme',
    style: STYLE,
    label: 'CSS vars',
    labelStyle,
  },

  // ── Tools (fzt.exe and fzt.wasm) ───────────────────────────
  {
    id: 'fzt-engine',
    source: 'fzt-exe',
    target: 'core-state',
    style: CONSUMES,
    label: 'pure engine',
    labelStyle,
  },
  {
    id: 'fzt-terminal',
    source: 'fzt-exe',
    target: 'terminal',
    style: CONSUMES,
  },
  {
    id: 'wasm-session',
    source: 'fzt-wasm',
    target: 'render-session',
    style: CONSUMES,
  },

  // ── Consumers ──────────────────────────────────────────────
  // homepage: WASM + frontend + browser + style
  {
    id: 'homepage-wasm',
    source: 'c-homepage',
    target: 'fzt-wasm',
    style: CONSUMES,
  },
  {
    id: 'homepage-frontend',
    source: 'c-homepage',
    target: 'frontend-palette',
    style: FRONTEND,
    label: 'addCommands',
    labelStyle,
  },
  {
    id: 'homepage-browser',
    source: 'c-homepage',
    target: 'browser',
    style: CONSUMES,
  },

  // showcase: WASM + browser (no frontend/)
  {
    id: 'showcase-wasm',
    source: 'c-showcase',
    target: 'fzt-wasm',
    style: CONSUMES,
  },
  {
    id: 'showcase-browser',
    source: 'c-showcase',
    target: 'browser',
    style: CONSUMES,
  },

  // at: fzt CLI + frontend + terminal + style
  {
    id: 'at-fzt',
    source: 'c-at',
    target: 'fzt-exe',
    style: CONSUMES,
    label: 'subprocess',
    labelStyle,
  },
  {
    id: 'at-frontend',
    source: 'c-at',
    target: 'frontend-identity',
    style: FRONTEND,
    label: '--frontend-name',
    labelStyle,
  },

  // picker: fzt --dir + frontend + terminal
  {
    id: 'picker-fzt',
    source: 'c-picker',
    target: 'fzt-exe',
    style: CONSUMES,
    label: 'fzt --dir',
    labelStyle,
  },
  {
    id: 'picker-provider',
    source: 'c-picker',
    target: 'core-provider',
    style: CONSUMES,
    label: 'DirProvider',
    labelStyle,
  },

  // future: just fzt + terminal, nothing else
  {
    id: 'future-fzt',
    source: 'c-future',
    target: 'fzt-exe',
    style: CONSUMES,
    label: 'minimal',
    labelStyle,
  },
]
