import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import * as icons from 'lucide-react'
import type { InfraNodeData } from '../types'
import { CATEGORY_COLORS } from '../types'

type LucideIcon = React.ComponentType<{ size?: number; className?: string; color?: string }>

function AppNode({ data }: NodeProps) {
  const nodeData = data as unknown as InfraNodeData
  const color = CATEGORY_COLORS[nodeData.category]
  const Icon = (icons as unknown as Record<string, LucideIcon>)[nodeData.icon]

  return (
    <>
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-3 !h-3" />
      <div
        className="rounded-xl px-4 py-3 border-2 cursor-pointer transition-all duration-200 hover:scale-105 min-w-[140px] text-center"
        style={{
          backgroundColor: '#1e293b',
          borderColor: color,
          boxShadow: `0 0 12px ${color}33`,
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          {Icon && <Icon size={18} className="shrink-0" color={color} />}
          <span className="font-semibold text-sm text-text" style={{ color }}>
            {nodeData.label}
          </span>
        </div>
        {nodeData.subdomain && (
          <div className="text-xs text-text-muted">{nodeData.subdomain}</div>
        )}
      </div>
    </>
  )
}

export default memo(AppNode)
