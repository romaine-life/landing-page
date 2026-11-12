import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { FztArchNodeData } from '../data/fzt-arch-nodes'

const COLORS: Record<FztArchNodeData['category'], { border: string; bg: string; text: string }> = {
  package:  { border: '#38bdf8', bg: '#1e293b', text: '#e2e8f0' },
  binary:   { border: '#a78bfa', bg: '#1e1b2e', text: '#c4b5fd' },
  asset:    { border: '#f59e0b', bg: '#2a2010', text: '#fde68a' },
  external: { border: '#4ade80', bg: '#0f2a1a', text: '#86efac' },
}

function FztArchNodeComponent({ data }: NodeProps) {
  const d = data as unknown as FztArchNodeData
  const c = COLORS[d.category]

  return (
    <>
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0" />
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-transparent !border-0" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-transparent !border-0" />
      <div
        className="rounded-md px-4 py-2.5 border max-w-[280px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
        style={{
          backgroundColor: c.bg,
          borderColor: `${c.border}88`,
          boxShadow: `0 0 6px ${c.border}22`,
          color: c.text,
        }}
      >
        <div className="font-medium text-xs">{d.label}</div>
        {d.pkg && (
          <div className="text-[9px] opacity-50 mt-0.5 font-mono">{d.pkg}</div>
        )}
        <div className="text-[10px] mt-1 leading-snug opacity-70">{d.description}</div>
      </div>
    </>
  )
}

export default memo(FztArchNodeComponent)
