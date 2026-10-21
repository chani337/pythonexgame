# NumPy · Pandas · Matplotlib 문제

학습 가이드에는 세 라이브러리 장이 있었지만 문제는 NumPy 2개, Pandas 2개뿐이었고 Matplotlib 은 **실행 자체가 준비돼 있지 않았습니다.** 새로 33문제를 넣고, 실제 데이터 파일과 그래프 출력·채점을 붙였습니다.

| 라이브러리 | 기초 | 중급 | 고급 | 챌린지 | 합계 (기존 포함) |
|---|---|---|---|---|---|
| NumPy | 4 | 3 (+2) | 2 | 2 | 13 |
| Pandas | 4 | 4 (+2) | 3 | 2 | 15 |
| Matplotlib | 3 | 3 | 2 | 1 | 9 |

## 1. 데이터 파일 — `src/data/pyDatasets.ts`

| 파일 | 내용 | 쓰는 문제 |
|---|---|---|
| `data/students.csv` | 4개 반 20명, 국어·영어·수학 | Pandas 기초~중급, 반별 평균 그래프, 산점도, 히스토그램 |
| `data/sales.csv` | 1~3월 세 지점의 주간 메뉴별 판매량·단가 (30행) | 파생 열, groupby, pivot_table, 두 그래프 나란히 |
| `data/weather.csv` | 서울·부산·제주 7일 기온·강수량, **빈칸 2개** | 결측치, 일교차, 두 선 그래프 |

- **매 실행마다** Pyodide 파일 시스템의 `/home/pyodide/data/` 에 다시 씁니다. 학생이 파일을 지우거나 덮어써도 다음 실행에 복구됩니다
- 모든 파일이 모든 실행에서 보입니다 (샌드박스 포함). 문제의 `datasets` 필드는 **화면에 미리보기를 띄울 파일**만 정합니다
- 문제 화면에 SQL 의 "테이블 구조" 와 같은 모양으로 앞 5행 + 전체 행 수 + `pd.read_csv(...)` 경로가 나옵니다
- **데이터를 고치면 기대값이 틀어집니다.** 고친 뒤 반드시 `npm run verify:pylibs`

## 2. 실행 환경 — `src/lib/pythonRuntime.ts`

앱(`usePyodide`)과 검증 스크립트가 **같은 코드**를 씁니다.

| 상수 | 언제 | 하는 일 |
|---|---|---|
| `PY_RUNTIME_SETUP` | 첫 실행 1회 | 작업 폴더 고정, `MPLBACKEND=Agg`, 경고 필터 |
| `writeDatasets` | 매 실행 | CSV 3개 쓰기 |
| `PY_FONT_SETUP` | matplotlib 첫 사용 | Pretendard TTF 등록 |
| `PY_BEFORE_RUN` | 매 실행 | 이전 실행의 그래프 닫기 |
| `PY_COLLECT_FIGURES` | 매 실행 후 | 열린 그래프를 PNG(base64)로 → 콘솔에 표시 |
| `FIGURE_CHECK_HARNESS` | `testRunnerCode: 'figure_check'` | 그래프 검사 채점 |

### 고친 기존 버그: Pandas 첫 실행이 오답 처리됨

pandas 2.2 는 처음 import 할 때 `Pyarrow will become a required dependency...` 경고를 stderr 로 냅니다. stderr 는 stdout 과 같은 줄에 모여 `stdout_match` 로 비교되므로, **세션에서 처음 푸는 Pandas 문제는 정답을 써도 틀렸습니다.** `PY_RUNTIME_SETUP` 의 경고 필터로 막았습니다.

### Matplotlib

- **백엔드 Agg**: Pyodide 기본 백엔드는 `plt.show()` 때 `document.body` 에 직접 그립니다. Agg 로 화면 밖에서 그린 뒤 앱이 PNG 로 받아 콘솔에 보여 줍니다 (`img-src data:` 는 CSP 에서 이미 허용)
- **한글 글꼴**: 기본 DejaVu Sans 에 한글이 없어 제목이 네모로 나옵니다. 사이트와 같은 Pretendard 의 **TTF** (2.7MB, jsDelivr) 를 matplotlib 첫 사용 때 한 번 받습니다. 사이트가 쓰는 woff2 는 matplotlib 이 못 읽습니다. 실패하면 그래프는 그대로 그려지고 한글만 네모로 나옵니다
- 첫 그래프 문제는 matplotlib 과 의존 패키지(약 10MB)를 받습니다. numpy·pandas 와 같은 방식으로 **처음 한 번만** 받고, 진행 중에는 상태 문구가 나옵니다
- 같은 실행기를 쓰므로 **샌드박스와 학습 가이드 예제에서도** 그래프가 보입니다

