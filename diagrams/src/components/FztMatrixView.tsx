import { Link } from 'react-router-dom'

// Layer definitions — columns
const LAYERS = [
  { key: 'renderers', label: 'Renderers' },
  { key: 'frontend-palette', label: ': palette' },
  { key: 'frontend-identity', label: 'Identity' },
  { key: 'frontend-actions', label: 'Actions' },
  { key: 'style-palette', label: 'Colors' },
  { key: 'style-font', label: 'Font' },
  { key: 'style-crt', label: 'CRT' },
  { key: 'providers', label: 'Provider' },
  { key: 'engine-scorer', label: 'Scorer' },
  { key: 'engine-tree', label: 'Tree' },
]

// Repo colors — each package maps to its repo color
const REPO_COLORS: Record<string, { bg: string; border: string; label: string }> = {
  'fzt-terminal':  { bg: '#1e293b', border: '#64748b', label: 'fzt (terminal)' },
  'fzt-browser':   { bg: '#1e293b', border: '#64748b', label: 'fzt (browser+WASM)' },
  'fzt-frontend':  { bg: '#2a2010', border: '#f59e0b', label: 'fzt-frontend' },
  'fzt-style':     { bg: '#2a1025', border: '#f472b6', label: 'fzt-style' },
  'fzt-engine':    { bg: '#0c1929', border: '#38bdf8', label: 'fzt (engine)' },
  'fzt-provider':  { bg: '#1e1b2e', border: '#a78bfa', label: 'fzt (provider)' },
  empty:           { bg: 'transparent', border: '#1e293b', label: '' },
}

type CellValue = {
  repo: keyof typeof REPO_COLORS
  label?: string // short label inside cell
}

type ToolRow = {
  name: string
  repo: string
  cells: Record<string, CellValue>
}

const tools: ToolRow[] = [
  {
    name: 'fzt-automate',
    repo: 'romaine-life/fzt-automate',
    cells: {
      'renderers': { repo: 'fzt-terminal', label: 'terminal' },
      'frontend-palette': { repo: 'fzt-frontend' },
      'frontend-identity': { repo: 'fzt-frontend' },
      'frontend-actions': { repo: 'fzt-frontend' },
      'style-palette': { repo: 'fzt-style' },
      'style-font': { repo: 'fzt-style' },
      'style-crt': { repo: 'empty' },
      'providers': { repo: 'fzt-provider', label: 'YAML' },
      'engine-scorer': { repo: 'fzt-engine' },
      'engine-tree': { repo: 'fzt-engine' },
    },
  },
  {
    name: 'fzt-picker',
    repo: 'romaine-life/fzt-picker',
    cells: {
      'renderers': { repo: 'fzt-terminal', label: 'terminal' },
      'frontend-palette': { repo: 'fzt-frontend' },
      'frontend-identity': { repo: 'fzt-frontend' },
      'frontend-actions': { repo: 'fzt-frontend' },
      'style-palette': { repo: 'fzt-style' },
      'style-font': { repo: 'fzt-style' },
      'style-crt': { repo: 'empty' },
      'providers': { repo: 'fzt-provider', label: 'DirProvider' },
      'engine-scorer': { repo: 'fzt-engine' },
      'engine-tree': { repo: 'fzt-engine' },
    },
  },
  {
    name: 'my-homepage',
    repo: 'romaine-life/my-homepage',
    cells: {
      'renderers': { repo: 'fzt-browser', label: 'browser' },
      'frontend-palette': { repo: 'fzt-frontend' },
      'frontend-identity': { repo: 'fzt-frontend' },
      'frontend-actions': { repo: 'fzt-frontend' },
      'style-palette': { repo: 'fzt-style' },
      'style-font': { repo: 'fzt-style' },
      'style-crt': { repo: 'fzt-style' },
      'providers': { repo: 'fzt-provider', label: 'YAML' },
      'engine-scorer': { repo: 'fzt-engine' },
      'engine-tree': { repo: 'fzt-engine' },
    },
  },
  {
    name: 'fzt-showcase',
    repo: 'romaine-life/fzt-showcase',
    cells: {
      'renderers': { repo: 'fzt-browser', label: 'browser' },
      'frontend-palette': { repo: 'fzt-frontend' },
      'frontend-identity': { repo: 'fzt-frontend' },
      'frontend-actions': { repo: 'fzt-frontend' },
      'style-palette': { repo: 'fzt-style' },
      'style-font': { repo: 'fzt-style' },
      'style-crt': { repo: 'fzt-style' },
      'providers': { repo: 'fzt-provider', label: 'YAML' },
      'engine-scorer': { repo: 'fzt-engine' },
      'engine-tree': { repo: 'fzt-engine' },
    },
  },
]

