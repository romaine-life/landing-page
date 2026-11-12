import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { FztFinalNodeData } from '../data/fzt-final-nodes'

const COLORS: Record<FztFinalNodeData['category'], { border: string; bg: string; text: string }> = {
  engine:    { border: '#38bdf8', bg: '#0c1929', text: '#bae6fd' },
  ecosystem: { border: '#f59e0b', bg: '#2a2010', text: '#fde68a' },
  tool:      { border: '#4ade80', bg: '#0f2a1a', text: '#86efac' },
  binary:    { border: '#a78bfa', bg: '#1e1b2e', text: '#c4b5fd' },
}

function FztFinalNodeComponent({ data }: NodeProps) {
  const d = data as unknown as FztFinalNodeData
  const c = COLORS[d.category]
  const isRepo = !!d.repo && (d.category === 'engine' || d.category === 'ecosystem')
  const dimStyle = d.dimmed
    ? { opacity: 0.08, transition: 'opacity 0.2s ease' }
    : { opacity: 1, transition: 'opacity 0.2s ease' }

  if (isRepo) {
    return (
      <>
        <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0" />
        <Handle type="target" position={Position.Top} className="!bg-transparent !border-0" />
        <Handle type="source" position={Position.Right} id="right" className="!bg-transparent !border-0" />
        <Handle type="target" position={Position.Left} id="left" className="!bg-transparent !border-0" />
        <div
          className="rounded-lg px-5 py-2.5 border-2 border-dashed"
          style={{ backgroundColor: c.bg, borderColor: `${c.border}55`, color: c.text, ...dimStyle }}
        >
          <div className="font-bold text-sm">{d.label}</div>
          <div className="text-[10px] mt-1 opacity-60 leading-snug">{d.description}</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0" />
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-transparent !border-0" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-transparent !border-0" />
      <div
        className="rounded-md px-4 py-2 border max-w-[260px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
        style={{
          backgroundColor: c.bg,
          borderColor: `${c.border}88`,
          boxShadow: `0 0 6px ${c.border}15`,
          color: c.text,
          ...dimStyle,
        }}
      >
        <div className="font-medium text-xs">{d.label}</div>
        {d.repo && <div className="text-[9px] opacity-40 mt-0.5 font-mono">{d.repo}</div>}
        <div className="text-[10px] mt-0.5 leading-snug opacity-70">{d.description}</div>
      </div>
    </>
  )
}

export default memo(FztFinalNodeComponent)
