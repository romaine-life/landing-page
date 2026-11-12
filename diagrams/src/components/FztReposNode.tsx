import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { FztReposNodeData } from '../data/fzt-repos-nodes'

const COLORS: Record<FztReposNodeData['category'], { border: string; bg: string; text: string }> = {
  'repo-boundary': { border: '#94a3b8', bg: '#0f172a', text: '#e2e8f0' },
  package:         { border: '#38bdf8', bg: '#0c1929', text: '#bae6fd' },
  binary:          { border: '#a78bfa', bg: '#1e1b2e', text: '#c4b5fd' },
  asset:           { border: '#f59e0b', bg: '#2a2010', text: '#fde68a' },
}

function FztReposNodeComponent({ data }: NodeProps) {
  const d = data as unknown as FztReposNodeData
  const c = COLORS[d.category]
  const dimStyle = d.dimmed ? { opacity: 0.1, transition: 'opacity 0.2s ease' } : { opacity: 1, transition: 'opacity 0.2s ease' }

  if (d.category === 'repo-boundary') {
    return (
      <>
        <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0" />
        <Handle type="target" position={Position.Top} className="!bg-transparent !border-0" />
        <Handle type="source" position={Position.Right} id="right" className="!bg-transparent !border-0" />
        <Handle type="target" position={Position.Left} id="left" className="!bg-transparent !border-0" />
        <div
          className="rounded-lg px-4 py-2 border-2 border-dashed"
          style={{ backgroundColor: c.bg, borderColor: `${c.border}66`, color: c.text, ...dimStyle }}
        >
          <div className="font-bold text-xs">{d.label}</div>
          {d.repo && (
            <div className="text-[9px] opacity-40 font-mono mt-0.5">{d.repo}</div>
          )}
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
        className="rounded-md px-3 py-2 border max-w-[260px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
        style={{
          backgroundColor: c.bg,
          borderColor: `${c.border}88`,
          boxShadow: `0 0 6px ${c.border}15`,
          color: c.text,
          ...dimStyle,
        }}
      >
        <div className="font-medium text-xs">{d.label}</div>
        <div className="text-[10px] mt-0.5 leading-snug opacity-70">{d.description}</div>
      </div>
    </>
  )
}

export default memo(FztReposNodeComponent)
