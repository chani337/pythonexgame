// Downloads sql.js into public/sql-js/ so SQL problems keep working on
// networks that block cdn.jsdelivr.net -- the same reason the Pyodide core is
// mirrored (scripts/fetch-pyodide-core.mjs).
//
// Unlike Pyodide this is only 0.71MB, so self-hosting costs almost nothing in
// bandwidth even when it is the path actually used.
//
// Runs as part of `npm run build` (prebuild). Failure is non-fatal: the deploy
// ships without the fallback rather than failing on a CDN hiccup.
//
//   npm run fetch:sqljs          # force a refresh
//
import { mkdir, writeFile, stat, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';

export const SQLJS_VERSION = '1.14.2';
const CDN_BASE = `https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VERSION}/dist`;

// sql-wasm.js is the loader the page injects; sql-wasm.wasm is what its
// locateFile() then fetches.
const FILES = ['sql-wasm.js', 'sql-wasm.wasm'];

const OUT_DIR = resolve(import.meta.dirname, '..', 'public', 'sql-js');
const mb = (n) => (n / 1048576).toFixed(2) + ' MB';

async function alreadyCurrent() {
  try {
    const marker = JSON.parse(await readFile(join(OUT_DIR, 'version.json'), 'utf8'));
    if (marker.version !== SQLJS_VERSION) return false;
    for (const name of FILES) {
      if ((await stat(join(OUT_DIR, name))).size === 0) return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!process.argv.includes('--force') && (await alreadyCurrent())) {
    console.log(`public/sql-js/ 는 이미 v${SQLJS_VERSION} 입니다 (--force 로 재다운로드)`);
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });
  console.log(`sql.js v${SQLJS_VERSION} 를 public/sql-js/ 로 받습니다...`);

  let total = 0;
  const integrity = {};
  for (const name of FILES) {
    const res = await fetch(`${CDN_BASE}/${name}`);
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(join(OUT_DIR, name), buf);
    total += buf.length;
    integrity[name] = 'sha384-' + createHash('sha384').update(buf).digest('base64');
    console.log(`  ${name.padEnd(16)} ${mb(buf.length).padStart(9)}`);
  }

  await writeFile(
    join(OUT_DIR, 'version.json'),
    JSON.stringify({ version: SQLJS_VERSION, files: FILES, integrity, totalBytes: total }, null, 2) + '\n'
  );

  console.log(`  ${'합계'.padEnd(14)} ${mb(total).padStart(9)}`);
  console.log('\nSRI 해시 (src/hooks/useSqlRunner.ts 의 SQLJS_INTEGRITY 와 일치해야 합니다):');
  console.log(`  ${integrity['sql-wasm.js']}`);
}

try {
  await main();
} catch (err) {
  console.warn(`\n[경고] sql.js 자체 호스팅 사본을 받지 못했습니다: ${err.message}`);
  console.warn('이번 빌드는 jsDelivr 폴백 없이 배포됩니다.');
}
