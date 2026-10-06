# 환경변수 설정

`src/lib/supabase.ts`에 하드코딩되어 있던 Supabase URL과 publishable key 폴백을 제거했습니다. 이제 환경변수가 **유일한 공급원**입니다.

## 왜 바꿨나

```ts
// 이전
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://orqiaahseiudprjguimw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_hYS6V5iI9fzBzUWJZ0ZKXQ_nZJw1HD-';
```

publishable key는 **애초에 공개를 전제로 설계된 키**입니다. 번들에 들어가므로 브라우저 개발자도구로 누구나 볼 수 있고, 실제 보호는 RLS가 담당합니다. 그래서 이것 자체가 유출 사고는 아닙니다.

문제는 다른 쪽이었습니다.

- `.env`, `.env.example`, `.gitignore`를 제대로 만들어 둔 것이 **무의미해집니다** (환경변수가 없어도 동작하므로 아무도 설정하지 않게 됨)
- **키를 교체하려면 소스를 수정하고 재배포**해야 합니다. 설정이어야 할 값이 소스가 되어 있었습니다
- 프로젝트 URL이 소스에 박혀 있어 스테이징/프로덕션 분리가 불가능합니다

## 필요한 환경변수

| 이름 | 예시 | 어디서 얻나 |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://xxxxxxxx.supabase.co` | Supabase 대시보드 → Project Settings → Data API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_...` | 같은 화면 → API Keys → publishable (anon) key |

`VITE_` 접두사는 Vite가 **클라이언트 번들에 노출**시키는 변수라는 뜻입니다. service_role 키처럼 비밀이어야 하는 값은 **절대 `VITE_` 접두사로 두지 마세요.**

## 로컬 설정

지금까지 `.env` 파일이 없었고 하드코딩 폴백에 의존하고 있었습니다. 이제 만들어야 합니다.

```bash
cp .env.example .env
# .env 를 열어 위 두 값을 채우세요
```

`.env`는 `.gitignore`에 이미 등록되어 있습니다 (`.env`, `.env.*`, `!.env.example`).

### 설정하지 않으면

앱이 **크래시하지 않고 게스트 모드로 degrade**됩니다. 의도된 동작입니다.

- 콘솔에 어떤 변수가 빠졌는지 한국어로 안내 (개발 모드에서만)
- 로그인·회원가입은 "클라우드 데이터베이스 접속 정보가 설정되지 않았습니다" 반환
- 랭킹·활동 피드는 비어 있음
- **문제 풀이, 학습 가이드, 샌드박스, localStorage 진도는 정상 동작**

`createClient('')`는 `supabaseUrl is required.`로 throw하고, 이 모듈은 import 그래프 최상단에 있어서 그대로 두면 앱 전체가 죽습니다. 그래서 미설정 시 `https://unconfigured.invalid` 플레이스홀더를 넣고 `isSupabaseConfigured = false`로 모든 호출부를 게이트합니다.

> 플래그를 확인하지 않는 호출부(Dashboard 랭킹 탭, Board)는 모두 `{ data: null, error }`를 정상 처리합니다 — supabase-js가 요청 실패 시 반환하는 형태입니다. Board는 로그인이 필요한데 미설정 상태에서는 로그인 자체가 불가능해 도달하지 않습니다.

## Vercel 설정

Project → Settings → Environment Variables에 등록합니다.

| Key | Value | Environments |
|---|---|---|
| `VITE_SUPABASE_URL` | 프로젝트 URL | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | publishable key | Production, Preview, Development |

**등록 후 반드시 재배포하세요.** Vite는 빌드 시점에 값을 번들에 넣기 때문에, 환경변수만 추가하고 재배포하지 않으면 이전 빌드가 계속 서비스됩니다.

등록이 제대로 됐는지 확인:

```bash
# 빌드 산출물에 값이 들어갔는지
npm run build
grep -rl "본인-프로젝트-id" dist/assets/*.js && echo "반영됨"

# 플레이스홀더가 남아 있으면 환경변수가 안 잡힌 것
grep -rl "unconfigured.invalid" dist/assets/*.js && echo "환경변수 누락!"
```

## git 히스토리에 키가 남아 있는지 확인

```bash
# 이 파일에서 키 문자열이 추가·삭제된 커밋 찾기
git log --oneline -S 'sb_publishable' -- src/lib/supabase.ts

# 저장소 전체에서
git log --all --oneline -S 'sb_publishable'

# 특정 커밋의 당시 내용 확인
git show <commit>:src/lib/supabase.ts
```

현재 저장소에서는 `dcfa3db Embed live Supabase credentials into build fallback` 커밋에 평문으로 들어가 있습니다. **히스토리 재작성은 하지 않았습니다** — 이미 공개된 저장소이고 포크/클론이 있을 수 있어서, 재작성해도 유출이 되돌려지지 않습니다. 실효성 있는 조치는 키 교체입니다.

## 키 교체 절차

publishable key는 공개 전제이므로 **반드시 교체해야 하는 것은 아닙니다.** 다만 아래 경우에는 교체하세요.

- service_role 키나 DB 비밀번호가 함께 노출된 적이 있다
- RLS 정책을 믿을 수 없는 기간이 있었다 (마이그레이션 001 이전이 여기에 해당합니다)

### 절차

1. **Supabase 대시보드** → Project Settings → API Keys
2. publishable key 옆 **Create new key** → 새 키 발급 (구 키는 당장 폐기하지 말 것)
3. **Vercel** 환경변수의 `VITE_SUPABASE_ANON_KEY`를 새 키로 변경 → **재배포**
4. 배포된 사이트에서 로그인·문제 풀이·랭킹이 정상인지 확인
5. 로컬 `.env`도 갱신
6. 정상 확인 후 Supabase에서 **구 키 폐기(revoke)**

4번과 6번 사이에 두 키가 동시에 유효한 기간을 두는 것이 핵심입니다. 바로 폐기하면 캐시된 구 번들을 쓰는 사용자가 즉시 끊깁니다.

> service_role 키는 이 저장소 어디에도 없습니다 (확인: `git log --all -S 'service_role' -- src/` 결과 없음). DB 비밀번호도 노출되지 않았습니다. 따라서 지금 당장 급한 교체 대상은 아니지만, 001을 적용하기 전까지는 RLS에 구멍이 있었다는 점을 감안해 판단하세요.
