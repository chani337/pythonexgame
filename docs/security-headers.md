# 보안 헤더 & CSP

백로그 4번 작업의 산출물입니다. `vercel.json`에 적용했고, **CSP는 Report-Only로 시작**합니다.

검증: `npm run build && npm run verify:csp`

---

## 1. `Access-Control-Allow-Origin: *` — 근거 없음, 제거했습니다

문서가 "왜 들어갔는지 코드에서 근거를 찾아줘"라고 했는데, **근거가 없습니다.**

```bash
$ git log --oneline -- vercel.json
488beae feat: 파이썬 대화형 학습 및 문제 풀이 플랫폼 (PyQuests) 구현
```

최초 커밋의 스캐폴드에 들어온 뒤 한 번도 수정되지 않았습니다. 소스 전체에 CORS 관련 코드가 없습니다.

```bash
$ grep -rn "Access-Control\|cors\|CORS" src/ vite.config.ts index.html
(결과 없음)
```

**정적 SPA에는 아무 역할이 없습니다.** 자기 출처로 보내는 요청은 CORS 검사를 받지 않고, 외부에서 이 사이트의 HTML/JS를 `fetch`로 읽어갈 수 있게 열어주는 것 외에 효과가 없습니다. Supabase·jsDelivr·Google Fonts는 **각자의 서버**가 CORS 헤더를 보내는 쪽이라 이 사이트의 헤더와 무관합니다.

### ⚠️ 그런데 `vercel.json` 에서 빼는 것만으로는 제거되지 않습니다

처음에 `vercel.json` 에서 해당 항목을 **삭제**했는데, 배포 후 확인해 보니 헤더가 그대로 남아 있었습니다.

```
$ curl -sI https://pyquests.vercel.app/favicon.svg | grep -i access-control
access-control-allow-origin: *
$ curl -sI https://pyquests.vercel.app/favicon.svg | grep -i x-vercel-cache
x-vercel-cache: MISS          ← 캐시가 아니라 오리진에서 갓 받은 응답
```

**Vercel 이 정상 서빙되는 정적 파일에 `*` 를 기본으로 붙이고, `vercel.json` 의 headers 는 가산(additive) 방식**이라 키를 생략하면 그 기본값이 살아남습니다. 404 응답에는 제 헤더(`X-Frame-Options`)만 붙고 ACAO 는 없는 것으로 교차 확인했습니다.

→ **값을 명시해서 덮어써야 합니다.**

```json
{ "key": "Access-Control-Allow-Origin", "value": "https://pyquests.vercel.app" }
```

자기 출처를 지정하는 것이 가장 제한적인 선택입니다. 동일 출처 요청은 애초에 CORS 를 거치지 않으므로, 실질적으로 **교차 출처 읽기를 차단**하는 효과입니다.

> **커스텀 도메인을 붙이면(9번 작업) 이 값도 바꿔야 합니다.** 안 바꿔도 보안상 더 느슨해지지는 않지만(여전히 교차 출처가 막힘), 엉뚱한 출처를 가리키게 됩니다.

`npm run verify:csp` 가 이 항목을 검사합니다 — 생략했거나 `*` 면 실패합니다.

나중에 외부에서 호출할 API 경로가 생기면 **그 경로에만** 별도 규칙으로 출처를 지정하세요 (`"source": "/api/(.*)"`).

---

## 2. 추가한 헤더

| 헤더 | 값 | 이유 |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | 브라우저가 Content-Type을 무시하고 내용을 추측해 실행하는 것을 막습니다 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | 외부로 나갈 때 경로·쿼리를 떼고 출처만 전송 |
| `X-Frame-Options` | `DENY` | **로그인 화면 클릭재킹 방지.** CSP `frame-ancestors 'none'`도 함께 넣었습니다 (구형 브라우저용 이중 방어) |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | HTTPS 강제. Vercel이 기본 제공하지만 명시 |
| `Permissions-Policy` | 26개 기능 차단, `fullscreen=(self)` | 아래 참고 |

### Permissions-Policy — `fullscreen`은 반드시 살려야 합니다

코드에서 실제 사용 여부를 확인한 결과입니다.

