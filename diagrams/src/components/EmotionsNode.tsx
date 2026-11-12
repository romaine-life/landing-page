import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { EmotionsNodeData } from '../data/emotions-nodes'

const COLORS: Record<
  EmotionsNodeData['category'],
  { border: string; bg: string; text: string; glow: string }
> = {
  human: { border: '#4ade80', bg: '#0a1f0f', text: '#bbf7d0', glow: '#4ade8022' },
  llm: { border: '#38bdf8', bg: '#0a1528', text: '#bae6fd', glow: '#38bdf822' },
  interface: { border: '#f59e0b', bg: '#1a1400', text: '#fde68a', glow: '#f59e0b22' },
  perception: { border: '#4ade80', bg: '#0f1f1a', text: '#a7f3d0', glow: '#4ade8018' },
  shared: { border: '#c084fc', bg: '#1a0f2e', text: '#e9d5ff', glow: '#c084fc22' },
  future: { border: '#a78bfa', bg: '#15102a', text: '#c4b5fd', glow: '#a78bfa18' },
  insight: { border: '#64748b', bg: '#0f172a', text: '#cbd5e1', glow: '#64748b11' },
}

function EmotionsNodeComponent({ data }: NodeProps) {
  const d = data as unknown as EmotionsNodeData
  const c = COLORS[d.category]

  const isNorthStar = d.label.startsWith('North Star')
  const isSectionLabel = d.label === 'TODAY' || d.label === 'THE VISION'

  if (isSectionLabel) {
    return (
      <>
        <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0" />
        <Handle type="target" position={Position.Top} className="!bg-transparent !border-0" />
        <div className="px-6 py-3">
          <div className="text-lg font-bold tracking-widest" style={{ color: '#94a3b8' }}>
            {d.label}
          </div>
          <div className="text-[11px] mt-1 max-w-[500px] leading-relaxed" style={{ color: '#64748b' }}>
            {d.description}
          </div>
        </div>
      </>
    )
  }

  if (isNorthStar) {
    return (
      <>
        <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0" />
        <Handle type="target" position={Position.Top} className="!bg-transparent !border-0" />
        <div
          className="rounded-xl px-8 py-5 border-2 max-w-[450px] text-center"
          style={{
            backgroundColor: '#1a0f2e',
            borderColor: '#c084fc',
            boxShadow: '0 0 30px #c084fc33, 0 0 60px #c084fc11',
          }}
        >
          <div className="text-base font-bold" style={{ color: '#e9d5ff' }}>
            {d.label}
          </div>
          <div className="text-[11px] mt-2 leading-relaxed" style={{ color: '#c4b5fd' }}>
            {d.description}
          </div>
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
        className="rounded-lg px-5 py-3.5 border max-w-[300px] transition-all duration-200 hover:scale-[1.02]"
        style={{
          backgroundColor: c.bg,
          borderColor: `${c.border}88`,
          boxShadow: `0 0 12px ${c.glow}`,
          color: c.text,
        }}
      >
        <div className="font-semibold text-xs tracking-wide">{d.label}</div>
        <div className="text-[10px] mt-1.5 leading-snug opacity-75">{d.description}</div>
      </div>
    </>
  )
}

export default memo(EmotionsNodeComponent)
