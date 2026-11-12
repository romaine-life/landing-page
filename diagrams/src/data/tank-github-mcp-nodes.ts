import type { Node } from '@xyflow/react'

export type TankGithubMcpNodeData = {
  label: string
  description?: string
  eyebrow?: string
  step?: string
  category:
    | 'label'
    | 'actor'
    | 'tank'
    | 'session'
    | 'token'
    | 'mcp'
    | 'github'
    | 'store'
    | 'platform'
    | 'policy'
}

export type TankGithubMcpNode = Node<TankGithubMcpNodeData>

const W = 270
const WIDE = 320

export const tankGithubMcpNodes: TankGithubMcpNode[] = [
  {
    id: 'label-control',
    type: 'tank-github-mcp',
    position: { x: -70, y: -105 },
    data: {
      label: 'CONTROL PLANE',
      description: 'Identity, install state, session creation',
      category: 'label',
    },
  },
  {
    id: 'label-runtime',
    type: 'tank-github-mcp',
    position: { x: -70, y: 205 },
    data: {
      label: 'PER MCP CALL',
      description: 'Localhost MCP request becomes a GitHub App call',
      category: 'label',
    },
  },
  {
    id: 'label-boundary',
    type: 'tank-github-mcp',
    position: { x: 700, y: 205 },
    data: {
      label: 'MCP SERVER BOUNDARY',
      description: 'Tank attestation is the only caller credential mcp-github accepts',
      category: 'label',
    },
  },
  {
    id: 'browser',
    type: 'tank-github-mcp',
    position: { x: 0, y: 0 },
    width: W,
    data: {
      step: '1',
      eyebrow: 'user edge',
      label: 'Browser SPA',
      description: 'Signs in with Entra ID and starts the GitHub App install flow when the profile has no installation_id.',
      category: 'actor',
    },
  },
  {
    id: 'orchestrator',
    type: 'tank-github-mcp',
    position: { x: 355, y: 0 },
    width: W,
    data: {
      step: '2',
      eyebrow: 'tank-operator',
      label: 'Go orchestrator',
      description: 'Owns user profiles, creates session pods, validates pod-bound service-account tokens, and signs Tank JWTs.',
      category: 'tank',
    },
  },
  {
    id: 'profile',
    type: 'tank-github-mcp',
    position: { x: 710, y: 0 },
    width: W,
    data: {
      eyebrow: 'cosmos profile',
      label: 'owner email + installation_id',
      description: 'The GitHub App installation id is stored per Tank user and later copied into the MCP attestation.',
      category: 'store',
    },
  },
  {
    id: 'github-app-install',
    type: 'tank-github-mcp',
    position: { x: 1065, y: 0 },
    width: W,
    data: {
      eyebrow: 'github.com',
      label: 'tank-operator-romaine-life',
      description: 'User-facing GitHub App install consent. The callback is state-bound to the logged-in Tank user.',
      category: 'github',
    },
  },
  {
    id: 'key-vault',
    type: 'tank-github-mcp',
    position: { x: 355, y: 145 },
    width: W,
    data: {
      eyebrow: 'signing material',
      label: 'Key Vault RSA key',
      description: 'The orchestrator signs session, install-state, and GitHub MCP attestation JWTs without exporting private bytes.',
      category: 'store',
    },
  },
  {
    id: 'agent',
    type: 'tank-github-mcp',
    position: { x: 0, y: 325 },
    width: W,
    data: {
      step: '3',
      eyebrow: 'session pod',
      label: 'Codex / Claude MCP client',
      description: 'The agent sees the server name github and sends MCP HTTP to 127.0.0.1:9992 inside its own pod.',
      category: 'session',
    },
  },
  {
    id: 'mcp-config',
    type: 'tank-github-mcp',
    position: { x: 0, y: 500 },
    width: W,
    data: {
      eyebrow: '/workspace/.mcp.json',
      label: 'github -> localhost:9992',
      description: 'Tank mounts MCP config into every session so agents never talk to in-cluster services directly.',
      category: 'session',
    },
  },
  {
    id: 'mcp-proxy',
    type: 'tank-github-mcp',
    position: { x: 355, y: 325 },
    width: W,
    data: {
      step: '4',
      eyebrow: 'pod sidecar',
      label: 'mcp-auth-proxy',
      description: 'Reads the projected token fresh per request, exchanges it for a Tank attestation, then forwards the MCP request.',
      category: 'token',
    },
  },
  {
    id: 'projected-token',
    type: 'tank-github-mcp',
    position: { x: 355, y: 500 },
    width: W,
    data: {
      eyebrow: 'projected SA token',
      label: 'audience: tank-operator',
      description: 'Bound to the session pod name and UID. It is useful to Tank, not directly to mcp-github.',
      category: 'token',
    },
  },
  {
    id: 'k8s-api',
    type: 'tank-github-mcp',
    position: { x: 355, y: 675 },
    width: W,
    data: {
      eyebrow: 'kubernetes api',
      label: 'TokenReview + pod lookup',
      description: 'Confirms namespace, service account, pod binding, Tank labels, active scope, and owner annotation.',
      category: 'platform',
    },
  },
  {
    id: 'mcp-github',
    type: 'tank-github-mcp',
    position: { x: 710, y: 325 },
    width: WIDE,
    data: {
      step: '5',
      eyebrow: 'mcp-github service',
      label: 'Tank-bound GitHub MCP',
      description: 'Accepts only Tank-signed aud=mcp-github-tank JWTs, verifies JWKS, and binds caller identity to each tool call.',
      category: 'mcp',
    },
  },
  {
    id: 'mcp-github-secrets',
    type: 'tank-github-mcp',
    position: { x: 730, y: 520 },
    width: W,
    data: {
      eyebrow: 'ExternalSecret',
      label: 'GitHub App credentials',
      description: 'Host app and user-facing app private keys live with mcp-github, never in session pods.',
      category: 'store',
    },
  },
  {
    id: 'minter-pool',
    type: 'tank-github-mcp',
    position: { x: 1095, y: 325 },
    width: W,
    data: {
      eyebrow: 'per caller routing',
      label: 'MinterPool',
      description: 'Host sessions use romaine-life-app. User sessions use their installation_id, with super-admin fallback for cross-install repos.',
      category: 'mcp',
    },
  },
  {
    id: 'github-api',
    type: 'tank-github-mcp',
    position: { x: 1450, y: 325 },
    width: W,
    data: {
      step: '6',
      eyebrow: 'github rest api',
      label: 'Repo reads, writes, PRs',
      description: 'mcp-github mints short-lived installation tokens and executes the requested GitHub operation.',
      category: 'github',
    },
  },
  {
    id: 'clone-token',
    type: 'tank-github-mcp',
    position: { x: 1450, y: 500 },
    width: W,
    data: {
      eyebrow: 'optional shell path',
      label: 'mint_clone_token',
      description: 'Returns a scoped install token for explicit git clone or push flows. Default is contents: read.',
      category: 'github',
    },
  },
  {
    id: 'write-policy',
    type: 'tank-github-mcp',
    position: { x: 1095, y: 675 },
    width: WIDE,
    data: {
      eyebrow: 'write-safety rule',
      label: 'No caller-provided SHAs',
      description: 'Branch heads, base refs, and blob SHAs are resolved server-side at call time to avoid stale-cache reverts.',
      category: 'policy',
    },
  },
]
