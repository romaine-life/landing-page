import type { Edge } from '@xyflow/react'

// Edge color palette — matches the prompt icons + status glyph colors the
// live UI uses, so a user glancing at the diagram sees the same colors
// they'll see in their shell.
const SEARCH = { stroke: '#f9e2af', strokeWidth: 2 } // yellow — SearchModeFg
const NAV = { stroke: '#94e2d5', strokeWidth: 2 } // teal — NavModeFg
const EDIT = { stroke: '#cba6f7', strokeWidth: 2 } // mauve — edit / palette commands
const COMMIT = { stroke: '#a6e3a1', strokeWidth: 2 } // green — commit to exit
const CANCEL = { stroke: '#f38ba8', strokeWidth: 2, strokeDasharray: '6 3' } // red dashed — cancel / unwind

const labelStyle = { fill: '#e2e8f0', fontSize: 11, fontFamily: 'ui-monospace, monospace', fontWeight: 500 }

export const fztKeyboardEdges: Edge[] = [
  // ── search ↔ normal ──────────────────────────────────────────
  { id: 'search-to-normal-arrow', source: 'search-mode', target: 'normal-mode', label: '\u2190\u2191\u2193\u2192 / `', style: NAV, labelStyle },
  { id: 'normal-to-search-slash', source: 'normal-mode', target: 'search-mode', label: '/ (preserve query)', style: NAV, labelStyle },
  { id: 'normal-to-search-bs', source: 'normal-mode', target: 'search-mode', label: 'Backspace (chop + return)', style: SEARCH, labelStyle },

  // ── primary → edit modes (palette commands) ─────────────────
  { id: 'search-to-rename', source: 'search-mode', target: 'rename', label: ':rename', style: EDIT, labelStyle },
  { id: 'search-to-add-after', source: 'search-mode', target: 'add-after', label: ':add-after', style: EDIT, labelStyle },
  { id: 'search-to-add-folder', source: 'search-mode', target: 'add-folder', label: ':add-folder', style: EDIT, labelStyle },
  { id: 'search-to-inspect', source: 'search-mode', target: 'inspect', label: ':inspect', style: EDIT, labelStyle },
  { id: 'search-to-delete', source: 'search-mode', target: 'delete', label: ':delete', style: EDIT, labelStyle },

  // ── add-* chain into rename (auto-entered after placement) ──
  { id: 'add-after-to-rename', source: 'add-after', target: 'rename', label: 'Shift+Enter \u2192 auto-rename', style: EDIT, labelStyle },
  { id: 'add-folder-to-rename', source: 'add-folder', target: 'rename', label: 'Shift+Enter \u2192 auto-rename', style: EDIT, labelStyle },

  // ── edit → primary (confirm / cancel) ───────────────────────
  { id: 'rename-confirm', source: 'rename', target: 'search-mode', label: 'Enter (confirm)', style: COMMIT, labelStyle },
  { id: 'rename-cancel', source: 'rename', target: 'exit-cancel', label: 'Escape', style: CANCEL, labelStyle },
  { id: 'inspect-confirm', source: 'inspect', target: 'search-mode', label: 'Shift+Enter', style: COMMIT, labelStyle },
  { id: 'delete-confirm', source: 'delete', target: 'search-mode', label: 'Shift+Enter', style: COMMIT, labelStyle },

  // ── primary → select sink ───────────────────────────────────
  { id: 'search-to-select', source: 'search-mode', target: 'exit-select', label: 'Enter (leaf) / Shift+Enter', style: COMMIT, labelStyle },
  { id: 'normal-to-select', source: 'normal-mode', target: 'exit-select', label: 'Enter / Shift+Enter', style: COMMIT, labelStyle },

  // ── primary → cancel sink ───────────────────────────────────
  { id: 'search-to-cancel', source: 'search-mode', target: 'exit-cancel', label: 'Escape cascade', style: CANCEL, labelStyle },
  { id: 'normal-to-cancel', source: 'normal-mode', target: 'exit-cancel', label: 'Escape cascade', style: CANCEL, labelStyle },
]
