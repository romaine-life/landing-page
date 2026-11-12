import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { SpireLensWorkflowNodeData } from '../data/spirelens-workflow-nodes'

const COLORS: Record<SpireLensWorkflowNodeData['category'], { border: string; bg: string; text: string; eyebrow: string }> = {
  human: { border: '#facc15', bg: '#29210b', text: '#fef3c7', eyebrow: 'input' },
  save: { border: '#38bdf8', bg: '#0b1d2a', text: '#dbeafe', eyebrow: 'save state' },
  agent: { border: '#a78bfa', bg: '#1f1833', text: '#ede9fe', eyebrow: 'llm phase' },
  code: { border: '#f472b6', bg: '#2a1021', text: '#fce7f3', eyebrow: 'code phase' },
  game: { border: '#fb7185', bg: '#2b1118', text: '#ffe4e6', eyebrow: 'sts2' },
  mcp: { border: '#22c55e', bg: '#0d2416', text: '#dcfce7', eyebrow: 'mcp' },
  evidence: { border: '#14b8a6', bg: '#0b2524', text: '#ccfbf1', eyebrow: 'evidence' },
  guardrail: { border: '#f97316', bg: '#2b180b', text: '#ffedd5', eyebrow: 'guardrail' },
  pr: { border: '#eab308', bg: '#241d08', text: '#fef9c3', eyebrow: 'review' },
}

function SpireLensWorkflowNode({ data }: NodeProps) {
  const d = data as unknown as SpireLensWorkflowNodeData
  const c = COLORS[d.category]

  return (
    <>
      <Handle type="target" position={Position.Left} id="left" className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-transparent !border-0" />
      <Handle type="target" position={Position.Top} id="top" className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-transparent !border-0" />
      <div
        className="rounded-md border px-4 py-3 transition-all duration-200 hover:scale-[1.015]"
        style={{
          width: 280,
          minHeight: 96,
          backgroundColor: c.bg,
          borderColor: `${c.border}99`,
          boxShadow: `0 0 10px ${c.border}18`,
          color: c.text,
        }}
      >
        <div className="text-[9px] uppercase tracking-wide opacity-55">{c.eyebrow}</div>
        <div className="mt-1 text-sm font-semibold leading-tight">{d.label}</div>
        <div className="mt-1.5 text-[10px] leading-snug opacity-75">{d.description}</div>
        {d.detail && (
          <div className="mt-2 border-t pt-1.5 text-[9px] leading-snug opacity-55" style={{ borderColor: `${c.border}33` }}>
            {d.detail}
          </div>
        )}
      </div>
    </>
  )
}

export default memo(SpireLensWorkflowNode)
