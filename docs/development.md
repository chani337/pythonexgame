# 개발 안내

README 는 사이트 소개이고, 개발에 필요한 내용은 여기에 있습니다.

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

자세한 내용과 Vercel 에 등록할 항목은 [environment-variables.md](environment-variables.md).

### 빌드

```bash
npm run build      # tsc -b && vite build
npm run lint       # oxlint
npm run test       # vitest
```

`prebuild` 가 Pyodide 코어(13MB)와 sql.js(0.7MB)를 `public/` 으로 내려받습니다. 둘 다 `.gitignore` 에 있는 빌드 산출물이고, 실패해도 빌드는 계속됩니다 (CDN 폴백 없이 배포됨).

## 검증 스크립트

타입 체크로는 잡히지 않는 것들을 검사합니다. `npm run verify:all` 로 한 번에 돌고, CI 에서도 돌아갑니다.

| 명령 | 내용 |
|---|---|
| `npm run test` | 문제 데이터 무결성 + 순수 함수 단위 테스트 |
| `npm run verify:sandbox` | JS Worker 샌드박스 — 실제 공격 21개를 `node:vm` 에서 시도 |
| `npm run verify:sql` | SQL 정답을 실제 sql.js 로 실행해 기대 출력과 비교 |
| `npm run verify:sql-guide` | SQL 학습 가이드의 실행 예제 전부 |
| `npm run verify:web` | HTML·CSS 채점기를 실제 Chrome 에서 (정답·오답·스크립트 차단) |
| `npm run verify:pylibs` | NumPy·Pandas·Matplotlib·실전 문제를 실제 Pyodide 에서 (효율성 테스트 포함) |
| `npm run verify:shared-pc` | 세션 저장소 어댑터 + 로그아웃 정리 완전성 |
| `npm run verify:guest-merge` | 게스트 진도 병합이 모든 키를 다루는지 |
| `npm run verify:pyodide` | Pyodide 로더 분기·SRI·폴백 |
| `npm run verify:csp` | `vercel.json` 의 CSP 가 실제 사용 출처를 덮는지 |
| `npm run verify:routing` | SPA 라우팅 설정과 경로 |
| `npm run check:problems` | `problems.ts` 와 `migrations/problems_seed.sql` 동기화 |
| `npm run check:site` | 소개 사이트가 데이터와 맞는지 |

빌드가 필요한 것: `npm run build && npm run verify:pwa-update` (PWA 업데이트 흐름).

## 아키텍처

```
브라우저                                        서버
┌──────────────────────────────┐
│ React 19 + Vite 6            │
│                              │
│  Python ─── Pyodide 0.26.2 ──┼──→ jsDelivr (SRI) → /pyodide/ 폴백
│  SQL ────── sql.js 1.14.2 ───┼──→ jsDelivr (SRI) → /sql-js/ 폴백
│  JS ─────── blob Web Worker  │     (네트워크 전역 차단, 5초 타임아웃)
│  HTML/CSS ─ sandbox iframe   │     (스크립트 실행 없음)
│                              │
│  진도 ───── localStorage ────┼──→ Supabase (REST)
│                              │
│  PWA ────── 서비스워커 ──────┼──→ 정적 자산만 캐시 (Supabase 제외)
└──────────────────────────────┘
```

코드 실행과 채점은 전부 클라이언트에서 합니다. 랭킹 무결성은 서버(Supabase 트리거·RLS)에서 따로 지킵니다.

### Supabase

- `problems` — 문제 id 참조 테이블. `user_solved_problems` 에 트리거로 검증. 문제를 추가하면 `npm run sync:problems` 로 seed 를 다시 만들고 적용
- `streak` / `solved_count` / `last_solved_date` — 서버가 계산. 클라이언트 UPDATE 는 트리거가 무시
- 랭킹·활동 피드는 집계 뷰(`leaderboard_public` 등)로만 읽음 — 원본 테이블은 본인 행만 보임
- 관리자·랭킹 제외는 `profiles.is_admin` / `profiles.hidden` 플래그

스키마는 `supabase_schema.sql` (목표 상태 전체), 변경 이력은 `migrations/`, 적용 순서는 [migrations/](migrations/).

### 공개 저장소에서 주의할 것

- Supabase URL · publishable(anon) key 는 클라이언트 번들에 들어가는 공개값입니다. 접근 통제는 RLS 가 합니다
- **service_role key 는 절대 커밋하지 마세요.** `.env` 는 `.gitignore` 에 있고 `.env.example` 만 커밋합니다

## 디렉터리

```
src/
  data/        problems.ts · docs.ts · chapterQuizzes.ts · changelog.ts
               solutionCode.ts · solutionExplanations.ts · sqlSeed.ts · pyDatasets.ts
  hooks/       usePyodide · useSqlRunner · useJsRunner · useIdleLogout · useDarkMode
  lib/         pythonRuntime (Pyodide 실행 환경) · lazyWithReload · supabase · routes
  utils/       webChecks · outputDiff · optionOrder · oracleToSqlite · checkKeywords ...
  contexts/    AuthContext (세션 · 진도 동기화 · 게스트 병합)
  components/  ProblemWorkspace · DocsViewer · Dashboard · UpdatePrompt · WebPreview ...

site/          소개 사이트 (pyquests-site.vercel.app)
migrations/    SQL 마이그레이션
scripts/       자산 다운로드 + 검증 스크립트
tests/         vitest
docs/          작업 문서
```

## 작업 문서

- [HTML · CSS 문제](web-problems.md)
- [NumPy · Pandas · Matplotlib · 실전 문제](python-library-problems.md)
- [PWA 업데이트](pwa-updates.md)
- [보안 헤더 · CSP](security-headers.md)
- [Pyodide 로딩](pyodide-loading.md)
- [SQL 실행기](sql-runner.md)
- [게스트 진도 이관](guest-progress-merge.md)
- [공유 PC 세션](shared-computer-sessions.md)
- [환경변수](environment-variables.md)
- [타이포그래피](typography.md)
- [URL 라우팅](url-routing.md)
- [소개 사이트](landing-site.md)
- [모바일 스플래시](mobile-splash.md)
- [테스트 · 저장소 정리](testing-and-cleanup.md)
- [마이그레이션](migrations/)
