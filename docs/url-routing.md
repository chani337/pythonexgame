# URL 라우팅

지금까지 **모든 화면이 같은 주소**였습니다. `currentView` 가 `useState` 하나였고 URL 과 아무 관계가 없었습니다.

| | 전 | 후 |
|---|---|---|
| 뒤로가기 | **사이트 이탈** | 이전 화면 |
| 문제 링크 공유 | 불가능 | `/problems/basic_part1_q3` |
| 검색엔진에 보이는 페이지 | **1개** | 화면 6개 + 가이드 7개 + 문제 377개 |
| 새로고침 | 대시보드로 돌아감 | 보던 화면 유지 |

```
/                       대시보드
/problems               문제 목록
/problems/basic_part1_q3 개별 문제        ← 377개
/docs                   학습 가이드
/docs/css               가이드 언어별     ← 7개
/sandbox  /board  /changelog
```

---

## 1. 라우터를 넣지 않았습니다

`react-router` 를 쓰지 않았습니다. 이 앱의 `currentView` 는 스크롤 복원(`listScrollPosRef`), 필터 상태, 집중 모드, Pyodide 활성화 게이트와 전부 얽혀 있습니다. 라우터로 옮기면 컴포넌트 트리를 재배치해야 하고 그 과정에서 깨질 것이 많습니다.

대신 **상태는 그대로 `App` 이 들고, 주소창만 따라가게** 했습니다. `src/lib/routes.ts` 가 번역 계층이고, 의존성은 늘지 않았습니다.

`vercel.json` 은 이미 모든 경로를 `index.html` 로 rewrite 하고 있어서 **서버 설정 변경이 없습니다.** 모든 경로가 200 으로 확인됩니다.

## 2. 두 방향이 서로를 부르지 않게

양방향 동기화는 무한 루프가 기본값입니다. 막는 방법은 **"이미 맞으면 아무것도 하지 않는다"** 한 줄입니다.

```
상태 변경  →  nextHistoryAction()  →  주소가 이미 맞으면 kind:'none'
popstate   →  parsePath()          →  상태를 주소에 맞춤
                                       → 위 effect 가 돌지만 할 일이 없음
```

이 판단을 컴포넌트 안에 인라인으로 두지 않고 **순수 함수로 꺼냈습니다.**

```ts
nextHistoryAction(currentPath, route, isFirstRun):
  | { kind: 'none' }
  | { kind: 'push',    path }
  | { kind: 'replace', path }
```

덕분에 아래 규칙들을 테스트로 고정할 수 있습니다. 브라우저를 띄워 손으로 눌러 보는 것 말고는 확인할 방법이 없던 부분입니다.

### 첫 진입은 `replace`, 그 뒤는 `push`

진입 URL 이 정규형이 아니면(`/nope`, 또는 **삭제된 문제의 id**) 주소를 정리해야 하는데, 이때 `push` 하면 **뒤로가기가 해석되지 않는 URL 로 돌아갑니다.** 그래서 첫 실행만 `replace` 입니다.

정규 경로로 진입하면 첫 실행에도 **아무 기록을 남기지 않습니다** (`kind: 'none'`).

### 문제는 어디서 열었든 `/problems/<id>`

학습 가이드에서 관련 문제를 열면 `currentView` 는 `'docs'` 로 남습니다 — 닫으면 가이드로 돌아가야 하니까요. 하지만 그 문제도 자기 주소가 있어야 합니다.

```ts
routeForState('docs', 'sql_q1', 'sql')  // → { view: 'problems', problemId: 'sql_q1' }
```

> 한계: 그 상태로 **새로고침**하면 "가이드에서 열었다"는 정보가 URL 에 없으므로 닫을 때 문제 목록으로 갑니다. 쿼리 파라미터로 실어야 하는데, 공유되는 링크를 지저분하게 만들 값은 아니라고 봤습니다.

### 남은 카테고리가 다른 경로를 오염시키지 않습니다

`/docs/css` 에서 샌드박스로 가면 `docCategory` 는 `'css'` 로 남아 있습니다. `buildPath` 가 화면과 맞지 않는 정보를 **무시**하므로 `/sandbox/css` 가 아니라 `/sandbox` 입니다. 테스트로 고정했습니다.

## 3. `DocCategory` 를 데이터 쪽으로 옮겼습니다

`routes.ts` 가 `DocsViewer.tsx` 에서 타입을 가져오면 **라우팅 모듈이 .tsx 파일에 의존**하게 되고, `tsconfig.test.json` 에 JSX 설정을 끌고 들어옵니다 (실제로 `--jsx is not set` 에러가 났습니다).

타입을 `src/data/docs.ts` — 챕터 데이터가 있는 곳 — 로 옮기고, `DocsViewer` 는 기존 import 가 깨지지 않게 re-export 합니다.

