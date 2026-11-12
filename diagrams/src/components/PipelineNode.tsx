import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { PipelineNodeData, PipelineNodeStatus } from '../data/pipeline-nodes'

const COLORS: Record<PipelineNodeData['category'], { border: string; bg: string; text: string }> = {
  repo: { border: '#64748b', bg: '#0f172a', text: '#e2e8f0' },
  workflow: { border: '#38bdf8', bg: '#1e293b', text: '#e2e8f0' },
  artifact: { border: '#a78bfa', bg: '#1e1b2e', text: '#c4b5fd' },
  issue: { border: '#ef4444', bg: '#2a1015', text: '#fca5a5' },
}

const STATUS_COLORS: Record<PipelineNodeStatus, {
  border: string
  bg: string
  text: string
  glow: string
  badgeClass: string
}> = {
  idle: {
    border: '#475569',
    bg: '#0f172a',
    text: '#e2e8f0',
    glow: 'none',
    badgeClass: 'bg-slate-800 text-slate-400',
  },
  queued: {
    border: '#f59e0b',
    bg: '#1a1500',
    text: '#fef3c7',
    glow: '0 0 12px #f59e0b33',
    badgeClass: 'bg-amber-900/40 text-amber-300',
  },
  running: {
    border: '#38bdf8',
    bg: '#0c1929',
    text: '#e0f2fe',
    glow: '0 0 14px #38bdf844',
    badgeClass: 'bg-sky-900/40 text-sky-300',
  },
  success: {
    border: '#22c55e',
    bg: '#0a1a0f',
    text: '#dcfce7',
    glow: '0 0 12px #22c55e33',
    badgeClass: 'bg-green-900/40 text-green-300',
  },
  blocked: {
    border: '#ef4444',
    bg: '#1a0f0f',
    text: '#fee2e2',
    glow: '0 0 12px #ef444444',
    badgeClass: 'bg-red-900/40 text-red-300',
  },
}

function PipelineNodeComponent({ data }: NodeProps) {
  const d = data as unknown as PipelineNodeData
  const c = COLORS[d.category]
  const statusColors = d.status ? STATUS_COLORS[d.status] : null
  const pulse = d.status === 'running'

  if (d.category === 'repo') {
    return (
      <>
        <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0" />
        <Handle type="target" position={Position.Top} className="!bg-transparent !border-0" />
        <div
          className={`rounded-md px-4 py-3 border-2 min-w-[220px] ${pulse ? 'animate-pulse' : ''}`}
          style={{
            backgroundColor: statusColors?.bg ?? c.bg,
            borderColor: statusColors?.border ?? c.border,
            color: statusColors?.text ?? c.text,
            boxShadow: statusColors?.glow ?? 'none',
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="font-bold text-sm">{d.label}</div>
            {d.status && (
              <span className={`rounded px-1.5 py-0.5 text-[9px] font-mono ${statusColors?.badgeClass}`}>
                {d.statusLabel ?? d.status}
              </span>
            )}
          </div>
          <div className="text-[10px] font-normal opacity-70 mt-1 leading-snug">{d.description}</div>
          {d.statusDetail && (
            <div className="text-[9px] mt-2 font-mono opacity-60">{d.statusDetail}</div>
          )}
        </div>
      </>
    )
  }

  if (d.category === 'issue') {
    return (
      <>
        <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0" />
        <Handle type="target" position={Position.Top} className="!bg-transparent !border-0" />
        <div
          className="rounded-md px-4 py-3 border-2 border-dashed max-w-[280px]"
          style={{ backgroundColor: c.bg, borderColor: c.border, color: c.text }}
        >
          <div className="font-bold text-xs flex items-center gap-1.5">
            <span className="text-red-400">&#9888;</span> {d.label}
          </div>
          <div className="text-[10px] mt-1 leading-snug opacity-80">{d.description}</div>
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
        className={`rounded-md px-4 py-3 border max-w-[300px] transition-all duration-200 ${
          pulse ? 'animate-pulse' : 'hover:scale-[1.02]'
        }`}
        style={{
          backgroundColor: statusColors?.bg ?? c.bg,
          borderColor: statusColors?.border ?? `${c.border}88`,
          boxShadow: statusColors?.glow ?? `0 0 6px ${c.border}22`,
          color: statusColors?.text ?? c.text,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="font-medium text-xs">{d.label}</div>
          {d.status && (
            <span className={`rounded px-1.5 py-0.5 text-[9px] font-mono ${statusColors?.badgeClass}`}>
              {d.statusLabel ?? d.status}
            </span>
          )}
        </div>
        {d.trigger && (
          <div className="text-[9px] opacity-50 mt-0.5 font-mono">{d.trigger}</div>
        )}
        <div className="text-[10px] mt-1 leading-snug opacity-70">{d.description}</div>
        {d.statusDetail && (
          <div className="text-[9px] mt-2 font-mono opacity-60">{d.statusDetail}</div>
        )}
      </div>
    </>
  )
}

export default memo(PipelineNodeComponent)
