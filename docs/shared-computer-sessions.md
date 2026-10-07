# 공유 PC 세션 처리

백로그 8번 작업의 산출물입니다. **DB 변경 없음.** 전부 클라이언트 세션 처리입니다.

검증: `npm run verify:shared-pc`

---

## 1. 세션이 어디에 저장되고 있었나

`createClient` 에 `auth` 옵션이 전혀 없었으므로 supabase-js 의 기본값이 쓰이고 있었습니다.

| 항목 | 값 |
|---|---|
| 저장소 | **`localStorage`** |
| 키 | `sb-<project-ref>-auth-token` |
| 수명 | 탭·브라우저를 닫아도, **재부팅을 해도** 남음 |
| 갱신 | `autoRefreshToken: true` — 1시간마다 자동 연장 |

즉 학교 컴퓨터실에서 학생이 로그아웃하지 않고 나가면 **그 계정은 무기한 열려 있었습니다.** 토큰이 자동 갱신되므로 만료로 끝나지도 않습니다.

## 2. 발견한 문제들

### (a) 휴대폰·태블릿에서는 로그아웃이 아예 불가능했습니다

로그아웃 버튼은 데스크톱 사이드바의 계정 카드 안에만 있었고, `src/index.css` 는 768px 이하에서 그 사이드바를 통째로 숨깁니다.

```css
@media (max-width: 768px) {
  .sidebar-desktop { display: none !important; }
  .sidebar-mobile  { display: block !important; }
}
```

모바일의 `더보기` 패널에는 고객센터·업데이트·다크모드·진척도만 있었고 **계정 영역이 없었습니다.** 공유 기기에서 가장 필요한 기능이 가장 작은 화면에서 빠져 있었던 셈입니다.

`verify:shared-pc` 가 이 조건을 검사합니다 — `.sidebar-desktop` 이 숨겨지는 미디어쿼리가 존재하면 모바일 블록에 `signOut()` 이 있어야 통과합니다.

### (b) 읽는 곳이 없는 닉네임이 남아 있었습니다

```ts
localStorage.setItem(`pyquests_display_name_${activeUserId}`, cleanName);
localStorage.setItem('pyquests_display_name', cleanName);   // ← 읽는 곳 없음
```

두 번째 줄은 전체 소스에 **읽는 코드가 하나도 없습니다.** 공유 브라우저에 이전 사람 닉네임만 남겨 두는 역할이었습니다. 삭제했습니다.

### (c) 로그아웃이 이전 사용자를 랭킹에서 "나"로 표시했습니다

`pyquests_last_user_id` 와 `pyquests_last_user_email` 은 세션 복원 중에도 내 순위를 강조하기 위한 폴백입니다. 로그아웃해도 남으니 **다음 사람에게 앞사람 행이 "나"로 하이라이트**되었습니다.

```ts
// Dashboard.tsx — isSelfUser
const lastEmail = localStorage.getItem('pyquests_last_user_email');
if (lastEmail && item.email === lastEmail) return true;
```

이메일 주소가 로그아웃 후에도 localStorage 에 남는다는 뜻이기도 합니다. 두 키 모두 로그아웃 시 삭제합니다. 로그인 경로는 `user?.id` / `user?.email` 을 먼저 보므로 영향이 없습니다.

## 3. "공용 컴퓨터예요" 옵션 — 설계

### 문제: 클라이언트는 선택보다 먼저 만들어집니다

`supabase` 는 모듈 최상단의 싱글턴이고 거의 모든 파일이 import 합니다. 사용자가 체크박스를 누르는 시점에는 이미 생성이 끝나 있으니 `createClient(..., { auth: { storage: sessionStorage } })` 처럼 인자로 넘길 수가 없습니다.

### 해법: 호출마다 저장소를 고르는 어댑터

`auth.storage` 에 `getItem`/`setItem`/`removeItem` 3개 메서드만 있는 객체를 넘기고, **매 호출 시점에** 어느 저장소를 쓸지 결정합니다. 앱의 나머지 부분은 아무것도 알 필요가 없습니다.

