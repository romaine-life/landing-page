import { createFztWeb } from './fzt-web.js';

const SAMPLE_YAML = `- name: Programming Languages
  description: Popular languages and their ecosystems
  children:
    - name: JavaScript
      description: The language of the web
      url: https://developer.mozilla.org/en-US/docs/Web/JavaScript
      children:
        - name: React
          description: UI component library by Meta
          url: https://react.dev
        - name: Vue
          description: Progressive framework
          url: https://vuejs.org
        - name: Node.js
          description: Server-side JavaScript runtime
          url: https://nodejs.org
        - name: TypeScript
          description: Typed superset of JavaScript
          url: https://www.typescriptlang.org
    - name: Go
      description: Fast compiled systems language
      url: https://go.dev
      children:
        - name: Gin
          description: HTTP web framework
          url: https://gin-gonic.com
        - name: Cobra
          description: CLI application framework
          url: https://github.com/spf13/cobra
        - name: tcell
          description: Terminal cell library for TUIs
          url: https://github.com/gdamore/tcell
        - name: GORM
          description: ORM library for Go
          url: https://gorm.io
    - name: Python
      description: Versatile scripting language
      url: https://www.python.org
      children:
        - name: Django
          description: Full-stack web framework
          url: https://www.djangoproject.com
        - name: FastAPI
          description: Modern async API framework
          url: https://fastapi.tiangolo.com
        - name: NumPy
          description: Numerical computing library
          url: https://numpy.org
    - name: Rust
      description: Memory-safe systems language
      url: https://www.rust-lang.org
      children:
        - name: Tokio
          description: Async runtime
          url: https://tokio.rs
        - name: Actix
          description: Web framework
          url: https://actix.rs
        - name: Serde
          description: Serialization framework
          url: https://serde.rs
- name: Cloud Providers
  description: Major cloud platforms
  children:
    - name: Azure
      description: Microsoft cloud platform
      url: https://azure.microsoft.com
      children:
        - name: Static Web Apps
          description: Serverless frontend hosting
          url: https://learn.microsoft.com/en-us/azure/static-web-apps/
        - name: Container Apps
          description: Managed container runtime
          url: https://learn.microsoft.com/en-us/azure/container-apps/
        - name: Cosmos DB
          description: Multi-model database service
          url: https://learn.microsoft.com/en-us/azure/cosmos-db/
        - name: Key Vault
          description: Secrets management
          url: https://learn.microsoft.com/en-us/azure/key-vault/
    - name: AWS
      description: Amazon Web Services
      url: https://aws.amazon.com
      children:
        - name: Lambda
          description: Serverless compute
          url: https://aws.amazon.com/lambda/
        - name: S3
          description: Object storage
          url: https://aws.amazon.com/s3/
        - name: EKS
          description: Managed Kubernetes
          url: https://aws.amazon.com/eks/
        - name: DynamoDB
          description: NoSQL database
          url: https://aws.amazon.com/dynamodb/
    - name: GCP
      description: Google Cloud Platform
      url: https://cloud.google.com
      children:
        - name: Cloud Run
          description: Serverless containers
          url: https://cloud.google.com/run
        - name: BigQuery
          description: Data warehouse
          url: https://cloud.google.com/bigquery
        - name: GKE
          description: Managed Kubernetes
          url: https://cloud.google.com/kubernetes-engine
- name: DevOps Tools
  description: Build, deploy, and monitor
  children:
    - name: CI/CD
      description: Continuous integration and delivery
      children:
        - name: GitHub Actions
          description: Workflow automation
          url: https://github.com/features/actions
        - name: GitLab CI
          description: Built-in CI pipelines
          url: https://docs.gitlab.com/ee/ci/
        - name: Jenkins
          description: Self-hosted automation server
          url: https://www.jenkins.io
    - name: Infrastructure
      description: Infrastructure as code
      children:
        - name: OpenTofu
          description: Open-source Terraform fork
          url: https://opentofu.org
        - name: Pulumi
          description: IaC with real languages
          url: https://www.pulumi.com
        - name: Ansible
          description: Configuration management
          url: https://www.ansible.com
    - name: Containers
      description: Container orchestration
      children:
        - name: Docker
          description: Container runtime
          url: https://www.docker.com
        - name: Kubernetes
          description: Container orchestration platform
          url: https://kubernetes.io
        - name: Helm
          description: Kubernetes package manager
          url: https://helm.sh
`;

// Tokyo Night 16-color palette
const PALETTE = [
  "#15161e", "#f7768e", "#9ece6a", "#e0af68",
  "#7aa2f7", "#bb9af7", "#7dcfff", "#a9b1d6",
  "#565f89", "#f7768e", "#9ece6a", "#e0af68",
  "#7aa2f7", "#bb9af7", "#7dcfff", "#c0caf5",
];

