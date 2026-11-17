# landing-page

Static landing page for [romaine.life](https://romaine.life).

Served from AKS (namespace `landing-page`) via a minimal Node+Express container behind the shared Envoy Gateway. CI comes from pipeline-templates' suites (its `fleet.json` entry): the image is built with the fzt-browser assets and String Box model that `dependencies.lock` pins, run with `--self-test`, pushed to `romainecr.azurecr.io/landing-page`, and pinned in `k8s/values.yaml` by a PR merge-queue lands; Argo CD renders the Helm chart in `k8s/`. A new fzt-browser or String Box release proposes its pins as a take-up PR.

`string-box/` is the String Box page at [romaine.life/string-box](https://romaine.life/string-box/): the board in 3D (three.js), then how it works (a 2D canvas, `src/scope.js`), built by Vite in the Dockerfile. CI fetches its model, `renders/string-box.glb`, from romaine-life/string-box (made there by `hardware/web3d.sh`); for local work, copy that file into `string-box/public/` and run `npm run dev` in `string-box/`.