```ts
const authStorage = {
  getItem: (key) => (readSharedFlag() ? sessionStorage : localStorage).getItem(key),
  setItem: (key, value) => {
    const shared = readSharedFlag();
    (shared ? sessionStorage : localStorage).setItem(key, value);
    (shared ? localStorage : sessionStorage).removeItem(key);  // 사본을 남기지 않음
  },
  removeItem: (key) => { localStorage.removeItem(key); sessionStorage.removeItem(key); },
};
```

설계에서 중요한 선택 네 가지입니다.

| 선택 | 이유 |
|---|---|
| 플래그를 **`sessionStorage`** 에 둠 | 플래그가 관리하는 토큰과 **정확히 같은 순간에** 사라집니다. 둘이 어긋날 수 없습니다 |
| `getItem` 이 **다른 저장소로 폴백하지 않음** | 폴백하면 localStorage 에 남은 토큰이 "탭과 함께 끝나야 할" 세션을 되살립니다. 이게 이 작업에서 가장 중요한 한 줄입니다 |
| `setItem` 이 **반대쪽 사본을 지움** | 토큰은 1시간마다 갱신됩니다. 지우지 않으면 낡은 사본이 무기한 남습니다 |
| `removeItem` 이 **양쪽 모두 지움** | 로그아웃은 어느 모드가 썼든 로그아웃이어야 합니다 |

### `storageKey` 를 지정하지 않은 이유

명시하면 토큰 키를 정확히 알 수 있어 깔끔하지만, **기존 사용자 전원의 세션이 배포 순간 무효화**되어 사이트 전체가 로그아웃됩니다. 그래서 키를 알아야 하는 몇 군데는 `/^sb-.*-auth-token/` 패턴으로 찾습니다.

### 적용 순서가 전부입니다

```ts
setSharedComputerMode(sharedComputer);          // 반드시 먼저
const res = await supabase.auth.signInWithPassword({ email, password });
```

어댑터는 **쓰기 시점에** 저장소를 고릅니다. 로그인 후에 모드를 바꾸면 읽기와 쓰기가 서로 다른 저장소를 보게 됩니다. `verify:shared-pc` 가 이 순서를 검사합니다.

Google OAuth 도 같습니다 — `sessionStorage` 는 탭 단위라서 구글로 갔다 같은 탭으로 돌아오는 동안 플래그가 유지되고, `detectSessionInUrl` 이 토큰을 쓸 때까지 살아 있습니다.

### 체크박스 위치

**Google 버튼 위**에 둡니다. 폼 안(비밀번호 아래)에 두면 구글로 로그인하는 사람에게는 보이지 않습니다.

기본값은 **꺼짐**입니다. 켜져 있으면 개인 기기 사용자가 탭을 닫을 때마다 조용히 로그아웃됩니다.

### 알아 둘 동작

공용 모드에서 **새 탭을 열면 로그인되지 않은 상태**입니다. `sessionStorage` 가 탭 단위이기 때문입니다. 링크를 새 탭으로 열면 놀랄 수 있지만, 공용 PC 에서 원하는 성질이 정확히 이것입니다. 안내 문구에 명시했습니다.

## 4. 60분 무활동 자동 로그아웃

`src/hooks/useIdleLogout.ts`.

### 마감을 `setTimeout` 으로 재지 않습니다

이게 핵심입니다. 백그라운드 탭의 타이머는 **1분에 한 번 수준으로 스로틀**되고, 노트북을 덮으면 **아예 멈춥니다**. "60분 뒤에 실행" 타이머는 브라우저 기분에 따라 아무 때나 터집니다.

대신 **마지막 활동 시각을 저장**하고 1분마다 벽시계로 비교합니다. 공백이 얼마나 길었든 정확한 답이 나오고, 가장 중요한 경우 — **밤새 브라우저를 켜 둔 상태** — 도 제대로 처리됩니다.

```ts
const check = () => {
  const last = readLastActivity();
  if (last === null || Date.now() - last < IDLE_LIMIT_MS) return;
  clearIdleTimer();
  onIdleRef.current();
};
```

### 활동 시각은 탭 간에 공유합니다

`pyquests_last_activity_at` 을 `localStorage` 에 둡니다.

- 한 탭에서 타이핑하면 다른 탭도 살아 있어야 합니다
- 1시간이 이미 지난 뒤 **새 탭을 열면 즉시 만료**되어야 합니다 — 시간을 연장시켜 주면 안 됩니다

