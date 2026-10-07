# PyQuests

브라우저에서 코딩 문제를 풀고 학습 가이드를 읽는 사이트입니다. 서버에 코드를 보내지 않고 **브라우저 안에서 직접 실행**합니다.

배포: https://pyquests.vercel.app

---

## 무엇이 들어 있나

### 문제 377개

| 언어 | 개수 | 구성 | 실행 |
|---|---:|---|---|
| Python | 140 | coding 140 | Pyodide (WASM Python) |
| 알고리즘 | 69 | coding 69 | Pyodide (Python 하네스) |
| SQL | 36 | coding 36 | sql.js (SQLite WASM) |
| JavaScript | 36 | coding 24 · fill 4 · quiz 8 | Web Worker (coding 24개만) |
| Java | 48 | quiz 32 · fill 16 | — |
| C | 48 | quiz 32 · fill 16 | — |

**실제로 코드가 실행되는 문제는 269개**입니다. Java 와 C, 그리고 JavaScript 중 12개는 객관식·빈칸 문제라서 실행기에 닿지 않습니다. (Java·C 실행은 백로그 12번 과제입니다.)

난이도: basic 95 · intermediate 158 · advanced 65 · expert 59

### 학습 가이드 86챕터

Python 16 · SQL 14 · Java 12 · JavaScript 12 · C 12 · HTML 8 · CSS 12. 챕터별 확인 퀴즈 72개가 함께 있습니다.

Python 챕터는 Jupyter 노트북에서 변환한 것이고, 원본은 `docs/source/` 에 있습니다 (빌드 때 읽지 않습니다 — `src/data/docs.ts` 에 내용이 들어 있습니다).

---

## 로컬에서 실행

```bash
npm install
cp .env.example .env     # 값을 채우세요 (아래)
npm run dev
```

### 환경변수

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

**없어도 실행됩니다.** 로그인·랭킹·진도 동기화만 꺼지고 문제 풀이, 학습 가이드, 샌드박스, localStorage 진도는 그대로 동작합니다 (`isSupabaseConfigured === false` 경로).

자세한 내용과 Vercel 에 등록할 항목은 [docs/environment-variables.md](docs/environment-variables.md).

### 빌드

```bash
npm run build      # tsc -b && vite build
npm run lint       # oxlint
npm run test       # vitest
```

`prebuild` 가 Pyodide 코어(13MB)와 sql.js(0.7MB)를 `public/` 으로 내려받습니다. 둘 다 `.gitignore` 에 있는 빌드 산출물이고, 실패해도 빌드는 계속됩니다 (CDN 폴백 없이 배포됨).

### 검증 스크립트

타입 체크로는 잡히지 않는 것들을 검사합니다. CI 에서 전부 돌아갑니다.

| 명령 | 내용 |
|---|---|
| `npm run test` | 문제 데이터 무결성 + 순수 함수 단위 테스트 |
| `npm run verify:sandbox` | JS Worker 샌드박스 — 실제 공격 21개를 `node:vm` 에서 시도 |
| `npm run verify:sql` | SQL 정답 36개를 실제 sql.js 로 실행해 기대 출력과 바이트 비교 |
| `npm run verify:shared-pc` | 세션 저장소 어댑터를 실제로 실행 + 로그아웃 정리 완전성 |
| `npm run verify:guest-merge` | 게스트 진도 병합이 모든 키를 다루는지 |
| `npm run verify:pyodide` | Pyodide 로더 분기·SRI·폴백 |
| `npm run verify:csp` | `vercel.json` 의 CSP 가 실제 사용 출처를 덮는지 |
| `npm run check:problems` | `problems.ts` 와 `migrations/problems_seed.sql` 동기화 |

---

## 아키텍처

```
브라우저                                        서버
┌──────────────────────────────┐
│ React 19 + Vite 6            │
│                              │
│  Python ─── Pyodide 0.26.2 ──┼──→ jsDelivr (SRI) → /pyodide/ 폴백
│  SQL ────── sql.js 1.14.2 ───┼──→ jsDelivr (SRI) → /sql-js/ 폴백
│  JS ─────── blob Web Worker  │     (네트워크 전역 차단, 5초 타임아웃)
│                              │
│  진도 ───── localStorage ────┼──→ Supabase (REST)
│                              │
│  PWA ────── 서비스워커 ──────┼──→ 정적 자산만 캐시 (Supabase 제외)
└──────────────────────────────┘
```

