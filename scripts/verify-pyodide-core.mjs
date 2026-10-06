// Boots the self-hosted Pyodide copy in public/pyodide/ to prove those six
// files are sufficient on their own -- that the fallback would actually run
// Python, not fail on a seventh file the CDN would have supplied.
//
// Also asserts numpy and pandas are absent, which is the whole point of
// removing the init-time preload.
//
//   npm run fetch:pyodide && npm run verify:pyodide-core
//
import { createRequire } from 'node:module';
import { resolve, join } from 'node:path';
import { access } from 'node:fs/promises';

const dir = resolve(import.meta.dirname, '..', 'public', 'pyodide');

try {
  await access(join(dir, 'pyodide.mjs'));
} catch {
  console.log('public/pyodide/ 가 없습니다. npm run fetch:pyodide 를 먼저 실행하세요.');
  process.exit(0);
}

// The full/ (browser) distribution's pyodide.asm.js takes a Node branch that
// uses CommonJS globals. Under ESM they don't exist, so shim them -- this is a
// test-harness concern only; browsers never hit that branch.
globalThis.require = createRequire(import.meta.url);
globalThis.__dirname = dir;
globalThis.__filename = join(dir, 'pyodide.asm.js');

const failures = [];
const check = (name, pass, detail = '') => {
  console.log(`${pass ? 'OK  ' : '실패'} ${name}${detail ? '  — ' + detail : ''}`);
  if (!pass) failures.push(name);
};

const { loadPyodide } = await import('file://' + join(dir, 'pyodide.mjs'));

const t0 = Date.now();
const py = await loadPyodide({ indexURL: dir + '/' });
check('자체 호스팅 사본만으로 부팅', true, `${Date.now() - t0}ms`);
check('Python 3.12', py.runPython('import sys; sys.version.split()[0]').startsWith('3.12'),
      py.runPython('import sys; sys.version.split()[0]'));

const out = [];
py.setStdout({ batched: (s) => out.push(s) });
py.runPython('name="김철수"\nprint(name)\nfor i in range(1,4):\n    print(i)');
check('일반 문제 실행 (추가 패키지 0개)', out.join('|') === '김철수|1|2|3', JSON.stringify(out.join('|')));

for (const pkg of ['numpy', 'pandas']) {
  let present = true;
  try { py.runPython(`import ${pkg}`); } catch { present = false; }
  check(`${pkg} 가 preload 되지 않음`, !present);
}

console.log(`\n${failures.length === 0 ? '전부 통과' : failures.length + '건 실패'}`);
process.exit(failures.length === 0 ? 0 : 1);
