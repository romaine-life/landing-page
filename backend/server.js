import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { Logger, redact } from '@romaine-life/logline';

// The backend's log: the estate's one log line (romaine-life/logline, AHT-204) on stdout,
// which the cluster ships. A message is fixed text; what varies goes in fields, and text
// from outside the program (an error) goes through redact.
const log = Logger.stream(process.stdout);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

app.get('/health', (_req, res) => res.status(200).send('ok'));

app.use(express.static(FRONTEND_DIR));

// fzt-browser's built files, from its npm package (PIPT-32); the rest of /fzh is frontend/fzh.
const FZT_DIR = path.join(path.dirname(require.resolve('@romaine-life/fzt-browser/package.json')), 'dist');
for (const file of ['fzt.wasm', 'fzt-terminal.js', 'fzt-terminal.css', 'fzt-web.js']) {
  app.get(`/fzh/${file}`, (_req, res) => res.sendFile(file, { root: FZT_DIR }));
}

// The diagrams site is a single-page app: its own routes resolve to its index.
app.get('/diagrams/*', (_req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'diagrams', 'index.html'));
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

// The image's self-test (`--self-test`, run read-only by the web-app suite's image check):
// every route answers with content, the built ones (/fzh, /diagrams, /string-box, /hearing) included.
// `--source` checks only what the repo itself serves, for the backend's own test.
const SOURCE_ROUTES = ['/', '/privacy.html', '/style.css', '/unknown/path', '/fzh/fzt.wasm', '/fzh/fzt-web.js'];
const BUILT_ROUTES = ['/fzh/', '/diagrams/', '/diagrams/fzt', '/string-box/', '/string-box/string-box.glb', '/hearing/'];

async function selfTest(routes) {
  const server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const health = await fetch(`${base}/health`);
    if (health.status !== 200 || (await health.text()) !== 'ok') throw new Error(`/health: HTTP ${health.status}`);
    // An unknown path answers with the landing page, so a missing file would look served:
    // every route but those two must answer with something else.
    const fallback = Buffer.from(await (await fetch(`${base}/unknown/path`)).arrayBuffer());
    for (const route of routes) {
      const response = await fetch(base + route);
      const body = Buffer.from(await response.arrayBuffer());
      if (response.status !== 200 || !body.length) throw new Error(`${route}: HTTP ${response.status}, ${body.length} bytes`);
      if (!['/', '/unknown/path'].includes(route) && body.equals(fallback)) throw new Error(`${route}: answered with the landing page, so it isn't there`);
    }
  } finally {
    server.closeAllConnections();
    server.close();
  }
  log.info('landing-page self-test passed', { routes: routes.length + 1 });
}

if (process.argv.includes('--self-test')) {
  // Its result is the exit code; nothing is left open, so the process then ends.
  selfTest(process.argv.includes('--source') ? SOURCE_ROUTES : [...SOURCE_ROUTES, ...BUILT_ROUTES]).catch((error) => {
    log.error('landing-page self-test failed', { error: redact(String(error?.message ?? error)) });
    process.exitCode = 1;
  });
} else {
  app.listen(PORT, () => {
    log.info('landing-page listening', { port: PORT });
  });
}
