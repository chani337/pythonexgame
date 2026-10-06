# 001 — 랭킹 무결성 적용 가이드

백로그 1번 작업의 산출물입니다. **프로덕션 DB는 아직 건드리지 않았습니다.** 이 문서의 순서대로 직접 적용하세요.

관련 파일
- `migrations/001_ranking_integrity.sql` — 본 마이그레이션 (STEP 1~8)
- `migrations/problems_seed.sql` — `public.problems` 시드 (생성 파일, `npm run sync:problems`)
- `migrations/001_ranking_integrity_rollback.sql` — 롤백
- `supabase_schema.sql` — 최종 상태 반영 완료

---

## 1. 무엇이 뚫려 있었나

`solved_insert_own` 정책이 `auth.uid() = user_id`만 검사하고 `problem_id`는 무엇이든 받았습니다. `leaderboard_public`의 `solved_count`는 `user_solved_problems`의 **행 수를 COUNT**했으므로, 로그인한 사용자가 브라우저 콘솔에서 이렇게 하면 즉시 1위가 됩니다.

```js
// 기존 상태에서 실제로 동작했던 조작
const rows = Array.from({ length: 5000 }, (_, i) => ({
  user_id: (await supabase.auth.getUser()).data.user.id,
  problem_id: `fake_${i}`,          // 실존 여부를 아무도 검사하지 않음
}));
await supabase.from('user_solved_problems').upsert(rows);
```

`unique_user_problem`은 **같은 id의 중복만** 막기 때문에 서로 다른 가짜 id는 전부 통과했습니다.

스트릭도 같은 문제였습니다. `profiles_update_own`이 `streak` 쓰기를 허용하고 `syncStatsToSupabase`가 클라이언트 계산값을 그대로 써서, `supabase.from('profiles').update({ streak: 9999 })` 한 줄로 설정 가능했습니다.

### 핵심: FK 하나가 조작을 원천 차단합니다

`problem_id`가 `public.problems`(377개)에 존재해야 한다는 제약이 걸리면, **달성 가능한 최대 `solved_count`가 377**이 됩니다. 이는 모든 문제를 정직하게 푼 사용자와 동일한 값입니다. 가짜 id 전략이 통째로 무의미해집니다.

속도 제한은 그 위에 얹는 2차 방어이며, 랭킹 인플레보다는 **DB 쓰기 남용**을 막는 장치입니다.

---

## 2. 적용 순서

> ⚠️ **시작 전에 Supabase 대시보드에서 백업을 받으세요.** Database → Backups.
> 이 마이그레이션은 데이터를 이동(`quarantined_solved_problems`)하고 FK를 추가합니다.

### 2-0. 사전 조사 (읽기 전용)

먼저 현재 피해 규모를 확인합니다. SQL Editor에서 실행하세요.

```sql
-- 전체 규모
SELECT COUNT(*) AS total_solved_rows,
       COUNT(DISTINCT user_id) AS users,
       COUNT(DISTINCT problem_id) AS distinct_problem_ids
FROM public.user_solved_problems;
```

`distinct_problem_ids`가 **377을 넘으면 조작이 있었다는 뜻입니다** (존재하지 않는 id가 섞여 있음).

```sql
-- 상위 사용자 — 377을 넘는 solved_count가 있으면 그 계정이 조작했습니다
SELECT user_id, COUNT(*) AS solved
FROM public.user_solved_problems
GROUP BY user_id
ORDER BY solved DESC
LIMIT 20;
```

```sql
-- 비정상 속도: 1분 안에 30건을 넘긴 구간
SELECT user_id,
       DATE_TRUNC('minute', solved_at) AS minute,
       COUNT(*) AS inserts
FROM public.user_solved_problems
GROUP BY user_id, DATE_TRUNC('minute', solved_at)
HAVING COUNT(*) > 30
ORDER BY inserts DESC;
```

