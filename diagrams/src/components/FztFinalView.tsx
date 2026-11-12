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

import { fztFinalNodes } from '../data/fzt-final-nodes'
import { fztFinalEdges } from '../data/fzt-final-edges'
import FztFinalNodeComponent from './FztFinalNode'

const nodeTypes = { 'fzt-final': FztFinalNodeComponent }

const TOOL_IDS = new Set(['tool-automate', 'tool-picker', 'tool-homepage', 'tool-showcase'])

const PKG_TO_REPO: Record<string, string> = {
  'pkg-scorer': 'repo-fzt', 'pkg-tree': 'repo-fzt', 'pkg-providers': 'repo-fzt', 'bin-fzt': 'repo-fzt',
  'pkg-term-render': 'repo-eco', 'pkg-browser-render': 'repo-eco', 'pkg-frontend': 'repo-eco',
}

function findReachable(startId: string, edges: Edge[]): Set<string> {
  const r = new Set<string>([startId])
  const q = [startId]
  while (q.length > 0) {
    const c = q.shift()!
    for (const e of edges) {
      if (e.source === c && !r.has(e.target)) { r.add(e.target); q.push(e.target) }
    }
  }
  for (const id of [...r]) { const repo = PKG_TO_REPO[id]; if (repo) r.add(repo) }
  return r
}

function findReachableEdges(nodes: Set<string>, edges: Edge[]): Set<string> {
  const r = new Set<string>()
  for (const e of edges) { if (nodes.has(e.source) && nodes.has(e.target)) r.add(e.id) }
  return r
}

export default function FztFinalView() {
  const [nodes, , onNodesChange] = useNodesState(fztFinalNodes)
  const [edges, , onEdgesChange] = useEdgesState(fztFinalEdges)
  const [hovered, setHovered] = useState<string | null>(null)

  const { hn, he } = useMemo(() => {
    if (!hovered) return { hn: null, he: null }
    const hn = findReachable(hovered, fztFinalEdges)
    return { hn, he: findReachableEdges(hn, fztFinalEdges) }
  }, [hovered])

  const sn = useMemo(() => {
    if (!hn) return nodes
    return nodes.map(n => ({ ...n, data: { ...n.data, dimmed: !hn.has(n.id) } }))
  }, [nodes, hn])

  const se = useMemo(() => {
    if (!he) return edges
    return edges.map(e => ({
      ...e,
      style: { ...e.style, opacity: he.has(e.id) ? 1 : 0.06 },
      labelStyle: { ...(e.labelStyle as Record<string, unknown>), opacity: he.has(e.id) ? 1 : 0.06 },
    }))
  }, [edges, he])

  return (
    <div className="w-screen h-screen bg-[#0f172a]">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <Link to="/fzt/shared" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">&larr; shared deps</Link>
        <h1 className="text-sm font-bold text-slate-300">fzt Final Architecture</h1>
        {hovered && (
          <span className="text-xs text-amber-400/80 font-mono">
            {fztFinalNodes.find(n => n.id === hovered)?.data?.label ?? ''}
          </span>
        )}
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-4 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#0c1929', border: '1px solid #38bdf8' }} /> engine (fzt)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#2a2010', border: '1px solid #f59e0b' }} /> ecosystem (fzt-terminal)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#0f2a1a', border: '1px solid #4ade80' }} /> tool
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#1e1b2e', border: '1px solid #a78bfa' }} /> binary
        </span>
        <span className="text-slate-500 italic">hover a tool</span>
      </div>

      <ReactFlow
        nodes={sn} edges={se}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        onNodeMouseEnter={useCallback((_: React.MouseEvent, n: { id: string }) => { if (TOOL_IDS.has(n.id)) setHovered(n.id) }, [])}
        onNodeMouseLeave={useCallback(() => setHovered(null), [])}
        nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.4 }}
        minZoom={0.3} maxZoom={2} proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e293b" />
        <Controls className="!bg-slate-800 !border-slate-700 !rounded-lg [&>button]:!bg-slate-800 [&>button]:!border-slate-700 [&>button]:!text-slate-400 [&>button:hover]:!bg-slate-700" />
      </ReactFlow>
    </div>
  )
}
