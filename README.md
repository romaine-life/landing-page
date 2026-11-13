# landing-page

Static landing page for [romaine.life](https://romaine.life).

Served from AKS (namespace `landing-page`) via a minimal Node+Express container behind the shared Envoy Gateway. Image built and pushed to `romainecr.azurecr.io/landing-page` by `.github/workflows/build-and-deploy.yaml`; Argo CD renders the Helm chart in `k8s/` and rolls the deployment after CI bumps `k8s/values.yaml`.

`string-box/` is the String Box board viewer at [romaine.life/string-box](https://romaine.life/string-box/): three.js, built by Vite in the Dockerfile. CI fetches its model, `renders/string-box.glb`, from romaine-life/string-box (made there by `hardware/web3d.sh`); for local work, copy that file into `string-box/public/` and run `npm run dev` in `string-box/`.
