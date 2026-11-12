import type { Node } from '@xyflow/react'

export type FztProposedNodeData = {
  label: string
  description: string
  pkg?: string
  category: 'engine' | 'rendering' | 'frontend-logic' | 'theme' | 'terminal' | 'browser' | 'tool' | 'consumer'
}

export type FztProposedNode = Node<FztProposedNodeData>

// Layout — layered left-to-right: engine → rendering → frontend logic → tools → consumers
const COL = { engine: 0, render: 350, frontend: 700, theme: 700, tools: 1100, consumers: 1500 }
const ROW = { r0: 0, r1: 120, r2: 240, r3: 360, r4: 480, r5: 600 }

export const fztProposedNodes: FztProposedNode[] = [
  // ── Engine layer (leftmost) ──────────────────────────────────
  {
    id: 'core-state',
    type: 'fzt-proposed',
    position: { x: COL.engine, y: ROW.r0 },
    data: {
      label: 'core/state',
      description: 'Tree data structure, scope push/pop, filtering, cursor, context stack',
      pkg: 'core/',
      category: 'engine',
    },
  },
  {
    id: 'core-scorer',
    type: 'fzt-proposed',
    position: { x: COL.engine, y: ROW.r1 },
    data: {
      label: 'core/scorer',
      description: 'Fuzzy matching, tiered scoring, multi-term AND logic',
      pkg: 'core/',
      category: 'engine',
    },
  },
  {
    id: 'core-input',
    type: 'fzt-proposed',
    position: { x: COL.engine, y: ROW.r2 },
    data: {
      label: 'core/input',
      description: 'Key handlers: unified, tree, search, flat. Action string dispatch.',
      pkg: 'core/',
      category: 'engine',
    },
  },
  {
    id: 'core-provider',
    type: 'fzt-proposed',
    position: { x: COL.engine, y: ROW.r3 },
    data: {
      label: 'core/provider',
      description: 'TreeProvider interface, DirProvider, YAML loader. Pluggable data sources.',
      pkg: 'core/',
      category: 'engine',
    },
  },

  // ── Rendering layer ──────────────────────────────────────────
  {
    id: 'render-canvas',
    type: 'fzt-proposed',
    position: { x: COL.render, y: ROW.r0 },
    data: {
      label: 'render/canvas',
      description: 'Canvas interface, MemScreen, ANSI serialization, structured data API',
      pkg: 'render/',
      category: 'rendering',
    },
  },
  {
    id: 'render-session',
    type: 'fzt-proposed',
    position: { x: COL.render, y: ROW.r1 },
    data: {
      label: 'render/session',
      description: 'Headless session: wraps state + screen. HandleKey, Render, Resize.',
      pkg: 'render/',
      category: 'rendering',
    },
  },

  // ── Frontend logic layer (the behavioral contract) ───────────
  {
    id: 'frontend-palette',
    type: 'fzt-proposed',
    position: { x: COL.frontend, y: ROW.r0 },
    data: {
      label: 'frontend/palette',
      description: ': command palette mechanics. Command registration, ctl title, two-level : / :: structure.',
      pkg: 'frontend/',
      category: 'frontend-logic',
    },
  },
  {
    id: 'frontend-identity',
    type: 'fzt-proposed',
    position: { x: COL.frontend, y: ROW.r1 },
    data: {
      label: 'frontend/identity',
      description: 'Frontend name, version, ctl title swap. "Who am I and how do I announce myself."',
      pkg: 'frontend/',
      category: 'frontend-logic',
    },
  },
  {
    id: 'frontend-actions',
    type: 'fzt-proposed',
    position: { x: COL.frontend, y: ROW.r2 },
    data: {
      label: 'frontend/actions',
      description: 'Action string contract. What "select:edit" or "update" means. Post-selection behavior routing.',
      pkg: 'frontend/',
      category: 'frontend-logic',
    },
  },

  // ── Theme (presentation — just config data) ──────────────────
  {
    id: 'theme',
    type: 'fzt-proposed',
    position: { x: COL.theme, y: ROW.r3 + 20 },
    data: {
      label: 'style/',
      description: 'Catppuccin palette, DOS font, CRT effects, spacing, border style. Pure data — no logic. One source, all tools.',
      pkg: 'style/',
      category: 'theme',
    },
  },

  // ── Platform renderers ───────────────────────────────────────
  {
    id: 'terminal',
    type: 'fzt-proposed',
    position: { x: COL.tools - 50, y: ROW.r3 + 20 },
    data: {
      label: 'terminal/',
      description: 'tcellCanvas, draw functions, raw TTY I/O. Consumes style/ for colors. Platform-specific rendering.',
      category: 'terminal',
    },
  },
  {
    id: 'browser',
    type: 'fzt-proposed',
    position: { x: COL.tools - 50, y: ROW.r4 + 40 },
    data: {
      label: 'browser/',
      description: 'fzt-terminal.js, fzt-dom-renderer.js, fzt-web.js, fzt-terminal.css. Consumes style/ as CSS vars.',
      category: 'browser',
    },
  },

  // ── Tools (the actual binaries / entry points) ───────────────
  {
    id: 'fzt-exe',
    type: 'fzt-proposed',
    position: { x: COL.tools, y: ROW.r0 },
    data: {
      label: 'fzt',
      description: 'Pure engine CLI. No frontend features. Tree nav, fuzzy search, YAML/stdin, selection output.',
      category: 'tool',
    },
  },
  {
    id: 'fzt-wasm',
    type: 'fzt-proposed',
    position: { x: COL.tools, y: ROW.r1 },
    data: {
      label: 'fzt.wasm',
      description: 'WASM bridge. Exposes engine to browser. No frontend logic — consumers add that.',
      category: 'tool',
    },
  },

  // ── Consumers (the actual products) ──────────────────────────
  {
    id: 'c-homepage',
    type: 'fzt-proposed',
    position: { x: COL.consumers, y: ROW.r0 },
    data: {
      label: 'my-homepage',
      description: 'Imports: engine (WASM) + frontend/ + browser/ + style/. Adds: bookmarks, edit mode, auth.',
      category: 'consumer',
    },
  },
  {
    id: 'c-showcase',
    type: 'fzt-proposed',
    position: { x: COL.consumers, y: ROW.r1 },
    data: {
      label: 'fzt-showcase',
      description: 'Imports: engine (WASM) + browser/ + style/. Demo site — no frontend/ (no commands).',
      category: 'consumer',
    },
  },
  {
    id: 'c-at',
    type: 'fzt-proposed',
    position: { x: COL.consumers, y: ROW.r2 },
    data: {
      label: 'at (automate)',
      description: 'Imports: engine (fzt) + frontend/ + terminal/ + style/. Adds: shell commands, YAML menu.',
      category: 'consumer',
    },
  },
  {
    id: 'c-picker',
    type: 'fzt-proposed',
    position: { x: COL.consumers, y: ROW.r3 },
    data: {
      label: 'fzt-picker',
      description: 'Imports: engine (fzt --dir) + frontend/ + terminal/ + style/. Adds: DirProvider, COM hook.',
      category: 'consumer',
    },
  },
  {
    id: 'c-future',
    type: 'fzt-proposed',
    position: { x: COL.consumers, y: ROW.r4 },
    data: {
      label: '??? (future tool)',
      description: 'Imports: engine (fzt) + terminal/ only. No frontend/, no style/. Minimal — just the engine.',
      category: 'consumer',
    },
  },
]
