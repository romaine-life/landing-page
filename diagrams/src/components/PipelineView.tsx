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

import { pipelineNodes } from '../data/pipeline-nodes'
import { pipelineEdges } from '../data/pipeline-edges'
import PipelineNodeComponent from './PipelineNode'

const nodeTypes = {
  pipeline: PipelineNodeComponent,
}

export default function PipelineView() {
  const [nodes, , onNodesChange] = useNodesState(pipelineNodes)
  const [edges, , onEdgesChange] = useEdgesState(pipelineEdges)

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
        <h1 className="text-sm font-bold text-slate-300">Pipeline Dependencies</h1>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 flex gap-4 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: '#f59e0b' }} /> dispatch
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: '#38bdf8' }} /> internal
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: '#a78bfa' }} /> artifact
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 inline-block border-t-2 border-dashed" style={{ borderColor: '#ef4444' }} /> broken
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
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1e293b" />
        <Controls className="!bg-slate-800 !border-slate-700 !rounded-lg [&>button]:!bg-slate-800 [&>button]:!border-slate-700 [&>button]:!text-slate-400 [&>button:hover]:!bg-slate-700" />
      </ReactFlow>
    </div>
  )
}
