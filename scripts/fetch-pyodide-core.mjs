// Downloads the Pyodide core runtime into public/pyodide/ so the app has a
// same-origin fallback when cdn.jsdelivr.net is unreachable -- which is the
// normal state on many school and corporate networks, and PyQuests is aimed
// at school computer labs.
//
// Only the files needed to BOOT Pyodide. The numpy / pandas / sqlite3 wheels
// are deliberately excluded: they are 35MB together, only 4 of 377 problems
// need numpy or pandas, and serving them from Vercel would move that traffic
// onto the project's own bandwidth. A visitor on a network that blocks
// jsDelivr gets Python; if they then open one of those 4 problems, the wheel
// fetch fails and the error explains why.
//
// Runs as part of `npm run build` (prebuild). Failure is non-fatal -- the
// deploy just ships without the fallback rather than failing the build
// because a CDN was briefly down.
//
//   npm run fetch:pyodide          # force a refresh
//
import { mkdir, writeFile, stat, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';

export const PYODIDE_VERSION = '0.26.2';
const CDN_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full`;

// Measured at v0.26.2. `pyodide.d.ts` is 403 on jsDelivr and is types-only.
const CORE_FILES = [
  'pyodide.js',          //   14 KB  loader (the one the page script tag pulls)
  'pyodide.mjs',         //   14 KB  ESM variant, referenced by pyodide.js
  'pyodide.asm.js',      // 1.17 MB  emscripten JS glue
  'pyodide.asm.wasm',    // 9.62 MB  the interpreter itself
  'python_stdlib.zip',   // 2.23 MB  Python standard library
  'pyodide-lock.json',   //  104 KB  package index, needed by loadPackage()
];

const OUT_DIR = resolve(import.meta.dirname, '..', 'public', 'pyodide');

const mb = (n) => (n / 1048576).toFixed(2) + ' MB';

async function alreadyCurrent() {
  try {
    const marker = JSON.parse(await readFile(join(OUT_DIR, 'version.json'), 'utf8'));
    if (marker.version !== PYODIDE_VERSION) return false;
    for (const name of CORE_FILES) {
      const s = await stat(join(OUT_DIR, name));
      if (s.size === 0) return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const force = process.argv.includes('--force');

  if (!force && (await alreadyCurrent())) {
    console.log(`public/pyodide/ 는 이미 v${PYODIDE_VERSION} 입니다 (--force 로 재다운로드)`);
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });
  console.log(`Pyodide v${PYODIDE_VERSION} 코어를 public/pyodide/ 로 받습니다...`);

  let total = 0;
  const hashes = {};

  for (const name of CORE_FILES) {
    const url = `${CDN_BASE}/${name}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(join(OUT_DIR, name), buf);
    total += buf.length;
    // sha384, base64 -- the format Subresource Integrity expects.
    hashes[name] = 'sha384-' + createHash('sha384').update(buf).digest('base64');
    console.log(`  ${name.padEnd(20)} ${mb(buf.length).padStart(9)}`);
  }

  await writeFile(
    join(OUT_DIR, 'version.json'),
    JSON.stringify({ version: PYODIDE_VERSION, files: CORE_FILES, integrity: hashes, totalBytes: total }, null, 2) + '\n'
  );

  console.log(`  ${'합계'.padEnd(18)} ${mb(total).padStart(9)}`);
  console.log('\nSRI 해시 (src/hooks/usePyodide.ts 의 PYODIDE_INTEGRITY 와 일치해야 합니다):');
  console.log(`  pyodide.js  ${hashes['pyodide.js']}`);
}

try {
  await main();
} catch (err) {
  // Non-fatal on purpose: a transient CDN failure must not break a deploy.
  console.warn(`\n[경고] Pyodide 코어 자체 호스팅 사본을 받지 못했습니다: ${err.message}`);
  console.warn('이번 빌드는 jsDelivr 폴백 없이 배포됩니다. jsDelivr 가 차단된 네트워크에서는 Python 실행이 불가합니다.');
}