## 4. `DocsViewer` 의 카테고리를 들어올렸습니다

`selectedCategory` 는 `DocsViewer` 내부 상태 + localStorage 였습니다. `/docs/css` 를 실주소로 만들려면 부모가 알아야 합니다.

**전면 재작성은 하지 않았습니다.** `DocsViewer` 가 여전히 상태를 소유하고, 선택적으로 초기값을 받고 변경을 보고합니다.

```tsx
<DocsViewer category={docCategory} onCategoryChange={setDocCategory} />
```

- `category` 가 있으면 **URL 이 우선**합니다 → `/docs/css` 는 마지막에 Python 을 보던 사람에게도 CSS 를 엽니다
- 없으면 기존 동작 그대로 — localStorage 의 마지막 카테고리
- 뒤로/앞으로가 카테고리를 바꾸면 **챕터 번호도 리셋**합니다. 안 하면 4챕터뿐인 언어에서 7챕터를 열려고 합니다

## 5. `scrollRestoration = 'manual'`

브라우저의 자동 스크롤 복원을 껐습니다. 앱이 `listScrollPosRef` 로 문제 목록 스크롤을 **직접** 복원하는데, 브라우저가 같은 일을 하면 서로 싸웁니다.

## 6. 테스트

`tests/routes.test.ts` — 26개. 전부 **누군가 입력하거나 붙여넣거나 검색 결과로 도달할 수 있는 URL** 이고, 잘못 해석되면 **에러 없이 빈 화면이나 엉뚱한 화면**이 나옵니다.

| 검사 | 왜 |
|---|---|
| 각 화면 경로 · 문제 id 추출 · 카테고리 추출 | 기본 동작 |
| 끝 슬래시 · 앞 슬래시 누락 · `//중복//` | 손으로 고친 URL, 링크 복사 과정에서 흔합니다 |
| 퍼센트 인코딩 디코딩 | `%5F` 로 인코딩된 `_` |
| **깨진 인코딩에서 throw 하지 않음** | `decodeURIComponent('%E0%A4%A')` 는 예외를 던집니다. 첫 렌더에서 터지면 **흰 화면** |
| **`/__proto__` · `/constructor` · `/toString`** | `segment in VIEW_SEGMENTS` 로 썼다면 **전부 통과**합니다. `hasOwnProperty.call` 로 막았습니다 |
| 모르는 경로 → 대시보드 | 스테일 링크 |
| 모르는 카테고리 → 카테고리 없는 가이드 (대시보드 아님) | 사용자 의도는 분명히 가이드였습니다 |
| **문제 id 377개 전부 왕복** | `problems.test.ts` 가 id 가 `[a-z0-9_]+` 임을 보장하는데, 그게 **URL 왕복까지 안전하다는 뜻인지**를 여기서 확인합니다 |
| `nextHistoryAction` 의 none/push/replace 분기 | §2 |

## 7. 프로덕션에서 전부 404 였습니다

라우팅을 배포하고 확인해 보니 `/` 만 200 이고 **나머지 전부 404** 였습니다.

```
/                            200
/problems                    404
/problems/basic_part1_q3     404
/docs/css                    404
```

### 원인

`vercel.json` 의 SPA rewrite 는 **처음부터 거기 있었고, 처음부터 동작하지 않았습니다.**

```json
"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
```

**Vercel 은 `/index.html` 을 `/` 로 308 리다이렉트합니다.**

```
$ curl -I https://pyquests.vercel.app/index.html
HTTP/2 308
location: https://pyquests.vercel.app/
```

즉 rewrite 의 destination 이 **파일이 아니라 리다이렉트**였고, Vercel 은 그 경로를 404 로 처리했습니다.

깊은 링크가 없던 동안에는 아무도 `/` 외의 경로를 열지 않았으니 드러날 일이 없었습니다.

### 수정

```json
"rewrites": [{ "source": "/(.*)", "destination": "/" }]
```

`/` 는 실제로 서빙되는 경로입니다.

### 첫 번째 수정 시도는 틀렸습니다

308 리다이렉트를 보고 `cleanUrls: true` 때문이라고 판단해서 그 옵션을 제거했습니다. **배포해 보니 `cleanUrls` 가 없는데도 `/index.html` 은 여전히 308 이었고, 깊은 경로는 그대로 404 였습니다.**

그 정규화는 `cleanUrls` 가 아니라 **Vercel 의 기본 동작**입니다. 메커니즘("destination 이 리다이렉트를 가리킨다")은 맞았지만 원인 지목이 틀렸습니다.

