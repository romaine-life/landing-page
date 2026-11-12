import { useState, useCallback, useMemo } from 'react'
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

import { fztReposNodes } from '../data/fzt-repos-nodes'
import { fztReposEdges } from '../data/fzt-repos-edges'
import FztReposNodeComponent from './FztReposNode'

const nodeTypes = {
  'fzt-repos': FztReposNodeComponent,
}

const CONSUMER_IDS = new Set(['repo-at', 'repo-homepage', 'repo-showcase', 'repo-picker', 'repo-future'])

// Map packages to their parent repo boundary node
const PACKAGE_TO_REPO: Record<string, string> = {
  'pkg-scorer': 'repo-fzt',
  'pkg-tree': 'repo-fzt',
  'pkg-input': 'repo-fzt',
  'pkg-provider': 'repo-fzt',
  'pkg-render': 'repo-fzt',
  'pkg-style-go': 'repo-style',
  'pkg-style-css': 'repo-style',
  'pkg-palette': 'repo-frontend',
  'pkg-identity': 'repo-frontend',
  'pkg-actions': 'repo-frontend',
  'pkg-terminal': 'repo-renderers',
  'pkg-browser': 'repo-renderers',
  'pkg-wasm': 'repo-renderers',
}

// Walk edges from a source node to find all reachable nodes (transitive deps)
// Also includes parent repo boundary nodes for any reached package
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
  // Add parent repo nodes for any reachable packages
  for (const nodeId of [...reachable]) {
    const repoId = PACKAGE_TO_REPO[nodeId]
    if (repoId) {
      reachable.add(repoId)
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

export default function FztReposView() {
  const [nodes, , onNodesChange] = useNodesState(fztReposNodes)
  const [edges, , onEdgesChange] = useEdgesState(fztReposEdges)
  const [hoveredConsumer, setHoveredConsumer] = useState<string | null>(null)

  const { highlightedNodes, highlightedEdges } = useMemo(() => {
    if (!hoveredConsumer) return { highlightedNodes: null, highlightedEdges: null }
    const reachableNodes = findReachable(hoveredConsumer, fztReposEdges)
    const reachableEdges = findReachableEdges(reachableNodes, fztReposEdges)
    return { highlightedNodes: reachableNodes, highlightedEdges: reachableEdges }
  }, [hoveredConsumer])

  const styledNodes = useMemo(() => {
    if (!highlightedNodes) return nodes
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        dimmed: !highlightedNodes.has(node.id),
      },
    }))
  }, [nodes, highlightedNodes])

  const styledEdges = useMemo(() => {
    if (!highlightedEdges) return edges
    return edges.map((edge) => {
      const dimmed = !highlightedEdges.has(edge.id)
      return {
        ...edge,
        style: {
          ...edge.style,
          opacity: dimmed ? 0.08 : 1,
        },
        labelStyle: {
          ...(edge.labelStyle as Record<string, unknown>),
          opacity: dimmed ? 0.08 : 1,
        },
      }
    })
  }, [edges, highlightedEdges])

  const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: { id: string }) => {
    if (CONSUMER_IDS.has(node.id)) {
      setHoveredConsumer(node.id)
    }
  }, [])

  const onNodeMouseLeave = useCallback(() => {
    setHoveredConsumer(null)
  }, [])

  return (
    <div className="w-screen h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <Link
          to="/fzt/proposed"
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          &larr; proposed
        </Link>
        <h1 className="text-sm font-bold text-slate-300">fzt Repo Split</h1>
        <Link
          to="/fzt/shared"
          className="text-xs text-amber-500/70 hover:text-amber-400 transition-colors"
        >
          shared deps &rarr;
        </Link>
        {hoveredConsumer && (
          <span className="text-xs text-amber-400/80 font-mono">
            {fztReposNodes.find((n) => n.id === hoveredConsumer)?.data?.label ?? ''}
          </span>
        )}
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-3 text-[10px] text-slate-400 max-w-md justify-end">
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: '#38bdf8' }} /> internal
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: '#a78bfa' }} /> cross-repo
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 inline-block border-t border-dashed" style={{ borderColor: '#f472b6' }} /> style dep
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: '#4ade80' }} /> consumer
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm inline-block border-2 border-dashed" style={{ borderColor: '#94a3b866', backgroundColor: '#0f172a' }} /> repo
        </span>
      </div>

      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
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
