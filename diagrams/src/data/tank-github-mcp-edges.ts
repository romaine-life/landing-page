import { MarkerType, type Edge } from '@xyflow/react'

const CONTROL = '#38bdf8'
const TOKEN = '#f59e0b'
const GITHUB = '#22c55e'
const STORE = '#c084fc'
const RETURN = '#94a3b8'
const POLICY = '#f43f5e'

function flowEdge(
  id: string,
  source: string,
  target: string,
  label: string,
  color: string,
  sourceHandle = 'right',
  targetHandle = 'left',
  animated = false,
): Edge {
  return {
    id,
    source,
    target,
    sourceHandle,
    targetHandle,
    type: 'smoothstep',
    label,
    animated,
    markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
    style: { stroke: color, strokeWidth: 2 },
    labelStyle: { fill: '#cbd5e1', fontSize: 10, fontWeight: 500 },
    labelBgStyle: { fill: '#0f172a', fillOpacity: 0.92 },
    labelBgPadding: [6, 3],
    labelBgBorderRadius: 4,
  }
}

function dashedEdge(
  id: string,
  source: string,
  target: string,
  label: string,
  color: string,
  sourceHandle = 'right',
  targetHandle = 'left',
): Edge {
  return {
    ...flowEdge(id, source, target, label, color, sourceHandle, targetHandle),
    style: { stroke: color, strokeWidth: 1.8, strokeDasharray: '6 5' },
  }
}

export const tankGithubMcpEdges: Edge[] = [
  flowEdge('browser-orchestrator', 'browser', 'orchestrator', 'login + install URL', CONTROL),
  flowEdge('orchestrator-profile', 'orchestrator', 'profile', 'profile row', STORE),
  flowEdge('orchestrator-install', 'orchestrator', 'github-app-install', 'state JWT + callback', GITHUB),
  flowEdge('install-profile', 'github-app-install', 'profile', 'installation_id', GITHUB, 'left', 'right'),
  flowEdge('orchestrator-kv', 'orchestrator', 'key-vault', 'sign JWTs', STORE, 'bottom', 'top'),

  flowEdge('orchestrator-agent', 'orchestrator', 'agent', 'create pod + labels', CONTROL, 'bottom', 'top'),
  flowEdge('config-agent', 'mcp-config', 'agent', 'server name: github', CONTROL, 'top', 'bottom'),
  flowEdge('agent-proxy', 'agent', 'mcp-proxy', 'MCP HTTP localhost:9992', CONTROL, 'right', 'left', true),
  flowEdge('proxy-token', 'mcp-proxy', 'projected-token', 'read fresh', TOKEN, 'bottom', 'top'),
  flowEdge('token-orchestrator', 'projected-token', 'orchestrator', 'POST /api/internal/github/attestation', TOKEN, 'top', 'bottom', true),
  flowEdge('orchestrator-k8s', 'orchestrator', 'k8s-api', 'TokenReview + pod UID', TOKEN, 'bottom', 'top'),
  flowEdge('k8s-orchestrator', 'k8s-api', 'orchestrator', 'valid Tank session pod', RETURN, 'top', 'bottom'),
  flowEdge('profile-orchestrator', 'profile', 'orchestrator', 'owner email -> install id', STORE, 'left', 'right'),
  dashedEdge('kv-orchestrator', 'key-vault', 'orchestrator', '5 min RS256 attestation', STORE, 'top', 'bottom'),
  flowEdge('orchestrator-proxy', 'orchestrator', 'mcp-proxy', 'aud=mcp-github-tank', TOKEN, 'right', 'top', true),

  flowEdge('proxy-mcp-github', 'mcp-proxy', 'mcp-github', 'forward MCP + Tank JWT', TOKEN, 'right', 'left', true),
  dashedEdge('mcp-jwks', 'mcp-github', 'orchestrator', 'fetch JWKS', RETURN, 'top', 'right'),
  flowEdge('mcp-secrets', 'mcp-github-secrets', 'mcp-github', 'App keys', STORE, 'top', 'bottom'),
  flowEdge('mcp-minter', 'mcp-github', 'minter-pool', 'caller identity', GITHUB, 'right', 'left', true),
  flowEdge('secrets-minter', 'mcp-github-secrets', 'minter-pool', 'host/user app', STORE, 'right', 'bottom'),
  flowEdge('minter-github', 'minter-pool', 'github-api', 'installation token', GITHUB, 'right', 'left', true),
  flowEdge('mcp-github-api', 'mcp-github', 'github-api', 'tool request', GITHUB, 'right', 'left', true),
  dashedEdge('github-mcp-return', 'github-api', 'mcp-github', 'tool result', RETURN, 'left', 'right'),
  dashedEdge('mcp-proxy-return', 'mcp-github', 'mcp-proxy', 'MCP response', RETURN, 'left', 'right'),
  dashedEdge('proxy-agent-return', 'mcp-proxy', 'agent', 'result or clone token', RETURN, 'left', 'right'),
  flowEdge('github-clone-token', 'github-api', 'clone-token', 'scoped token', GITHUB, 'bottom', 'top'),
  flowEdge('mcp-write-policy', 'mcp-github', 'write-policy', 'writes resolve refs server-side', POLICY, 'bottom', 'top'),
]
