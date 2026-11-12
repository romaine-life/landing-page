import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { FztKeyboardNodeData } from '../data/fzt-keyboard-nodes'

// Colors match the live fzt prompt-icon palette where applicable:
//   primary-search  → yellow  (SearchModeFg = #f9e2af)
//   primary-nav     → teal    (NavModeFg   = #94e2d5)
// Edit modes use mauve (Catppuccin palette palette[13]) to visually
// distinguish palette-driven state from default modes.
const COLORS: Record<
  FztKeyboardNodeData['category'],
  { border: string; bg: string; text: string; glyphColor?: string }
> = {
  'primary-search': {
    border: '#f9e2af',
    bg: '#2a2410',
    text: '#f9e2af',
    glyphColor: '#f9e2af',
  },
  'primary-nav': {
    border: '#94e2d5',
    bg: '#0f2524',
    text: '#94e2d5',
    glyphColor: '#94e2d5',
  },
  edit: {
    border: '#cba6f7',
    bg: '#1e1b2e',
    text: '#cba6f7',
  },
  'exit-select': {
    border: '#a6e3a1',
    bg: '#0f1e12',
    text: '#a6e3a1',
  },
  'exit-cancel': {
    border: '#f38ba8',
    bg: '#2a1019',
    text: '#f38ba8',
  },
}

function FztKeyboardNodeComponent({ data }: NodeProps) {
  const d = data as unknown as FztKeyboardNodeData
  const c = COLORS[d.category]

  return (
    <>
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0" />
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0" />
      <div
        className="rounded-md px-3 py-2.5 border-2 max-w-[300px] transition-all duration-200 hover:scale-[1.02]"
        style={{
          backgroundColor: c.bg,
          borderColor: c.border,
          boxShadow: `0 0 8px ${c.border}33`,
          color: c.text,
        }}
      >
        <div className="flex items-center gap-2 font-bold text-xs">
          {d.glyph && (
            <span
              className="font-mono text-sm"
              style={{ color: c.glyphColor ?? c.border }}
            >
              {d.glyph}
            </span>
          )}
          <span>{d.label}</span>
        </div>
        <div
          className="text-[10px] mt-1.5 leading-snug opacity-80"
          style={{ color: '#cbd5e1' }}
        >
          {d.description}
        </div>
      </div>
    </>
  )
}

export default memo(FztKeyboardNodeComponent)