### 어떤 이벤트를 활동으로 보는가

```ts
const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
```

`mousemove` 와 `scroll` 은 뺐습니다 — 책이 키보드 위에 놓인 것이나 로딩 직후 페이지가 자리잡는 것까지 활동으로 셉니다. 위 네 개는 전부 사람이 실제로 뭔가 해야 발생합니다.

`visibilitychange` 는 **연장이 아니라 확인** 트리거입니다. 탭으로 돌아오는 것만으로 시계를 리셋하면, 자리를 비운 사이 다른 사람이 마우스를 건드려 세션이 유지됩니다.

캡처 단계에 등록합니다 — 어떤 컴포넌트가 `stopPropagation()` 을 쓴다고 앱 전체가 유휴해 보이면 안 됩니다.

localStorage 쓰기는 30초에 한 번으로 제한합니다 (키 입력마다 쓰면 안 됩니다).

### 로그인 상태에서만 작동합니다

게스트는 끝낼 세션이 없고, 로그아웃시키면 **아직 아무 곳에도 저장되지 않은 로컬 진도**를 날립니다.

### 반드시 안내합니다

설명 없는 자동 로그아웃은 **사이트가 고장난 것과 구별되지 않습니다.**

```
60분 동안 사용이 없어 자동으로 로그아웃했어요.
진도는 계정에 저장되어 있으니 다시 로그인하면 이어서 풀 수 있어요.
```

## 5. 로그아웃 시 정리

```ts
purgeSignedOutAccountLocalStorage(leavingUserId, sharedSession);
clearSharedComputerMode();
clearIdleTimer();
```

| 대상 | 처리 | 근거 |
|---|---|---|
| Supabase 세션 | 삭제 (양쪽 저장소) | — |
| `pyquests_cached_leaderboard` | 삭제 | 다른 사용자 닉네임·점수가 담깁니다. 공개 데이터지만 로그아웃 후에도 랭킹이 채워져 보이면 "아직 로그인됨"으로 읽힙니다 |
| `pyquests_last_user_id` / `_email` | 삭제 | §2(c) |
| 계정별 접두사 키 8종 | **떠나는 계정 것만** 삭제 | 해결 기록·스트릭·닉네임이 다음 사람 브라우저에 남지 않게 |
| `pyquests_sandbox_code` | **공용 모드에서만** 삭제 | 개인 기기에서 로그아웃만으로 작업물을 지우는 건 파괴입니다. 공용 모드는 사용자가 "여기는 공용 PC"라고 명시한 경우라 반대로 남기면 안 됩니다 |
| 게스트 키 (`*_guest`) | **보존** | 아래 |
| `pyquests_dark_mode`, `pyquests_sidebar_collapsed`, 학습가이드 UI 위치 3종 | 보존 | 기기 설정이지 개인정보가 아닙니다 |
| Cache Storage | **손대지 않음** | 아래 |

### 기존 `purgeOtherAccountsLocalStorage` 와의 관계

이미 있던 함수는 **다른** 계정의 키만 지웁니다 — 로그인한 본인 캐시는 오프라인 동작에 필요하니까요. 로그아웃에서는 그 논리가 뒤집힙니다: 계정이 떠나는 중이고, 공유 PC 라면 그 기록이 남아 있으면 안 됩니다. 그래서 별도 함수입니다.

### 게스트 키를 지우지 않는 이유

병합이 실패하면 **게스트 키가 유일한 사본**이고 다음 로그인에 재시도합니다 (7번 작업 참고). 로그아웃에서 지우면 그 데이터를 파괴하는 것입니다.

다음 사람이 앞사람의 게스트 진도를 보게 되는 건 사실입니다. 다만 그건 **로그아웃과 무관하게 이미 그런 구조**입니다 — 게스트 키는 애초에 브라우저 단위로 공유되니, 로그아웃이 고칠 자리가 아닙니다. 데이터 유실 위험과 비교해 보존을 택했습니다.

### Cache Storage 를 비우지 않는 이유

`vite.config.ts` 의 `runtimeCaching` 6개 경로는 전부 정적 자산입니다.

