import { memo } from 'react'
import { BaseEdge, type EdgeProps } from '@xyflow/react'

function ELKEdgeComponent({ data, style, animated, markerEnd }: EdgeProps) {
  const elkPath = (data as Record<string, unknown>)?.elkPath as string | undefined
  if (!elkPath) return null

  return (
    <BaseEdge
      path={elkPath}
      style={style}
      className={animated ? 'react-flow__edge-path animated' : ''}
      markerEnd={markerEnd}
    />
  )
}

export default memo(ELKEdgeComponent)
