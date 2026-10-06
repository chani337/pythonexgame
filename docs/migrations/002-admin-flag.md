# 002 — 관리자 판별을 DB 플래그로 분리

백로그 3번 작업 B파트의 산출물입니다. **프로덕션 DB는 건드리지 않았습니다.**

관련 파일
- `migrations/002_admin_flag.sql` (STEP 1~3)
- `migrations/002_admin_flag_rollback.sql`
- `supabase_schema.sql` — 최종 상태 반영 완료

**선행 조건: 마이그레이션 001이 먼저 적용되어 있어야 합니다.** 002는 001이 만든 `protect_profile_stats` 트리거 함수를 교체합니다.

---

## 1. 무엇이 문제였나

```ts
export const ADMIN_USER_ID = 'cf1c67dd-2b5e-4f86-9a0b-d0dda805f3da';
```

이 UUID가 **소스 3곳**(`AuthContext.tsx`, `Board.tsx`, `Sidebar.tsx`)과 **RLS 정책 3곳**(`board_select_own_or_admin`, `board_update_own_or_admin`, `board_delete_own_or_admin`)에 박혀 있었고, 저장소는 공개입니다.

권한 자체는 RLS가 지키고 있어서 **탈취는 불가능했습니다.** 하지만,

- **공격 대상이 특정됩니다.** "이 UUID의 계정만 뚫으면 전체 문의글을 볼 수 있다"가 공개 정보였습니다
- `EXCLUDED_LEADERBOARD_IDS`의 테스트 계정 UUID 2개도 같이 노출됐습니다
- **관리자를 바꾸려면 RLS 정책까지 고쳐야** 했습니다. 데이터가 아니라 스키마 변경이었습니다

## 2. 선택: `profiles.is_admin` 컬럼 (별도 `admins` 테이블 아님)

| | `profiles.is_admin` | `public.admins` 테이블 |
|---|---|---|
| RLS에서의 조회 | PK 단건 조회 (`is_admin()` 헬퍼) | EXISTS 서브쿼리 |
| 추가로 보호할 객체 | 없음 (기존 트리거 확장) | 테이블 1개 + 자체 RLS |
| 부여 이력 (누가/언제) | 없음 | `granted_at`, `granted_by` 가능 |
| 권한 단계 확장 | 불리 (컬럼 추가해야 함) | 유리 (role 컬럼) |
| 구현 분량 | 작음 | 중간 |

**추천: `is_admin` 컬럼.** 관리자가 1명인 개인 프로젝트에서 별도 테이블은 과설계입니다. 001이 이미 `hidden` 컬럼과 보호 트리거를 만들어 뒀으므로 그 위에 한 줄 얹는 것으로 끝납니다.

나중에 두 번째 권한 단계가 생기면(예: 문의 답변만 가능하고 통계는 못 보는 모더레이터) 그때 테이블로 옮기면 됩니다. **정책이 의존하는 것은 `public.is_admin()` 하나**라서 교체 범위가 그 함수 안으로 한정됩니다.

## 3. 적용 순서

> ⚠️ **STEP 순서를 반드시 지키세요.** STEP 2가 현재 관리자에게 플래그를 부여하고, STEP 3이 정책을 그 플래그에 의존하게 만듭니다. 순서를 바꾸면 **STEP 2를 실행할 때까지 관리자가 고객센터에서 잠깁니다.**

### STEP 1 — 컬럼 + 보호 + 헬퍼 함수

- `profiles.is_admin BOOLEAN DEFAULT false`
- 001의 `protect_profile_stats`를 교체해 `is_admin`도 보호 대상에 추가
- `public.is_admin()` — 호출자 본인의 플래그를 읽는 `SECURITY DEFINER STABLE` 함수

### STEP 2 — 플래그 부여 (정책 교체 전에!)

```sql
UPDATE public.profiles SET is_admin = true
WHERE id = 'cf1c67dd-2b5e-4f86-9a0b-d0dda805f3da';

-- 기존 EXCLUDED_LEADERBOARD_IDS 가 가리던 계정들을 hidden 으로 이관
UPDATE public.profiles SET hidden = true
WHERE id IN (
  'cf1c67dd-2b5e-4f86-9a0b-d0dda805f3da',  -- 관리자
  '5eb2fb93-7238-4f04-90b5-8d5706fd4c01',  -- '히히' 테스트 계정
  'b14d9a0d-93df-42b6-81f0-b195f4c0795d'   -- '비밀' 테스트 계정
);
```

확인 (관리자 1, hidden 3이어야 함):

```sql
SELECT COUNT(*) FILTER (WHERE is_admin) AS admins,
       COUNT(*) FILTER (WHERE hidden)   AS hidden_accounts
FROM public.profiles;
```

**0이 나오면 멈추세요.** `protect_profile_stats` 트리거가 막은 것입니다 — 자세한 내용은 아래 5절.

### STEP 3 — RLS 정책의 하드코딩 UUID 교체

`board_posts`의 3개 정책에서 `auth.uid() = 'cf1c67dd-...'`를 `public.is_admin()`으로 바꿉니다.

### STEP 4 — 클라이언트 배포

이 커밋의 코드 변경을 배포합니다.