```
cdn.jsdelivr.net/pyodide/        /pyodide/
cdn.jsdelivr.net/npm/sql.js@     /sql-js/
fonts.gstatic.com                fonts.googleapis.com
```

**Supabase 경로가 없고 개인화된 응답도 없습니다.** 비우면 다음 사용자가 Pyodide 13MB 를 다시 받을 뿐 지워지는 개인정보는 없습니다.

이게 계속 사실인지는 사람이 기억할 일이 아니라서 `verify:shared-pc` 가 검사합니다 — `runtimeCaching` 블록에 `supabase` 라는 문자열이 나타나거나 와일드카드 경로가 들어오면 실패합니다. 프리캐시 `globPatterns` 에 `json`/`txt` 가 들어가는지도 함께 봅니다.

### 네트워크가 끊긴 상태의 로그아웃

```ts
try { await supabase.auth.signOut(); }
catch (err) { console.warn('Sign-out request failed, clearing locally anyway:', err); }
purgeSignedOutAccountLocalStorage(...);   // 어느 쪽이든 토큰을 지움
```

서버 왕복이 실패했다고 브라우저가 로그인 상태로 남아 있으면 안 됩니다. 이게 `purgeAuthTokens()` 가 패턴으로 토큰을 찾는 이유입니다.

## 6. 자동 검증

`npm run verify:shared-pc` 는 두 부분입니다.

### (1) 실제 어댑터를 실행합니다

esbuild 로 `src/lib/supabase.ts` 를 트랜스파일해 **실제 모듈을 import** 하고, 가짜 `Storage` 객체를 물려 동작을 확인합니다. 어댑터 동작은 소스를 읽어서는 판정할 수 없고, 잘못돼도 **UI 에서 전혀 달라 보이지 않습니다.**

| 검사 | 틀리면 |
|---|---|
| `createClient` 에 커스텀 storage 가 들어갔는지 | 옵션이 아무 일도 하지 않습니다 |
| 기본 모드 → localStorage | 개인 기기에서 탭 닫을 때마다 로그아웃 |
| 공용 모드 → sessionStorage 에만 | 탭을 닫아도 세션이 남습니다 |
| **공용 모드에서 localStorage 잔여 토큰을 읽지 않음** | 끝났어야 할 세션이 되살아납니다 |
| 공용 모드 전환이 기존 토큰을 제거 | 다음 기본 모드 방문자가 그 세션으로 로그인됩니다 |
| `removeItem` 이 양쪽을 지움 | 로그아웃이 반쪽만 됩니다 |
| `purgeAuthTokens` 가 패턴으로 찾고 **무관한 키는 안 건드림** | 오프라인 로그아웃 실패 / 앱 설정 삭제 |
| 스토리지가 차단된 브라우저에서 throw 하지 않음 | 이 모듈은 import 그래프 최상단입니다 — 던지면 **사이트 전체가 흰 화면** |

### (2) 소스에서 확인합니다

| 검사 | 왜 |
|---|---|
| **앱이 쓰는 모든 `pyquests_*` 키에 로그아웃 결정이 있는지** | 새 키를 추가하고 로그아웃 처리를 잊으면 조용히 남습니다. 타입 체크로는 절대 안 잡힙니다 |
| 백로그가 지정한 3개 키 삭제 | §2(c) |
| 오프라인 로그아웃 시 토큰 강제 제거 | 위 |
| 타이머가 로그인 상태에서 가동되는지 | 호출이 사라지면 자동 로그아웃이 전혀 동작하지 않습니다 |
| 마감이 `setTimeout` 이 아닌지 | §4 |
| 활동 시각이 탭 간 공유되는지 / 탭 복귀 시 확인하는지 | §4 |
| 자동 로그아웃 안내가 있는지 | 설명 없는 로그아웃 |
| **모바일에서 로그아웃이 가능한지** | §2(a) |
| 체크박스가 Google 버튼보다 위인지 | 구글 사용자에게 안 보임 |
| 세 로그인 경로 모두에 선택값이 전달되는지 | 체크박스가 무효 |
| 모드 적용이 토큰 기록보다 먼저인지 | 어댑터는 쓰기 시점에 고릅니다 |
| 서비스워커에 Supabase 경로가 없는지 | §5 |

현재 결과: **전부 통과**, `pyquests_*` 키 26개 전원에 명시된 결정 있음.

