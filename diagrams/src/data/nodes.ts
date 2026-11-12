import type { InfraNode } from '../types'

// Layout constants — positioned manually for a clear reading flow.
// Apps across the top, shared infra in the middle, external services at the bottom.
const COL = { left: 0, midLeft: 300, center: 600, midRight: 900, right: 1200 }
const ROW = { apps: 0, dns: 180, api: 320, data: 480, external: 650, cicd: 480 }

export const nodes: InfraNode[] = [
  // ── Apps (top row) ──────────────────────────────────────────
  {
    id: 'plant-agent',
    type: 'app',
    position: { x: 0, y: ROW.apps },
    data: {
      label: 'plant-agent',
      description: 'Plant monitoring + photo logging + AI chat',
      icon: 'Sprout',
      category: 'app',
      apps: ['plant-agent'],
      subdomain: 'plants.romaine.life',
      url: 'https://github.com/nelsong6/plant-agent',
    },
  },
  {
    id: 'kill-me',
    type: 'app',
    position: { x: 200, y: ROW.apps },
    data: {
      label: 'kill-me',
      description: '12-day Synergy workout tracker',
      icon: 'Dumbbell',
      category: 'app',
      apps: ['kill-me'],
      subdomain: 'kill-me.romaine.life',
      url: 'https://github.com/romaine-life/kill-me',
    },
  },
  {
    id: 'investing',
    type: 'app',
    position: { x: 400, y: ROW.apps },
    data: {
      label: 'investing',
      description: 'Portfolio analysis with LLM insights',
      icon: 'TrendingUp',
      category: 'app',
      apps: ['investing'],
      subdomain: 'investing.romaine.life',
      url: 'https://github.com/nelsong6/investing',
    },
  },
  {
    id: 'lights',
    type: 'app',
    position: { x: 600, y: ROW.apps },
    data: {
      label: 'lights',
      description: 'Hubitat smart home control',
      icon: 'Lightbulb',
      category: 'app',
      apps: ['lights'],
      subdomain: 'lights.romaine.life',
      url: 'https://github.com/romaine-life/lights',
    },
  },
  {
    id: 'my-homepage',
    type: 'app',
    position: { x: 800, y: ROW.apps },
    data: {
      label: 'my-homepage',
      description: 'Bookmark manager',
      icon: 'Bookmark',
      category: 'app',
      apps: ['my-homepage'],
      subdomain: 'homepage.romaine.life',
      url: 'https://github.com/romaine-life/my-homepage',
    },
  },
  {
    id: 'bender-world',
    type: 'app',
    position: { x: 1000, y: ROW.apps },
    data: {
      label: 'bender-world',
      description: 'Q-learning reinforcement learning visualization',
      icon: 'Bot',
      category: 'app',
      apps: ['bender-world'],
      subdomain: 'bender.romaine.life',
      url: 'https://github.com/romaine-life/bender-world',
    },
  },
  {
    id: 'eight-queens',
    type: 'app',
    position: { x: 1200, y: ROW.apps },
    data: {
      label: 'eight-queens',
      description: 'Genetic algorithm visualizer (8-queens puzzle)',
      icon: 'Crown',
      category: 'app',
      apps: ['eight-queens'],
      subdomain: 'queens.romaine.life',
      url: 'https://github.com/romaine-life/eight-queens',
    },
  },

  // ── Shared infrastructure ───────────────────────────────────
  {
    id: 'dns',
    type: 'infra',
    position: { x: COL.center, y: ROW.dns },
    data: {
      label: 'Azure DNS Zone',
      description: 'romaine.life — routes all subdomains to their apps',
      icon: 'Globe',
      category: 'shared',
      apps: [],
    },
  },
  {
    id: 'cosmos',
    type: 'infra',
    position: { x: COL.center, y: ROW.data },
    data: {
      label: 'Cosmos DB',
      description: 'Free tier, shared instance. Per-app databases: PlantAgentDB, WorkoutTrackerDB, HomepageDB, InvestingDB, LightsDB.',
      icon: 'Database',
      category: 'shared',
      apps: ['plant-agent', 'kill-me', 'investing', 'my-homepage', 'lights'],
    },
  },
  {
    id: 'keyvault',
    type: 'infra',
    position: { x: COL.midRight, y: ROW.data },
    data: {
      label: 'Key Vaults',
      description: 'App-owned vaults for runtime secrets; platform vaults for platform-owned material.',
      icon: 'KeyRound',
      category: 'shared',
      apps: [],
    },
  },
  {
    id: 'appconfig',
    type: 'infra',
    position: { x: COL.midRight, y: ROW.api },
    data: {
      label: 'App Configuration',
      description: 'Runtime feature flags and app settings where services need centralized config.',
      icon: 'Settings',
      category: 'shared',
      apps: [],
    },
  },
  {
    id: 'managed-identity',
    type: 'infra',
    position: { x: COL.right, y: ROW.data },
    data: {
      label: 'Managed Identity',
      description: 'infra-shared-identity lets External Secrets read app-owned vaults through scoped RBAC.',
      icon: 'Fingerprint',
      category: 'shared',
      apps: [],
    },
  },

  // ── External services ───────────────────────────────────────
  {
    id: 'entra',
    type: 'infra',
    position: { x: COL.left, y: ROW.external },
    data: {
      label: 'Microsoft Entra ID',
      description: 'MSAL.js auth → self-signed JWT (7-day). Admin email: nelson-devops-project@outlook.com.',
      icon: 'Shield',
      category: 'external',
      apps: ['plant-agent', 'kill-me', 'investing', 'lights'],
    },
  },
  {
    id: 'raspberry-pi',
    type: 'infra',
    position: { x: COL.midLeft, y: ROW.external },
    data: {
      label: 'Raspberry Pi 5',
      description: 'FastAPI service with camera module. Uploads plant photos to Azure Blob Storage via Cloudflare Tunnel (pi.romaine.life).',
      icon: 'Camera',
      category: 'external',
      apps: ['plant-agent'],
      subdomain: 'pi.romaine.life',
    },
  },
  {
    id: 'client-devices',
    type: 'infra',
    position: { x: COL.center, y: ROW.external },
    data: {
      label: 'Client Devices',
      description: 'Local machines (Win/Mac/Linux) with CLI auth tool — TPM/Secure Enclave key pairs tied to OS login.',
      icon: 'Monitor',
      category: 'external',
      apps: ['my-homepage'],
    },
  },
  {
    id: 'blob-storage',
    type: 'infra',
    position: { x: COL.midRight, y: ROW.external },
    data: {
      label: 'Azure Blob Storage',
      description: 'Stores plant photos uploaded by the Raspberry Pi.',
      icon: 'Image',
      category: 'shared',
      apps: ['plant-agent'],
    },
  },
  {
    id: 'claude',
    type: 'infra',
    position: { x: COL.right, y: ROW.external },
    data: {
      label: 'Claude Haiku API',
      description: 'Anthropic API — vision-based plant ID and health analysis.',
      icon: 'Brain',
      category: 'external',
      apps: ['plant-agent'],
    },
  },
  {
    id: 'hubitat',
    type: 'infra',
    position: { x: COL.right, y: ROW.external },
    data: {
      label: 'Hubitat C-8 Pro',
      description: 'Local smart home hub at 192.168.50.130. Maker API for light control.',
      icon: 'Wifi',
      category: 'external',
      apps: ['lights'],
    },
  },

  // ── CI/CD & IaC ────────────────────────────────────────────
  {
    id: 'github-actions',
    type: 'infra',
    position: { x: COL.left, y: ROW.cicd },
    data: {
      label: 'GitHub Actions',
      description: 'CI/CD for all repos. OIDC-based Azure auth, no stored secrets.',
      icon: 'GitBranch',
      category: 'infra',
      apps: [],
    },
  },
  {
    id: 'pipeline-templates',
    type: 'infra',
    position: { x: COL.left, y: ROW.cicd + 100 },
    data: {
      label: 'pipeline-templates',
      description: 'Reusable GitHub Actions workflows shared by all app repos.',
      icon: 'FileCode',
      category: 'infra',
      apps: [],
      url: 'https://github.com/nelsong6/pipeline-templates',
    },
  },
  {
    id: 'infra-bootstrap',
    type: 'infra',
    position: { x: COL.left, y: ROW.cicd + 200 },
    data: {
      label: 'infra-bootstrap',
      description: 'Root IaC repo. Owns platform resources and CI identities; app repos own runtime Key Vaults.',
      icon: 'Blocks',
      category: 'infra',
      apps: [],
      url: 'https://github.com/romaine-life/infra-bootstrap',
    },
  },
]
