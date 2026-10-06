// Extracts the canonical problem id list from src/data/problems.ts and emits
// the seed SQL for public.problems (the reference table that
// user_solved_problems.problem_id is validated against).
//
// problems.ts is bundled data, not a runtime module we can `require`, and it
// mixes quoted/bare keys at two indentation levels -- regex-scraping it has
// already produced wrong counts once. So transpile it with esbuild and import
// the real array instead.
//
//   node scripts/extract-problem-ids.mjs            # write migrations/problems_seed.sql
//   node scripts/extract-problem-ids.mjs --check     # verify the seed file is current
//
import { build } from 'esbuild';
import { mkdtemp, writeFile, readFile, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SOURCE = join(ROOT, 'src/data/problems.ts');
const OUT_SQL = join(ROOT, 'migrations/problems_seed.sql');

async function loadProblems() {
  const dir = await mkdtemp(join(tmpdir(), 'pyquests-problems-'));
  const outfile = join(dir, 'problems.mjs');
  try {
    await build({
      entryPoints: [SOURCE],
      outfile,
      format: 'esm',
      platform: 'node',
      bundle: true,
      logLevel: 'silent',
    });
    const mod = await import(`file://${outfile}`);
    if (!Array.isArray(mod.problems)) {
      throw new Error('problems.ts did not export a `problems` array');
    }
    return mod.problems;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

function sqlQuote(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function buildSeedSql(problems) {
  const rows = problems
    .map((p) => {
      // language is optional in the type; the python problems predate the
      // field and an absent value means python (same rule the client uses).
      const language = p.language ?? 'python';
      return `  (${sqlQuote(p.id)}, ${sqlQuote(language)}, ${sqlQuote(p.difficulty)}, ${sqlQuote(p.type)})`;
    })
    .join(',\n');

  return `-- GENERATED FILE -- do not edit by hand.
-- Regenerate with: npm run sync:problems
-- Source: src/data/problems.ts (${problems.length} problems)
--
-- Seeds/refreshes public.problems, the reference table that
-- user_solved_problems.problem_id is validated against. Safe to re-run: it
-- upserts current problems and deletes rows whose problem no longer exists,
-- but only when nothing references them (a solved row pinning a retired
-- problem keeps that row, so re-running can never cascade-delete progress).

BEGIN;

CREATE TEMP TABLE _problems_incoming (
  id TEXT PRIMARY KEY,
  language TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  type TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO _problems_incoming (id, language, difficulty, type) VALUES
${rows};

INSERT INTO public.problems (id, language, difficulty, type)
SELECT id, language, difficulty, type FROM _problems_incoming
ON CONFLICT (id) DO UPDATE
  SET language   = EXCLUDED.language,
      difficulty = EXCLUDED.difficulty,
      type       = EXCLUDED.type;

-- Retire problems that no longer exist in the source, unless a user's solved
-- or review row still points at them.
DELETE FROM public.problems p
WHERE NOT EXISTS (SELECT 1 FROM _problems_incoming i WHERE i.id = p.id)
  AND NOT EXISTS (SELECT 1 FROM public.user_solved_problems s WHERE s.problem_id = p.id)
  AND NOT EXISTS (SELECT 1 FROM public.user_review_problems r WHERE r.problem_id = p.id);

-- Report what is still pinned by user data after the delete above.
SELECT p.id AS orphaned_problem_still_referenced
FROM public.problems p
WHERE NOT EXISTS (SELECT 1 FROM _problems_incoming i WHERE i.id = p.id);

COMMIT;
`;
}

const problems = await loadProblems();

const ids = problems.map((p) => p.id);
const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
if (duplicates.length > 0) {
  console.error(`duplicate problem ids: ${[...new Set(duplicates)].join(', ')}`);
  process.exit(1);
}

const tally = (key, fallback) =>
  problems.reduce((acc, p) => {
    const v = p[key] ?? fallback;
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {});

const sql = buildSeedSql(problems);
const checkOnly = process.argv.includes('--check');

if (checkOnly) {
  const existing = await readFile(OUT_SQL, 'utf8').catch(() => null);
  if (existing !== sql) {
    console.error('migrations/problems_seed.sql is stale -- run: npm run sync:problems');
    process.exit(1);
  }
  console.log(`problems_seed.sql is current (${problems.length} problems)`);
} else {
  await mkdir(join(ROOT, 'migrations'), { recursive: true });
  await writeFile(OUT_SQL, sql);
  console.log(`wrote migrations/problems_seed.sql -- ${problems.length} problems`);
}

console.log(`  language:   ${JSON.stringify(tally('language', 'python'))}`);
console.log(`  difficulty: ${JSON.stringify(tally('difficulty'))}`);
console.log(`  type:       ${JSON.stringify(tally('type'))}`);
