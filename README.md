# landing-page

Static landing page for [romaine.life](https://romaine.life).

Served from AKS (namespace `landing-page`) via a minimal Node+Express container behind the shared Envoy Gateway. Image built and pushed to `romainecr.azurecr.io/landing-page` by `.github/workflows/build-and-deploy.yaml`; Argo CD renders the Helm chart in `k8s/` and rolls the deployment after CI bumps `k8s/values.yaml`.
