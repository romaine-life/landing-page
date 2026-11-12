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

import { fztArchNodes } from '../data/fzt-arch-nodes'
import { fztArchEdges } from '../data/fzt-arch-edges'
import FztArchNodeComponent from './FztArchNode'

const nodeTypes = {
  'fzt-arch': FztArchNodeComponent,
}

export default function FztArchView() {
  const [nodes, , onNodesChange] = useNodesState(fztArchNodes)
  const [edges, , onEdgesChange] = useEdgesState(fztArchEdges)

  return (
    <div className="w-screen h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <Link
          to="/"
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          &larr; infra
        </Link>
        <h1 className="text-sm font-bold text-slate-300">fzt Package Architecture</h1>
        <Link
          to="/fzt/proposed"
          className="text-xs text-amber-500/70 hover:text-amber-400 transition-colors"
        >
          proposed &rarr;
        </Link>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 flex gap-4 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: '#38bdf8' }} /> Go import
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: '#a78bfa' }} /> compiles to
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: '#f59e0b' }} /> JS/runtime
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: '#4ade80' }} /> consumer
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
