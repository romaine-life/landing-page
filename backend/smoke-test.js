const http = require('http');
const { spawn } = require('child_process');

const port = 31338;
const child = spawn(process.execPath, ['server.js'], {
  cwd: __dirname,
  env: { ...process.env, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let output = '';
child.stdout.on('data', (chunk) => {
  output += chunk.toString();
});
child.stderr.on('data', (chunk) => {
  output += chunk.toString();
});

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: '127.0.0.1', port, path }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });
    req.on('error', reject);
    req.setTimeout(1000, () => {
      req.destroy(new Error(`Timed out requesting ${path}`));
    });
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error(`Server exited early with ${child.exitCode}\n${output}`);
    }
    try {
      const response = await get('/health');
      if (response.statusCode === 200 && response.body === 'ok') return;
    } catch (_error) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error(`Server did not become healthy\n${output}`);
}

async function main() {
  await waitForServer();
  const root = await get('/');
  if (root.statusCode !== 200 || !root.body.includes('romaine.life')) {
    throw new Error(`Unexpected root response: ${root.statusCode}`);
  }
  const fallback = await get('/unknown/path');
  if (fallback.statusCode !== 200 || !fallback.body.includes('romaine.life')) {
    throw new Error(`Unexpected fallback response: ${fallback.statusCode}`);
  }
}

main()
  .finally(() => {
    child.kill();
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
