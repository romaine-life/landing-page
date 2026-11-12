import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Link } from 'react-router-dom'

import { fztProposedNodes } from '../data/fzt-proposed-nodes'
import { fztProposedEdges } from '../data/fzt-proposed-edges'
import FztProposedNodeComponent from './FztProposedNode'

const nodeTypes = {
  'fzt-proposed': FztProposedNodeComponent,
}

export default function FztProposedView() {
  const [nodes, , onNodesChange] = useNodesState(fztProposedNodes)
  const [edges, , onEdgesChange] = useEdgesState(fztProposedEdges)

  return (
    <div className="w-screen h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <Link
          to="/fzt"
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          &larr; current
        </Link>
        <h1 className="text-sm font-bold text-slate-300">fzt Proposed Architecture</h1>
        <Link
          to="/fzt/repos"
          className="text-xs text-amber-500/70 hover:text-amber-400 transition-colors"
        >
          repo split &rarr;
        </Link>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-3 text-[10px] text-slate-400 max-w-md justify-end">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#0c1929', border: '1px solid #38bdf8' }} /> engine
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#1a1635', border: '1px solid #818cf8' }} /> rendering
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#2a2010', border: '1px solid #f59e0b' }} /> frontend logic
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#2a1025', border: '1px solid #f472b6' }} /> theme
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#1e293b', border: '1px solid #64748b' }} /> platform
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#1e1b2e', border: '1px solid #a78bfa' }} /> tool
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#0f2a1a', border: '1px solid #4ade80' }} /> consumer
        </span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
