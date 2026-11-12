import { useCallback, useMemo, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type NodeMouseHandler,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Link } from 'react-router-dom'

import { nodes as initialNodes } from '../data/nodes'
import { edges as initialEdges } from '../data/edges'
import { annotations } from '../data/annotations'
import type { AppName, InfraNodeData } from '../types'
import AppNode from './AppNode'
import InfraNode from './InfraNode'
import AppFilter from './AppFilter'
import DetailPanel from './DetailPanel'

const nodeTypes = {
  app: AppNode,
  infra: InfraNode,
}

type DiagramViewProps = {
  selectedApp: AppName | null
  onSelectApp: (app: AppName | null) => void
}

export default function DiagramView({ selectedApp, onSelectApp }: DiagramViewProps) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // Determine which nodes are relevant to the selected app
  const isNodeRelevant = useCallback(
    (node: Node) => {
      if (!selectedApp) return true
      const data = node.data as InfraNodeData
      // Node is relevant if: it IS the selected app, it lists the app, or it's shared (empty apps array)
      return (
        node.id === selectedApp ||
        data.apps.includes(selectedApp) ||
        data.apps.length === 0
      )
    },
    [selectedApp],
  )

  // Apply opacity based on filter
  const filteredNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        style: {
          ...node.style,
          opacity: isNodeRelevant(node) ? 1 : 0.15,
          transition: 'opacity 0.3s ease',
        },
      })),
    [nodes, isNodeRelevant],
  )

  const filteredEdges = useMemo(() => {
    if (!selectedApp) return edges

    // An edge is relevant if both source and target are relevant
    const relevantNodeIds = new Set(
      nodes.filter(isNodeRelevant).map((n) => n.id),
    )

    return edges.map((edge) => ({
      ...edge,
      style: {
        ...edge.style,
        opacity:
          relevantNodeIds.has(edge.source) && relevantNodeIds.has(edge.target)
            ? 1
            : 0.08,
        transition: 'opacity 0.3s ease',
      },
      animated:
        relevantNodeIds.has(edge.source) && relevantNodeIds.has(edge.target)
          ? edge.animated
          : false,
    }))
  }, [edges, nodes, selectedApp, isNodeRelevant])

  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    setSelectedNodeId((prev) => (prev === node.id ? null : node.id))
  }, [])

  const selectedAnnotation = selectedNodeId ? annotations[selectedNodeId] ?? null : null
  const selectedCategory = selectedNodeId
    ? ((nodes.find((n) => n.id === selectedNodeId)?.data as InfraNodeData | undefined)?.category ?? null)
    : null

  return (
    <div className="flex flex-col h-screen">
      <AppFilter selectedApp={selectedApp} onSelect={onSelectApp} />
      <div className="absolute top-2 right-4 z-10 flex gap-3 text-[10px] text-slate-500">
        <Link to="/pipelines" className="hover:text-slate-300 transition-colors">
          pipelines &rarr;
        </Link>
        <Link to="/fzt" className="hover:text-slate-300 transition-colors">
          fzt &rarr;
        </Link>
        <Link to="/emotions" className="hover:text-slate-300 transition-colors">
          emotions &rarr;
        </Link>
      </div>
      <div className="flex-1 relative">
        <ReactFlow
          nodes={filteredNodes}
          edges={filteredEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.3}
          maxZoom={2}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#334155" />
          <Controls position="bottom-left" />
          <MiniMap
            position="bottom-right"
            nodeColor={(node) => {
              const data = node.data as InfraNodeData
              const colors: Record<string, string> = {
                app: '#a78bfa',
                shared: '#38bdf8',
                external: '#fb923c',
                infra: '#4ade80',
              }
              return colors[data.category] ?? '#94a3b8'
            }}
            maskColor="rgba(15, 23, 42, 0.8)"
          />
        </ReactFlow>
        <DetailPanel
          annotation={selectedAnnotation}
          category={selectedCategory}
          onClose={() => setSelectedNodeId(null)}
        />
      </div>
    </div>
  )
}
