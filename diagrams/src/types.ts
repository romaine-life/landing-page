import type { Node, Edge } from '@xyflow/react'

export type NodeCategory = 'app' | 'shared' | 'external' | 'infra'

export type InfraNodeData = {
  label: string
  description: string
  icon: string
  category: NodeCategory
  apps: string[]
  url?: string
  subdomain?: string
}

export type InfraNode = Node<InfraNodeData>
export type InfraEdge = Edge

export type Annotation = {
  nodeId: string
  title: string
  body: string
  links?: { label: string; url: string }[]
}

export const APP_NAMES = [
  'plant-agent',
  'kill-me',
  'investing',
  'lights',
  'bender-world',
  'eight-queens',
  'my-homepage',
] as const

export type AppName = (typeof APP_NAMES)[number]

export const CATEGORY_COLORS: Record<NodeCategory, string> = {
  app: '#a78bfa',
  shared: '#38bdf8',
  external: '#fb923c',
  infra: '#4ade80',
}
