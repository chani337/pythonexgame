# 배포 런북 — 백로그 1~5번

커밋 `ac11466` ~ `7b57c71` 까지를 실제로 적용하는 절차입니다. **위에서 아래로 순서대로** 진행하세요.

## 이것만 기억하세요

1. **마이그레이션이 배포보다 먼저입니다.** 클라이언트가 streak 쓰기를 중단했으므로, DB 가 계산을 맡기 전에 배포하면 스트릭이 아예 갱신되지 않습니다
2. **4단계(권한 축소)는 배포 후에** 합니다. 현재 운영 중인 구 클라이언트가 `user_solved_problems` 를 직접 읽습니다
3. **1~3단계는 데이터를 삭제하지 않습니다.** `DELETE` 문이 0개입니다

---

## 0단계 — Vercel 환경변수 (가장 먼저, 빠뜨리면 로그인이 전부 죽습니다)

하드코딩 폴백을 제거했으므로, 환경변수 없이 배포되면 사이트가 **게스트 모드**로 뜹니다.

Vercel → 프로젝트 → Settings → Environment Variables

| Key | Value | Environments |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://orqiaahseiudprjguimw.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_hYS6V5iI9fzBzUWJZ0ZKXQ_nZJw1HD-` | Production, Preview, Development |

> 로컬 `.env` 는 이미 만들어 뒀습니다 (`.gitignore` 에 등록되어 커밋되지 않습니다).

**아직 푸시하지 마세요.** 환경변수 등록만 해두고 다음 단계로 갑니다.

---

## 1단계 — Supabase 백업

### 1-a. 대시보드 백업
Supabase → Database → Backups → 현재 시점 백업 확인 (Free 플랜은 자동 일일 백업)

### 1-b. SQL 스냅샷 (되돌리기가 훨씬 빠릅니다)
SQL Editor 에 붙여넣고 실행:

```
migrations/deploy/phase1b-backup.sql
```

**출력에서 `original` 과 `backup` 숫자가 모든 행에서 같은지 확인하세요.** 하나라도 다르면 멈추고 다시 실행하세요.

---

## 2단계 — 사전 조사 (읽기 전용, 아무것도 바뀌지 않음)

```
migrations/deploy/phase0-preflight.sql
```

결과를 캡처해 두세요. 특히:
- `distinct_problem_ids` 가 **377 을 넘으면** 조작이 있었다는 뜻입니다
- `solved` 가 **377 을 넘는 계정**이 조작한 계정입니다

---

## 3단계 — problems 참조 테이블

```
1) migrations/deploy/phase1-problems-table.sql
2) migrations/problems_seed.sql          ← 418줄, 377개 문제
```

**확인 (377 이 아니면 절대 다음으로 가지 마세요):**

```sql
SELECT COUNT(*) FROM public.problems;   -- 377
SELECT language, COUNT(*) FROM public.problems GROUP BY language ORDER BY 2 DESC;
-- python 140 / algorithm 69 / java 48 / c 48 / sql 36 / js 36
```

---

## 4단계 — 무결성 핵심

```
migrations/deploy/phase2-core.sql
```

적용 내용: `hidden` 컬럼, stat 쓰기 보호 트리거, **problem_id 검증 트리거**, 서버 스트릭 계산 + 전체 백필, 분당 30건 제한, 공개 뷰 4개, 게스트 병합 RPC.

### 출력에서 반드시 읽을 것

STEP 3 이 세 가지를 출력합니다.

1. **요약** — 미등록 행 / id / 사용자 수
2. **`users > 1` 목록** ← **여기를 보세요.** 두 명 이상이 푼 미등록 id 입니다. 실제 문제처럼 보이는 게 있으면 이름이 바뀐 문제입니다
3. 단독 사용자 id 목록 (최대 30개)

2번에 실제 문제가 있으면 (급하지 않습니다, 행은 그대로 있습니다):

```sql
UPDATE public.user_solved_problems SET problem_id = '<새 id>' WHERE problem_id = '<옛 id>';
SELECT public.recompute_solver_stats();
```

### 확인

```sql
-- 377 을 넘는 계정이 없어야 함
SELECT user_id, solved_count FROM public.profiles WHERE solved_count > 377;

-- 데이터가 그대로인지
SELECT (SELECT COUNT(*) FROM pyquests_backup.user_solved_problems_before_001) AS before,
       (SELECT COUNT(*) FROM public.user_solved_problems) AS after;   -- 같아야 함

-- 스트릭이 실제 기록과 맞는지
SELECT id, display_name, streak, public.calculate_streak(id) AS recomputed
FROM public.profiles WHERE solved_count > 0 ORDER BY streak DESC LIMIT 10;
```

---

## 5단계 — 관리자 플래그

```
migrations/deploy/phase3-admin.sql
```

**출력에서 `admins = 1`, `hidden_accounts = 3` 을 확인하세요.** 0 이면 멈추고 알려주세요.

