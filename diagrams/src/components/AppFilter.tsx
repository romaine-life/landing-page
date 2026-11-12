import { APP_NAMES, CATEGORY_COLORS } from '../types'
import type { AppName } from '../types'

type AppFilterProps = {
  selectedApp: AppName | null
  onSelect: (app: AppName | null) => void
}

export default function AppFilter({ selectedApp, onSelect }: AppFilterProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-surface border-b border-border">
      <span className="text-xs font-medium text-text-muted mr-2 uppercase tracking-wider">
        Filter
      </span>
      <button
        onClick={() => onSelect(null)}
        className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
        style={{
          backgroundColor: selectedApp === null ? '#38bdf8' : 'transparent',
          color: selectedApp === null ? '#0f172a' : '#94a3b8',
          border: `1px solid ${selectedApp === null ? '#38bdf8' : '#334155'}`,
        }}
      >
        All
      </button>
      {APP_NAMES.map((app) => {
        const isActive = selectedApp === app
        const color = CATEGORY_COLORS.app
        return (
          <button
            key={app}
            onClick={() => onSelect(isActive ? null : app)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              backgroundColor: isActive ? color : 'transparent',
              color: isActive ? '#0f172a' : '#94a3b8',
              border: `1px solid ${isActive ? color : '#334155'}`,
            }}
          >
            {app}
          </button>
        )
      })}
    </div>
  )
}