```bash
$ grep -rn "requestFullscreen" src/
src/components/DocsViewer.tsx:531:  document.documentElement.requestFullscreen()
```

**`DocsViewer`의 "집중 학습 모드"가 전체화면을 사용합니다.** `fullscreen=()`으로 막으면 그 기능이 조용히 죽습니다. 그래서 `fullscreen=(self)`로 자기 출처에만 허용했습니다.

카메라·마이크·위치·블루투스·USB·결제 등 나머지 26개는 코드에 흔적이 전혀 없어서 전부 `()`로 차단했습니다. (`NotificationBadge`는 컴포넌트 이름이고 Web Notification API는 쓰지 않습니다.)

`npm run verify:csp`가 `fullscreen=()`을 넣으면 실패하도록 검사합니다.

---

## 3. CSP

실제 런타임 외부 출처는 **딱 3곳 + Supabase**입니다. 학습 가이드 본문에 등장하는 `cdn.jsdelivr.net/npm/bootstrap`, `example.com`, `youtube.com` 같은 URL은 **코드블록 안의 텍스트**이고 `<pre>`로 렌더링될 뿐 요청되지 않으므로 CSP에 넣지 않았습니다.

```
default-src 'self';
base-uri 'self';
object-src 'none';
frame-src 'none';
frame-ancestors 'none';
form-action 'self';
script-src 'self' 'sha256-stabNAzmohgSIpzRzskGO/7lLX4nFcJlwOdCeCE2MTw='
           https://cdn.jsdelivr.net 'wasm-unsafe-eval' 'unsafe-eval';
worker-src 'self' blob:;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: blob:;
connect-src 'self' https://cdn.jsdelivr.net
            https://<프로젝트>.supabase.co wss://<프로젝트>.supabase.co;
manifest-src 'self';
upgrade-insecure-requests
```

### 각 항목의 근거

| 지시어 | 왜 이 값인가 |
|---|---|
| `script-src 'sha256-...'` | `index.html`의 다크모드 선적용 인라인 스크립트. 외부 파일로 빼면 first paint 이후에 실행돼 흰 화면 깜빡임이 돌아오므로 인라인이어야 합니다. `'unsafe-inline'` 대신 **정확한 해시**로 좁혔습니다 |
| `script-src https://cdn.jsdelivr.net` | `pyodide.js` 로더 |
| `script-src 'wasm-unsafe-eval'` | Pyodide의 WebAssembly 컴파일. 이게 없으면 Python 실행이 전부 죽습니다 |
| `worker-src blob:` | `useJsRunner`가 `URL.createObjectURL`로 워커를 만듭니다 |
| `style-src 'unsafe-inline'` | CodeMirror 6이 런타임에 `<style>`을 주입합니다. React의 `style={{}}`는 CSSOM 속성 설정이라 CSP와 무관하지만 CodeMirror 때문에 필요합니다 |
| `connect-src https://cdn.jsdelivr.net` | Pyodide가 wasm·휠을 `fetch`로 받습니다 |
| `connect-src wss://...supabase.co` | realtime 웹소켓. `https://`와 **별개의 스킴**이라 따로 적어야 합니다 |
| `img-src data: blob:` | 아이콘·SVG 인라인 |

### ⚠️ `'unsafe-eval'` — CSP의 보호 효과를 크게 깎습니다

이걸 넣어야 하는 이유:

**`useJsRunner`는 `new Function`으로 사용자 코드를 실행합니다.** 그리고 `blob:` 워커는 **자신을 만든 문서의 CSP를 상속**합니다. 즉 워커 안의 `new Function`이 문서의 `script-src`로 검사되므로, 문서 CSP에 `'unsafe-eval'`이 있어야 합니다.

문제는 `'unsafe-eval'`이 **문서 전체에 적용**된다는 점입니다. XSS가 발생했을 때 CSP가 막아주는 핵심 수단 하나가 사라집니다. 해시로 인라인 스크립트를 정밀하게 좁혀둔 노력이 상당 부분 무의미해집니다.

#### 대안 — 워커를 정적 파일로 분리 (권장 후속 작업)

