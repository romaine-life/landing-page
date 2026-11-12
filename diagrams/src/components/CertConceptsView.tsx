import { useState, useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useNavigate } from 'react-router-dom'
import CertConceptsNodeComponent from './CertConceptsNode'
import { certConceptsNodes } from '../data/cert-concepts-nodes'
import { certConceptsEdges } from '../data/cert-concepts-edges'

const nodeTypes = { 'cert-concepts': CertConceptsNodeComponent }

const LEGEND = [
  { label: 'Certificate Authority', color: '#4ade80' },
  { label: 'Subject / Server', color: '#a78bfa' },
  { label: 'Keys', color: '#f59e0b' },
  { label: 'Certificate', color: '#38bdf8' },
  { label: 'Trust & Verification', color: '#2dd4bf' },
  { label: 'Key Insight', color: '#fb7185' },
]

export default function CertConceptsView() {
  const navigate = useNavigate()
  const [nodes, , onNodesChange] = useNodesState(certConceptsNodes)
  const [edges, , onEdgesChange] = useEdgesState(certConceptsEdges)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Highlight hovered node + direct neighbors, dim everything else
  const highlightedNodes = useMemo(() => {
    if (!hoveredNode) return null
    const set = new Set([hoveredNode])
    edges.forEach((e) => {
      if (e.source === hoveredNode || e.target === hoveredNode) {
        set.add(e.source)
        set.add(e.target)
      }
    })
    return set
  }, [hoveredNode, edges])

  const highlightedEdges = useMemo(() => {
    if (!hoveredNode) return null
    const set = new Set<string>()
    edges.forEach((e) => {
      if (e.source === hoveredNode || e.target === hoveredNode) {
        set.add(e.id)
      }
    })
    return set
  }, [hoveredNode, edges])

  const styledNodes = useMemo(() => {
    if (!highlightedNodes) return nodes
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        // Section labels never dim
        dimmed: node.id.startsWith('label-') ? false : !highlightedNodes.has(node.id),
      },
    }))
  }, [nodes, highlightedNodes])

  const styledEdges = useMemo(() => {
    if (!highlightedEdges) return edges
    return edges.map((edge) => ({
      ...edge,
      style: {
        ...edge.style,
        opacity: highlightedEdges.has(edge.id) ? 1 : 0.08,
        transition: 'opacity 0.2s ease',
      },
      labelStyle: {
        ...edge.labelStyle,
        opacity: highlightedEdges.has(edge.id) ? 1 : 0,
        transition: 'opacity 0.2s ease',
      },
    }))
  }, [edges, highlightedEdges])

  const onNodeMouseEnter = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      if (!node.id.startsWith('label-')) setHoveredNode(node.id)
    },
    [],
  )
  const onNodeMouseLeave = useCallback(() => setHoveredNode(null), [])

  return (
    <div className="w-screen h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => navigate('/')}
          className="text-xs text-slate-500 hover:text-slate-300 mb-2 cursor-pointer"
        >
          &larr; back to infra
        </button>
        <h1 className="text-lg font-bold text-slate-200">
          Certificate &amp; PKI Concepts
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Hover a node to trace its connections
        </p>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 bg-slate-900/80 backdrop-blur rounded-lg border border-slate-700/50 p-3">
        <div className="text-[10px] text-slate-500 font-medium mb-2 uppercase tracking-wider">
          Legend
        </div>
        <div className="flex flex-col gap-1.5">
          {LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px] text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{ type: 'smoothstep' }}
        fitView
        fitViewOptions={{ padding: 0.5 }}
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