// ── DOS command history (rendered before fzt output) ──────────
function buildCommandHistory() {
  const frag = document.createDocumentFragment();
  const history = [
    { cmd: "type README.TXT", output: "fzt \u2014 A {fuzzy finder}(https://github.com/junegunn/fzf) with hierarchical navigation.\nType to search, arrow keys to navigate, Enter to drill in or open." },
    { cmd: "dir /B *.LNK", links: [
      { text: "Forgejo", href: "https://forgejo.romaine.life/romaine-life/fzt" },
      { text: "Source", href: "https://forgejo.romaine.life/romaine-life/fzt-showcase" },
      { text: "YAML", id: "btn-toggle-yaml" },
    ]},
    { cmd: "fzt.exe" },
  ];

  for (const entry of history) {
    const cmdDiv = document.createElement("div");
    cmdDiv.className = "cmd-history";
    const p = document.createElement("span");
    p.textContent = "C:\\> ";
    p.style.color = "var(--fg-dim)";
    cmdDiv.appendChild(p);
    const c = document.createElement("span");
    c.textContent = entry.cmd;
    c.style.color = "var(--accent)";
    cmdDiv.appendChild(c);
    frag.appendChild(cmdDiv);

    if (entry.output) {
      for (const line of entry.output.split("\n")) {
        const outDiv = document.createElement("div");
        outDiv.className = "cmd-output";
        const linkRe = /\{([^}]+)\}\(([^)]+)\)/g;
        let last = 0;
        let match;
        while ((match = linkRe.exec(line)) !== null) {
          if (match.index > last) outDiv.appendChild(document.createTextNode(line.slice(last, match.index)));
          const a = document.createElement("a");
          a.href = match[2];
          a.target = "_blank";
          a.textContent = match[1];
          a.className = "cmd-link";
          outDiv.appendChild(a);
          last = match.index + match[0].length;
        }
        if (last < line.length) outDiv.appendChild(document.createTextNode(line.slice(last)));
        if (last === 0) outDiv.textContent = line;
        frag.appendChild(outDiv);
      }
    }

    if (entry.links) {
      const outDiv = document.createElement("div");
      outDiv.className = "cmd-output";
      entry.links.forEach((link, i) => {
        if (i > 0) outDiv.appendChild(document.createTextNode("  "));
        if (link.href) {
          const a = document.createElement("a");
          a.href = link.href;
          a.target = "_blank";
          a.textContent = link.text;
          a.className = "cmd-link";
          outDiv.appendChild(a);
        } else if (link.id) {
          const btn = document.createElement("button");
          btn.id = link.id;
          btn.textContent = link.text;
          btn.className = "cmd-link-btn";
          outDiv.appendChild(btn);
        }
      });
      frag.appendChild(outDiv);
    }
  }

  frag.appendChild(document.createElement("div"));
  return frag;
}

// ── Main ──────────────────────────────────────────────────────
const terminalEl = document.getElementById("terminal");

const term = createFztWeb(terminalEl, {
  palette: PALETTE,
  shouldForwardKey: (e) => {
    return document.activeElement !== document.getElementById("yaml-editor");
  },
  onAction: (action, url) => {
    if (action && action.startsWith("select:") && url) {
      window.open(url, "_blank");
    }
  },
  onRender: () => {
    // Prepend DOS command history before fzt output
    const pre = document.getElementById("terminal");
    const existing = Array.from(pre.childNodes);
    const history = buildCommandHistory();
    pre.insertBefore(history, pre.firstChild);
  },
});

async function init() {
  await term.initWasm();

  document.getElementById("loading").classList.add("hidden");

  const editor = document.getElementById("yaml-editor");
  editor.value = SAMPLE_YAML;

  applyYAML();

  // YAML drawer toggle
  const drawer = document.getElementById("yaml-drawer");
  document.getElementById("btn-toggle-yaml").addEventListener("click", () => {
    drawer.classList.toggle("hidden");
    if (!drawer.classList.contains("hidden")) editor.focus();
  });
  document.getElementById("btn-close-yaml").addEventListener("click", () => {
    drawer.classList.add("hidden");
  });

  document.getElementById("btn-sample").addEventListener("click", () => {
    editor.value = SAMPLE_YAML;
    applyYAML();
  });
  document.getElementById("btn-apply").addEventListener("click", () => {
    applyYAML();
  });
}

function applyYAML() {
  const yaml = document.getElementById("yaml-editor").value;
  if (!term.loadYAML(yaml)) return;
  term.init();
}

init();