// Group columns by repo for header
const COL_GROUPS = [
  { label: 'Renderers', repo: 'romaine-life/fzt', cols: ['renderers'], color: '#64748b' },
  { label: 'Frontend', repo: 'romaine-life/fzt-frontend', cols: ['frontend-palette', 'frontend-identity', 'frontend-actions'], color: '#f59e0b' },
  { label: 'Style', repo: 'nelsong6/fzt-style', cols: ['style-palette', 'style-font', 'style-crt'], color: '#f472b6' },
  { label: 'Providers', repo: 'romaine-life/fzt', cols: ['providers'], color: '#a78bfa' },
  { label: 'Engine', repo: 'romaine-life/fzt', cols: ['engine-scorer', 'engine-tree'], color: '#38bdf8' },
]

export default function FztMatrixView() {
  return (
    <div className="w-screen h-screen bg-[#0f172a] overflow-auto">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex items-center gap-4">
        <Link
          to="/fzt/shared"
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          &larr; shared deps
        </Link>
        <h1 className="text-sm font-bold text-slate-300">fzt Feature Matrix</h1>
      </div>

      {/* Legend */}
      <div className="px-6 pb-4 flex gap-4 flex-wrap text-[10px]">
        {Object.entries(REPO_COLORS).filter(([k]) => k !== 'empty').map(([key, val]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span
              className="w-4 h-3 rounded-sm inline-block border"
              style={{ backgroundColor: val.bg, borderColor: val.border }}
            />
            <span style={{ color: val.border }}>{val.label}</span>
          </span>
        ))}
      </div>

      {/* Matrix */}
      <div className="px-6 pb-6">
        <table className="border-collapse w-full">
          {/* Group headers */}
          <thead>
            <tr>
              <th className="w-40" />
              {COL_GROUPS.map((group) => (
                <th
                  key={group.label}
                  colSpan={group.cols.length}
                  className="text-[10px] font-bold px-2 py-1.5 text-left border-b-2"
                  style={{ color: group.color, borderColor: `${group.color}44` }}
                >
                  <div>{group.label}</div>
                  <div className="text-[8px] font-mono font-normal opacity-40">{group.repo}</div>
                </th>
              ))}
            </tr>
            {/* Column sub-headers */}
            <tr>
              <th className="w-40" />
              {LAYERS.map((layer) => (
                <th
                  key={layer.key}
                  className="text-[9px] font-normal text-slate-500 px-2 py-1 text-left border-b border-slate-800/50"
                >
                  {layer.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <tr key={tool.name} className="group">
                {/* Tool name */}
                <td className="py-2 pr-3 border-r border-slate-800/50">
                  <Link
                    to={`/fzt/tool/${tool.name}`}
                    className="text-xs font-medium text-green-400 hover:text-green-300 transition-colors"
                  >
                    {tool.name}
                  </Link>
                  <div className="text-[8px] font-mono text-slate-600">{tool.repo}</div>
                </td>
                {/* Cells */}
                {LAYERS.map((layer) => {
                  const cell = tool.cells[layer.key]
                  const color = REPO_COLORS[cell?.repo ?? 'empty']
                  const isEmpty = cell?.repo === 'empty'
                  return (
                    <td key={layer.key} className="px-1.5 py-2">
                      <div
                        className="rounded h-8 flex items-center justify-center border text-[9px] font-mono transition-all duration-150"
                        style={{
                          backgroundColor: isEmpty ? 'transparent' : color.bg,
                          borderColor: isEmpty ? '#1e293b' : `${color.border}66`,
                          color: isEmpty ? '#334155' : `${color.border}aa`,
                        }}
                      >
                        {isEmpty ? '—' : (cell?.label || '')}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
