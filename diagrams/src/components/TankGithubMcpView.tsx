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

import { tankGithubMcpNodes } from '../data/tank-github-mcp-nodes'
import { tankGithubMcpEdges } from '../data/tank-github-mcp-edges'
import TankGithubMcpNodeComponent from './TankGithubMcpNode'

const nodeTypes = {
  'tank-github-mcp': TankGithubMcpNodeComponent,
}

const LEGEND = [
  { label: 'Tank control', color: '#38bdf8' },
  { label: 'token exchange', color: '#f59e0b' },
  { label: 'GitHub App', color: '#22c55e' },
  { label: 'secret / state', color: '#c084fc' },
  { label: 'return', color: '#94a3b8', dashed: true },
]

export default function TankGithubMcpView() {
  const [nodes, , onNodesChange] = useNodesState(tankGithubMcpNodes)
  const [edges, , onEdgesChange] = useEdgesState(tankGithubMcpEdges)

  return (
    <div className="h-screen w-screen bg-[#0f172a]">
      <div className="absolute left-4 top-4 z-10 flex items-center gap-4">
        <Link
          to="/"
          className="text-xs text-slate-500 transition-colors hover:text-slate-300"
        >
          &larr; infra
        </Link>
        <h1 className="text-sm font-bold text-slate-300">tank-operator / mcp-github</h1>
        <span className="max-w-[560px] text-[10px] leading-snug text-slate-500">
          Pod-bound service-account identity is exchanged for a short-lived Tank JWT before
          the GitHub MCP server mints any GitHub App installation token.
        </span>
      </div>

      <div className="absolute right-14 top-4 z-10 flex gap-4 text-[10px] text-slate-400">
        {LEGEND.map((item) => (
          <span key={item.label} className="flex items-center gap-1">
            <span
              className={`inline-block h-0.5 w-4 ${item.dashed ? 'border-t-2 border-dashed bg-transparent' : ''}`}
              style={item.dashed ? { borderColor: item.color } : { backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.25}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1e293b" />
        <Controls className="!rounded-lg !border-slate-700 !bg-slate-800 [&>button]:!border-slate-700 [&>button]:!bg-slate-800 [&>button]:!text-slate-400 [&>button:hover]:!bg-slate-700" />
        <MiniMap
          nodeColor={(node) => {
            const category = (node.data as { category?: string })?.category
            switch (category) {
              case 'tank':
                return '#a78bfa'
              case 'session':
                return '#2dd4bf'
              case 'token':
                return '#f59e0b'
              case 'mcp':
                return '#f472b6'
              case 'github':
                return '#22c55e'
              case 'store':
                return '#c084fc'
              case 'platform':
                return '#60a5fa'
              case 'policy':
                return '#fb7185'
              default:
                return '#64748b'
            }
          }}
          className="!border-slate-700 !bg-slate-900"
          maskColor="rgba(15, 23, 42, 0.8)"
        />
      </ReactFlow>
    </div>
  )
}