```sql
-- 클라이언트가 보고한 streak 중 실제 solve 기록으로 설명되지 않는 값
SELECT p.id, p.display_name, p.streak,
       (SELECT COUNT(DISTINCT (s.solved_at AT TIME ZONE 'Asia/Seoul')::date)
          FROM public.user_solved_problems s WHERE s.user_id = p.id) AS distinct_solve_days
FROM public.profiles p
WHERE p.streak > (SELECT COUNT(DISTINCT (s.solved_at AT TIME ZONE 'Asia/Seoul')::date)
                    FROM public.user_solved_problems s WHERE s.user_id = p.id)
ORDER BY p.streak DESC;
```

결과를 캡처해 두세요. 적용 후 비교 대상이 됩니다.

### 2-1. 참조 테이블 생성 + 시드

```bash
npm run sync:problems     # migrations/problems_seed.sql 생성 (377개)
```

SQL Editor에서 순서대로:

1. `migrations/001_ranking_integrity.sql`의 **STEP 1**만 실행 (`public.problems` 생성)
2. `migrations/problems_seed.sql` 전체 실행
3. 확인:

```sql
SELECT COUNT(*) FROM public.problems;   -- 377 이어야 함
SELECT language, COUNT(*) FROM public.problems GROUP BY language ORDER BY 2 DESC;
-- python 140 / algorithm 69 / java 48 / c 48 / sql 36 / js 36
```

**377이 아니면 멈추세요.** 시드가 불완전한 상태로 STEP 3을 실행하면 정상 진도가 격리됩니다.

### 2-2. 유효하지 않은 problem_id 확인

```sql
SELECT s.problem_id, COUNT(*) AS rows, COUNT(DISTINCT s.user_id) AS users
FROM public.user_solved_problems s
WHERE NOT EXISTS (SELECT 1 FROM public.problems p WHERE p.id = s.problem_id)
GROUP BY s.problem_id
ORDER BY rows DESC;
```

여기 나오는 id를 판단하세요.

- `fake_1`, `aaa` 같은 무의미한 문자열 → 조작. 그대로 격리
- **과거에 존재했지만 이름이 바뀐 id** → 정상 진도입니다. STEP 3 실행 **전에** 매핑해서 되살리세요:

```sql
-- 예: 이름이 바뀐 경우
UPDATE public.user_solved_problems
SET problem_id = 'new_id'
WHERE problem_id = 'old_id';
```

> 과거 커밋에서 `fa40f17`(난이도 라벨 정정)은 id를 바꾸지 않았고, C/챌린지 추가도 전부 신규 id였습니다. 따라서 이름 변경은 없었을 가능성이 높지만, 직접 확인하세요.

### 2-3. STEP 2 ~ STEP 6 실행

`migrations/001_ranking_integrity.sql`의 STEP 2부터 STEP 6까지 실행합니다. **STEP 7은 아직 실행하지 마세요.**

이 단계에서 일어나는 일:
- `profiles.hidden` 컬럼 추가
- 클라이언트의 `streak`/`solved_count`/`last_solved_date`/`hidden` 쓰기가 무시됨 (에러가 아니라 무시 — 구 클라이언트가 계속 동작)
- 유효하지 않은 행이 `quarantined_solved_problems`로 이동 후 FK 추가 ← **조작 차단 지점**
- 전 사용자 스트릭·solved_count를 실제 기록으로 재계산
- 분당 30건 insert 제한
- `leaderboard_public`이 `hidden` 계정 제외, `recent_activity_public` 뷰 신설

### 2-4. 조작 계정 숨기기

사전 조사에서 찾은 계정을 가립니다.

```sql
-- 테스트/관리자 계정 (지금까지 클라이언트 EXCLUDED_LEADERBOARD_IDS로 가리던 것)
UPDATE public.profiles SET hidden = true
WHERE id IN (
  'cf1c67dd-2b5e-4f86-9a0b-d0dda805f3da'   -- 관리자
  -- 여기에 테스트 계정 UUID 추가
);
```

`hidden`은 `protect_profile_stats` 트리거가 보호하므로 **클라이언트(anon/authenticated)는 스스로 해제할 수 없고**, SQL Editor(postgres)와 service_role 키에서만 변경됩니다.

### 2-5. 클라이언트 배포

