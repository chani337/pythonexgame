# SQL 실행기 — Pyodide 에서 sql.js 로

백로그 6번 작업의 산출물입니다.

검증: `npm run verify:sql`

---

## 1. 결론 — 문제 데이터를 한 글자도 바꾸지 않았습니다

문서가 *"기대 출력 형식이 달라지면 SQL 36문제의 testCases 도 함께 갱신"* 을 허용했지만, **갱신할 필요가 없도록** 만들었습니다.

```
$ npm run verify:sql
대조 30 / 36 문제
바이트 단위 일치: 30
불일치: 0
```

핵심 설계는 **표시와 채점의 분리**입니다.

- **채점** — 기존 Python 하네스가 출력했던 텍스트를 그대로 재현 (`toStdout`)
- **표시** — 같은 결과를 구조화된 데이터로 받아 화면에는 실제 `<table>` 로 렌더링

덕분에 화면은 개선되고 36개 정답 키는 그대로입니다.

## 2. 왜 옮겼나

### 다운로드 14.6MB → 0.71MB

| | 기존 (Pyodide 경유) | sql.js |
|---|---|---|
| 필요 파일 | Pyodide 코어 13.15MB + sqlite3 휠 1.45MB | `sql-wasm.js` 46KB + `sql-wasm.wasm` 643KB |
| **합계** | **14.6 MB** | **0.69 MB** |

SQL 문제만 푸는 학생이 Python 인터프리터 전체를 받던 구조가 사라집니다. **95% 감소**.

### 라우팅 버그

기존에는 **제출된 코드를 보고** SQL 인지 판별했습니다.

```ts
const t = code.trim().toUpperCase();
const isRawSql = t.startsWith('SELECT') || t.startsWith('CREATE') || ... ;
```

주석으로 시작하는 쿼리는 이 검사를 통과하지 못하고 **Python 으로 넘어가 SyntaxError** 가 났습니다.

```sql
-- 내 풀이
SELECT name FROM users;
```

지금은 **문제의 언어 속성**으로 라우팅합니다. 코드 내용을 보지 않습니다.

> 정답 코드 30개는 전부 키워드로 시작해서 **채점에는 영향이 없던 잠재 버그**였습니다. 학생이 주석을 달고 제출할 때만 터졌습니다.

### Python 문자열 보간 제거

기존에는 사용자 쿼리를 Python 삼중따옴표 문자열에 끼워 넣고 백슬래시와 `"""` 만 이스케이프했습니다.

```python
query = """<사용자 입력이 그대로>"""
```

자기 브라우저의 Pyodide 안이라 서버 영향은 없지만, 채점 우회 경로이고 구조적으로 취약했습니다. 이제 쿼리는 **소스 코드가 아니라 쿼리로** 엔진에 전달됩니다.

## 3. 중간에 잡은 것 — 부동소수 표기

첫 프로토타입에서 4문제(`sql_q12`, `sql_q14`, `sql_q26`, `sql_q30`)가 틀렸고 원인이 하나였습니다.

```
Python: str(88.0) → "88.0"      ← SQLite AVG() 는 REAL 반환
JS    : String(88) → "88"       ← JS 는 int/float 구분이 없음
```

모든 기대 출력이 Python 경로로 만들어졌으니, 포매터가 **어느 컬럼이 REAL 인지** 알아야 바이트 호환이 됩니다. 그런데 sql.js 는 컬럼 타입 접근자를 공개하지 않습니다 (`Statement` 에 `getColumnNames` 는 있고 타입은 없음).

해결: **SQLite 에게 직접 물어봅니다.**

```ts
// 사용자 쿼리를 서브쿼리로 감싸 typeof() 조회
SELECT typeof("dept") AS t0, typeof("avg_score") AS t1
FROM ( <사용자 쿼리> ) LIMIT 1
```

별칭 없는 `AVG(score)` 컬럼까지 동작하고, 30개 결과셋 전부 타입 판별에 성공했습니다. 감쌀 수 없는 형태면 `null` 을 반환해 일반 숫자 포매팅으로 폴백합니다.