## 3. 그래프 채점 — `figure_check`

출력 글자로는 그래프를 채점할 수 없어서, **그려진 Figure 객체를 직접 검사**합니다. 테스트 입력은 `설명|파이썬 식` 형태입니다.

```
"막대 높이가 판매량이다|[p.get_height() for p in _ax.patches]"
```

- 설명은 학생에게 ✓/✗ 와 함께 보이고, 틀리면 `지금: …` 으로 실제 값을 보여 줍니다
- 식은 `_fig`, `_axes`, `_ax`(= `_axes[0]`) 가 묶인 상태로 평가됩니다
- 실수는 소수 둘째 자리, numpy 값은 일반 파이썬 값, 목록은 `[a, b, c]` 로 맞춰 비교합니다
- 검사 전에 `canvas.draw()` 를 합니다. 안 하면 눈금 이름표(`get_xticklabels`)가 빈 문자열입니다 — 검증 중에 실제로 걸린 문제입니다

## 4. 검증 — `npm run verify:pylibs`

실제 Pyodide(Node)에서 앱과 같은 설정으로 돌립니다. 패키지(약 60MB)는 처음에 jsDelivr 에서 받아 `node_modules/.cache/pyodide-packages` 에 둡니다. CI 에서는 `actions/cache` 로 재사용합니다.

| 검사 | 수 |
|---|---|
| 정답 코드 통과 (기존 4 + 새 33) | 37 |
| 시작 코드는 불합격 | 37 |
| 흔한 오답은 불합격 (경계값 `>` vs `>=`, `axis` 반대, 범례 없음, 빈칸 안 채움, 막대 대신 선 등) | 9 |

정답 코드는 앱과 달리 **매번 새 namespace** 에서 돌립니다. 이전 문제의 변수에 기대서 통과하는 일이 없게 하려는 것입니다.

### 검증하면서 바뀐 것

- **`pd_a3` (빈 강수량 채우기)**: 처음엔 "도시별 **합계**" 였는데, pandas 의 `sum()` 은 NaN 을 건너뛰어서 **채우지 않아도 같은 답**이 나왔습니다. 채우기를 배우는 문제가 그걸 확인하지 못하므로 "도시별 **평균**" 으로 바꿨습니다 (채우지 않으면 서울이 7일이 아닌 6일 평균이 됨)
- **데이터 폴더 경로**: `FS.mkdirTree('data')` 가 `/data` 를 만들어서 `read_csv('data/...')` 가 파일을 못 찾았습니다. 절대 경로로 고쳤습니다. 앱에서도 똑같이 깨졌을 문제입니다

## 5. 문제 추가하는 법

1. `problems.ts` 에 문제를 넣고 `testCases[].expected` 와 `examples[0].output` 을 `"__FILL__"` 로 둡니다
2. `solutionCode.ts` 에 정답 코드를 넣습니다
3. `npm run verify:pylibs -- --write` → 정답 코드를 돌려 기대값을 채우고, **채운 값을 출력합니다. 그 값이 맞는지 직접 확인하세요** (정답 코드가 틀리면 틀린 값이 기대값이 됩니다)
4. `npm run verify:pylibs` → 정답 통과 · 시작 코드 불합격 확인
5. `npm run sync:problems` → DB seed 갱신, Supabase 에 반영

---

# 실전 문제와 효율성 테스트

`category: '실전'`, `language: 'algorithm'` 8문제 (`prac_1` ~ `prac_8`). 프로그래머스 Lv.1~2 수준.

## 기존 알고리즘 문제와 다른 점