`blob:` 대신 **같은 출처의 정적 파일**로 워커를 만들면, 그 워커는 **자기 응답 헤더의 CSP**를 갖습니다. 그러면 `'unsafe-eval'`을 워커 경로에만 주고 문서 CSP에서는 뺄 수 있습니다.

```ts
// src/hooks/useJsRunner.ts — Vite 가 별도 에셋으로 뽑아줍니다
const worker = new Worker(new URL('./jsRunner.worker.ts', import.meta.url), {
  type: 'module',
});
```

```json
// vercel.json — 워커 경로에만 unsafe-eval
{
  "source": "/assets/jsRunner.worker(.*)",
  "headers": [{
    "key": "Content-Security-Policy",
    "value": "default-src 'none'; script-src 'self' 'unsafe-eval'"
  }]
}
```

```
// 문서 CSP 에서는 제거
script-src 'self' 'sha256-...' https://cdn.jsdelivr.net 'wasm-unsafe-eval';
worker-src 'self';     ← blob: 도 불필요
```

**이번 작업 범위에 넣지 않았습니다.** `WORKER_SOURCE`를 실제 모듈로 옮기는 리팩터링이고, 2번 작업에서 만든 `verify:sandbox` 하네스가 `WORKER_SOURCE` 문자열을 `node:vm`에 넣는 구조라 하네스도 같이 고쳐야 합니다. Pyodide도 `'unsafe-eval'`을 요구할 가능성이 있어서(아래 참고), **Report-Only 결과를 보고 판단하는 것이 순서상 맞습니다.**

#### Pyodide가 `'unsafe-eval'`까지 필요한지는 Report-Only로 확인해야 합니다

최신 Pyodide는 `'wasm-unsafe-eval'`만으로 동작한다는 보고가 있지만, FFI 경로에서 `new Function`을 쓰는 버전도 있습니다. **코드를 읽어서 단정할 수 없는 부분**이라 지금은 둘 다 넣어두고, Report-Only에서 위반이 안 나오는 것을 확인한 뒤 `'unsafe-eval'` 제거를 시도하는 순서로 잡았습니다.

---

## 4. Report-Only 1차 관찰 결과 (2026-10-06, 실제 배포)

브라우저에서 확인한 위반과 조치입니다. **세 건 모두 정적 검증으로는 잡을 수 없었습니다.**

### (1) `connect-src` 위반 — 서비스워커가 Google Fonts 를 fetch

```
Connecting to 'https://fonts.googleapis.com/css2?family=Inter...' violates
the following Content Security Policy directive: "connect-src 'self' ..."
  at workbox-ebc1056e.js:1
```

원인은 이 작업이 아니라 **5번 작업에서 추가한 `runtimeCaching`** 입니다. 서비스워커가 폰트를 캐시하려고 `fetch()` 하는데, **서비스워커의 fetch 는 `style-src`/`font-src` 가 아니라 `connect-src` 로 검사**됩니다. 페이지가 `<link>` 로 불러올 때는 `style-src` 로 검사되므로, 같은 URL 이 지시어를 두 개 걸칩니다.

→ `connect-src` 에 `https://fonts.googleapis.com https://fonts.gstatic.com` 추가.
→ `verify:csp` 에 이 검사를 넣어 회귀를 막았습니다.

### (2) `Permissions-Policy` 미인식 기능

```
Error with Permissions-Policy header: Unrecognized feature: 'ambient-light-sensor'.
Error with Permissions-Policy header: Unrecognized feature: 'battery'.
Error with Permissions-Policy header: Unrecognized feature: 'document-domain'.
```

Chrome 이 모르는 기능명이라 **아무것도 보호하지 못하면서 콘솔 에러만** 냅니다. 제거해서 27개 → 24개.

### (3) `upgrade-insecure-requests` 경고 — 조치 불필요

```
The Content Security Policy directive 'upgrade-insecure-requests' is ignored
when delivered in a report-only policy.
```

**정상입니다.** 이 지시어는 Report-Only 에서 동작하지 않고 강제 모드에서만 적용됩니다. 그대로 두면 전환 시 작동하므로 손대지 않았습니다. Report-Only 기간에는 이 경고가 계속 보입니다.

