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

import { fztKeyboardNodes } from '../data/fzt-keyboard-nodes'
import { fztKeyboardEdges } from '../data/fzt-keyboard-edges'
import FztKeyboardNodeComponent from './FztKeyboardNode'

const nodeTypes = { 'fzt-keyboard': FztKeyboardNodeComponent }

export default function FztKeyboardView() {
  const [nodes, , onNodesChange] = useNodesState(fztKeyboardNodes)
  const [edges, , onEdgesChange] = useEdgesState(fztKeyboardEdges)

  return (
    <div className="w-screen h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <Link to="/fzt" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
          &larr; fzt
        </Link>
        <h1 className="text-sm font-bold text-slate-300">fzt Keyboard State Model</h1>
        <a
          href="https://github.com/romaine-life/fzt-terminal/blob/main/CLAUDE.md"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          narrative reference &rarr;
        </a>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 text-[10px] text-slate-400 items-end">
        <div className="flex gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#2a2410', border: '1px solid #f9e2af' }} />
            search mode
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#0f2524', border: '1px solid #94e2d5' }} />
            normal mode
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#1e1b2e', border: '1px solid #cba6f7' }} />
            edit mode
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#0f1e12', border: '1px solid #a6e3a1' }} />
            commit
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#2a1019', border: '1px solid #f38ba8' }} />
            cancel
          </span>
        </div>
        <div className="flex gap-3 mt-1 text-slate-500">
          <span>edge color follows destination mode</span>
        </div>
      </div>

      {/* Escape cascade footnote */}
      <div className="absolute bottom-16 left-4 z-10 max-w-[420px] text-[10px] text-slate-400 leading-relaxed bg-slate-900/80 border border-slate-700 rounded-md px-3 py-2">
        <div className="font-bold text-slate-300 mb-1">Escape cascade</div>
        Each Escape steps back one layer:
        <ol className="list-decimal list-inside mt-1 space-y-0.5 text-slate-400">
          <li>cancel active edit mode (if any)</li>
          <li>clear non-empty query</li>
          <li>pop one scope level</li>
          <li>pop one context (palette was a pushed context)</li>
          <li>at root, nothing to unwind &rarr; cancel</li>
        </ol>
        <div className="mt-1 text-slate-500">Shift+Backspace collapses 2–4 into one gesture, preserving edit mode.</div>
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
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1e293b" />
        <Controls className="!bg-slate-800 !border-slate-700 !rounded-lg [&>button]:!bg-slate-800 [&>button]:!border-slate-700 [&>button]:!text-slate-400 [&>button:hover]:!bg-slate-700" />
      </ReactFlow>
    </div>
  )
}
