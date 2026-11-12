import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { TankGithubMcpNodeData } from '../data/tank-github-mcp-nodes'

const COLORS: Record<
  TankGithubMcpNodeData['category'],
  { border: string; bg: string; text: string; glow: string; eyebrow: string }
> = {
  label: { border: '#64748b', bg: 'transparent', text: '#94a3b8', glow: 'none', eyebrow: '#64748b' },
  actor: { border: '#38bdf8', bg: '#071827', text: '#bae6fd', glow: '#38bdf822', eyebrow: '#67e8f9' },
  tank: { border: '#a78bfa', bg: '#17132a', text: '#ddd6fe', glow: '#a78bfa22', eyebrow: '#c4b5fd' },
  session: { border: '#2dd4bf', bg: '#08231f', text: '#ccfbf1', glow: '#2dd4bf22', eyebrow: '#5eead4' },
  token: { border: '#f59e0b', bg: '#241804', text: '#fde68a', glow: '#f59e0b26', eyebrow: '#fbbf24' },
  mcp: { border: '#f472b6', bg: '#261020', text: '#fbcfe8', glow: '#f472b626', eyebrow: '#f9a8d4' },
  github: { border: '#22c55e', bg: '#082011', text: '#bbf7d0', glow: '#22c55e22', eyebrow: '#86efac' },
  store: { border: '#c084fc', bg: '#1a1027', text: '#e9d5ff', glow: '#c084fc22', eyebrow: '#d8b4fe' },
  platform: { border: '#60a5fa', bg: '#0a1728', text: '#bfdbfe', glow: '#60a5fa22', eyebrow: '#93c5fd' },
  policy: { border: '#fb7185', bg: '#2a1017', text: '#ffe4e6', glow: '#fb718522', eyebrow: '#fda4af' },
}

function TankGithubMcpNodeComponent({ data }: NodeProps) {
  const d = data as unknown as TankGithubMcpNodeData
  const c = COLORS[d.category]

  if (d.category === 'label') {
    return (
      <div className="px-3 py-2">
        <div className="text-[11px] font-bold tracking-[0.22em]" style={{ color: c.text }}>
          {d.label}
        </div>
        {d.description && (
          <div className="mt-1 max-w-[420px] text-[10px] leading-snug text-slate-600">
            {d.description}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Handle type="source" position={Position.Top} id="top" className="!bg-transparent !border-0" />
      <Handle type="target" position={Position.Top} id="top" className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-transparent !border-0" />
      <Handle type="target" position={Position.Right} id="right" className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-transparent !border-0" />
      <Handle type="target" position={Position.Bottom} id="bottom" className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Left} id="left" className="!bg-transparent !border-0" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-transparent !border-0" />
      <div
        className="w-[270px] rounded-lg border px-4 py-3 transition-all duration-200 hover:scale-[1.015]"
        style={{
          backgroundColor: c.bg,
          borderColor: `${c.border}99`,
          boxShadow: `0 0 16px ${c.glow}`,
          color: c.text,
        }}
      >
        <div className="flex items-center gap-2">
          {d.step && (
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
              style={{ backgroundColor: `${c.border}24`, color: c.eyebrow }}
            >
              {d.step}
            </span>
          )}
          {d.eyebrow && (
            <span
              className="min-w-0 truncate text-[9px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: c.eyebrow }}
            >
              {d.eyebrow}
            </span>
          )}
        </div>
        <div className="mt-2 text-sm font-semibold leading-tight text-slate-100">
          {d.label}
        </div>
        {d.description && (
          <div className="mt-1.5 text-[10px] leading-snug opacity-75">
            {d.description}
          </div>
        )}
      </div>
    </>
  )
}

export default memo(TankGithubMcpNodeComponent)