### 함께 정리한 것 (이 작업 범위 밖이지만 콘솔 노이즈)

```
<meta name="apple-mobile-web-app-capable"> is deprecated.
Please include <meta name="mobile-web-app-capable">
```

표준 이름을 추가하고, 구형 iOS Safari 가 `apple-` 접두사만 인식하므로 기존 것도 함께 남겼습니다.

### 아직 고치지 않은 것 — Google Fonts 중복 로드

CSP 위반을 추적하다 발견했습니다. 폰트 스타일시트를 **두 번** 불러오고 있고, 가중치가 서로 다릅니다.

| 위치 | 요청 |
|---|---|
| `index.html` | `Inter:300..700` + `Outfit:300..900` + `JetBrains Mono:400;500;600` |
| `src/index.css` 2번 줄 `@import` | `Outfit:300..800` + `Inter:300..800` + `JetBrains Mono:400;500;700` |

같은 세 패밀리를 중복으로 받고 있어 렌더 블로킹 요청이 하나 더 있습니다. **합치면 가중치 집합이 달라 글자 두께가 바뀔 수 있어** 이번에는 건드리지 않았습니다. 9번 작업(SEO/성능)에서 어느 가중치가 실제로 쓰이는지 확인한 뒤 정리하는 것이 안전합니다.

---

## 5. 적용 순서

### 5-1. 지금 상태

보안 헤더 5개는 **바로 적용**됩니다 (위험 없음). CSP는 `Content-Security-Policy-Report-Only`라서 **아무것도 차단하지 않고 위반만 콘솔에 보고**합니다.

배포하고 아래를 확인하세요.

```
개발자도구(F12) → Console
```

위반이 있으면 이런 형태로 찍힙니다.

```
[Report Only] Refused to load the script 'https://...' because it violates
the following Content Security Policy directive: "script-src ..."
```

**반드시 다음 화면을 전부 한 번씩 거치세요** — 위반은 해당 기능을 실제로 실행해야 나타납니다.

| 확인 화면 | 무엇을 건드려야 하나 |
|---|---|
| 메인 (대시보드) | 랭킹 로딩, 활동 피드, 트리비아 카드 |
| 문제 학습 → Python 문제 | **코드 실행** (Pyodide 첫 로딩 = jsDelivr wasm 다운로드) |
| Python 문제 중 numpy/pandas 사용 문제 | 추가 휠 다운로드 |
| 문제 학습 → SQL 문제 | 실행 (sqlite3 휠) |
| 문제 학습 → JavaScript 문제 | 실행 (**blob 워커 + new Function**) |
| 문제 학습 → Java/C 문제 | 객관식·빈칸 제출 |
| 학습 가이드 | 챕터 이동, **집중 학습 모드(전체화면)**, Ctrl+휠 확대 |
| 샌드박스 | 코드 실행 |
| 로그인 / 회원가입 | Supabase 인증 |
| 고객센터 | 글 작성·조회 |
| 오답노트 | 추가·삭제 |
| 업데이트 로그 | 페이지 진입 |
| 프로필 닉네임 변경 | 저장 |
| 다크 모드 토글 후 **새로고침** | 인라인 스크립트 해시 (깜빡임 없이 다크로 떠야 함) |

### 5-2. 위반이 나왔을 때

| 위반 내용 | 조치 |
|---|---|
| `script-src` 에서 인라인 스크립트 거부 | `npm run build && npm run csp:hash` → 나온 해시를 `vercel.json`에 반영 (빌드가 바뀌면 해시도 바뀝니다) |
| 모르는 외부 출처 | 정말 필요한지 먼저 확인. 필요하면 해당 지시어에 추가 |
| `connect-src` 위반 | Supabase URL 오타 또는 `wss://` 누락 |
| `style-src` 위반 | `'unsafe-inline'`이 이미 있으므로 나오지 않아야 합니다. 나오면 폰트 CDN 경로 확인 |

### 5-3. 강제 전환 — 2026-10-06 적용 완료

Report-Only 관찰에서 위반 0건을 확인한 뒤 전환했습니다. 실제 브라우저에서 거친 경로:

