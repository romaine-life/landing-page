import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { FztSharedNodeData } from '../data/fzt-shared-nodes'

const COLORS: Record<FztSharedNodeData['category'], { border: string; bg: string; text: string }> = {
  tool:     { border: '#4ade80', bg: '#0f2a1a', text: '#86efac' },
  renderer: { border: '#64748b', bg: '#1e293b', text: '#cbd5e1' },
  frontend: { border: '#f59e0b', bg: '#2a2010', text: '#fde68a' },
  style:    { border: '#f472b6', bg: '#2a1025', text: '#fbcfe8' },
  engine:   { border: '#38bdf8', bg: '#0c1929', text: '#bae6fd' },
}

function FztSharedNodeComponent({ data }: NodeProps) {
  const d = data as unknown as FztSharedNodeData
  const c = COLORS[d.category]
  const dimStyle = d.dimmed
    ? { opacity: 0.08, transition: 'opacity 0.2s ease' }
    : { opacity: 1, transition: 'opacity 0.2s ease' }

  return (
    <>
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0" />
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0" />
      <div
        className="rounded-md px-4 py-2 border max-w-[280px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
        style={{
          backgroundColor: c.bg,
          borderColor: `${c.border}88`,
          boxShadow: `0 0 6px ${c.border}15`,
          color: c.text,
          ...dimStyle,
        }}
      >
        <div className="font-medium text-xs">{d.label}</div>
        {d.repo && (
          <div className="text-[9px] opacity-40 mt-0.5 font-mono">{d.repo}</div>
        )}
        <div className="text-[10px] mt-0.5 leading-snug opacity-70">{d.description}</div>
      </div>
    </>
  )
}

export default memo(FztSharedNodeComponent)