이 커밋의 코드 변경을 배포합니다. 변경 내용:
- `syncStatsToSupabase` → `syncSandboxRunsToSupabase` (streak/last_solved_date를 더 이상 전송하지 않음)
- 활동 피드가 `user_solved_problems` 직접 읽기 → `recent_activity_public` 뷰
- 로그인 사용자의 streak은 서버 계산값(`profile.streak`)을 신뢰

### 2-6. STEP 7 실행 (클라이언트 배포 확인 후)

배포가 끝나고 활동 피드가 정상 동작하는 것을 확인한 다음 STEP 7을 실행합니다. `GRANT ALL`을 실제 필요한 권한으로 좁히고 `solved_select_public`을 본인 행으로 제한합니다.

### 2-7. STEP 8 실행

`merge_guest_progress` RPC를 만듭니다. 7번 작업(게스트 진도 이관)에서 사용합니다.

```sql
-- 반환: (merged_count, already_owned_count, skipped_count)
--   merged_count       = 이번에 실제로 새로 저장된 문제 수  ← 사용자 안내 문구에 쓸 값
--   already_owned_count = 이미 계정에 있던 문제 수
--   skipped_count      = public.problems 에 없어서 버린 id 수
SELECT * FROM public.merge_guest_progress(ARRAY['basic_part1_q1', 'basic_part1_q2']);
```

---

## 3. 이미 검증한 것 (Postgres 15 컨테이너)

프로덕션에 적용하기 전에, 로컬 Postgres 15 컨테이너에 Supabase 스텁(`auth.users`, `auth.uid()`, `anon`/`authenticated`/`service_role` 역할)을 만들고 **실제로 실행해서** 확인한 결과입니다.

### 취약점 재현

마이그레이션 전 스키마에 공격을 그대로 넣어봤습니다.

```sql
-- 정직한 사용자: 실제 문제 5개
-- 조작 계정: 존재하지 않는 id 5000개 INSERT + streak 직접 설정
INSERT INTO user_solved_problems (user_id, problem_id)
SELECT '<cheater>', 'fake_' || g FROM generate_series(1,5000) g;
UPDATE profiles SET streak = 9999 WHERE email = 'cheater@test.local';
```

| display_name | streak | solved_count |
|---|---|---|
| cheater | **9999** | **5000** |
| honest | 0 | 5 |

5000행이 **전부 통과했습니다.** 문서가 지적한 내용이 그대로 사실입니다.

### 마이그레이션 후

| display_name | streak | solved_count |
|---|---|---|
| honest | 1 | 5 |
| cheater | **0** | **0** |

5000행은 삭제가 아니라 `quarantined_solved_problems`로 이동했습니다 (`problem_id not in public.problems`, 5000행).

### 통과한 테스트

| # | 테스트 | 결과 |
|---|---|---|
| 1 | 존재하지 않는 `problem_id` INSERT | FK 위반으로 거부 |
| 2 | 정상 `problem_id` INSERT | 통과, `solved_count`/`streak`/`last_solved_date` 자동 갱신 |
| 3 | `authenticated` 역할로 `UPDATE profiles SET streak=9999, solved_count=9999, hidden=true` | **에러 없이 무시**, 원래 값 유지 |
| 3b | `postgres` 역할(SQL 에디터)로 같은 UPDATE | 정상 반영 — 관리자는 손으로 고칠 수 있어야 함 |
| 4 | `UPDATE profiles SET display_name=...` | 정상 동작 (보호 대상 아님) |
| 5 | 오늘·어제·그제 연속 | streak 3 |
| 6 | 어제·그제만 (오늘 미해결) | streak 2 — 아침에 0으로 리셋되지 않음 |
| 7 | 0~4일 연속 + 5일 구멍 + 6~7일 | streak 5 (구멍에서 정확히 끊김) |
| 8 | 최신 기록이 3일 전 | streak 0 |
| 9 | 기록 전무 | streak 0 |
| 10 | 같은 날 10문제 | streak 1, solved_count 10 (날짜 중복 집계 안 함) |
| 11 | 전체 DELETE | solved_count 0, streak 0, last_solved_date NULL로 재계산 |
| 12 | 1분 내 연속 INSERT | 30건 성공, **31번째에서 차단** |
| 13 | `merge_guest_progress` 유효 100 + 가짜 3 | merged 100 / skipped 3, 속도제한 우회됨 |
| 14 | 같은 호출 재실행 | merged **0** / already_owned 100 (멱등) |
| 15 | 50개 겹치고 50개 신규 | merged 50 / already_owned 50 |
| 16 | 1001개 전달 | `program_limit_exceeded`로 거부 |
| 17 | 로그인 없이 RPC 호출 | `insufficient_privilege`로 거부 |
| 18 | `hidden=true` 계정 | `leaderboard_public`·`recent_activity_public`에서 사라짐 |
| 19 | `recent_activity_public` 컬럼 | `problem_id, solved_at, display_name` — **user_id 비노출** |
| 20 | `authenticated`로 남의 solved 행 조회 | 0건 (RLS 격리) |
| 21 | `anon`으로 `user_solved_problems` 직접 SELECT | `permission denied` |
| 22 | `anon`으로 `profiles` 직접 SELECT | `permission denied` |
| 23 | `anon`으로 두 공개 뷰 SELECT | 정상 (뷰 소유자 권한으로 동작) |
| 24 | `authenticated`로 solved 행 DELETE | `permission denied` |
| 25 | 377개를 정당하게 전부 + 가짜 100개 추가 시도 | solved_count **377에서 상한**, 가짜는 skipped 100 |
| 26 | 스키마 파일 2회 연속 적용 | 멱등 — 에러 없음 |

