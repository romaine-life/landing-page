import type { Node } from '@xyflow/react'

export type FztReposNodeData = {
  label: string
  description: string
  repo?: string
  category: 'repo-boundary' | 'package' | 'binary' | 'asset'
  dimmed?: boolean
}

export type FztReposNode = Node<FztReposNodeData>

// Layout — repos as vertical lanes, left to right by dependency depth
const REPO = { fzt: 0, style: 350, frontend: 650, renderers: 1000, tools: 1400 }
const ROW = { label: -40, r0: 40, r1: 160, r2: 280, r3: 400, r4: 520, r5: 640 }

export const fztReposNodes: FztReposNode[] = [
  // ── Repo: romaine-life/fzt ───────────────────────────────────────
  // The engine. Scorer + tree + interaction + providers + rendering infra.
  {
    id: 'repo-fzt',
    type: 'fzt-repos',
    position: { x: REPO.fzt - 20, y: ROW.label },
    data: {
      label: 'romaine-life/fzt',
      description: 'The engine. Scorer, tree structure, interaction, providers, rendering infra. No binary — you import it.',
      repo: 'romaine-life/fzt',
      category: 'repo-boundary',
    },
  },
  {
    id: 'pkg-scorer',
    type: 'fzt-repos',
    position: { x: REPO.fzt, y: ROW.r0 },
    data: {
      label: 'scorer',
      description: 'FuzzyMatch, tiered scoring. The atom — input + query → ranked results.',
      category: 'package',
    },
  },
  {
    id: 'pkg-tree',
    type: 'fzt-repos',
    position: { x: REPO.fzt, y: ROW.r1 },
    data: {
      label: 'tree',
      description: 'Tree structure, scope push/pop, filtering, cursor, context stack',
      category: 'package',
    },
  },
  {
    id: 'pkg-input',
    type: 'fzt-repos',
    position: { x: REPO.fzt, y: ROW.r2 },
    data: {
      label: 'input',
      description: 'Key handlers: unified, tree, search, flat. Action string dispatch.',
      category: 'package',
    },
  },
  {
    id: 'pkg-provider',
    type: 'fzt-repos',
    position: { x: REPO.fzt, y: ROW.r3 },
    data: {
      label: 'providers',
      description: 'TreeProvider interface, DirProvider, YAML loader. Pluggable data sources.',
      category: 'package',
    },
  },
  {
    id: 'pkg-render',
    type: 'fzt-repos',
    position: { x: REPO.fzt, y: ROW.r4 },
    data: {
      label: 'render',
      description: 'Canvas, MemScreen, Session, ANSI serialization, structured data API',
      category: 'package',
    },
  },

  // ── Repo: nelsong6/fzt-style ─────────────────────────────────
  {
    id: 'repo-style',
    type: 'fzt-repos',
    position: { x: REPO.style - 20, y: ROW.label },
    data: {
      label: 'nelsong6/fzt-style',
      description: 'Visual identity: Catppuccin palette, DOS font, CRT effects. Go constants + CSS vars. One source, all tools.',
      repo: 'nelsong6/fzt-style',
      category: 'repo-boundary',
    },
  },
  {
    id: 'pkg-style-go',
    type: 'fzt-repos',
    position: { x: REPO.style, y: ROW.r0 },
    data: {
      label: 'style (Go)',
      description: 'Semantic color constants, font names, spacing values',
      category: 'package',
    },
  },
  {
    id: 'pkg-style-css',
    type: 'fzt-repos',
    position: { x: REPO.style, y: ROW.r1 },
    data: {
      label: 'style (CSS/JS)',
      description: 'fzt-terminal.css, palette defaults, CSS custom properties',
      category: 'asset',
    },
  },

  // ── Repo: romaine-life/fzt-frontend ──────────────────────────────
  {
    id: 'repo-frontend',
    type: 'fzt-repos',
    position: { x: REPO.frontend - 20, y: ROW.label },
    data: {
      label: 'romaine-life/fzt-frontend',
      description: 'Shared frontend behavior: command palette, identity, action routing. The contract your tools implement.',
      repo: 'romaine-life/fzt-frontend',
      category: 'repo-boundary',
    },
  },
  {
    id: 'pkg-palette',
    type: 'fzt-repos',
    position: { x: REPO.frontend, y: ROW.r0 },
    data: {
      label: 'palette',
      description: ': command mechanics, two-level : / ::, command registration',
      category: 'package',
    },
  },
  {
    id: 'pkg-identity',
    type: 'fzt-repos',
    position: { x: REPO.frontend, y: ROW.r1 },
    data: {
      label: 'identity',
      description: 'Frontend name, version, ctl title swap',
      category: 'package',
    },
  },
  {
    id: 'pkg-actions',
    type: 'fzt-repos',
    position: { x: REPO.frontend, y: ROW.r2 },
    data: {
      label: 'actions',
      description: 'Action string contract, post-selection routing',
      category: 'package',
    },
  },

  // ── Renderers (shared, could be in fzt or own repo) ──────────
  {
    id: 'repo-renderers',
    type: 'fzt-repos',
    position: { x: REPO.renderers - 20, y: ROW.label },
    data: {
      label: 'renderers',
      description: 'Platform-specific rendering. Consumed by tools that need to display the engine.',
      category: 'repo-boundary',
    },
  },
  {
    id: 'pkg-terminal',
    type: 'fzt-repos',
    position: { x: REPO.renderers, y: ROW.r0 },
    data: {
      label: 'terminal',
      description: 'tcellCanvas, draw functions, raw TTY I/O. Consumes fzt-style (Go).',
      category: 'package',
    },
  },
  {
    id: 'pkg-browser',
    type: 'fzt-repos',
    position: { x: REPO.renderers, y: ROW.r1 },
    data: {
      label: 'browser',
      description: 'fzt-terminal.js, fzt-dom-renderer.js, fzt-web.js. Consumes fzt-style (CSS).',
      category: 'asset',
    },
  },
  {
    id: 'pkg-wasm',
    type: 'fzt-repos',
    position: { x: REPO.renderers, y: ROW.r2 },
    data: {
      label: 'fzt.wasm',
      description: 'WASM bridge: exposes engine to browser. Headless — no frontend logic.',
      category: 'binary',
    },
  },

  // ── Tools (each is its own repo / binary) ────────────────────
  {
    id: 'repo-at',
    type: 'fzt-repos',
    position: { x: REPO.tools, y: ROW.r0 },
    data: {
      label: 'at (automate)',
      description: 'Shell automation. YAML menu → fzt engine → shell function execution. Terminal renderer.',
      repo: 'nelsong6/shell-config',
      category: 'repo-boundary',
    },
  },
  {
    id: 'repo-homepage',
    type: 'fzt-repos',
    position: { x: REPO.tools, y: ROW.r1 },
    data: {
      label: 'my-homepage',
      description: 'Bookmark manager. WASM engine → browser renderer. Registers commands via addCommands().',
      repo: 'romaine-life/my-homepage',
      category: 'repo-boundary',
    },
  },
  {
    id: 'repo-showcase',
    type: 'fzt-repos',
    position: { x: REPO.tools, y: ROW.r2 },
    data: {
      label: 'fzt-showcase',
      description: 'Interactive demo. WASM engine → browser renderer. No frontend layer (no commands).',
      repo: 'romaine-life/fzt-showcase',
      category: 'repo-boundary',
    },
  },
  {
    id: 'repo-picker',
    type: 'fzt-repos',
    position: { x: REPO.tools, y: ROW.r3 },
    data: {
      label: 'fzt-picker',
      description: 'File dialog replacement. DirProvider → fzt engine → terminal renderer. Rust COM hook.',
      repo: 'romaine-life/fzt-picker',
      category: 'repo-boundary',
    },
  },
  {
    id: 'repo-future',
    type: 'fzt-repos',
    position: { x: REPO.tools, y: ROW.r4 },
    data: {
      label: '??? (future)',
      description: 'Any new tool. Imports fzt + whichever layers it needs. Minimal or full.',
      category: 'repo-boundary',
    },
  },
]
