import type { Node } from '@xyflow/react'

export type FztKeyboardNodeData = {
  label: string
  glyph?: string // nerd-font or unicode icon shown next to label
  description: string
  category: 'primary-search' | 'primary-nav' | 'edit' | 'exit-select' | 'exit-cancel'
}

export type FztKeyboardNode = Node<FztKeyboardNodeData>

// Layout — three columns. Left: exit sinks. Middle: primary modes. Right: edit modes.
const COL = { exit: 0, primary: 400, edit: 820 }
const ROW = {
  exitSelect: 200,
  exitCancel: 460,
  search: 180,
  normal: 480,
  rename: 40,
  addAfter: 180,
  addFolder: 300,
  inspect: 420,
  delete: 540,
}

export const fztKeyboardNodes: FztKeyboardNode[] = [
  // ── Primary modes ─────────────────────────────────────────────
  {
    id: 'search-mode',
    type: 'fzt-keyboard',
    position: { x: COL.primary, y: ROW.search },
    data: {
      label: 'Search mode',
      glyph: '\uF002', // nerd-font magnifying glass
      description:
        'Default state. Typing fills the query, Shift is Shift (capitals + symbols literal), arrows or ` enter normal mode. Enter selects top match; Shift+Enter universally confirms the cursor\u2019s item. Escape cascades unwind.',
      category: 'primary-search',
    },
  },
  {
    id: 'normal-mode',
    type: 'fzt-keyboard',
    position: { x: COL.primary, y: ROW.normal },
    data: {
      label: 'Normal mode',
      glyph: '\uF0A9', // nerd-font right arrow
      description:
        'Cursor visible on tree. Letters are silent except lowercase hjkl (nav). `/` returns to search preserving query; Backspace returns to search chopping one char. Query is preserved on entry.',
      category: 'primary-nav',
    },
  },

  // ── Edit / action modes ───────────────────────────────────────
  {
    id: 'rename',
    type: 'fzt-keyboard',
    position: { x: COL.edit, y: ROW.rename },
    data: {
      label: 'rename / property-edit',
      description:
        'Every printable key goes to EditBuffer. Enter confirms, Escape cancels. Entered automatically after add-after / add-folder placement, or explicitly on a property row.',
      category: 'edit',
    },
  },
  {
    id: 'add-after',
    type: 'fzt-keyboard',
    position: { x: COL.edit, y: ROW.addAfter },
    data: {
      label: 'add-after',
      description:
        'Palette command. Navigate to the item you want the new entry after; Shift+Enter places it and enters rename on the new row.',
      category: 'edit',
    },
  },
  {
    id: 'add-folder',
    type: 'fzt-keyboard',
    position: { x: COL.edit, y: ROW.addFolder },
    data: {
      label: 'add-folder',
      description:
        'Palette command. Navigate to the insertion point; Shift+Enter creates a folder + first child and enters rename on the folder.',
      category: 'edit',
    },
  },
  {
    id: 'inspect',
    type: 'fzt-keyboard',
    position: { x: COL.edit, y: ROW.inspect },
    data: {
      label: 'inspect',
      description:
        'Palette command. Navigate to target; Shift+Enter reveals editable property rows (name / description / url / action) under it. Selecting a property row enters rename on its value.',
      category: 'edit',
    },
  },
  {
    id: 'delete',
    type: 'fzt-keyboard',
    position: { x: COL.edit, y: ROW.delete },
    data: {
      label: 'delete',
      description:
        'Palette command. Navigate to target; Shift+Enter deletes it (unless it\u2019s in the active scope chain). Dirty flag set for :save.',
      category: 'edit',
    },
  },

  // ── Exit sinks ────────────────────────────────────────────────
  {
    id: 'exit-select',
    type: 'fzt-keyboard',
    position: { x: COL.exit, y: ROW.exitSelect },
    data: {
      label: 'select / commit',
      description:
        'Leaf selected — output emitted to stdout, picker returns. From search: Enter on a leaf, or Enter on top match. From normal: Enter on cursor. Shift+Enter anywhere commits the cursor\u2019s item without scope-pushing folders.',
      category: 'exit-select',
    },
  },
  {
    id: 'exit-cancel',
    type: 'fzt-keyboard',
    position: { x: COL.exit, y: ROW.exitCancel },
    data: {
      label: 'cancel',
      description:
        'Escape cascade: (1) cancel active edit mode, (2) clear non-empty query, (3) pop scope, (4) pop context, (5) at root with nothing left → State.Cancelled=true, picker exits.',
      category: 'exit-cancel',
    },
  },
]
