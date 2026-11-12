import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { CertConceptsNodeData } from '../data/cert-concepts-nodes'

const COLORS: Record<
  CertConceptsNodeData['category'],
  { border: string; bg: string; text: string }
> = {
  ca: { border: '#4ade80', bg: '#0f2a1a', text: '#86efac' },
  subject: { border: '#a78bfa', bg: '#1a0f2e', text: '#c4b5fd' },
  key: { border: '#f59e0b', bg: '#2a1f0a', text: '#fde68a' },
  cert: { border: '#38bdf8', bg: '#0c1929', text: '#bae6fd' },
  trust: { border: '#2dd4bf', bg: '#0a2a2a', text: '#99f6e4' },
  insight: { border: '#fb7185', bg: '#2a0f18', text: '#fda4af' },
  section: { border: '#475569', bg: 'transparent', text: '#94a3b8' },
}

function CertConceptsNodeComponent({ data }: NodeProps) {
  const d = data as unknown as CertConceptsNodeData

  // Section labels render as plain text headers
  if (d.category === 'section') {
    return (
      <div className="px-1 py-1">
        <div className="text-sm font-bold tracking-widest" style={{ color: '#94a3b8' }}>
          {d.label}
        </div>
        <div
          className="text-[10px] mt-1 max-w-[420px] leading-relaxed"
          style={{ color: '#64748b' }}
        >
          {d.description}
        </div>
      </div>
    )
  }

  const c = COLORS[d.category]

  const dimStyle = d.dimmed
    ? { opacity: 0.08, transition: 'opacity 0.2s ease' }
    : { opacity: 1, transition: 'opacity 0.2s ease' }

  const isInsight = d.category === 'insight'
  const isCert = d.category === 'cert'

  return (
    <>
      <Handle type="target" position={Position.Top} id="top" className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-transparent !border-0" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-transparent !border-0" />
      <div
        className={`rounded-lg px-4 py-3 border max-w-[260px] transition-all duration-200 hover:scale-[1.02] ${
          isInsight ? 'border-dashed' : ''
        }`}
        style={{
          backgroundColor: c.bg,
          borderColor: isInsight ? `${c.border}66` : `${c.border}88`,
          boxShadow: isCert
            ? `0 0 20px ${c.border}25, 0 0 40px ${c.border}10`
            : `0 0 6px ${c.border}15`,
          color: c.text,
          ...dimStyle,
        }}
      >
        <div className={`font-semibold ${isCert ? 'text-sm' : 'text-xs'}`}>
          {d.label}
        </div>
        <div
          className={`${isCert ? 'text-[11px]' : 'text-[10px]'} mt-1 leading-snug opacity-75`}
        >
          {d.description}
        </div>
      </div>
    </>
  )
}

export default memo(CertConceptsNodeComponent)