### 검증 중에 잡은 버그 3개

1. **`date - bigint` 연산자 없음** — `ROW_NUMBER()`가 `bigint`를 반환하는데 `date` 산술에는 `date - integer` 연산자만 있습니다. `calculate_streak`가 생성 자체에 실패했습니다. `(r.rn - 1)::int` 캐스트로 수정.
2. **`merged_count`가 거짓 보고** — 공급한 유효 id 수를 세고 있어서, 재로그인마다 "100개를 저장했어요"라고 알릴 상태였습니다. `INSERT ... RETURNING`을 세도록 바꾸고 `already_owned_count`를 분리.
3. **`supabase_schema.sql`의 전방 참조** — `leaderboard_public`이 `user_solved_problems`보다 먼저 정의되어 있어서 **신규 DB에서 위에서 아래로 실행하면 뷰 생성이 실패**했습니다 (기존 파일에 있던 버그). 섹션 순서를 바로잡았고, `recent_activity_public`도 같은 문제를 피하도록 배치했습니다.

### 알게 된 동작 하나

대량 INSERT 공격을 하면 **FK보다 속도 제한이 먼저** 걸립니다. immediate FK 제약은 문장 끝에 검사되는데, `BEFORE INSERT` 트리거는 같은 문장에서 이미 기록된 행을 볼 수 있어서 30행째에 예외가 납니다. 단건 INSERT에서는 FK가 먼저 걸립니다. 두 방어 모두 각자 동작하는 것을 확인했습니다.

---

## 4. 적용 후 검증 — 프로덕션에서 직접 확인할 항목

위 26개는 로컬에서 통과했지만, **실제 데이터와 실제 Supabase 환경에서는 직접 확인하셔야 합니다.**


### DB 쪽

```sql
-- (1) FK가 실제로 막는지
INSERT INTO public.user_solved_problems (user_id, problem_id)
VALUES ('<본인 UUID>', 'definitely_not_a_real_problem');
-- 기대: ERROR ... violates foreign key constraint
```

```sql
-- (2) 스트릭이 클라이언트 값을 무시하는지
--
-- 주의: SQL 에디터는 postgres 역할로 실행되고, 트리거는 anon/authenticated
-- 역할만 막습니다. 그냥 UPDATE 하면 성공하는 것이 정상입니다 (관리자가
-- hidden/is_admin 을 손으로 고칠 수 있어야 하므로). 클라이언트 입장을
-- 재현하려면 역할을 바꿔서 테스트하세요.
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '<본인 UUID>', false);
UPDATE public.profiles SET streak = 9999 WHERE id = '<본인 UUID>';
RESET ROLE;
SELECT streak FROM public.profiles WHERE id = '<본인 UUID>';
-- 기대: 9999가 아니라 원래 값 (에러 없이 무시됨)
```

