import type { Node } from '@xyflow/react'

export type FztSharedNodeData = {
  label: string
  description: string
  repo?: string
  category: 'tool' | 'renderer' | 'frontend' | 'style' | 'engine'
  dimmed?: boolean
}

export type FztSharedNode = Node<FztSharedNodeData>

// Horizontal layers — tools on top, engine on bottom
// Each layer spans full width, nodes spread horizontally within their layer
const W = 280
const GAP = 20
const col = (n: number) => n * (W + GAP)

const LAYER = {
  tools: 0,
  renderers: 150,
  frontend: 300,
  style: 450,
  engine: 600,
}

export const fztSharedNodes: FztSharedNode[] = [
  // ── Layer 5: Tools ───────────────────────────────────────────
  { id: 'tool-automate', type: 'fzt-shared', position: { x: col(0), y: LAYER.tools },
    data: { label: 'fzt-automate', description: 'Shell automation', repo: 'romaine-life/fzt-automate', category: 'tool' } },
  { id: 'tool-picker', type: 'fzt-shared', position: { x: col(1), y: LAYER.tools },
    data: { label: 'fzt-picker', description: 'File dialog replacement', repo: 'romaine-life/fzt-picker', category: 'tool' } },
  { id: 'tool-homepage', type: 'fzt-shared', position: { x: col(2), y: LAYER.tools },
    data: { label: 'my-homepage', description: 'Bookmark manager', repo: 'romaine-life/my-homepage', category: 'tool' } },
  { id: 'tool-showcase', type: 'fzt-shared', position: { x: col(3), y: LAYER.tools },
    data: { label: 'fzt-showcase', description: 'Interactive demo', repo: 'romaine-life/fzt-showcase', category: 'tool' } },

  // ── Layer 4: Renderers ───────────────────────────────────────
  { id: 'render-terminal', type: 'fzt-shared', position: { x: col(0) + W/2 - W/2, y: LAYER.renderers },
    data: { label: 'terminal renderer', description: 'tcellCanvas, draw functions, TTY I/O', repo: 'romaine-life/fzt', category: 'renderer' } },
  { id: 'render-browser', type: 'fzt-shared', position: { x: col(2), y: LAYER.renderers },
    data: { label: 'browser renderer + WASM', description: 'fzt-terminal.js, DOM renderer, fzt.wasm bridge', repo: 'romaine-life/fzt', category: 'renderer' } },

  // ── Layer 3: Frontend logic ──────────────────────────────────
  { id: 'fe-palette', type: 'fzt-shared', position: { x: col(0), y: LAYER.frontend },
    data: { label: ': command palette', description: 'Two-level : / :: structure, command registration', repo: 'romaine-life/fzt-frontend', category: 'frontend' } },
  { id: 'fe-identity', type: 'fzt-shared', position: { x: col(1) + 40, y: LAYER.frontend },
    data: { label: 'identity', description: 'Name, version, ctl title swap', repo: 'romaine-life/fzt-frontend', category: 'frontend' } },
  { id: 'fe-actions', type: 'fzt-shared', position: { x: col(2) + 80, y: LAYER.frontend },
    data: { label: 'action routing', description: 'Action string contract, post-selection dispatch', repo: 'romaine-life/fzt-frontend', category: 'frontend' } },

  // ── Layer 2: Style ───────────────────────────────────────────
  { id: 'style-colors', type: 'fzt-shared', position: { x: col(0), y: LAYER.style },
    data: { label: 'Catppuccin palette', description: '16 semantic colors, Go + CSS', repo: 'nelsong6/fzt-style', category: 'style' } },
  { id: 'style-font', type: 'fzt-shared', position: { x: col(1) + 40, y: LAYER.style },
    data: { label: 'DOS font + nerd icons', description: 'Perfect DOS VGA 437, Symbols Nerd Font', repo: 'nelsong6/fzt-style', category: 'style' } },
  { id: 'style-crt', type: 'fzt-shared', position: { x: col(2) + 80, y: LAYER.style },
    data: { label: 'CRT effects', description: 'Scanlines, vignette, corners, cursor blink', repo: 'nelsong6/fzt-style', category: 'style' } },

  // ── Layer 1: Engine ──────────────────────────────────────────
  { id: 'engine-scorer', type: 'fzt-shared', position: { x: col(0), y: LAYER.engine },
    data: { label: 'scorer', description: 'FuzzyMatch, tiered scoring — the atom', repo: 'romaine-life/fzt', category: 'engine' } },
  { id: 'engine-tree', type: 'fzt-shared', position: { x: col(1) + 40, y: LAYER.engine },
    data: { label: 'tree + interaction', description: 'Scope, filtering, cursor, key handlers', repo: 'romaine-life/fzt', category: 'engine' } },
  { id: 'engine-providers', type: 'fzt-shared', position: { x: col(2) + 80, y: LAYER.engine },
    data: { label: 'providers', description: 'YAML loader, DirProvider, TreeProvider interface', repo: 'romaine-life/fzt', category: 'engine' } },
]
