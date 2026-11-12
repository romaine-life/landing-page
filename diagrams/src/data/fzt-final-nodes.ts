import type { Node } from '@xyflow/react'

export type FztFinalNodeData = {
  label: string
  description: string
  repo?: string
  category: 'engine' | 'ecosystem' | 'tool' | 'binary'
  dimmed?: boolean
}

export type FztFinalNode = Node<FztFinalNodeData>

// Three columns: engine (left), ecosystem (center), tools (right)
const COL = { engine: 0, eco: 380, tools: 800 }
const ROW = { r0: 0, r1: 120, r2: 240, r3: 360, r4: 480 }

export const fztFinalNodes: FztFinalNode[] = [
  // ── romaine-life/fzt — the engine ────────────────────────────────
  {
    id: 'repo-fzt',
    type: 'fzt-final',
    position: { x: COL.engine - 10, y: ROW.r0 - 50 },
    data: {
      label: 'romaine-life/fzt',
      description: 'Pure engine. No rendering, no style, no frontend. Library + scorer CLI.',
      repo: 'romaine-life/fzt',
      category: 'engine',
    },
  },
  {
    id: 'pkg-scorer',
    type: 'fzt-final',
    position: { x: COL.engine, y: ROW.r0 },
    data: { label: 'scorer', description: 'FuzzyMatch, tiered scoring — the atom', category: 'engine' },
  },
  {
    id: 'pkg-tree',
    type: 'fzt-final',
    position: { x: COL.engine, y: ROW.r1 },
    data: { label: 'tree + input', description: 'Scope, filtering, cursor, key handlers', category: 'engine' },
  },
  {
    id: 'pkg-providers',
    type: 'fzt-final',
    position: { x: COL.engine, y: ROW.r2 },
    data: { label: 'providers', description: 'YAML loader, DirProvider, TreeProvider interface', category: 'engine' },
  },
  {
    id: 'bin-fzt',
    type: 'fzt-final',
    position: { x: COL.engine, y: ROW.r3 },
    data: { label: 'fzt.exe', description: 'echo lines | fzt "query" → ranked output. No TUI.', category: 'binary' },
  },

  // ── romaine-life/fzt-terminal — Nelson's ecosystem ───────────────
  {
    id: 'repo-eco',
    type: 'fzt-final',
    position: { x: COL.eco - 10, y: ROW.r0 - 50 },
    data: {
      label: 'romaine-life/fzt-terminal',
      description: 'Your ecosystem. Renderers, style, frontend behavior, web assets. Imports fzt.',
      repo: 'romaine-life/fzt-terminal',
      category: 'ecosystem',
    },
  },
  {
    id: 'pkg-term-render',
    type: 'fzt-final',
    position: { x: COL.eco, y: ROW.r0 },
    data: { label: 'terminal renderer', description: 'tcellCanvas, draw functions, TTY I/O + Go style constants', category: 'ecosystem' },
  },
  {
    id: 'pkg-browser-render',
    type: 'fzt-final',
    position: { x: COL.eco, y: ROW.r1 },
    data: { label: 'browser renderer', description: 'fzt-terminal.js, DOM renderer, fzt.wasm + CSS/JS style', category: 'ecosystem' },
  },
  {
    id: 'pkg-frontend',
    type: 'fzt-final',
    position: { x: COL.eco, y: ROW.r2 },
    data: { label: 'frontend behavior', description: ': command palette, identity, action routing', category: 'ecosystem' },
  },

  // ── Tools — each their own repo ──────────────────────────────
  {
    id: 'tool-automate',
    type: 'fzt-final',
    position: { x: COL.tools, y: ROW.r0 },
    data: { label: 'fzt-automate', description: 'Shell automation. YAML menu → pick → execute.', repo: 'romaine-life/fzt-automate', category: 'tool' },
  },
  {
    id: 'tool-picker',
    type: 'fzt-final',
    position: { x: COL.tools, y: ROW.r1 },
    data: { label: 'fzt-picker', description: 'File dialog replacement. DirProvider + Rust COM hook.', repo: 'romaine-life/fzt-picker', category: 'tool' },
  },
  {
    id: 'tool-homepage',
    type: 'fzt-final',
    position: { x: COL.tools, y: ROW.r2 },
    data: { label: 'my-homepage', description: 'Bookmark manager. WASM + browser renderer.', repo: 'romaine-life/my-homepage', category: 'tool' },
  },
  {
    id: 'tool-showcase',
    type: 'fzt-final',
    position: { x: COL.tools, y: ROW.r3 },
    data: { label: 'fzt-showcase', description: 'Interactive demo. WASM + browser renderer.', repo: 'romaine-life/fzt-showcase', category: 'tool' },
  },
]
