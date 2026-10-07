// Checks that every guest localStorage key the app WRITES is accounted for by
// the login merge -- either merged into the account or deliberately dropped.
//
// This is the failure mode worth automating: a new piece of guest progress
// gets a localStorage key, nobody updates mergeLocalStorageProgress, and that
// progress silently disappears the moment the user registers. Nothing about
// that is visible in a type check or a build.
//
//   npm run verify:guest-merge
//
import { readFile } from 'node:fs/promises';
import { readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SRC = join(ROOT, 'src');

async function sourceFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await sourceFiles(p));
    else if (/\.tsx?$/.test(entry.name)) out.push(p);
  }
  return out;
}

const files = await sourceFiles(SRC);
const sources = new Map();
for (const f of files) sources.set(f.replace(ROOT + '/', ''), await readFile(f, 'utf8'));

// --- keys the app writes for a not-logged-in visitor ---------------------
// Both the literal 'pyquests_x_guest' form and the ternary form
//   user ? `pyquests_x_${user.id}` : 'pyquests_x_guest'
const written = new Map();   // key -> files
for (const [file, text] of sources) {
  for (const m of text.matchAll(/'(pyquests_[a-z_]*?_guest)'/g)) {
    if (!written.has(m[1])) written.set(m[1], new Set());
    written.get(m[1]).add(file);
  }
}

const auth = sources.get('src/contexts/AuthContext.tsx') ?? '';

// --- what the merge reads -----------------------------------------------
const mergeStart = auth.indexOf('const mergeLocalStorageProgress');
const mergeEnd = auth.indexOf('const refreshLeaderboard');
const mergeBody = auth.slice(mergeStart, mergeEnd);

// Only count a key as merged if it is read OUTSIDE the cleanup block --
// appearing in the removeItem list means it is cleared, not merged, and
// conflating the two reported streak_guest as merged when it is deliberately
// discarded.
// Anchor on removeItem and walk back to ITS loop header. Searching forward
// for 'for (const key of [' finds the quiz-answers loop first and truncates
// the body before the reads, which made every key look unmerged.
const removeAt = mergeBody.indexOf('localStorage.removeItem(key)');
const cleanupStart = removeAt === -1 ? -1 : mergeBody.lastIndexOf('for (const key of [', removeAt);
const mergeOnly = cleanupStart === -1 ? mergeBody : mergeBody.slice(0, cleanupStart);

const readPrefixes = [...mergeOnly.matchAll(/readIds\('(pyquests_[a-z_]*?_)'\)/g)].map((m) => m[1]);
const readLiterals = [...mergeOnly.matchAll(/'(pyquests_[a-z_]*?_guest)'/g)].map((m) => m[1]);
const templateReads = [...mergeOnly.matchAll(/`(pyquests_[a-z_]*?_)\$\{userId\}`/g)].map((m) => m[1]);

const reads = new Set([
  ...readPrefixes.map((p) => p + 'guest'),
  ...readLiterals,
  ...templateReads.map((p) => p + 'guest'),
]);

// --- what the merge clears on success ------------------------------------
const clearBlock = cleanupStart === -1 ? '' : mergeBody.slice(cleanupStart, removeAt);
const cleared = new Set([...clearBlock.matchAll(/'(pyquests_[a-z_]*?_guest)'/g)].map((m) => m[1]));

// Server-derived since migration 001: refresh_solver_stats recomputes streak
// and last_solved_date from the solve rows, so merging the client's numbers
// would be writing values the database discards. They still need clearing.
const INTENTIONALLY_NOT_MERGED = new Set([
  'pyquests_streak_guest',
  'pyquests_last_solved_date_guest',
]);

console.log('=== 게스트 키 커버리지 ===\n');
console.log(`앱이 쓰는 게스트 키: ${written.size}개`);

