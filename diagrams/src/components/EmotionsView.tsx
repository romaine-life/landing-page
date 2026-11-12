import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Link } from 'react-router-dom'

import { emotionsNodes } from '../data/emotions-nodes'
import { emotionsEdges } from '../data/emotions-edges'
import EmotionsNodeComponent from './EmotionsNode'

const nodeTypes = {
  emotions: EmotionsNodeComponent,
}

export default function EmotionsView() {
  const [nodes, , onNodesChange] = useNodesState(emotionsNodes)
  const [edges, , onEdgesChange] = useEdgesState(emotionsEdges)

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
        <h1 className="text-sm font-bold text-slate-300">emotions-mcp</h1>
        <span className="text-[10px] text-slate-500">
          Restoring the feedback half of human communication
        </span>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 flex gap-4 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#0a1f0f', border: '1px solid #4ade80' }} /> human
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#0a1528', border: '1px solid #38bdf8' }} /> llm
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#1a0f2e', border: '1px solid #c084fc' }} /> shared
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#15102a', border: '1px solid #a78bfa' }} /> future
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: '#4ade80' }} /> signal
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 inline-block border-t-2 border-dashed" style={{ borderColor: '#fbbf24' }} /> weak
        </span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1e293b" />
        <Controls className="!bg-slate-800 !border-slate-700 !rounded-lg [&>button]:!bg-slate-800 [&>button]:!border-slate-700 [&>button]:!text-slate-400 [&>button:hover]:!bg-slate-700" />
        <MiniMap
          nodeColor={(node) => {
            const category = (node.data as { category?: string })?.category
            switch (category) {
              case 'human':
              case 'perception':
                return '#4ade80'
              case 'llm':
                return '#38bdf8'
              case 'shared':
                return '#c084fc'
              case 'future':
                return '#a78bfa'
              case 'interface':
                return '#f59e0b'
              default:
                return '#64748b'
            }
          }}
          className="!bg-slate-900 !border-slate-700"
          maskColor="rgba(15, 23, 42, 0.8)"
        />
      </ReactFlow>
    </div>
  )
}
