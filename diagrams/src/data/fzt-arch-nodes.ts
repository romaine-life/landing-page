import type { Node } from '@xyflow/react'

export type FztArchNodeData = {
  label: string
  description: string
  pkg?: string // Go import path
  category: 'package' | 'binary' | 'asset' | 'external'
}

export type FztArchNode = Node<FztArchNodeData>

// Layout columns and rows
const COL = { core: 0, render: 400, tui: 800, cmd: 1200, web: 400, ext: 800 }
const ROW = { top: 0, mid: 160, bot: 320, ext: 480 }

const pkgStyle = { width: 280, height: 80 }

export const fztArchNodes: FztArchNode[] = [
  // ── core/ ────────────────────────────────────────────────────
  {
    id: 'core',
    type: 'fzt-arch',
    position: { x: COL.core, y: ROW.top },
    ...pkgStyle,
    data: {
      label: 'core/',
      description: 'State management, scoring, tree logic, style constants, TreeProvider interface, key handlers, DirProvider',
      pkg: 'github.com/romaine-life/fzt/core',
      category: 'package',
    },
  },

  // ── render/ ──────────────────────────────────────────────────
  {
    id: 'render',
    type: 'fzt-arch',
    position: { x: COL.render, y: ROW.top },
    ...pkgStyle,
    data: {
      label: 'render/',
      description: 'Canvas interface, MemScreen, ANSI serialization, Session (headless), structured data API',
      pkg: 'github.com/romaine-life/fzt/render',
      category: 'package',
    },
  },

  // ── internal/tui/ ────────────────────────────────────────────
  {
    id: 'tui',
    type: 'fzt-arch',
    position: { x: COL.tui, y: ROW.top },
    ...pkgStyle,
    data: {
      label: 'internal/tui/',
      description: 'Terminal frontend: tcellCanvas, draw functions, Run/RunInline, raw terminal I/O',
      pkg: 'github.com/romaine-life/fzt/internal/tui',
      category: 'package',
    },
  },

  // ── cmd/ binaries ────────────────────────────────────────────
  {
    id: 'cmd-cli',
    type: 'fzt-arch',
    position: { x: COL.cmd, y: ROW.top - 40 },
    data: {
      label: 'fzt (CLI)',
      description: 'Main binary: flag parsing, stdin piping, YAML loading. Universal — no domain-specific features.',
      category: 'binary',
    },
  },
  {
    id: 'cmd-wasm',
    type: 'fzt-arch',
    position: { x: COL.cmd, y: ROW.top + 60 },
    data: {
      label: 'fzt.wasm',
      description: 'WASM bridge: exposes init, handleKey, clickRow, resize, addCommands, setFrontend, structured data getters',
      category: 'binary',
    },
  },

  // ── web/ assets ──────────────────────────────────────────────
  {
    id: 'web-terminal',
    type: 'fzt-arch',
    position: { x: COL.web - 100, y: ROW.mid + 20 },
    data: {
      label: 'fzt-terminal.js',
      description: 'ANSI parser, grid renderer, WASM bridge, keyboard forwarding, ResizeObserver',
      category: 'asset',
    },
  },
  {
    id: 'web-dom',
    type: 'fzt-arch',
    position: { x: COL.web + 200, y: ROW.mid + 20 },
    data: {
      label: 'fzt-dom-renderer.js',
      description: 'Native DOM renderer from structured data API (replaces ANSI parsing pipeline)',
      category: 'asset',
    },
  },
  {
    id: 'web-css',
    type: 'fzt-arch',
    position: { x: COL.web + 50, y: ROW.mid + 120 },
    data: {
      label: 'fzt-terminal.css',
      description: 'CRT effects, Catppuccin palette, DOS font, cursor blink — shared visual identity',
      category: 'asset',
    },
  },
  {
    id: 'web-defaults',
    type: 'fzt-arch',
    position: { x: COL.web - 100, y: ROW.mid + 120 },
    data: {
      label: 'fzt-web.js',
      description: 'Defaults wrapper: Catppuccin palette, DOS font stack, convenience constructor',
      category: 'asset',
    },
  },

  // ── External frontends ───────────────────────────────────────
  {
    id: 'homepage',
    type: 'fzt-arch',
    position: { x: COL.ext - 200, y: ROW.ext },
    data: {
      label: 'my-homepage',
      description: 'Bookmark manager. Uses WASM + fzt-terminal.js. Registers commands via addCommands().',
      category: 'external',
    },
  },
  {
    id: 'showcase',
    type: 'fzt-arch',
    position: { x: COL.ext + 100, y: ROW.ext },
    data: {
      label: 'fzt-showcase',
      description: 'Interactive demo site. Uses WASM + fzt-terminal.js.',
      category: 'external',
    },
  },
  {
    id: 'at',
    type: 'fzt-arch',
    position: { x: COL.ext + 400, y: ROW.ext },
    data: {
      label: 'at (automate)',
      description: 'Shell automation. Pipes YAML into fzt CLI with --frontend-name=at.',
      category: 'external',
    },
  },
  {
    id: 'fzt-picker',
    type: 'fzt-arch',
    position: { x: COL.ext + 700, y: ROW.ext },
    data: {
      label: 'fzt-picker',
      description: 'Windows file dialog replacement. Rust COM hook spawns fzt --dir.',
      category: 'external',
    },
  },
]
