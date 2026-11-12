import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Link } from 'react-router-dom'

import { fztSharedNodes } from '../data/fzt-shared-nodes'
import { fztSharedEdges } from '../data/fzt-shared-edges'
import FztSharedNodeComponent from './FztSharedNode'

const nodeTypes = {
  'fzt-shared': FztSharedNodeComponent,
}

const TOOL_IDS = new Set(['tool-automate', 'tool-picker', 'tool-homepage', 'tool-showcase'])
const TOOL_NAMES: Record<string, string> = {
  'tool-automate': 'fzt-automate',
  'tool-picker': 'fzt-picker',
  'tool-homepage': 'my-homepage',
  'tool-showcase': 'fzt-showcase',
}

function findReachable(startId: string, edges: Edge[]): Set<string> {
  const reachable = new Set<string>([startId])
  const queue = [startId]
  while (queue.length > 0) {
    const current = queue.shift()!
    for (const edge of edges) {
      if (edge.source === current && !reachable.has(edge.target)) {
        reachable.add(edge.target)
        queue.push(edge.target)
      }
    }
  }
  return reachable
}

function findReachableEdges(reachableNodes: Set<string>, edges: Edge[]): Set<string> {
  const reachableEdges = new Set<string>()
  for (const edge of edges) {
    if (reachableNodes.has(edge.source) && reachableNodes.has(edge.target)) {
      reachableEdges.add(edge.id)
    }
  }
  return reachableEdges
}

export default function FztSharedView() {
  const [nodes, , onNodesChange] = useNodesState(fztSharedNodes)
  const [edges, , onEdgesChange] = useEdgesState(fztSharedEdges)
  const [hoveredTool, setHoveredTool] = useState<string | null>(null)

  const { highlightedNodes, highlightedEdges } = useMemo(() => {
    if (!hoveredTool) return { highlightedNodes: null, highlightedEdges: null }
    const reachableNodes = findReachable(hoveredTool, fztSharedEdges)
    const reachableEdges = findReachableEdges(reachableNodes, fztSharedEdges)
    return { highlightedNodes: reachableNodes, highlightedEdges: reachableEdges }
  }, [hoveredTool])

  const styledNodes = useMemo(() => {
    if (!highlightedNodes) return nodes
    return nodes.map((node) => ({
      ...node,
      data: { ...node.data, dimmed: !highlightedNodes.has(node.id) },
    }))
  }, [nodes, highlightedNodes])

  const styledEdges = useMemo(() => {
    if (!highlightedEdges) return edges
    return edges.map((edge) => {
      const dimmed = !highlightedEdges.has(edge.id)
      return {
        ...edge,
        style: { ...edge.style, opacity: dimmed ? 0.05 : 1 },
        labelStyle: { ...(edge.labelStyle as Record<string, unknown>), opacity: dimmed ? 0.05 : 1 },
      }
    })
  }, [edges, highlightedEdges])

  const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: { id: string }) => {
    if (TOOL_IDS.has(node.id)) setHoveredTool(node.id)
  }, [])

  const onNodeMouseLeave = useCallback(() => {
    setHoveredTool(null)
  }, [])

  const navigate = useNavigate()
  const onNodeClick = useCallback((_: React.MouseEvent, node: { id: string }) => {
    const toolName = TOOL_NAMES[node.id]
    if (toolName) navigate(`/fzt/tool/${toolName}`)
  }, [navigate])

  return (
    <div className="w-screen h-screen bg-[#0f172a]">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <Link
          to="/fzt/repos"
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          &larr; repo split
        </Link>
        <h1 className="text-sm font-bold text-slate-300">fzt Shared Dependencies</h1>
        <Link
          to="/fzt/matrix"
          className="text-xs text-amber-500/70 hover:text-amber-400 transition-colors"
        >
          matrix &rarr;
        </Link>
        <Link
          to="/fzt/final"
          className="text-xs text-amber-500/70 hover:text-amber-400 transition-colors"
        >
          final &rarr;
        </Link>
        {hoveredTool && (
          <span className="text-xs text-amber-400/80 font-mono">
            {fztSharedNodes.find((n) => n.id === hoveredTool)?.data?.label ?? ''}
          </span>
        )}
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-4 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#0f2a1a', border: '1px solid #4ade80' }} /> tool
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #64748b' }} /> renderer
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#2a2010', border: '1px solid #f59e0b' }} /> frontend
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#2a1025', border: '1px solid #f472b6' }} /> style
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#0c1929', border: '1px solid #38bdf8' }} /> engine
        </span>
        <span className="text-slate-500 italic">hover a tool</span>
      </div>

      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e293b" />
        <Controls className="!bg-slate-800 !border-slate-700 !rounded-lg [&>button]:!bg-slate-800 [&>button]:!border-slate-700 [&>button]:!text-slate-400 [&>button:hover]:!bg-slate-700" />
      </ReactFlow>
    </div>
  )
}
