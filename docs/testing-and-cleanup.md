# 저장소 정리 + 테스트

백로그 11번 작업의 산출물입니다. **DB 변경 없음. 앱 동작 변경 없음.**

```bash
npm run verify:all   # CI 가 돌리는 것과 같은 묶음
npm run test         # vitest run
```

---

## A. 정리한 것

### `extract_problems.cjs` — 삭제

`problems.ts` 를 생성했던 1회용 스크립트인데 실행이 **불가능한 상태**였습니다.

```js
const logDir = 'c:\\Users\\smhrd\\Desktop\\바이브';
const jsonPath = path.join(logDir, 'diag_line_281.json');
```

다른 사람 PC 의 절대 경로를 가리키고, 읽으려는 `diag_line_281.json` 은 `.gitignore` 의 `diag_*` 에 걸려 저장소에 없습니다. 어디서도 돌아가지 않습니다.

### `문제.txt` — `docs/source/` 로 이동

백로그가 "정답이 평문으로 있다면 공개 저장소에 두는 게 적절한지"를 물었는데, **정답이 없습니다.** 문제 90개의 지문·조건·실행 예시만 있습니다 (`정답`/`풀이` 섹션 0개). 전체 377문제 중 초기 Python 90개의 원문입니다.

지울 이유는 없지만 루트에 있을 이유도 없어서 `docs/source/` 로 옮겼습니다.

### `docs/` 의 노트북·txt — `docs/source/` 로 이동

`docs/*.ipynb` 8개와 `NumPy.txt`/`Pandas.txt`/`Matplotlib.txt` 가 `docs/` 에 제 작업 문서들과 섞여 있었습니다.

관계를 확인했습니다: **런타임에 읽지 않습니다.** `src/data/docs.ts` 가 "Auto-generated jupyter notebook docs file" 이고 노트북 내용이 전부 들어가 있습니다. `chapterQuizzes.ts` 의 `chapterId` 도 파일명에서 나온 문자열(`0_________ipynb`)이지 파일 참조가 아닙니다.

즉 **변환 원본**입니다. 생성 스크립트는 저장소에 없습니다 — 노트북을 수정해도 자동 반영되지 않으니, 지금은 `docs.ts` 를 직접 고치는 구조입니다.

### `package.json` — `"name": "-"` → `"pyquests"`

### `DEFAULT_LEADERBOARD` — 삭제

가짜 계정 5개(`알고리즘마스터`, `코드파이썬`, ... `@pyquests.io`)가 상수로 있었습니다. **어디서도 import 하지 않습니다** — 두 읽기 경로가 모두 `default-runner-` 로 시작하는 id 를 필터링하므로 렌더링도 되지 않았습니다. 공개 저장소에 "랭킹을 채워 넣는다"는 오해만 남기는 죽은 코드였습니다.

**필터 두 줄은 남겼습니다.** 재방문자의 `pyquests_cached_leaderboard` 에 예전 빌드가 넣은 그 행들이 아직 들어 있을 수 있고, 그 캐시는 네트워크 요청보다 먼저 읽힙니다.

### Google Fonts 를 두 번 받던 것 — 수정

```html
<!-- index.html -->
<link href="...Inter:wght@300..700&Outfit:wght@300..900&JetBrains+Mono:wght@400;500;600...">
```
```css
/* src/index.css */
@import url('...Outfit:wght@300..800&Inter:wght@300..800&JetBrains+Mono:wght@400;500;700...');
```

두 스타일시트가 겹치면서도 서로 달랐습니다. 실제로 쓰는 weight 는 **400/500/600/700/800** 인데:

| | Inter 800 | JetBrains 700 |
|---|---|---|
| `<link>` | ✗ (700까지) | ✗ (600까지) |
| `@import` | ✓ | ✓ |

`@import` 가 들어오기 전까지는 브라우저가 Inter 800 과 JetBrains 700 을 **합성(synthesise)** 했습니다. 반대로 300/900 은 어디서도 쓰지 않는데 둘 다 받고 있었습니다.

`@import` 를 제거하고 `<link>` 하나로 합쳤습니다. `@import` 쪽을 지운 이유는 CSS 안의 `@import` 가 렌더링을 추가로 블로킹하고, `index.html` 에는 이미 `preconnect` 가 붙어 있기 때문입니다.

### `pyquests_display_name` (8번 작업에서 발견) — 삭제

읽는 코드가 없는 채로 공유 브라우저에 앞사람 닉네임만 남기고 있었습니다. 자세한 내용은 [공유 PC 세션](shared-computer-sessions.md).

---

## B. 테스트

