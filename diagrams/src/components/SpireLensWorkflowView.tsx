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

import { spireLensWorkflowNodes } from '../data/spirelens-workflow-nodes'
import { spireLensWorkflowEdges } from '../data/spirelens-workflow-edges'
import SpireLensWorkflowNode from './SpireLensWorkflowNode'

const nodeTypes = {
  'spirelens-workflow': SpireLensWorkflowNode,
}

export default function SpireLensWorkflowView() {
  const [nodes, , onNodesChange] = useNodesState(spireLensWorkflowNodes)
  const [edges, , onEdgesChange] = useEdgesState(spireLensWorkflowEdges)

  return (
    <div className="w-screen h-screen bg-[#0f172a]">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
          &larr; infra
        </Link>
        <h1 className="text-sm font-bold text-slate-300">SpireLens Scenario Validation Workflow</h1>
      </div>

      <div className="absolute top-4 right-12 z-10 flex gap-4 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border" style={{ backgroundColor: '#0b1d2a', borderColor: '#38bdf8' }} /> save state
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border" style={{ backgroundColor: '#0d2416', borderColor: '#22c55e' }} /> MCP
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border" style={{ backgroundColor: '#1f1833', borderColor: '#a78bfa' }} /> LLM
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border" style={{ backgroundColor: '#2a1021', borderColor: '#f472b6' }} /> code
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border" style={{ backgroundColor: '#241d08', borderColor: '#eab308' }} /> PR
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border" style={{ backgroundColor: '#2b180b', borderColor: '#f97316' }} /> abort path
        </span>
      </div>

      <div className="absolute bottom-4 left-4 z-10 max-w-[520px] rounded-md border border-slate-700 bg-slate-900/90 px-4 py-3 text-[11px] leading-relaxed text-slate-400 shadow-xl">
        <div className="mb-1 text-xs font-semibold text-slate-200">Current operating rule</div>
        Three LLM phases stay separate: test primitives define the scenario, code changes stay narrowly scoped, and the verifier
        proves behavior with MCP state plus screenshots before the final PR handoff.
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.24 }}
        minZoom={0.25}
        maxZoom={1.6}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e293b" />
        <Controls className="!bg-slate-800 !border-slate-700 !rounded-lg [&>button]:!bg-slate-800 [&>button]:!border-slate-700 [&>button]:!text-slate-400 [&>button:hover]:!bg-slate-700" />
      </ReactFlow>
    </div>
  )
}