이 단계에서 테스트 계정 2개와 관리자 계정이 `hidden = true` 가 되어 랭킹에서 빠집니다 (지금까지 클라이언트가 하드코딩으로 가리던 것).

---

## 6단계 — 클라이언트 배포

```bash
git push origin main
```

Vercel 이 자동 배포합니다. **배포 로그에서 `prebuild` 가 Pyodide 코어 13.15MB 를 받는지** 확인하세요.

### 배포 후 확인 (로그아웃 상태 + 로그인 상태 둘 다)

| 확인 | 기대 |
|---|---|
| 메인 접속 | 랭킹 표시, "누가 방금 풀었어요" 배너 표시 |
| 랭킹 탭 — 이번 주 / 언어별 | 비어 있지 않음 (새 집계 뷰) |
| 로그인 | 정상 (환경변수 확인) |
| Python 문제 실행 | 정상. Network 에 **numpy/pandas 휠 요청이 없어야 함** |
| `numpy_q1` 실행 | 하단에 "numpy를 준비하는 중입니다..." 배너 → 정상 실행 |
| SQL 문제 실행 | 정상 (sqlite3 휠) |
| JavaScript 문제 실행 | 정상 (샌드박스 강화 후) |
| 문제 풀기 → 스트릭 | 서버 계산값으로 증가 |
| 고객센터 (관리자) | 전체 문의 조회·답변 가능 |
| 학습 가이드 집중 모드 | 전체화면 동작 (Permissions-Policy) |
| 다크모드 토글 후 새로고침 | 깜빡임 없이 다크 (인라인 스크립트 해시) |
| Console | CSP 위반(Report Only) 과 403/42501 권한 에러 확인 |

Console 의 CSP Report-Only 위반은 **기록만 해두고** 그대로 두세요. `docs/security-headers.md` 4-2 절에 대응법이 있습니다.

---

## 7단계 — 권한 축소 (6단계가 정상인 것을 확인한 뒤에만)

```
migrations/deploy/phase4-lockdown.sql
```

`GRANT ALL` 을 실제 필요한 권한으로 좁히고, `user_solved_problems` 읽기를 본인 행으로 제한합니다.

**적용 직후 로그아웃 상태로 메인을 열어 "누가 방금 풀었어요" 배너가 계속 뜨는지 확인하세요.** 비면 6단계 배포가 반영되지 않은 것이므로 즉시 되돌리세요:

```sql
-- 비상 복구
DROP POLICY IF EXISTS "solved_select_own" ON public.user_solved_problems;
CREATE POLICY "solved_select_public" ON public.user_solved_problems FOR SELECT USING (true);
GRANT ALL ON public.user_solved_problems TO anon, authenticated;
```

---

## 되돌리기

| 상황 | 파일 |
|---|---|
| 트리거·뷰만 걷어내기 (데이터 그대로) | `migrations/001_ranking_integrity_rollback.sql` |
| 관리자 플래그 되돌리기 | `migrations/002_admin_flag_rollback.sql` |
| 계산된 stat 값까지 스냅샷으로 복원 | `migrations/deploy/restore-from-backup.sql` |
| 클라이언트 | Vercel → Deployments → 이전 배포 → Promote to Production |

클라이언트는 되돌리지 않아도 됩니다. 새 클라이언트는 마이그레이션이 롤백된 DB 에서도 동작합니다 (랭킹 탭과 활동 피드만 비게 됩니다).

---

## 정리 (모두 정상 확인 후)

```sql
-- 백업 스냅샷 삭제 (원본과 같은 용량을 차지합니다)
DROP SCHEMA pyquests_backup CASCADE;
```

```bash
# 실험용 브랜치 삭제
git branch -D experiment/ui-redesign
```

---

## 적용 전 로컬 검증 결과

이 절차 그대로를 Postgres 15 컨테이너에서 실행해 확인했습니다. 조작 계정(가짜 id 3000개 + streak 9999), 정직한 학생, **이름이 바뀐 문제를 푼 학생 2명**을 넣은 상태에서:

| 항목 | 결과 |
|---|---|
| `user_solved_problems` 행 수 | 3007 → **3007** (손실 0) |
| `user_review_problems` / `user_read_chapters` / `board_posts` / `profiles` | 전부 동일 |
| 조작 계정 solved_count | 3000 → **0** (삭제 없이 집계 제외) |
| 정직한 학생 | 5 / streak 1 (영향 없음) |
| 이름 바뀐 문제 행 | 타임스탬프까지 **그대로 보존** |
| id 복원 + `recompute_solver_stats()` | 두 학생 모두 solved_count 1, streak 1 로 **완전 복구** |
| 새 가짜 id INSERT | `pyquests_unknown_problem` 으로 차단 |
| 4단계 후 anon 의 테이블 직접 읽기 | `permission denied` |
| 4단계 후 공개 뷰 4개 | 전부 정상 조회 |
| 전 단계 `ON_ERROR_STOP=1` 적용 | 에러 0 |
