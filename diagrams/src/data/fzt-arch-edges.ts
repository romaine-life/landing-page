import type { Edge } from '@xyflow/react'

// Edge styles by relationship type
const IMPORTS = { stroke: '#38bdf8', strokeWidth: 2 }       // blue: Go import
const BUILDS = { stroke: '#a78bfa', strokeWidth: 2 }        // purple: compiles to
const USES = { stroke: '#f59e0b', strokeWidth: 1.5 }        // amber: JS/runtime usage
const CONSUMES = { stroke: '#4ade80', strokeWidth: 1.5 }    // green: external consumer

export const fztArchEdges: Edge[] = [
  // ── Go import dependencies ─────────────────────────────────
  // render/ imports core/
  {
    id: 'render-core',
    source: 'render',
    target: 'core',
    style: IMPORTS,
    label: 'imports',
    labelStyle: { fill: '#94a3b8', fontSize: 9 },
  },
  // internal/tui/ imports core/ + render/
  {
    id: 'tui-core',
    source: 'tui',
    target: 'core',
    style: IMPORTS,
  },
  {
    id: 'tui-render',
    source: 'tui',
    target: 'render',
    style: IMPORTS,
    label: 'imports',
    labelStyle: { fill: '#94a3b8', fontSize: 9 },
  },

  // ── Binaries ───────────────────────────────────────────────
  // fzt CLI imports all three
  {
    id: 'cli-tui',
    source: 'cmd-cli',
    target: 'tui',
    style: BUILDS,
    label: 'imports',
    labelStyle: { fill: '#94a3b8', fontSize: 9 },
  },
  // fzt.wasm imports render/ + tui (for draw callbacks)
  {
    id: 'wasm-render',
    source: 'cmd-wasm',
    target: 'render',
    style: BUILDS,
  },
  {
    id: 'wasm-tui',
    source: 'cmd-wasm',
    target: 'tui',
    style: BUILDS,
    label: 'draw callbacks',
    labelStyle: { fill: '#94a3b8', fontSize: 9 },
  },

  // ── Web assets use WASM ────────────────────────────────────
  {
    id: 'terminal-wasm',
    source: 'web-terminal',
    target: 'cmd-wasm',
    style: USES,
    label: 'loads WASM',
    labelStyle: { fill: '#94a3b8', fontSize: 9 },
  },
  {
    id: 'dom-wasm',
    source: 'web-dom',
    target: 'cmd-wasm',
    style: USES,
    label: 'structured API',
    labelStyle: { fill: '#94a3b8', fontSize: 9 },
  },
  {
    id: 'defaults-terminal',
    source: 'web-defaults',
    target: 'web-terminal',
    style: USES,
    label: 'wraps',
    labelStyle: { fill: '#94a3b8', fontSize: 9 },
  },

  // ── External consumers ─────────────────────────────────────
  {
    id: 'homepage-wasm',
    source: 'homepage',
    target: 'web-terminal',
    style: CONSUMES,
    label: 'WASM + ANSI',
    labelStyle: { fill: '#94a3b8', fontSize: 9 },
  },
  {
    id: 'showcase-wasm',
    source: 'showcase',
    target: 'web-terminal',
    style: CONSUMES,
  },
  {
    id: 'at-cli',
    source: 'at',
    target: 'cmd-cli',
    style: CONSUMES,
    label: 'subprocess',
    labelStyle: { fill: '#94a3b8', fontSize: 9 },
  },
  {
    id: 'fzt-picker-cli',
    source: 'fzt-picker',
    target: 'cmd-cli',
    style: CONSUMES,
    label: 'fzt --dir',
    labelStyle: { fill: '#94a3b8', fontSize: 9 },
  },
]
