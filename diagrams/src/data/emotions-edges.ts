import type { Edge } from '@xyflow/react'

export const emotionsEdges: Edge[] = [
  // ═══════════════════════════════════════
  // CURRENT STATE
  // ═══════════════════════════════════════

  // Human signals → mostly lost
  {
    id: 'human-signals-lost',
    source: 'human-signals',
    target: 'human-knife',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#4ade80', strokeWidth: 1.5, strokeDasharray: '5 5' },
    label: '90% lost',
    labelStyle: { fill: '#ef4444', fontSize: 10 },
  },

  // Knife → text interface (thin)
  {
    id: 'knife-to-interface',
    source: 'human-knife',
    target: 'text-interface',
    type: 'smoothstep',
    style: { stroke: '#4ade80', strokeWidth: 1.5 },
  },

  // Text interface → LLM blind (thin)
  {
    id: 'interface-to-blind',
    source: 'text-interface',
    target: 'llm-blind',
    type: 'smoothstep',
    style: { stroke: '#f59e0b', strokeWidth: 1.5 },
  },

  // LLM → opaque output (thick)
  {
    id: 'llm-to-opaque',
    source: 'llm-blind',
    target: 'llm-opaque',
    type: 'smoothstep',
    style: { stroke: '#38bdf8', strokeWidth: 1.5, strokeDasharray: '5 5' },
  },

  // Opaque → text interface (thick)
  {
    id: 'opaque-to-interface',
    source: 'llm-opaque',
    target: 'text-interface',
    type: 'smoothstep',
    style: { stroke: '#38bdf8', strokeWidth: 4 },
    label: 'full output',
    labelStyle: { fill: '#38bdf8', fontSize: 10 },
  },

  // Post-it dangles from interface
  {
    id: 'interface-to-postit',
    source: 'text-interface',
    target: 'postit',
    type: 'smoothstep',
    style: { stroke: '#fbbf24', strokeWidth: 1, strokeDasharray: '3 3' },
  },

  // ═══════════════════════════════════════
  // FUTURE STATE
  // ═══════════════════════════════════════

  // Human → perception layer
  {
    id: 'human-to-perception',
    source: 'human-future',
    target: 'perception-layer',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#4ade80', strokeWidth: 3 },
  },

  // Perception → shared space
  {
    id: 'perception-to-shared',
    source: 'perception-layer',
    target: 'shared-space',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#c084fc', strokeWidth: 2.5 },
  },

  // Shared space → query tool
  {
    id: 'shared-to-query',
    source: 'shared-space',
    target: 'query-tool',
    type: 'smoothstep',
    style: { stroke: '#c084fc', strokeWidth: 2 },
  },

  // Query tool ← LLM (LLM initiates)
  {
    id: 'llm-to-query',
    source: 'llm-future',
    target: 'query-tool',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#38bdf8', strokeWidth: 2.5 },
    label: 'pulls when uncertain',
    labelStyle: { fill: '#94a3b8', fontSize: 10 },
  },

  // LLM → expression layer
  {
    id: 'llm-to-expression',
    source: 'llm-future',
    target: 'expression-layer',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#38bdf8', strokeWidth: 3 },
  },

  // Expression → shared space
  {
    id: 'expression-to-shared',
    source: 'expression-layer',
    target: 'shared-space',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#c084fc', strokeWidth: 2.5 },
  },

  // Dimensional layers chain
  {
    id: 'dim-1-to-2',
    source: 'dim-prosody',
    target: 'dim-face-body',
    type: 'smoothstep',
    style: { stroke: '#4ade80', strokeWidth: 1.5 },
    label: 'adds dimensions',
    labelStyle: { fill: '#64748b', fontSize: 9 },
  },
  {
    id: 'dim-2-to-3',
    source: 'dim-face-body',
    target: 'dim-physiology',
    type: 'smoothstep',
    style: { stroke: '#a78bfa', strokeWidth: 1.5 },
  },
  {
    id: 'dim-3-to-4',
    source: 'dim-physiology',
    target: 'dim-temporal',
    type: 'smoothstep',
    style: { stroke: '#a78bfa', strokeWidth: 1.5 },
  },

  // Perception layer fed by dimensional layers
  {
    id: 'prosody-to-perception',
    source: 'dim-prosody',
    target: 'perception-layer',
    type: 'smoothstep',
    style: { stroke: '#4ade8055', strokeWidth: 1, strokeDasharray: '4 4' },
  },

  // Temporal → shared space (time enables relationship)
  {
    id: 'temporal-to-shared',
    source: 'dim-temporal',
    target: 'shared-space',
    type: 'smoothstep',
    style: { stroke: '#a78bfa55', strokeWidth: 1, strokeDasharray: '4 4' },
  },

  // North star connections
  {
    id: 'shared-to-star',
    source: 'shared-space',
    target: 'north-star',
    type: 'smoothstep',
    style: { stroke: '#c084fc', strokeWidth: 2, strokeDasharray: '6 3' },
  },
]