vitest 를 넣었습니다. `tests/` 는 `tsconfig.test.json` 으로 **`tsc -b` 에도 포함**되므로, 테스트 안의 타입 오류가 빌드를 깨뜨립니다 (일부러 `const x: string = 123` 을 넣어 확인했습니다).

### 문제 데이터 검증 (가장 중요)

377문제 × 3개 실행기, 손으로 쓴 데이터에 **정답이 base64 로 인코딩**되어 있습니다. 눈으로 봐서는 오타를 찾을 수 없습니다.

전부 앱이 **런타임에 검사하지 않고 의존하는** 불변식입니다.

| 검사 | 틀리면 |
|---|---|
| id 유일 | 중복 id 는 다른 문제의 진도를 덮습니다 |
| id 가 `[a-z0-9_]+` | `problems` 테이블의 PK 이고 RPC 배열로 전달됩니다 |
| type 별 필수 필드 | coding 에 `testCases` 가 없으면 채점이 안 됩니다 |
| `testRunnerCode` 가 알려진 값 | 모르는 값은 채점을 통째로 건너뜁니다 |
| base64 필드 3종이 모두 디코딩됨 | 채점기 안에서 throw 합니다 |
| **`correctAnswerIndex` 가 `quizOptions` 범위 안** | **모든 답이 오답 처리됩니다. 에러는 아무 데도 안 납니다** |
| `correctAnswerText` 가 빈 문자열이 아님 | 정답이 없는 빈칸 문제 |
| 정답이 설명에 평문으로 중복 노출되지 않음 | 난독화의 의미가 없어집니다 |
| `language` 가 타입 안 / `difficulty` 가 네 값 중 하나 | 필터에서 사라집니다 |
| `examples` 최소 1개 | `ProblemWorkspace` 가 무조건 렌더링합니다 |
| `solutionCode` 키가 모두 실존 문제 | 이름이 바뀐 문제의 고아 항목 = 아무도 볼 수 없는 정답 |

**실제로 깨지는지 확인했습니다.** 퀴즈 하나의 `correctAnswerIndex` 를 `"MQ=="`(1) → `"OQ=="`(9) 로 바꿨더니:

```
× correctAnswerIndex 디코딩 값이 quizOptions 범위 안이다
+   "java_quiz_intro_1: index 9 / options 4"
```

`expected` 를 `"!!!broken!!!"` 로 바꿨더니 디코딩 테스트가 실패했습니다. 둘 다 문제 id 를 알려줍니다.

현재 상태: **위 전부 통과.** 데이터에 오류가 없습니다.

### 분포 출력

```
총 문제: 377
언어별  : { python: 140, sql: 36, java: 48, c: 48, js: 36, algorithm: 69 }
난이도별: { basic: 95, intermediate: 158, advanced: 65, expert: 59 }
타입별  : { coding: 269, quiz: 72, fill: 36 }
실제 코드 실행: 269
```

### 순수 함수 단위 테스트

| 대상 | 핵심 |
|---|---|
| `decodeAnswer` | **한글 왕복** — 그냥 `atob()` 면 다국어가 깨집니다 (그래서 `TextDecoder` 가 있습니다). base64 가 아니면 throw 하는지도 |
| `checkKeywords` | **단어 경계** — 이 모듈의 존재 이유입니다. 부분 문자열이면 `in` 이 `print` 안에서, `or` 가 `for` 안에서 잡혀 필수 키워드 검사가 거의 모든 코드를 통과시킵니다. `joined` 에 `in` 이 없다고 판정하는지 확인 |
| `translateOracleSqlToSqlite` | `NVL`→`IFNULL`, `FETCH FIRST`→`LIMIT`, `(+)`→`LEFT JOIN`. 그리고 **표준 SQL 을 건드리지 않는지** — 36문제 전부 이 함수를 지나가므로 과하게 치환하면 Oracle 문법을 쓰지 않은 문제가 깨집니다 |
| `isProfaneOrForbidden` | 욕설 차단 + 회피(`시 발`, `씨1발`, `노_무_현`) 차단 + **정상 닉네임 오탐 없음** |
| `filterProblems` | `language` 미지정을 python 으로 취급하는지 (140개 중 **99개가 미지정**입니다 — 기본값 처리가 없으면 Python 문제 대부분이 사라집니다), 언어별 합이 전체와 같은지 |

---

## C. 보고 — 고치지 않고 알려드리는 것

백로그가 "기존 코드 동작을 바꾸지 마 … 문제 데이터의 실제 오류라면 목록으로 알려줘 (내가 판단해서 고칠게)" 라고 했으므로 아래는 **그대로 두었습니다.** 각각 테스트에 현재 개수가 고정되어 있어서, 줄어드는 건 괜찮고 **늘어나면 실패**합니다.