- `ADMIN_USER_ID`, `ADMIN_EMAIL`, `EXCLUDED_LEADERBOARD_IDS` **상수 전부 삭제**
- `Board.tsx`, `Sidebar.tsx`, `Dashboard.tsx`의 `isAdmin` → `profile?.is_admin === true`
- `AuthContext`의 랭킹 제외 로직 → `profile?.hidden === true`
- `UserProfile` 타입에 `hidden?`, `is_admin?` 추가 (`select('*')`라 자동으로 실려 옵니다)

클라이언트 분기는 **UI 편의일 뿐입니다.** 개발자도구에서 `is_admin`을 true로 바꾸면 관리자 버튼이 보이긴 하지만, 실제 요청은 전부 RLS에 막혀 빈 결과나 거부가 돌아옵니다. 코드에도 주석으로 남겨 뒀습니다.

---

## 4. 검증 완료 (Postgres 15 컨테이너)

| # | 테스트 | 결과 |
|---|---|---|
| 1 | `postgres` 역할로 `is_admin`/`hidden` 부여 | 정상 반영 |
| 2 | `authenticated`가 스스로 `is_admin = true` 시도 | **무시** (false 유지) |
| 3 | `authenticated`가 `hidden = false`, `streak = 9999` 동시 시도 | 전부 무시 |
| 4 | `is_admin()` — 관리자 세션 | `true` |
| 5 | `is_admin()` — 일반 회원 세션 | `false` |
| 6 | `is_admin()` — 익명 세션 | `false` |
| 7 | 회원이 `board_posts` 조회 | 본인 글 1건만 |
| 8 | 관리자가 `board_posts` 조회 | 전체 2건 |
| 9 | 회원이 남의 글에 `admin_reply` 위조 시도 | 0건 반영 (RLS 거부) |
| 10 | 관리자가 회원 글에 답변 + 상태 변경 | 정상 |
| 11 | `hidden = true` 관리자가 `leaderboard_public`에 | 제외됨 |
| 12 | 002를 001-only DB에 단독 적용 | 정상 |
| 13 | 최종 `supabase_schema.sql` 신규 적용 (001+002 포함) | 정상 |

하드코딩 UUID 잔존 검사:

```bash
$ grep -c "cf1c67dd-2b5e-4f86-9a0b-d0dda805f3da" supabase_schema.sql
0
$ grep -rn "ADMIN_USER_ID\|EXCLUDED_LEADERBOARD_IDS" src/
(마이그레이션 SQL 안의 STEP 2 부여문에만 남음 — 그건 데이터이지 정책이 아님)
```

## 5. 검증 중에 잡은 설계 결함

001의 `protect_profile_stats` 트리거가 **역할을 구분하지 않고 모든 UPDATE를 막고 있었습니다.** Supabase SQL 에디터는 `postgres` 역할로 실행되므로, 위 STEP 2의 `UPDATE ... SET is_admin = true`가 **에러 없이 조용히 무시**됩니다. 001 문서에 적어 둔 "조작 계정 숨기기" 절차(`SET hidden = true`)도 같은 이유로 동작하지 않았습니다.

트리거가 막아야 할 대상은 **클라이언트 역할뿐**입니다. 수정:

```sql
-- PostgREST는 요청마다 역할을 설정합니다 (anon / authenticated / service_role).
-- SQL 에디터는 postgres. 즉 브라우저에서 온 요청만 막고, 관리자가 손으로
-- 고치는 것과 service_role 키는 통과시킵니다.
IF current_user NOT IN ('anon', 'authenticated') THEN
  RETURN NEW;
END IF;
```

001의 마이그레이션·스키마·문서에도 모두 반영했습니다. 001 문서의 검증 쿼리 (2)번은 이제 `SET ROLE authenticated`로 역할을 바꿔서 테스트하도록 바뀌었습니다 — SQL 에디터에서 그냥 실행하면 **성공하는 것이 정상**입니다.

## 6. 롤백

```
migrations/002_admin_flag_rollback.sql
```

정책을 하드코딩 UUID로 되돌리고 `is_admin()` 함수와 001 트리거 함수를 복원합니다. `is_admin` 컬럼은 남겨 둡니다(지우면 부여 상태가 사라지므로). 컬럼까지 지우려면 파일 STEP 3의 주석을 해제하세요.

클라이언트를 구버전으로 되돌릴 필요는 없습니다 — 새 클라이언트는 `profile.is_admin`을 읽는데, 롤백해도 컬럼이 남아 있으면 계속 동작합니다.

## 7. 관리자 추가/변경 방법 (앞으로)

소스 수정도, 재배포도 필요 없습니다. SQL 에디터에서:

```sql
-- 관리자 지정
UPDATE public.profiles SET is_admin = true WHERE email = 'new-admin@example.com';

-- 관리자 해제
UPDATE public.profiles SET is_admin = false WHERE email = 'old-admin@example.com';

-- 계정을 랭킹에서 숨기기 (테스트 계정, 조작 확인된 계정)
UPDATE public.profiles SET hidden = true WHERE email = 'tester@example.com';

-- 현재 상태 확인
SELECT email, display_name, is_admin, hidden FROM public.profiles
WHERE is_admin OR hidden ORDER BY email;
```