**문제 데이터가 아니라 포매터를 고쳐서** 해결했다는 점이 이 작업의 핵심입니다.

## 4. 구조

| 파일 | 역할 |
|---|---|
| `src/hooks/useSqlRunner.ts` | sql.js 로드(CDN→자체호스팅 폴백, SRI), 실행, 포매팅, 채점 |
| `src/utils/oracleToSqlite.ts` | Oracle→SQLite 번역기. `usePyodide.ts` 에서 **그대로 추출** |
| `src/data/sqlSeed.ts` | 시드 데이터를 선언적으로. 문제별 다른 스키마 가능한 구조 |
| `scripts/fetch-sqljs.mjs` | `public/sql-js/` 자체 호스팅 사본 (gitignore, `prebuild`) |
| `scripts/verify-sql-runner.mjs` | 36문제 재현 + 번역기 고정 + 라우팅 + 에러 처리 검증 |

### 로드 순서 (5번 Pyodide 와 동일 패턴)

```
1. jsDelivr (SRI sha384 + crossorigin, 8초 타임아웃)
     ↓ 실패
2. 자체 호스팅 /sql-js/ (동일 출처, SRI 불필요)
     ↓ 실패
3. 한국어 에러 + 두 출처의 실패 이유
```

어느 경로로 로드됐는지 `console.info` 로 남깁니다.

```
[PyQuests] sql.js 1.14.2 로드 성공 — jsDelivr CDN (https://cdn.jsdelivr.net/npm/sql.js@1.14.2/dist/)
```

**버전 업그레이드 시**

```bash
# 1. scripts/fetch-sqljs.mjs 와 useSqlRunner.ts 의 버전 문자열 수정
npm run fetch:sqljs        # 2. 새 파일 + SRI 해시 출력
# 3. 출력된 해시를 useSqlRunner.ts 의 SQLJS_INTEGRITY 에 반영
npm run verify:sql         # 4. 36문제 재현 확인
```

### 서비스워커

`sql-js/` 는 Pyodide 와 같은 이유로 **precache 에서 제외**했습니다. `globPatterns` 가 `sql-wasm.js`(46KB)는 잡고 정작 큰 `sql-wasm.wasm`(643KB)은 확장자가 없어서 빠지는, 아무에게도 이득이 없는 조합이 되기 때문입니다.

런타임 캐시 라우트를 둘 추가했습니다 — jsDelivr 경로(`/npm/sql.js@`)와 자체 호스팅(`/sql-js/`). Pyodide 라우트가 `/pyodide/` 접두사라 sql.js 를 잡지 못했습니다.

확인 결과: `precache 34개 / sql-js 0 / pyodide 0 / Supabase 0`.

## 5. 검증 내용

`npm run verify:sql` 이 **실제 런타임 모듈을 import** 합니다 (복사본이 아니라 `oracleToSqlite.ts`, `sqlSeed.ts` 자체). 둘 중 하나를 고쳐서 호환이 깨지면 여기서 실패합니다.

| 검사 | 결과 |
|---|---|
| 정답 30개 바이트 단위 재현 | 30/30 |
| `NVL` → `IFNULL` | OK |
| `FETCH FIRST n ROWS ONLY` → `LIMIT n` | OK |
| `OFFSET n ROWS FETCH NEXT m` → `LIMIT m OFFSET n` | OK |
| `(+)` → `LEFT JOIN` | OK |
| `(+)` 없으면 무변경 | OK |
| 주석으로 시작하는 쿼리 | OK (기존엔 SyntaxError) |
| 선행 개행/공백 | OK |
| 소문자 `with` | OK |
| 여러 문장 | OK (결과셋 2개 처리) |
| 쓰기 전용 쿼리 (`INSERT`) | OK (성공 메시지) |
| 문법 오류 | 에러 메시지로 표면화 |
| 없는 테이블 | 에러 메시지로 표면화 |

### expert 6문제 — 자동 검증 불가