const problems = [];
for (const [key, inFiles] of [...written].sort()) {
  const isRead = reads.has(key);
  const isCleared = cleared.has(key);
  const intentional = INTENTIONALLY_NOT_MERGED.has(key);

  let status;
  if (intentional) {
    status = isCleared ? '미병합(서버가 계산) + 정리' : '!! 정리 안 됨';
    if (!isCleared) problems.push(`${key} 를 정리하지 않습니다`);
    console.log(`  ${key.padEnd(36)} ${status}`);
    continue;
  }
  if (isRead && isCleared) status = '병합 + 정리';
  else if (!isRead && !intentional) { status = '!! 병합 안 됨'; problems.push(`${key} 를 병합하지 않습니다 (${[...inFiles].join(', ')})`); }
  else if (!isCleared) { status = '!! 정리 안 됨'; problems.push(`${key} 를 성공 후 정리하지 않습니다 — 다음 로그인에 재병합됩니다`); }
  else status = '확인 필요';

  console.log(`  ${key.padEnd(36)} ${status}`);
}

// --- the merge must not write server-derived columns ---------------------
console.log('\n=== 서버 계산 컬럼을 쓰지 않는지 ===');
for (const col of ['streak', 'last_solved_date', 'solved_count']) {
  const writes = new RegExp(`${col}:`).test(mergeBody);
  console.log(`  ${col.padEnd(18)} ${writes ? '!! 병합이 직접 씁니다' : '쓰지 않음'}`);
  if (writes) problems.push(`merge 가 ${col} 을 직접 씁니다 — 001 의 보호 트리거가 무시합니다`);
}

// --- solved rows must go through the RPC, not a bulk upsert -------------
console.log('\n=== 대량 쓰기 경로 ===');
const usesRpc = mergeBody.includes("rpc('merge_guest_progress'");
const bulkUpsert = /from\('user_solved_problems'\)\s*\.upsert/.test(mergeBody);
console.log(`  merge_guest_progress RPC 사용        ${usesRpc ? 'OK' : '!! 아니오'}`);
console.log(`  user_solved_problems 직접 upsert     ${bulkUpsert ? '!! 있음 (분당 30건 제한에 걸립니다)' : '없음'}`);
if (!usesRpc) problems.push('solved 병합이 RPC 를 쓰지 않습니다 — 분당 30건 제한에 걸립니다');
if (bulkUpsert) problems.push('user_solved_problems 를 직접 upsert 합니다 — 31번째 행에서 전체가 중단됩니다');

// --- unknown ids must be filtered before writing ------------------------
console.log('\n=== 미등록 problem_id 필터 ===');
const filtersReview = mergeBody.includes('KNOWN_PROBLEM_IDS.has');
console.log(`  review 병합 전 필터                  ${filtersReview ? 'OK' : '!! 없음'}`);
if (!filtersReview) problems.push('review 병합이 미등록 id 를 걸러내지 않습니다 — 한 개로 전체가 중단됩니다');

// --- the merge has to run for brand-new signups too ---------------------
console.log('\n=== 신규 가입 경로 ===');
const profileFn = auth.slice(auth.indexOf('const fetchProfile'), auth.indexOf('const mergeLocalStorageProgress'));
const callsOutsideElse = /mergedForUserRef\.current !== userId/.test(profileFn);
console.log(`  프로필 유무와 무관하게 호출            ${callsOutsideElse ? 'OK' : '!! else 분기 안에만 있습니다'}`);
if (!callsOutsideElse) problems.push('병합이 기존 프로필이 있는 경우에만 실행됩니다 — 신규 가입자는 진도를 잃습니다');

const guards = /mergedForUserRef/.test(auth);
console.log(`  중복 실행 방지                        ${guards ? 'OK' : '!! 없음'}`);
if (!guards) problems.push('중복 실행 방지가 없습니다 — 토큰 갱신마다 알림이 뜹니다');

console.log('');
if (problems.length) {
  console.log('문제:');
  for (const p of problems) console.log('  ! ' + p);
  process.exit(1);
}
console.log('전부 통과');