| | 기존 알고리즘 문제 | 실전 |
|---|---|---|
| 풀이 방법 | 제목·설명에 기법이 나옴 ("그리드 DFS", "백트래킹으로") | 이야기 속에 숨김 — 무엇을 쓸지 고르는 게 실력 |
| 제한사항 | 없거나 형식만 | 입력 크기 명시 (최대 100,000 등) |
| 테스트 | 작은 입력 3개 | 경계값 포함 4~6개 + **효율성 테스트** |

기존 알고리즘 문제에는 효율성 테스트를 붙이지 않았습니다. 정답 코드 중 O(n²) 인 것이 있어서(예: Two Sum) 정답 코드부터 떨어집니다.

## 효율성 테스트 — `perfTests`, `PERF_HARNESS`

정확성 테스트를 **모두 통과하면** 큰 입력으로 시간을 잽니다.

### 어떻게 멈추나

Pyodide 는 페이지와 같은 스레드에서 돌기 때문에 JS 에서 중단할 수 없습니다 (Web Worker + `SharedArrayBuffer` 인터럽트는 COOP/COEP 헤더가 필요해 사이트 전체 설정이 바뀝니다). 대신 `sys.settrace` 로 Python 이벤트 1024개마다 시계를 보고, 넘었으면 `_PqTimeout` 을 던집니다.

- `BaseException` 이라 학생 코드의 `except Exception:` 이 삼키지 못합니다 (검증함)
- 추적 비용은 반복문 위주 코드에서 약 8배 — **기준 풀이도 똑같이 추적**해서 공정합니다
- 한 번의 긴 C 호출(`max(set(x), key=x.count)` 같은)은 중간에 끊지 못합니다. 끝난 뒤 시간으로 판정합니다

### 시간 제한

**이 기기에서 잰 기준 풀이 시간 × 30, 최소 1초, 최대 5초.**

고정 제한이면 느린 학교 PC 에서 맞는 O(n) 풀이가 떨어집니다. 30배면 O(n)·O(n log n) 은 넉넉히 통과하고, 이 입력 크기에서 O(n²) 은 수천 배 차이라 확실히 걸립니다. 기대값도 저장하지 않고 **기준 풀이의 결과**와 비교합니다.

### 검증 — `npm run verify:pylibs`

각 문제마다 `scripts/perf-slow-solutions.json` 의 **느린 풀이**로 확인합니다:

1. 기준 풀이는 효율성 통과
2. 느린 풀이는 **정확성은 통과** (그래야 "맞지만 느린" 풀이를 잡는다는 증명이 됨)
3. 느린 풀이는 효율성 **실패**

| 문제 | 기준 풀이 | 느린 풀이 |
|---|---|---|
| 출석부 정리 | 집합으로 중복 확인 | `name not in 리스트` |
| 가장 많이 팔린 메뉴 | 딕셔너리로 한 번에 세기 | 메뉴마다 전체 다시 세기 |
| 연속 휴가 최고 방문객 | 슬라이딩 윈도우 | 시작점마다 `sum(슬라이스)` |
| 괄호 검사기 | 스택 | `replace('()', '')` 반복 |
| 회의실 하나로 최대한 | 끝나는 시각 그리디 | 고른 회의 전체와 비교 |
| 미로 탈출 | BFS | 모든 경로 DFS |
| 따뜻해지는 날까지 | 단조 스택 | 날마다 뒤를 전부 훑기 |
| 계단 오르는 방법 | 반복문 DP | 그냥 재귀 (RecursionError) |

## 실행 시간 제한 (모든 Python 문제)

같은 추적 방식으로 **모든 실행을 10초에서 멈춥니다** (`RUN_GUARD_SECONDS`). 전에는 `while i < 10:` 에서 `i += 1` 을 빼먹으면 **탭이 영원히 멈췄습니다.**

- NumPy · Pandas · Matplotlib 을 쓰는 코드는 제외 — import 때 Python 코드가 많이 돌아서 추적하면 눈에 띄게 느려집니다
- 출력은 **2,000줄까지만** 모읍니다. `while True: print(i)` 는 10초 동안 수십만 줄을 내는데, 멈춘 뒤에 그걸 화면에 그리느라 페이지가 다시 멈췄습니다. 채점 표식(`###TEST_OUT###`)과 그 다음 줄은 항상 남깁니다
