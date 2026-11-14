import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface VersionInfo {
  version: string
  sha: string
  deployedAt: string
}

function formatAge(iso: string, now: number): string {
  const sec = Math.floor((now - new Date(iso).getTime()) / 1000)
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day}d ago`
  return new Date(iso).toLocaleDateString()
}

function VersionFooter() {
  const [info, setInfo] = useState<VersionInfo | null>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}version.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setInfo(d))
      .catch(() => {})
    const t = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(t)
  }, [])

  if (!info) return null
  return (
    <div className="border-t border-slate-700 px-3 py-2 text-[10px] text-slate-500 leading-tight">
      <a
        href={`https://forgejo.romaine.life/romaine-life/landing-page/commit/${info.sha}`}
        target="_blank"
        rel="noreferrer"
        className="font-mono hover:text-slate-300 transition-colors"
      >
        {info.version}
      </a>
      <div title={info.deployedAt}>{formatAge(info.deployedAt, now)}</div>
    </div>
  )
}

const NAV_SECTIONS = [
  {
    label: 'Infrastructure',
    routes: [
      { path: '/', label: 'Overview' },
      { path: '/pipelines', label: 'Pipelines' },
      { path: '/tank-operator/mcp-github', label: 'Tank GitHub MCP' },
    ],
  },
  {
    label: 'fzt',
    routes: [
      { path: '/fzt', label: 'Architecture' },
      { path: '/fzt/final', label: 'Final' },
      { path: '/fzt/repos', label: 'Repos' },
      { path: '/fzt/shared', label: 'Shared' },
      { path: '/fzt/proposed', label: 'Proposed' },
      { path: '/fzt/matrix', label: 'Matrix' },
      { path: '/fzt/keyboard', label: 'Keyboard' },
    ],
  },
  {
    label: 'Other',
    routes: [
      { path: '/spirelens', label: 'SpireLens' },
      { path: '/certs', label: 'Cert Concepts' },
      { path: '/emotions', label: 'Emotions' },
    ],
  },
]

export default function NavSidebar() {
  const [collapsed, setCollapsed] = useState(true)
  const location = useLocation()

  return (
    <div
      className="fixed top-0 right-0 bottom-0 z-50 flex transition-transform duration-200"
      style={{ transform: collapsed ? 'translateX(100%)' : 'translateX(0)' }}
    >
      {/* Toggle tab */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute right-full top-3 w-8 h-10 flex items-center justify-center rounded-l-md border border-r-0 border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer text-lg"
      >
        {collapsed ? '\u2039' : '\u203A'}
      </button>

      {/* Panel */}
      <div className="w-48 bg-slate-900 border-l border-slate-700 flex flex-col">
        <div className="flex-1 overflow-y-auto py-4 px-3">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-4">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5 px-2">
                {section.label}
              </div>
              {section.routes.map((route) => {
                const active = location.pathname === route.path
                return (
                  <Link
                    key={route.path}
                    to={route.path}
                    className={`block px-2 py-1 rounded text-xs transition-colors ${
                      active
                        ? 'bg-slate-800 text-slate-200'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {route.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
        <VersionFooter />
      </div>
    </div>
  )
}