| 확인한 것 | 결과 |
|---|---|
| 메인 / 랭킹 / 이번주 / 언어별 탭 | 위반 없음 |
| 로그인 | 위반 없음 |
| **Python 문제 실행** | `[PyQuests] Pyodide v0.26.2 로드 성공 — jsDelivr CDN` — SRI 통과, wasm 13MB 다운로드 정상 |
| **SQL 문제 실행** | `Loading sqlite3` / `Loaded sqlite3` — 휠 지연 로드 정상 |
| **JavaScript 문제 실행** | 출력·채점 정상(`TEST 1 PASS`), 샌드박스 과도 차단 없음 |
| 학습 가이드 집중 모드 (전체화면) | 정상 |
| 다크모드 토글 → 새로고침 | 깜빡임 없음 — 인라인 스크립트 해시 유효 |
| 고객센터 / 오답노트 / 업데이트 로그 / 닉네임 변경 | 위반 없음 |

`'unsafe-eval'` 은 **남겨뒀습니다.** Report-Only 에서 Pyodide 가 이걸 요구하는지 판별할 방법이 없었고(위반이 안 났다는 것은 허용돼 있었기 때문), 빼고 시험하면 Python 실행이 전면 중단될 위험이 있습니다. 3절의 **워커 정적 파일 분리**를 먼저 적용한 뒤 제거를 시도하는 것이 안전한 순서입니다.

#### 되돌리는 방법

`vercel.json` 에서 키 이름만 되돌리고 재배포하면 즉시 관찰 모드로 돌아갑니다.

```diff
- "key": "Content-Security-Policy",
+ "key": "Content-Security-Policy-Report-Only",
```

### 5-3b. 원래 전환 절차 (참고)

위반이 **0건**인 것을 확인한 뒤, `vercel.json`에서 키 이름만 바꿉니다.

```diff
- "key": "Content-Security-Policy-Report-Only",
+ "key": "Content-Security-Policy",
```

재배포하고 4-1의 표를 **한 번 더** 전부 확인하세요. Report-Only와 강제 모드는 동작이 같아야 정상이지만, 실제로 차단될 때만 드러나는 문제가 있을 수 있습니다.

`npm run verify:csp`가 현재 모드를 출력하므로 어느 상태인지 헷갈리지 않습니다.

### 5-4. 강제 전환 후 선택적 강화

1. `'unsafe-eval'` 제거를 시도해 보고, Python 실행이 깨지면 되돌립니다 (Pyodide가 필요로 한다는 뜻)
2. 3절의 **워커 정적 파일 분리**를 적용해 `'unsafe-eval'`을 워커 경로로 격리
3. `report-uri` / `report-to`를 붙여 위반을 수집 (Sentry 등). 사용자 환경에서만 나오는 위반을 잡을 수 있습니다

---

## 6. 자동 검증이 잡아주는 것

```bash
npm run build && npm run verify:csp
```

| 검사 | 왜 중요한가 |
|---|---|
| 인라인 스크립트 해시 ↔ 현재 빌드 일치 | **불일치하면 강제 전환 시 다크모드가 조용히 깨집니다.** 가장 사고 나기 쉬운 지점 |
| `index.html`의 모든 subresource가 허용되는지 | 새 CDN을 추가하고 CSP를 잊는 경우 |
| 런타임 출처(Pyodide wasm, Supabase REST/wss, 폰트) 커버 | 정적 스캔으로는 안 보이는 fetch |
| `wasm-unsafe-eval`, `worker-src blob:` 존재 | 빼면 Python·JS 실행이 전멸 |
| `Permissions-Policy`가 `fullscreen`을 막지 않는지 | 집중 학습 모드 보호 |
| `Access-Control-Allow-Origin` 재등장 여부 | 되돌아오는 것 방지 |
| 현재 Report-Only / 강제 모드 표시 | 상태 혼동 방지 |

**이 검증은 Report-Only 배포를 대체하지 못합니다.** Pyodide가 `'unsafe-eval'`을 쓰는지 같은 질문은 실제 브라우저만 답할 수 있습니다.
