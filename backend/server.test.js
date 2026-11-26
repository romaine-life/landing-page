import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@romaine-life/logline';

const here = path.dirname(fileURLToPath(import.meta.url));

test('the source self-test passes and writes only the standard log line', () => {
  const result = spawnSync(process.execPath, [path.join(here, 'server.js'), '--self-test', '--source'], { cwd: here, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(result.stderr, '');
  const lines = result.stdout.split('\n').filter(Boolean);
  assert.equal(lines.length, 1, result.stdout);
  const entry = parse(lines[0]);
  assert.equal(entry.level, 'info');
  assert.equal(entry.message, 'landing-page self-test passed');
  assert.deepEqual(Object.fromEntries(entry.fields), { routes: '7' });
});