## 7. 브라우저에서 직접 확인할 항목

백로그가 요구한 검증입니다. **자동 검증이 대체하지 못합니다.**

### (a) 공용 모드 — 탭을 닫으면 세션이 사라지는지

1. 로그인 화면에서 **"공용 컴퓨터예요" 체크** 후 로그인
2. F12 → Application → Local Storage: `sb-...-auth-token` 이 **없어야** 함
3. Session Storage: `sb-...-auth-token` 과 `pyquests_shared_pc=1` 이 **있어야** 함
4. **F5 새로고침** → 로그인 유지 (같은 탭이므로)
5. **탭을 닫고 새 탭에서 사이트 열기** → 로그아웃 상태여야 함

### (b) 기본 모드 — 기존 동작이 그대로인지

1. 체크박스를 **끄고** 로그인
2. Local Storage 에 `sb-...-auth-token` 이 있어야 함, Session Storage 에는 없어야 함
3. 탭을 닫고 다시 열기 → **로그인 유지**

이게 가장 중요한 회귀 검사입니다. 어댑터가 잘못되면 전체 사용자가 로그아웃됩니다.

### (c) 로그아웃 후 잔여 데이터

로그아웃한 뒤 F12 에서 확인합니다.

| 위치 | 기대 |
|---|---|
| Local Storage | `sb-*-auth-token` 없음 / `pyquests_cached_leaderboard` 없음 / `pyquests_last_user_id`·`_email` 없음 / `pyquests_*_<userId>` 없음 |
| Local Storage (남아 있어야 하는 것) | `pyquests_dark_mode`, `pyquests_sidebar_collapsed`, `pyquests_*_guest` |
| Session Storage | 비어 있음 |
| Cache Storage | `pyodide-*`, `sqljs-*`, `google-fonts-*` 만. Supabase 관련 **없음** |
| IndexedDB | PyQuests 가 쓰지 않습니다 — 비어 있어야 정상 |

### (d) 60분 자동 로그아웃

실제로 60분 기다리기보다 시계를 조작하는 게 빠릅니다.

1. 로그인
2. F12 콘솔:
   ```js
   localStorage.setItem('pyquests_last_activity_at', String(Date.now() - 61 * 60 * 1000))
   ```
3. 1분 안에 자동 로그아웃 + 안내 배너
4. (또는 2번 직후 탭을 다른 탭으로 전환했다가 돌아오면 **즉시**)

재부팅·절전 경로도 확인하려면 2번 대신 노트북을 1시간 이상 덮어 두고 열어 보면 됩니다.

### (e) 모바일 로그아웃

1. 브라우저를 768px 이하로 좁히거나 휴대폰에서 접속
2. 하단 탭바 → **더보기**
3. 맨 위에 닉네임 + **로그아웃** 버튼이 있어야 함

## 8. 구현하지 않은 것 (언급만)

- **로그아웃 2분 전 경고**: 백로그는 "자동 로그아웃 + 안내"만 요구했고 안내는 사후입니다. 사전 카운트다운이 있으면 샌드박스에 쓰던 코드를 잃지 않게 할 수 있습니다
- **`pyquests_sandbox_code` 를 계정별로 스코프**: 지금은 모든 계정·게스트가 공유하는 단일 키입니다. 스코프하면 공용 모드 분기 없이 일반 정리 루프에 들어가지만, 기존 사용자의 초안이 떠돌게 됩니다
- **진도 자체를 공용 모드에서 `sessionStorage` 로**: 토큰만 옮겼고 진도 캐시는 여전히 localStorage 입니다. 로그아웃 없이 탭만 닫는 경로는 기존 `purgeOtherAccountsLocalStorage('guest')` 가 메웁니다 — 다음 방문이 비로그인 상태로 시작하면서 계정별 키를 전부 지우고, 이번 작업에서 `pyquests_last_user_id`/`_email` 도 그 자리에 추가했습니다. 다만 그건 **다음 로드**에 일어나므로, 탭을 닫은 직후 같은 브라우저를 여는 첫 화면에서 앞사람의 해결 개수가 한 번 스쳐 보일 수 있습니다 (세션은 이미 없으므로 조작·조회 권한은 없습니다)
