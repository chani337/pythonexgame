# HTML · CSS 문제

HTML 18문제, CSS 20문제입니다. 코딩 문제는 **편집기에 쓰는 대로 아래 미리보기가 바뀌고**(VS Code Live Server 와 같은 경험), 제출하면 **완성된 화면을 검사해서** 채점합니다.

**서버 없음 · DB 스키마 변경 없음.** 다만 새 문제 id 를 `public.problems` 에 넣어야 해서 seed 재실행은 필요합니다 (§5).

## 1. 왜 Java · C 대신 이것인가

Java · C 실행은 조사 결과 브라우저 안에서는 불가능하고(clang 100MB, JVM 필요), 공개 Piston API 는 2026-02-15 부터 화이트리스트 전용이라, **남의 코드를 내 서버에서 돌리는 VM 운영**이 필요했습니다. 지금 PyQuests 의 보안 모델("서버에서 코드를 실행하지 않는다")을 바꾸는 결정이라 보류했습니다.

HTML · CSS 는 브라우저가 원래 하는 일이라 그 전제를 그대로 지킵니다.

## 2. 미리보기 — `src/components/WebPreview.tsx`

학생 코드를 `<iframe srcdoc>` 에 넣고, 입력을 멈춘 뒤 300ms 에 다시 그립니다.

```html
<iframe sandbox="allow-same-origin">   <!-- allow-scripts 없음 -->
```

| 속성 | 이유 |
|---|---|
| `allow-scripts` **없음** | `<script>`, `onerror=`, `javascript:` 전부 실행 안 됨. 학생 페이지가 앱·세션에 손댈 방법이 없습니다 |
| `allow-same-origin` 있음 | 부모(채점기)가 `contentDocument` 와 `getComputedStyle` 을 읽으려면 필요합니다 |

**절대 `allow-scripts` 를 추가하지 마세요.** `allow-same-origin` 과 같이 있으면 페이지가 스스로 sandbox 를 걷어낼 수 있습니다.

### CSP 와의 관계

- srcdoc 문서는 앱의 CSP 를 **상속**합니다. 외부 이미지(`img-src`)는 앱과 똑같이 막힙니다
- `frame-src 'none'` 은 srcdoc 에 **적용되지 않습니다** (Chrome 에서 확인)
- 운영 CSP 도 인라인 스크립트를 막기 때문에 **두 겹**입니다. 검증은 두 겹을 따로 확인합니다 (§4)

### 폰트 — `src/utils/previewDocument.ts`

브라우저 기본값(Times, OS 한글)이 아니라 **사이트와 같은 폰트**로 보이게, 문서 앞에 Pretendard · JetBrains Mono 링크와 `:where(html){font-family:…}` 를 붙입니다.

- `:where()` 라 명시도 0 → 학생이 쓴 `font-family` 는 `*` 선택자여도 이깁니다
- `<!DOCTYPE>` 앞에 붙여도 **srcdoc 은 항상 표준 모드**라 quirks 로 떨어지지 않습니다
- 파서가 이 태그들을 `<head>` 로 올리므로 `body` 선택자 · `:nth-child` · 채점에 영향 없음

## 3. 채점 — `src/utils/webChecks.ts`

문제마다 `webChecks` 배열이 있습니다. stdout 비교(`testCases`)는 쓰지 않습니다.

| kind | 검사 | 예 |
|---|---|---|
| `exists` | 선택자가 `min`~`max` 개 | `ul > li` 정확히 3개 |
| `text` | 첫 요소의 글자 (공백 정리 후) | `h1` = `안녕하세요` |
| `attr` | 속성이 있음 / 값이 같음 | `a[target]` = `_blank` |
| `style` | **계산된** 스타일 값 | `h1` 의 `color` = `red` |
| `size` | 실제 렌더링 크기 (±1px) | `.box` 너비 200 |
| `layout` | 나란히(`row`) / 쌓임(`column`) | grid 1~3번이 한 줄 |

모든 검사에 `negate: true` 를 붙이면 반대가 됩니다 (`.outside` 링크는 초록색이 **아니다**).

### `style` 은 계산된 값끼리 비교합니다

학생의 `#f00`, `rgb(255,0,0)`, `RED` 는 전부 `rgb(255, 0, 0)` 으로 계산됩니다. 기대값도 같은 방식으로 계산해야 문제 작성자가 `red` 라고 쓸 수 있어서, **같은 태그의 임시 요소(probe)를 대상 옆에 넣고 값을 넣어 읽은 뒤 바로 지웁니다.** 옆에 넣는 이유는 `%` · `em` 이 같은 부모 기준으로 풀리게 하기 위해서입니다.

