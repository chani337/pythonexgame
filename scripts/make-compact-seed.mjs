// Emits a single compact INSERT for public.problems, for pasting into the
// Supabase SQL editor. The full problems_seed.sql uses a temp table so it can
// be re-run idempotently; for the first seed that machinery is unnecessary and
// just makes the paste longer -- and a long paste is what got truncated once
// already.
import { build } from 'esbuild';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const dir = await mkdtemp(join(ROOT, 'node_modules', '.seed-'));
const out = join(dir, 'p.mjs');
await build({ entryPoints: [join(ROOT, 'src/data/problems.ts')], outfile: out, format: 'esm', platform: 'node', bundle: true, logLevel: 'silent' });
const { problems } = await import('file://' + out);
await rm(dir, { recursive: true, force: true });

const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const rows = problems.map((p) => `(${q(p.id)},${q(p.language ?? 'python')},${q(p.difficulty)},${q(p.type)})`);

const sql =
  `INSERT INTO public.problems (id, language, difficulty, type) VALUES\n` +
  rows.join(',\n') +
  `\nON CONFLICT (id) DO UPDATE SET language=EXCLUDED.language, difficulty=EXCLUDED.difficulty, type=EXCLUDED.type;\n`;

const target = join(ROOT, 'migrations/deploy/phase1b-seed-compact.sql');
await writeFile(target, sql);
console.log(`wrote ${target}`);
console.log(`  문제 ${problems.length}개 / ${sql.length} bytes / ${sql.split('\n').length} 줄`);
