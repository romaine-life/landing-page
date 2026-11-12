// Each tool's configuration across the shared layer stack.
// Same rows, different selections per tool.

export type LayerItem = {
  label: string
  description: string
}

export type ToolConfig = {
  name: string
  repo: string
  description: string
  providers: LayerItem[]
  style: LayerItem[]
  frontend: LayerItem[]
  renderers: LayerItem[]
  engine: LayerItem[] // always the same, shown for completeness
}

const ENGINE_UNIVERSAL: LayerItem[] = [
  { label: 'scorer', description: 'FuzzyMatch, tiered scoring' },
  { label: 'tree + interaction', description: 'Scope, filtering, cursor, key handlers' },
]

const STYLE_TERMINAL: LayerItem[] = [
  { label: 'Catppuccin palette', description: '16 semantic colors (Go constants)' },
  { label: 'DOS font + nerd icons', description: 'Perfect DOS VGA 437' },
]

const STYLE_BROWSER: LayerItem[] = [
  { label: 'Catppuccin palette', description: '16 semantic colors (CSS vars)' },
  { label: 'DOS font + nerd icons', description: 'Perfect DOS VGA 437' },
  { label: 'CRT effects', description: 'Scanlines, vignette, corners, cursor blink' },
]

const FRONTEND_FULL: LayerItem[] = [
  { label: ': command palette', description: 'Two-level : / :: structure' },
  { label: 'identity', description: 'Name, version, ctl title swap' },
  { label: 'action routing', description: 'Post-selection dispatch' },
]

export const toolConfigs: ToolConfig[] = [
  {
    name: 'fzt-automate',
    repo: 'romaine-life/fzt-automate',
    description: 'Shell automation. YAML menu → fzt engine → shell function execution.',
    providers: [{ label: 'YAML loader', description: 'Static menu from at-menu/root.yaml' }],
    style: STYLE_TERMINAL,
    frontend: FRONTEND_FULL,
    renderers: [{ label: 'terminal', description: 'tcellCanvas, draw functions, TTY I/O' }],
    engine: ENGINE_UNIVERSAL,
  },
  {
    name: 'fzt-picker',
    repo: 'romaine-life/fzt-picker',
    description: 'File dialog replacement. Rust COM hook, lazy directory browsing.',
    providers: [{ label: 'DirProvider', description: 'Lazy filesystem loading per scope push' }],
    style: STYLE_TERMINAL,
    frontend: FRONTEND_FULL,
    renderers: [{ label: 'terminal', description: 'tcellCanvas, draw functions, TTY I/O' }],
    engine: ENGINE_UNIVERSAL,
  },
  {
    name: 'my-homepage',
    repo: 'romaine-life/my-homepage',
    description: 'Bookmark manager. WASM engine, edit mode, cookie auth.',
    providers: [{ label: 'YAML loader', description: 'Bookmarks from API → YAML → fzt' }],
    style: STYLE_BROWSER,
    frontend: FRONTEND_FULL,
    renderers: [
      { label: 'browser renderer', description: 'fzt-terminal.js / DOM renderer' },
      { label: 'fzt.wasm', description: 'WASM bridge to engine' },
    ],
    engine: ENGINE_UNIVERSAL,
  },
  {
    name: 'fzt-showcase',
    repo: 'romaine-life/fzt-showcase',
    description: 'Interactive demo site for fzt.',
    providers: [{ label: 'YAML loader', description: 'Sample bookmarks from static YAML' }],
    style: STYLE_BROWSER,
    frontend: FRONTEND_FULL,
    renderers: [
      { label: 'browser renderer', description: 'fzt-terminal.js / DOM renderer' },
      { label: 'fzt.wasm', description: 'WASM bridge to engine' },
    ],
    engine: ENGINE_UNIVERSAL,
  },
]
