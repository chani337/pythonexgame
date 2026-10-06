// Computes the CSP sha256 hashes for every inline <script> in dist/index.html.
//
// The dark-mode pre-paint script has to be inline (an external file would
// load after first paint and the light-mode flash would be visible again),
// so script-src needs either 'unsafe-inline' -- which defeats most of the
// point -- or an exact hash of its contents. This prints the hash.
//
// Re-run after any change to that script and update vercel.json:
//   npm run build && npm run csp:hash
//
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const file = resolve(import.meta.dirname, '..', 'dist', 'index.html');
const html = await readFile(file, 'utf8');

// Only scripts with no src attribute carry inline content.
const matches = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];

if (matches.length === 0) {
  console.log('인라인 script 없음 — script-src 에 해시가 필요하지 않습니다.');
  process.exit(0);
}

console.log(`dist/index.html 인라인 script ${matches.length}개\n`);
const hashes = [];
for (const [, body] of matches) {
  const hash = createHash('sha256').update(body, 'utf8').digest('base64');
  hashes.push(`'sha256-${hash}'`);
  const preview = body.trim().split('\n')[0].slice(0, 60);
  console.log(`  'sha256-${hash}'`);
  console.log(`    └ ${preview}...`);
}
console.log('\nvercel.json 의 script-src 에 넣을 값:');
console.log('  ' + hashes.join(' '));
