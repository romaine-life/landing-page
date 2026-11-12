import { X, ExternalLink } from 'lucide-react'
import type { Annotation } from '../types'
import { CATEGORY_COLORS, type NodeCategory } from '../types'

type DetailPanelProps = {
  annotation: Annotation | null
  category: NodeCategory | null
  onClose: () => void
}

export default function DetailPanel({ annotation, category, onClose }: DetailPanelProps) {
  if (!annotation) return null

  const accentColor = category ? CATEGORY_COLORS[category] : '#38bdf8'

  return (
    <div className="absolute top-0 right-0 h-full w-[380px] bg-surface border-l border-border z-50 overflow-y-auto shadow-2xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h2
            className="text-lg font-bold"
            style={{ color: accentColor }}
          >
            {annotation.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-surface-hover transition-colors text-text-muted hover:text-text"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
          {annotation.body}
        </div>

        {/* Links */}
        {annotation.links && annotation.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {annotation.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-surface-hover"
                style={{
                  color: accentColor,
                  borderColor: `${accentColor}44`,
                }}
              >
                <ExternalLink size={12} />
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