**코드 실행은 전부 클라이언트**입니다. 채점도 브라우저에서 합니다 (`testRunnerCode === 'stdout_match'` 가 대부분). 따라서 **채점 결과는 신뢰 경계 밖**이고, 랭킹 무결성은 서버에서 따로 지킵니다 — 아래 참고.

### Supabase 쪽

- `problems` — 문제 id 377개의 참조 테이블. `user_solved_problems` 에 트리거로 검증
- `streak` / `solved_count` / `last_solved_date` — **서버가 계산**합니다. 클라이언트 UPDATE 는 트리거가 무시합니다
- 분당 30건 INSERT 속도 제한
- 랭킹·활동 피드는 집계 뷰(`leaderboard_public` 등)로만 읽습니다 — 원본 테이블은 본인 행만 보입니다
- 관리자·랭킹 제외는 `profiles.is_admin` / `profiles.hidden` 플래그 (쓰기 금지)

스키마는 `supabase_schema.sql` (목표 상태 전체), 변경 이력은 `migrations/`.

```bash
# 새 프로젝트에 적용
psql "$DATABASE_URL" -f supabase_schema.sql
```

기존 DB 에 적용하는 순서는 [docs/migrations/](docs/migrations/) 와 [docs/DEPLOY-1-5.md](docs/DEPLOY-1-5.md) 를 보세요. `migrations/deploy/` 에 Supabase SQL 편집기에 그대로 붙일 수 있게 쪼갠 파일들이 있습니다.

---

## 공개 저장소입니다 — 무엇이 공개 정보인가

| 항목 | 상태 |
|---|---|
| Supabase URL · publishable(anon) key | **공개 전제**입니다. 클라이언트 번들에 들어가므로 숨길 수 없습니다. 접근 통제는 RLS 가 합니다 |
| 문제 정답 | `src/utils/answerObfuscation.ts` 의 **base64 난독화**입니다. 보안이 아니라 우연히 눈에 띄는 것만 막습니다 — 마음먹으면 누구나 읽습니다 |
| 채점 로직 | 전부 클라이언트. 조작 가능합니다 |
| RLS 정책 · 트리거 | 공개돼 있어도 안전합니다. 실제 통제는 서버에서 실행됩니다 |
| service_role key | **절대 커밋하지 마세요.** 이 저장소에 없고, 클라이언트 코드에 들어갈 일도 없습니다 |
| `.env` | `.gitignore` 에 있습니다. `.env.example` 만 커밋합니다 |

랭킹을 조작 불가능하게 만들려면 서버 채점이 필요하고, 그게 백로그 12번입니다. 현재 구조는 **서버가 "존재하는 문제 id 인지 / 비정상적으로 빠르지 않은지"까지만** 검증합니다.

---

## 디렉터리

```
src/
  data/        problems.ts (377) · docs.ts (86챕터) · chapterQuizzes.ts
               solutionCode.ts · solutionExplanations.ts · sqlSeed.ts
  hooks/       usePyodide · useSqlRunner · useJsRunner · useIdleLogout · useDarkMode
  utils/       oracleToSqlite · answerObfuscation · profanityFilter · checkKeywords
  contexts/    AuthContext (세션 · 진도 동기화 · 게스트 병합)
  components/  ProblemWorkspace (실행기 3분기) · Dashboard · DocsViewer · Sidebar ...
  lib/         supabase.ts (세션 저장소 어댑터)

migrations/    SQL 마이그레이션 + deploy/ (편집기용 분할 파일)
scripts/       자산 다운로드 + 검증 스크립트
tests/         vitest
docs/          작업 문서 + source/ (노트북·원문 등 변환 원본)
```

## 문서

- [보안 헤더 · CSP](docs/security-headers.md)
- [Pyodide 로딩](docs/pyodide-loading.md)
- [SQL 실행기](docs/sql-runner.md)
- [게스트 진도 이관](docs/guest-progress-merge.md)
- [공유 PC 세션](docs/shared-computer-sessions.md)
- [환경변수](docs/environment-variables.md)
- [소개 사이트](docs/landing-site.md)
- [테스트 · 저장소 정리](docs/testing-and-cleanup.md)
- [마이그레이션](docs/migrations/)