> `protect_profile_stats` 트리거는 `current_user NOT IN ('anon','authenticated')`
> 이면 통과시킵니다. PostgREST가 요청마다 역할을 설정하므로 브라우저에서 온
> 요청은 전부 anon/authenticated이고, SQL 에디터(postgres)와 service_role 키는
> 예외입니다. **이 예외가 없으면 아래 2-4의 `hidden = true` 설정이 조용히
> 무시됩니다** — 실제로 그렇게 만들었다가 테스트에서 잡았습니다.

```sql
-- (3) 스트릭 계산이 맞는지
SELECT id, display_name, streak, last_solved_date,
       public.calculate_streak(id) AS recomputed
FROM public.profiles
WHERE solved_count > 0
ORDER BY streak DESC LIMIT 10;
-- 기대: streak = recomputed (전부 일치)
```

```sql
-- (4) solved_count가 실제 행 수와 일치하는지
SELECT p.id, p.solved_count,
       (SELECT COUNT(*) FROM public.user_solved_problems s WHERE s.user_id = p.id) AS actual
FROM public.profiles p
WHERE p.solved_count <> (SELECT COUNT(*) FROM public.user_solved_problems s WHERE s.user_id = p.id);
-- 기대: 0 rows
```

```sql
-- (5) 377을 넘는 계정이 남아 있지 않은지
SELECT user_id, COUNT(*) FROM public.user_solved_problems
GROUP BY user_id HAVING COUNT(*) > (SELECT COUNT(*) FROM public.problems);
-- 기대: 0 rows
```

```sql
-- (6) 속도 제한
DO $$
DECLARE i INT;
BEGIN
  FOR i IN 1..35 LOOP
    INSERT INTO public.user_solved_problems (user_id, problem_id)
    SELECT '<본인 UUID>', id FROM public.problems OFFSET i LIMIT 1
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;
-- 기대: 30건째 이후 pyquests_rate_limit 예외
-- 주의: 본인 계정의 solved 데이터가 실제로 늘어납니다. 테스트 계정으로 하세요.
```

```sql
-- (7) 숨긴 계정이 랭킹/피드에서 빠졌는지
SELECT COUNT(*) FROM public.leaderboard_public
WHERE id IN (SELECT id FROM public.profiles WHERE hidden);
-- 기대: 0
```

### 앱 쪽 (브라우저)

| 확인 항목 | 기대 결과 |
|---|---|
| 로그아웃 상태로 메인 접속 | 랭킹과 "누가 방금 풀었어요" 배너가 정상 표시 |
| 로그인 후 문제 1개 풀기 | solved 카운트 +1, 스트릭이 서버 값으로 갱신 |
| 같은 문제 다시 풀기 | 카운트가 중복 증가하지 않음 |
| 연속 10문제 빠르게 풀기 | 속도 제한에 걸리지 않음 (30/분 이내) |
| 닉네임 변경 | 정상 동작 (streak 보호 트리거와 무관) |
| 고객센터 글 작성·조회 | 정상 (STEP 7의 GRANT 축소 후에도) |
| 학습 가이드 챕터 완료 체크 | 정상 |
| 오답노트 추가·삭제 | 정상 |
| 개발자도구 Console 에러 | 403/42501 권한 에러 없음 |

STEP 7 적용 후에는 **로그아웃 상태에서 활동 피드가 계속 뜨는지**를 특히 확인하세요. 비면 뷰 전환이 배포되지 않은 것입니다.

---

## 5. 롤백

```
migrations/001_ranking_integrity_rollback.sql
```

롤백도 같은 컨테이너에서 실제로 실행해 확인했습니다: 트리거 4개·함수 5개가 모두 제거되고, FK가 사라져 가짜 id가 다시 통과하는 상태(= 적용 전 동작)로 돌아가며, `leaderboard_public`은 구버전 GROUP BY 정의로 복원됩니다. 격리 테이블의 5000행은 의도대로 보존됩니다.