주의할 점 두 가지:

- `border-*-width` 는 `border-style` 이 `none` 이면 0 으로 계산됩니다. probe 에는 자동으로 `solid` 를 줍니다
- 단축 속성은 비교하지 마세요. `gap` 대신 `column-gap` / `row-gap`, `padding` 대신 `padding-top` 처럼 **개별 속성**을 씁니다

### `layout` 이 필요한 이유

`grid-template-columns: repeat(3, 1fr)` 은 계산되면 `123px 123px 123px` 이라 `style` 로 비교할 수 없습니다. 그래서 **실제 위치**를 봅니다. "나란히"는 다음 상자가 앞 상자 끝 뒤에서 시작하고 세로로 겹치는 것이라, `align-items: center` 처럼 위쪽이 달라도 한 줄로 인정합니다.

### 키워드 검사

화면만으로 구분이 안 되는 경우만 `requiredKeywords.ts` 에 넣었습니다. 지금은 `css_q15`(CSS 변수) 하나 — 같은 보라색을 두 번 직접 써도 화면은 같기 때문입니다.

## 4. 검증 — `npm run verify:web`

jsdom 에는 cascade 가 없어서(`#f00` 이 `rgb(255, 0, 0)` 으로 안 바뀜) **실제 Chrome** 에서 돌립니다. `vercel.json` 의 CSP 헤더를 그대로 붙인 로컬 서버로 엽니다. CI(ubuntu-latest)에는 Chrome 이 기본으로 있습니다.

| 검사 | 수 |
|---|---|
| 모든 코딩 문제: 정답 코드는 통과, 시작 코드는 불합격 | 30 × 2 |
| 다르게 쓴 정답도 통과 (`#f00`, `1.25rem`=20px, 공백 · 골격 없음 등) | 7 |
| 흔한 오답은 불합격 (자손 선택자 대신 전체 `a`, `solid` 빠뜨림, `ol` 대신 `ul` 등) | 11 |
| 운영 CSP 에서 스크립트 9종 차단 | 1 |
| **인라인 스크립트를 허용한 CSP 에서도** sandbox 만으로 차단 | 1 |
| 대조군: `allow-scripts` 를 주면 실제로 뚫림 (검사가 유효함) | 1 |
| 폰트: 기본 Pretendard, 학생 `font-family` 우선, 표준 모드 유지, 파일 로드 | 4 |
| 잘못된 선택자는 예외 대신 불합격 · 부모가 계산된 스타일을 읽을 수 있음 | 2 |
| **합계** | **87** |

대조군이 있는 이유: 처음 버전은 sandbox 를 빼도 통과했습니다. 운영 CSP 가 대신 막고 있었기 때문입니다. 그래서 CSP 를 풀고 sandbox 만 남긴 실행을 따로 둡니다.

## 5. 배포 순서

1. **Supabase 에서 `migrations/problems_seed.sql` 실행** (기존 377 + 새 38 = 415문제로 재생성돼 있음)
   - 결과 한 줄: `upserted` 415, `retired` 0, `still_referenced` `{}` 이면 정상
   - 이 파일은 **한 문장(statement)** 입니다. 예전 버전(`BEGIN` + `TEMP TABLE … ON COMMIT DROP`)은 Supabase SQL Editor 에서 `relation "_problems_incoming" does not exist` 로 실패했습니다. 에디터가 붙여넣은 스크립트를 한 세션의 트랜잭션으로 묶어 돌리지 않기 때문입니다
2. 그 다음 `main` 푸시

순서가 바뀌면 로그인한 학생이 새 문제를 풀었을 때 해결 기록이 서버에서 거부됩니다 (`problem_id` 검증 트리거).

## 6. 문제 추가하는 법

`problems.ts` 에 `language: 'html' | 'css'`, `type: 'coding'`, `initialCode`, `webChecks` 를 넣고 `solutionCode.ts` 에 정답을 넣은 뒤:

```bash
npm run verify:web       # 정답 통과 · 시작 코드 불합격 자동 확인
npm run sync:problems    # seed 재생성
```

시작 코드가 이미 통과해 버리면(검사가 너무 느슨하면) `verify:web` 이 실패합니다.

### 미리보기 안에서 안 되는 것

- 외부 이미지 (`https://…png`) — CSP. 문제는 `alt` 로 확인합니다
- `:hover` 같은 상태 — 채점 불가. 학생이 직접 마우스를 올려 보는 용도로만 씁니다
- 미디어 쿼리 — 미리보기 너비가 기기마다 달라서 채점에 쓰지 않습니다. 객관식으로 냈습니다
