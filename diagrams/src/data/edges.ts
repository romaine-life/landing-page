import type { InfraEdge } from '../types'

// Edge styling constants
const SHARED_STYLE = { stroke: '#38bdf8', strokeWidth: 1.5 }
const APP_STYLE = { stroke: '#a78bfa', strokeWidth: 1.5 }
const EXTERNAL_STYLE = { stroke: '#fb923c', strokeWidth: 1.5 }
const INFRA_STYLE = { stroke: '#4ade80', strokeWidth: 1.5 }

export const edges: InfraEdge[] = [
  // ── Apps → DNS ──────────────────────────────────────────────
  // All apps are routed through the DNS zone
  ...['plant-agent', 'kill-me', 'investing', 'lights', 'my-homepage', 'bender-world', 'eight-queens'].map(
    (app) => ({
      id: `${app}-dns`,
      source: app,
      target: 'dns',
      style: SHARED_STYLE,
      animated: false,
    }),
  ),

  // ── Apps → Cosmos DB ────────────────────────────────────────
  ...['plant-agent', 'kill-me', 'investing', 'my-homepage', 'lights'].map((app) => ({
    id: `${app}-cosmos`,
    source: app,
    target: 'cosmos',
    style: APP_STYLE,
    animated: true,
  })),

  // ── Key Vaults → External Secrets identity ──────────────────
  {
    id: 'keyvault-identity',
    source: 'keyvault',
    target: 'managed-identity',
    style: SHARED_STYLE,
  },

  // ── Auth apps → Entra ID ────────────────────────────────────
  ...['plant-agent', 'kill-me', 'investing', 'lights'].map((app) => ({
    id: `${app}-entra`,
    source: app,
    target: 'entra',
    style: EXTERNAL_STYLE,
  })),

  // ── my-homepage device auth ────────────────────────────────
  {
    id: 'client-devices-homepage',
    source: 'client-devices',
    target: 'my-homepage',
    style: EXTERNAL_STYLE,
    label: 'JWT',
  },

  // ── plant-agent external connections ────────────────────────
  {
    id: 'pi-blob',
    source: 'raspberry-pi',
    target: 'blob-storage',
    style: EXTERNAL_STYLE,
    animated: true,
    label: 'photos',
  },
  {
    id: 'plant-agent-blob',
    source: 'plant-agent',
    target: 'blob-storage',
    style: APP_STYLE,
  },
  {
    id: 'plant-agent-claude',
    source: 'plant-agent',
    target: 'claude',
    style: EXTERNAL_STYLE,
    animated: true,
    label: 'vision',
  },
  {
    id: 'plant-agent-pi',
    source: 'plant-agent',
    target: 'raspberry-pi',
    style: EXTERNAL_STYLE,
  },

  // ── lights → Hubitat ────────────────────────────────────────
  {
    id: 'lights-hubitat',
    source: 'lights',
    target: 'hubitat',
    style: EXTERNAL_STYLE,
    label: 'local',
  },

  // ── CI/CD connections ───────────────────────────────────────
  {
    id: 'actions-templates',
    source: 'github-actions',
    target: 'pipeline-templates',
    style: INFRA_STYLE,
  },
  {
    id: 'actions-bootstrap',
    source: 'github-actions',
    target: 'infra-bootstrap',
    style: INFRA_STYLE,
  },
]
