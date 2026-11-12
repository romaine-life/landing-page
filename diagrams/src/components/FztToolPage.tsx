import { Link, useParams } from 'react-router-dom'
import { toolConfigs, type LayerItem } from '../data/fzt-tool-configs'

const LAYERS = [
  { key: 'renderers', label: 'Renderers', repo: 'romaine-life/fzt', color: '#64748b', bg: '#1e293b' },
  { key: 'frontend', label: 'Frontend', repo: 'romaine-life/fzt-frontend', color: '#f59e0b', bg: '#2a2010' },
  { key: 'style', label: 'Style', repo: 'nelsong6/fzt-style', color: '#f472b6', bg: '#2a1025' },
  { key: 'providers', label: 'Providers', repo: 'romaine-life/fzt', color: '#a78bfa', bg: '#1e1b2e' },
  { key: 'engine', label: 'Engine', repo: 'romaine-life/fzt', color: '#38bdf8', bg: '#0c1929' },
] as const

function LayerRow({ layer, items }: { layer: typeof LAYERS[number]; items: LayerItem[] }) {
  const empty = items.length === 0
  return (
    <div className="flex items-stretch border-b border-slate-800/50">
      {/* Row label */}
      <div
        className="w-48 flex-shrink-0 px-4 py-4 flex flex-col justify-center border-r"
        style={{ borderColor: `${layer.color}33` }}
      >
        <div className="text-xs font-bold" style={{ color: layer.color }}>{layer.label}</div>
        <div className="text-[9px] font-mono opacity-40 mt-0.5 text-slate-400">{layer.repo}</div>
      </div>

      {/* Items or empty */}
      <div className="flex-1 px-4 py-3 flex items-center gap-3 flex-wrap min-h-[60px]">
        {empty ? (
          <span className="text-[10px] text-slate-600 italic">not used</span>
        ) : (
          items.map((item) => (
            <div
              key={item.label}
              className="rounded px-3 py-1.5 border text-xs"
              style={{
                backgroundColor: layer.bg,
                borderColor: `${layer.color}55`,
                color: `${layer.color}cc`,
              }}
            >
              <span className="font-medium">{item.label}</span>
              <span className="ml-2 opacity-50 text-[10px]">{item.description}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function FztToolPage() {
  const { tool } = useParams<{ tool: string }>()
  const config = toolConfigs.find((t) => t.name === tool)

  if (!config) {
    return (
      <div className="w-screen h-screen bg-[#0f172a] flex items-center justify-center text-slate-400">
        Tool not found. <Link to="/fzt/shared" className="ml-2 text-amber-400 underline">Back to overview</Link>
      </div>
    )
  }

  // Navigation: prev/next tool
  const idx = toolConfigs.indexOf(config)
  const prev = idx > 0 ? toolConfigs[idx - 1] : null
  const next = idx < toolConfigs.length - 1 ? toolConfigs[idx + 1] : null

  return (
    <div className="w-screen h-screen bg-[#0f172a] overflow-auto">
      {/* Header */}
      <div className="px-6 pt-5 pb-3 flex items-center gap-4">
        <Link
          to="/fzt/shared"
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          &larr; overview
        </Link>
        {prev && (
          <Link
            to={`/fzt/tool/${prev.name}`}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            &larr; {prev.name}
          </Link>
        )}
        <h1 className="text-lg font-bold text-slate-200">{config.name}</h1>
        {next && (
          <Link
            to={`/fzt/tool/${next.name}`}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            {next.name} &rarr;
          </Link>
        )}
      </div>

      {/* Tool info */}
      <div className="px-6 pb-4">
        <div className="text-[10px] font-mono text-slate-500">{config.repo}</div>
        <div className="text-sm text-slate-400 mt-1">{config.description}</div>
      </div>

      {/* Layer stack */}
      <div className="mx-6 rounded-lg border border-slate-800 overflow-hidden mb-6">
        {LAYERS.map((layer) => (
          <LayerRow
            key={layer.key}
            layer={layer}
            items={config[layer.key]}
          />
        ))}
      </div>
    </div>
  )
}
