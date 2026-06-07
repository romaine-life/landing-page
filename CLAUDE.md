# landing-page

Simple static landing page for romaine.life (apex domain). Lists all apps with links and GitHub repo icons.

Served from AKS (namespace `landing-page`) by a Node+Express container that static-serves `frontend/`. Apex DNS (`romaine.life`) and the Envoy Gateway / cert-manager wiring live in infra-bootstrap; the per-app routing manifests (HTTPRoute, XListenerSet, Certificate, Deployment, Service) live in `k8s/` here.

## Change Log

### 2026-03-22

- Added plant-agent (plants.romaine.life), bender-world (bender.romaine.life), and eight-queens (queens.romaine.life) to the app list — landing page now shows all apps from infra-bootstrap
- Renamed "Workout App" to "Workout Tracker" to match kill-me's actual description

### 2026-03-23

- Removed Spacelift from both CI workflows (Spacelift was removed from infra-bootstrap months ago). Merged `trigger-infra.yml` and `full-stack-deploy.yml` into a single workflow that deploys directly to Azure SWA on push to `frontend/**` or manual dispatch

### 2026-04-02

- Added fzt-showcase (fzh.romaine.life) to the app list — interactive web demo of fzh fuzzy finder running Go scoring via WASM

### 2026-05-07

- Migrated off Azure Static Web Apps to AKS. Apex `romaine.life` is now served by a Node+Express container (`romainecr.azurecr.io/landing-page`) in namespace `landing-page`, behind the shared Envoy Gateway with a cert-manager-issued cert. Replaced `full-stack-deploy.yml` with `build-and-deploy.yaml`. Frontend build step removed — Express serves `frontend/` directly.

### 2026-06-07

- Replaced app-level Kustomize with a Helm chart under `k8s/`. CI now bumps `k8s/values.yaml`, and Argo CD renders the chart directly.