격리된 행은 자동으로 되돌리지 않습니다 (의도적). 되살리려면 롤백 파일 STEP 4의 주석을 해제하세요.

클라이언트는 구버전으로 되돌릴 필요가 없습니다 — 새 클라이언트는 롤백된 DB에서도 동작합니다 (streak을 안 쓰고, 뷰가 사라지면 피드만 비게 됩니다). 뷰를 지우지 않는 쪽을 권합니다.

---

## 6. 상시 운영용 탐지 쿼리

```sql
-- 최근 24시간 중 분당 20건을 넘긴 사용자
SELECT user_id, DATE_TRUNC('minute', solved_at) AS minute, COUNT(*)
FROM public.user_solved_problems
WHERE solved_at > NOW() - INTERVAL '24 hours'
GROUP BY 1, 2 HAVING COUNT(*) > 20 ORDER BY 3 DESC;

-- 격리 테이블에 새 행이 쌓였는지 (FK 적용 후에는 0이어야 정상)
SELECT reason, COUNT(*), MAX(quarantined_at) FROM public.quarantined_solved_problems GROUP BY 1;

-- 하루에 전체 문제의 절반 이상을 푼 계정
SELECT user_id, (solved_at AT TIME ZONE 'Asia/Seoul')::date AS day, COUNT(*)
FROM public.user_solved_problems
GROUP BY 1, 2
HAVING COUNT(*) > (SELECT COUNT(*) FROM public.problems) / 2
ORDER BY 3 DESC;
```

조작이 확인되면:

```sql
-- 랭킹에서 가리기 (데이터는 보존)
UPDATE public.profiles SET hidden = true WHERE id = '<UUID>';

-- 특정 시점 이후 기록만 삭제 (트리거가 스트릭을 자동 재계산)
DELETE FROM public.user_solved_problems
WHERE user_id = '<UUID>' AND solved_at > '2026-10-01';
```

---

## 7. 남은 위험과 범위 밖 사항

**이 마이그레이션이 막지 못하는 것**

1. **정답을 보고 푸는 것** — 정답은 `answerObfuscation.ts`의 base64이고 번들에 포함됩니다. 소스 코드가 공개 저장소에 있으므로 작정하면 377문제를 전부 "정당하게" 제출할 수 있습니다. 클라이언트 채점의 구조적 한계이고, **12번 작업(Piston 서버 채점)만이 실제 해결책**입니다. 그래서 12번의 8번 항목 — "랭킹을 서버 채점 문제 기준으로 전환할지" — 에 대한 제 의견은 **찬성**입니다. 서버 채점 문제가 생기면 그것만으로 별도 랭킹을 두는 쪽이 맞습니다.
2. **다중 계정** — 이메일만으로 가입하므로 계정을 여러 개 만드는 것은 막히지 않습니다. 랭킹 1위를 여러 번 차지하는 것과는 무관하니 실질 위험은 낮습니다.

**발견했지만 이 작업 범위 밖인 것**

- `src/App.tsx`의 `handleUnlockAllProblems`가 377행을 한 번에 upsert하고 `streak: 30`을 씁니다. STEP 5의 속도 제한에 걸리고 streak 쓰기는 무시됩니다. 관리자 전용 치트 기능이라 **제거를 권합니다** (백로그 11번 A-4의 죽은 코드 정리와 같은 성격). 유지하려면 `merge_guest_progress`를 재사용하도록 바꿔야 합니다. 범위 밖이라 건드리지 않았습니다.
- `ADMIN_USER_ID`가 RLS 정책 3곳에 하드코딩된 문제는 **3번 작업**에서 `is_admin` 컬럼으로 분리합니다. 이 마이그레이션의 `protect_profile_stats` 트리거에 `is_admin` 보호를 추가해야 하므로, 3번 작업은 `002_admin_flag.sql`에서 이 트리거를 교체하게 됩니다.
- `EXCLUDED_LEADERBOARD_IDS`는 이제 `profiles.hidden`으로 대체 가능합니다. 클라이언트 쪽 상수 제거는 3번 작업에서 함께 처리하는 것이 깔끔합니다 (지금은 뷰가 이미 걸러주므로 상수가 남아 있어도 무해합니다).
