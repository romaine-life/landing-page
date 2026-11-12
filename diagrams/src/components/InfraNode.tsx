import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import * as icons from 'lucide-react'
import type { InfraNodeData } from '../types'
import { CATEGORY_COLORS } from '../types'

type LucideIcon = React.ComponentType<{ size?: number; className?: string; color?: string }>

function InfraNode({ data }: NodeProps) {
  const nodeData = data as unknown as InfraNodeData
  const color = CATEGORY_COLORS[nodeData.category]
  const Icon = (icons as unknown as Record<string, LucideIcon>)[nodeData.icon]

  return (
    <>
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-3 !h-3" />
      <div
        className="rounded-lg px-3 py-2 border cursor-pointer transition-all duration-200 hover:scale-105 min-w-[120px] text-center"
        style={{
          backgroundColor: '#1e293b',
          borderColor: `${color}66`,
          boxShadow: `0 0 8px ${color}22`,
        }}
      >
        <div className="flex items-center justify-center gap-2">
          {Icon && <Icon size={16} className="shrink-0" color={color} />}
          <span className="font-medium text-xs text-text">{nodeData.label}</span>
        </div>
        {nodeData.subdomain && (
          <div className="text-[10px] text-text-muted mt-0.5">{nodeData.subdomain}</div>
        )}
      </div>
    </>
  )
}

export default memo(InfraNode)