`sql_expert_recursive_cte`, `sql_expert_rank_window`, `sql_expert_correlated_subquery`, `sql_expert_join_having`, `sql_expert_top_n_per_group`, `sql_expert_lag_window` 는 **`solutionCode.ts` 에 정답이 없습니다.** 기존 Pyodide 경로로도 자동 검증이 불가능했던 **기존 빈틈**입니다 (2번 작업의 JS 6문제와 같은 상황이고, 11번 데이터 검증 테스트에서 함께 잡아야 합니다).

대신 그 문제들이 요구하는 기능이 sql.js 에서 되는지 확인했습니다.

```
sql.js SQLite 3.49.1   (Pyodide 쪽은 3.4x 대)

재귀 CTE · RANK() · LAG() · PARTITION BY · 상관 서브쿼리
JOIN+GROUP+HAVING · Top-N per Group · LEFT JOIN · IFNULL · LIMIT
→ 10/10 지원
```

## 6. 브라우저에서 직접 확인할 항목

| 확인 | 기대 |
|---|---|
| SQL 문제 실행 | 결과가 **표**로 렌더링 (기존 `" \| "` 텍스트가 아니라) |
| 콘솔 | `[PyQuests] sql.js 1.14.2 로드 성공 — jsDelivr CDN` |
| Network | `sql-wasm.wasm` 643KB 1건. **Pyodide wasm 13MB 요청이 없어야 함** |
| 채점 | PASS/FAIL 이 기존과 동일하게 판정 |
| `sql_q17` (NULL 포함) | NULL 셀이 흐린 이탤릭으로 표시 |
| 주석 달고 제출 (`-- 메모` 후 SELECT) | **정상 실행** (기존엔 SyntaxError) |
| Python 문제 | 여전히 정상 (SQL 경로 제거가 영향 없는지) |
| jsDelivr 차단 후 SQL 실행 | `자체 호스팅` 으로 폴백 로그 |

**Network 탭에서 Pyodide 요청이 사라졌는지가 이 작업의 핵심 지표입니다.**

## 7. 남은 위험

- **`ORDER BY` 없이 여러 행을 반환하는 문제가 20개입니다.** 정량화해 봤습니다.

  ```
  sql_q1(5행) q2(3) q3(3) q4(2) q6(4) q7(4) q10(3) q13(3) q14(2) q16(4)
  q17(6) q18(3) q19(3) q20(3) q21(3) q22(3) q23(6) q27(2) q28(6) q29(5)
  ```

  SQL 표준상 `ORDER BY` 없는 결과 순서는 **보장되지 않습니다.** 20문제의 기대 출력이 특정 순서에 의존하고 있고, 지금은 sql.js 3.49.1 에서 전부 바이트 일치합니다.

  실질 위험이 낮은 이유: 이 두 테이블에는 **인덱스가 없고** 쿼리가 단순 스캔이라, SQLite 는 `rowid` 순서(= 삽입 순서)로 읽습니다. 버전이 바뀌어도 플랜이 달라질 여지가 거의 없습니다.

  **다만 이건 sql.js 전환이 만든 위험이 아니라 원래 있던 것입니다.** Pyodide 의 sqlite3 도 같은 보장 없는 순서에 의존하고 있었고, 그쪽 버전이 올라갔을 때도 똑같이 깨질 수 있었습니다. 근본 해결은 20문제에 `ORDER BY` 를 넣고 기대 출력을 갱신하는 것인데, **문제 데이터 변경이라 이번 범위 밖**입니다. 11번 작업(데이터 검증 테스트)에서 다루는 것이 맞습니다.
- **expert 6문제** 는 정답 코드가 없어 끝까지 자동 검증 불가
- **쓰기 쿼리의 영속성 없음** — 매 실행이 새 in-memory DB 입니다. `INSERT` 후 `SELECT` 로 확인하는 문제가 생기면 한 번의 실행 안에서 여러 문장으로 작성해야 합니다 (기존 Python 경로도 동일했습니다)