### (1) 정답·해설이 없는 expert 문제 35개

```
정답 코드 없는 coding 문제: 35개 / 269개
algo_expert_* 15 · py_expert_* 9 · js_expert_* 6 · sql_expert_* 5
```

`solutionCode` 와 `solutionExplanations` **둘 다** 비어 있어서 `ProblemWorkspace` 가 정답·해설 섹션을 통째로 숨깁니다. 크래시는 아니지만, **가장 어려운 문제들이 하필 답을 볼 수 없는 문제들**입니다. 다이크스트라나 편집거리에서 막힌 학생이 볼 게 없습니다.

전체 목록은 `npm run test` 출력에 나옵니다.

### (2) 행 순서에 의존하는 SQL 문제 25개

```
행 순서에 의존하는 SQL 문제: 25개 / 36개
```

`stdout_match` 는 결과 표를 줄 단위로 비교하는데, **2행 이상을 돌려주면서 `ORDER BY` 가 없는** 쿼리는 SQLite 가 내놓는 우연한 순서로 채점됩니다.

지금은 안정적입니다 — `verify:sql` 이 36개 전부 돌려서 통과합니다. 하지만 **보장된 동작이 아니고**, SQLite 버전이 올라가거나 인덱스가 추가되면 순서가 바뀔 수 있습니다. 그러면 정답이 오답으로 처리됩니다.

고치는 방법은 두 가지이고 둘 다 콘텐츠 판단입니다.

1. 25문제의 조건에 `ORDER BY` 를 명시 (학습 측면에서도 더 나음 — SQL 에서 순서가 보장되지 않는다는 걸 가르침)
2. 기대 출력을 재생성하고 채점을 순서 무관 비교로 바꿈 (`stdout_match` 변경이 필요)

### (3) 닉네임 필터 오탐 — 정상 단어 15개

`FORBIDDEN_WORDS` 를 **단순 부분 문자열**로 비교하기 때문에, 짧은 항목이 평범한 한국어를 잡습니다. 정상 단어 60개로 검사했더니 15개(25%)가 걸렸습니다.

| 원인 항목 | 막히는 정상 단어 |
|---|---|
| **`라도`** | `하나라도` `그라도` `너라도` `바라도` `라도` |
| **`성인`** | `성인` `성인식` `성인용` |
| `재앙` | `재앙` |
| `노무` | `노무사` |
| `틀니` | `틀니` |
| `호구` | `호구조사` |
| `자살`·`살인`·`미친` | `자살골` `살인마` `미친코딩` |

가장 심각한 건 **`라도`** 입니다. 한국어 조사라서 이걸로 끝나는 닉네임은 전부 거부됩니다. 닉네임이 **최대 5자**라 짧은 단어의 영향이 더 큽니다.

고치려면 단어별로 "단어 경계 필요 / 부분 문자열 허용"을 구분해야 하는데 (`checkKeywords` 가 이미 `BARE_WORDS` 로 쓰는 방식입니다), 어떤 단어를 어느 쪽에 넣을지는 판단이 필요합니다. 특히 정치인 이름 항목들은 의도가 명확하지 않아 손대지 않았습니다.

테스트에 현재 오탐 목록이 **고정**되어 있어서, 나중에 필터를 고치면 그 테스트가 실패하며 목록을 갱신하라고 알려줍니다.

---

## D. CI

`.github/workflows/ci.yml` — push(main) 와 모든 PR 에서 실행됩니다.

```
npm ci → lint → tsc -b → test → check:problems
       → verify:sandbox → verify:pyodide → verify:sql
       → verify:guest-merge → verify:shared-pc
       → build → verify:csp → verify:pyodide-core
```

지금까지 만든 검증 스크립트 7개가 **"누가 기억해서 실행할 때만" 돌고 있었습니다.** 이게 가장 큰 변화입니다 — 9·10번 작업에서 `index.html`·라우팅·`vercel.json` 을 또 건드리는데, 그때 안전망이 있습니다.

`build` 와 `verify:pyodide-core` 를 마지막에 두었습니다. `prebuild` 가 Pyodide(13MB)와 sql.js 를 내려받고, 실패는 설계상 치명적이지 않으므로(폴백 없이 배포됨) **CDN 문제로 CI 가 빨개지지 않습니다.** `verify:pyodide-core` 도 파일이 없으면 0을 반환합니다.

`npm run verify:all` 이 CI 의 네트워크 불필요한 부분을 로컬에서 그대로 재현합니다.