`cleanUrls` 제거는 되돌리지 않았습니다 — `dist/` 에 `.html` 이 하나뿐이라 이 앱에서는 아무 일도 하지 않는 옵션이고, 없는 편이 추론할 거리가 하나 줄어듭니다. 다만 **그게 버그의 원인은 아니었습니다.**

> 소개 사이트(`site/vercel.json`)는 `cleanUrls` 를 **유지**합니다. 거기는 rewrite 가 없고, `/index.html` → `/` 정규화는 주소를 하나로 모아 주므로 바람직합니다.

이 과정에서 확인된 것: **배포본 확인이 없었으면 틀린 수정을 맞다고 보고했을 것입니다.** 설정만 보고는 판정할 수 없었습니다.

### 왜 못 잡았나 — 검증의 구멍

로컬에서 13개 경로를 전부 200 으로 확인했는데도 놓쳤습니다. **`vite preview` 에는 자체 SPA 폴백이 있습니다.** `vercel.json` 에 뭐가 적혀 있든 개발 기기에서는 200 이 나옵니다.

이걸 잡을 수 있는 검사는 **배포된 호스트에 직접 물어보는 것** 하나뿐입니다.

```bash
PYQUESTS_URL=https://pyquests.vercel.app npm run verify:routing
```

`scripts/verify-routing.mjs` 가 두 층으로 확인합니다.

| 층 | 검사 | CI |
|---|---|---|
| 설정 | catch-all rewrite 존재 | ✓ |
| 설정 | **destination 이 `.html` 이 아님** ← 이번 버그 | ✓ |
| 설정 | `redirects` 가 앱 경로를 가로채지 않음 | ✓ |
| 설정 | `staticPaths()` 전부 해석 가능 · 정규형 | ✓ |
| 배포본 | 각 경로가 실제로 200 | 배포 후 수동 |

배포본 확인이 CI 에 없는 이유는, CI 시점에 **그 커밋의 배포가 아직 없기** 때문입니다. 배포 후에 돌려야 의미가 있습니다. 고쳤는지 확인할 때 이 명령이 그대로 증거가 됩니다.

## 8. 브라우저에서 확인한 것

빌드본을 실제로 띄워 확인했습니다.

| 경로 | 결과 |
|---|---|
| `/problems/basic_part1_q3` | **그 문제가 바로 열림** — 제목·설명·제약조건·기대출력 정상, 사이드바 "문제 학습" 활성 |
| `/docs/css` | 학습 가이드 활성 (비로그인이라 로그인 게이트 — 의도된 동작) |
| `/changelog` | 업데이트 화면 |
| `/nope` | 대시보드, 주소가 `/` 로 정리됨 |
| 전 경로 HTTP | 200 (SPA rewrite 가 이미 있었음) |

### 아직 손으로 확인해야 하는 것

자동 검증이 덮지 못하는 부분입니다. 헤드리스 브라우저에서 이 앱을 스크립트로 조작하려 했지만, Supabase 연결과 서비스워커 때문에 가상 시간에서 로드 이벤트가 끝나지 않아 포기했습니다.

1. 문제 목록에서 문제를 열고 **뒤로가기** → 목록으로, 스크롤 위치 유지
2. 학습 가이드에서 관련 문제를 열고 **뒤로가기** → 가이드로
3. `다음 문제` 를 몇 번 누르고 **뒤로가기** → 문제가 하나씩 거꾸로
4. 가이드 탭을 CSS → SQL 로 바꾸고 **뒤로가기** → CSS 로, 챕터도 1번으로
5. `/problems/basic_part1_q3` 를 **새 탭에 붙여넣기** → 그 문제가 열림
6. 주소창에 아무 경로나 → 대시보드, 주소가 `/` 로 바뀜

## 9. 다음 (9번 작업)

이제 sitemap 이 가능합니다. `routes.ts` 에 `staticPaths()` 를 넣어 뒀습니다 — 화면 6개 + 가이드 7개를 반환하고, 문제 377개는 `problems.ts` 에서 만들면 됩니다.

남은 것은 **도메인**입니다. `og:url`·`canonical`·`sitemap.xml` 은 모두 절대 URL 이 필요하고, 지금 `pyquests.vercel.app` 으로 박으면 도메인이 생길 때 검색엔진에 잘못된 주소가 등록된 상태가 됩니다.

문제별 **메타 태그**(제목·설명)는 이 라우팅으로도 안 됩니다. SPA 라 모든 경로가 같은 `index.html` 을 받고 `<title>` 이 동일합니다. 구글은 JS 를 실행해서 보지만 카카오톡·슬랙 미리보기는 **서버가 보낸 HTML 만** 읽습니다. 문제별 썸네일이 필요하면 Vercel 의 사전 렌더링이나 엣지 함수가 필요하고, 그건 9번에서 판단할 사안입니다.
