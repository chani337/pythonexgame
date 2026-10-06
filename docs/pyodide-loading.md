# Pyodide 로딩

백로그 5번 작업의 산출물입니다.

검증: `npm run verify:pyodide` (로더 폴백) / `npm run verify:pyodide-core` (자체 호스팅 사본 실제 부팅)

---

## 1. 측정한 숫자 — preload 가 받던 양

| 파일 | 크기 |
|---|---|
| `pyodide.asm.wasm` | 9.62 MB |
| `python_stdlib.zip` | 2.23 MB |
| `pyodide.asm.js` | 1.17 MB |
| `pyodide-lock.json` | 0.10 MB |
| `pyodide.js` + `pyodide.mjs` | 0.03 MB |
| **코어 합계** | **13.15 MB** |
| numpy 휠 | 11.41 MB |
| pandas 휠 | 22.66 MB |
| pandas 의존성 (numpy 재사용 + pytz 1.03 + dateutil + six) | ~1.1 MB |
| **preload 포함 합계** | **~48 MB** |

그리고 **numpy/pandas 를 쓰는 문제는 377개 중 4개**입니다.

```
numpy_q1, numpy_q2, pandas_q1, pandas_q2
```

실행 가능한 학습가이드 코드 셀 4개 중에도 이 패키지를 쓰는 셀은 없습니다. 즉 **`print("안녕")` 한 줄을 실행하려고 48MB를 받고 있었습니다.**

> 참고: 휠은 jsDelivr 가 서빙하므로 이건 Vercel 대역폭 문제가 아니라 **사용자의 시간과 데이터** 문제입니다. 학교 와이파이에서 48MB는 체감이 큽니다. (반대로 자체 호스팅으로 돌리면 그때부터 Vercel 대역폭 문제가 됩니다 — 2절 참고.)

## 2. 바뀐 점

### (a) init 의 preload 제거

```diff
- await py.loadPackage(['numpy', 'pandas']);   // 무조건
```

실행 시점 조건부 로드만 남겼습니다. 기존 패턴이 실사용 전부를 커버하는지 **전수 확인**했습니다.

| 패키지 | 패턴 | 실사용 | 놓침 |
|---|---|---|---|
| numpy | `includes('numpy') \|\| includes('np.')` | 2곳 | **0** |
| pandas | `includes('pandas') \|\| includes('pd.')` | 2곳 | **0** |

`import numpy`, `import numpy as np`, `from numpy import array`, `np.array(...)` 모두 걸립니다. 보강이 필요 없었습니다.

추가한 것:
- **이미 받은 패키지는 `Set` 으로 캐싱** — 같은 세션에서 두 번째 numpy 문제는 즉시 실행됩니다
- **진행 표시** — 휠 다운로드 중 하단에 "numpy를 준비하는 중입니다... (최초 1회만 내려받습니다)" 가 뜹니다. 11MB 다운로드 동안 실행 버튼이 멈춘 것처럼 보이던 문제를 해결합니다
- **실패 시 원인 안내** — jsDelivr 가 차단된 네트워크에서 휠을 못 받으면 그 사실을 알려줍니다 (자체 호스팅 사본에는 휠이 없으므로)
- `sqlite3` 는 기존대로 SQL 문제에서만 지연 로드

### (b) 정적 script 태그 → 동적 주입

`index.html` 의 태그를 제거했습니다. 기존 구조의 문제가 세 가지였습니다.

1. **대시보드·문제목록 방문자도 로더를 받았습니다.** `usePyodide(enabled)` 게이트는 `loadPyodide()` 호출만 막고, 스크립트 자체는 이미 받은 상태였습니다
2. **`integrity` 속성이 없었습니다.** jsDelivr 가 침해되면 모든 방문자에게 임의 코드 실행입니다
3. **실패 감지가 `window.loadPyodide` 폴링 200ms × 30회**였습니다. 차단된 네트워크에서 6초를 기다린 뒤에야 실패를 알았고, 느리지만 동작하는 네트워크도 정확히 같은 지점에서 실패로 판정됐습니다

이제 `onload`/`onerror` 로 즉시 판정합니다. SRI 불일치도 `onerror` 로 나타납니다.

### (c) SRI

```ts
integrity: 'sha384-tVslJOEkg7nVRW3Y3/ReGX0NnonNrbcmt1R5qFbQXQdGa2chRkoJYHAjAsv3zoTq',
```

교차 출처 스크립트에 SRI 를 걸려면 `crossorigin="anonymous"` 가 **반드시** 함께 있어야 합니다 (없으면 응답이 opaque 해서 브라우저가 해시를 검증할 수 없습니다). 둘 다 설정하고 테스트로 확인합니다.

**버전을 올릴 때:**

```bash
# 1. scripts/fetch-pyodide-core.mjs 의 PYODIDE_VERSION 수정
# 2. 새 파일 받기 + 해시 출력
npm run fetch:pyodide
# 3. 출력된 pyodide.js 해시를 src/hooks/usePyodide.ts 의 integrity 에 반영
# 4. 대조
npm run verify:pyodide        # "SRI 해시가 실제 파일과 일치" 항목 확인
```

`verify:pyodide` 가 `public/pyodide/version.json` 의 실제 해시와 소스의 `integrity` 를 대조하므로, **갱신을 잊으면 테스트가 실패합니다.**

#### ⚠️ SRI 로 보호되지 않는 부분

`loadPyodide()` 가 **런타임에 받는 `pyodide.asm.wasm`, `python_stdlib.zip`, 패키지 휠에는 SRI 를 걸 수 없습니다.** Pyodide 내부가 `fetch` 로 가져오고, 거기에 integrity 를 주입하는 공개 API 가 없습니다. 즉 SRI 는 **로더 스크립트만** 보장합니다. wasm 이 교체되는 공격은 막지 못합니다.

이 한계를 좁히려면 CDN 을 아예 쓰지 않고 자체 호스팅만 쓰는 방법밖에 없는데, 그러면 13MB 가 Vercel 대역폭으로 넘어옵니다. 현재는 **CDN 우선 + 자체 호스팅 폴백**이 균형점이라고 판단했습니다.

### (d) 자체 호스팅 폴백

학교·회사 네트워크에서 CDN 이 차단되면 **사이트는 열리는데 Python 실행만 조용히 죽습니다.** PyQuests 가 학교 컴퓨터실을 대상으로 하므로 이건 실제 시나리오입니다.

`scripts/fetch-pyodide-core.mjs` 가 코어 6개 파일을 `public/pyodide/` 로 받습니다.

**코어만 받고 휠은 제외했습니다.** numpy+pandas 는 35MB 이고 4문제만 쓰므로, 자체 호스팅으로 넘기면 Vercel 대역폭을 크게 먹습니다. CDN 이 차단된 네트워크의 사용자는 **Python 은 되고, 그 4문제에서만 안내 메시지를 받습니다.**

#### git 커밋 여부 — **커밋하지 않는 것을 권합니다**

13.15MB 를 git 에 넣으면,

- 모든 clone 이 13MB 를 더 받습니다
- 버전을 올릴 때마다 히스토리에 13MB 가 또 쌓입니다 (git 은 바이너리 델타를 거의 못 줄입니다)
- 소스가 아니라 **빌드 산출물**입니다

그래서 `.gitignore` 에 `public/pyodide/` 를 넣고, `prebuild` 로 빌드마다 받습니다.

```json
"prebuild": "node scripts/fetch-pyodide-core.mjs",
"fetch:pyodide": "node scripts/fetch-pyodide-core.mjs --force"
```

**다운로드 실패는 치명적이지 않게** 만들었습니다 — jsDelivr 가 잠시 죽었다고 배포가 깨지면 안 되므로, 경고만 출력하고 폴백 없이 배포됩니다. 이미 받아둔 파일이 있으면 `version.json` 을 보고 건너뜁니다.

### (e) 로드 순서

```
1. jsDelivr (SRI + crossorigin, 8초 타임아웃)
      ↓ 실패
2. 자체 호스팅 /pyodide/ (동일 출처, SRI 불필요)
      ↓ 실패
3. 한국어 에러 + 두 출처의 실패 이유
```

어느 경로로 로드됐는지 `console.info` 로 남깁니다.

```
[PyQuests] Pyodide v0.26.2 로드 성공 — jsDelivr CDN (https://cdn.jsdelivr.net/pyodide/v0.26.2/full/)
```

**스크립트는 성공했지만 wasm 다운로드가 실패한 경우에도 폴백합니다** — 부분 차단 환경에서 실제로 일어나는 상황입니다.

### (f) 서비스워커

기존 `globPatterns: ['**/*.{js,css,html,svg,png,ico}']` 는 **최악의 조합**이었습니다. `public/pyodide/` 가 생기면 `pyodide.js`(14KB)와 `pyodide.asm.js`(1.17MB)는 precache 하고, 정작 큰 `pyodide.asm.wasm`(9.62MB)과 `python_stdlib.zip`(2.23MB)은 확장자가 목록에 없어서 빠집니다. 모든 첫 방문자가 1.2MB 를 더 받으면서 아무 이득이 없습니다.

```ts
globIgnores: ['pyodide/**'],              // precache 에서 완전 제외
maximumFileSizeToCacheInBytes: 12MB,      // 위 ignore 가 지워져도 wasm 이 조용히 빠지지 않도록
runtimeCaching: [
  { jsDelivr /pyodide/  → CacheFirst, 1년 },   // 실제 사용 시점에 캐시
  { /pyodide/ (자체 호스팅) → CacheFirst, 1년 },
  { fonts.gstatic.com   → CacheFirst, 1년 },
  { fonts.googleapis.com → StaleWhileRevalidate },
]
```

- **precache 하지 않고 runtime 캐시**합니다. Python 화면에 들어온 사람만 받고, 재방문자는 다시 받지 않습니다
- 휠도 같은 패턴에 걸리므로 4문제를 푼 학생은 다음 세션에 35MB 를 다시 받지 않습니다
- **Supabase 는 `runtimeCaching` 에 없습니다** → 항상 네트워크. 빌드 산출물 확인: `grep -c supabase dist/sw.js` = **0**

검증 결과:

```
precache 항목: 34개 / 그 중 pyodide: 0개
precache 용량: 2197 KiB (작업 전 2192 KiB — 변화 없음)
```

---

## 3. 검증 완료

### `npm run verify:pyodide` — 로더 폴백 (19/19)

`node:vm` 이 아니라 가짜 `document`/`window` 를 주입해 **실제 `bootPyodide` 를** 돌립니다.

| 시나리오 | 확인 내용 |
|---|---|
| 정상 | jsDelivr 에서 로드, 자체 호스팅은 시도조차 안 함 |
| 정상 | `integrity` 가 `sha384-` 로 설정, `crossOrigin="anonymous"` 동반 |
| 정상 | `indexURL` 이 스크립트 출처와 일치 (wasm 을 다른 출처에서 받지 않음) |
| CDN 차단 | 자체 호스팅으로 폴백, 순서 유지, 실패한 script 태그 DOM 제거 |
| CDN 차단 | 자체 호스팅에는 `integrity` 없음 (동일 출처) |
| **CDN wasm 만 실패** | 스크립트가 성공했어도 폴백 |
| 전부 실패 | 한국어 에러, "차단" 언급, 두 출처의 실패 이유 모두 포함 |
| 무응답 CDN | 8003ms 에 타임아웃 후 폴백 |
| SRI | 소스의 해시가 `version.json` 의 실제 파일 해시와 일치 |

### `npm run verify:pyodide-core` — 자체 호스팅 사본 실제 부팅

Node 에서 `public/pyodide/` 만 가지고 Pyodide 를 띄웁니다. **6개 파일로 충분한지**를 실제 실행으로 확인합니다.

```
OK   자체 호스팅 사본만으로 부팅  — 1066ms
OK   Python 3.12  — 3.12.1
OK   일반 문제 실행 (추가 패키지 0개)  — "김철수|1|2|3"
OK   numpy 가 preload 되지 않음
OK   pandas 가 preload 되지 않음
```

---

## 4. 브라우저에서 직접 확인할 항목

**위 검증은 브라우저를 대체하지 못합니다.** 배포 후 아래를 직접 확인해 주세요.

### (1) preload 가 사라졌는지

1. F12 → **Network** 탭 → `Disable cache` 체크
2. 문제 학습 → **numpy/pandas 를 쓰지 않는** Python 문제 (예: `basic_part1_q1`) 열고 실행
3. 확인:
   - `pyodide.asm.wasm`, `python_stdlib.zip` 은 받아야 정상 (코어 13MB)
   - **`numpy-*.whl`, `pandas-*.whl` 요청이 없어야 합니다** ← 핵심
4. Network 탭 하단의 transferred 합계가 **13MB 대**여야 합니다 (이전에는 48MB 대)

### (2) 조건부 로드가 동작하는지

1. `numpy_q1` 문제 열고 실행
2. 하단에 **"numpy를 준비하는 중입니다..."** 배너가 뜨는지
3. Network 에 `numpy-1.26.4-...whl` (11.41MB) 요청이 나타나는지
4. 같은 문제를 **다시 실행** → 배너가 뜨지 않고 휠 요청도 없어야 합니다 (Set 캐싱)

### (3) CDN 차단 시 폴백

1. F12 → Network → 요청 우클릭 → **Block request domain** → `cdn.jsdelivr.net`
2. 새로고침 후 Python 문제 실행
3. Console 에 이렇게 나와야 합니다:
   ```
   [PyQuests] Pyodide 로드 실패 — jsDelivr CDN: ...
   [PyQuests] Pyodide v0.26.2 로드 성공 — 자체 호스팅 (/pyodide/)
   ```
4. **Python 문제가 정상 실행**되어야 합니다
5. SQL 문제는 `sqlite3` 휠을 CDN 에서 받으므로 **실패하고 안내 메시지가 나오는 것이 정상**입니다

### (4) 둘 다 차단

`cdn.jsdelivr.net` 차단 + `/pyodide/` 를 404 로 만들면 (또는 `public/pyodide/` 없이 빌드) 한국어 에러가 떠야 합니다.

### (5) 재방문 캐시

1. Python 문제 실행 (코어 다운로드)
2. 탭을 닫고 다시 열어 같은 문제 실행
3. Network 에서 pyodide 파일들이 **`(ServiceWorker)` 또는 `(disk cache)`** 로 표시되어야 합니다
4. Application → Cache Storage 에 `pyodide-cdn-v0.26.2` 가 보여야 합니다
5. **Supabase 요청은 캐시되지 않아야 합니다** (Application → Cache Storage 에 supabase 항목 없음)

### (6) SRI

Console 에 이런 에러가 **없어야** 합니다.

```
Failed to find a valid digest in the 'integrity' attribute for resource ...
```

나오면 `npm run fetch:pyodide` 로 해시를 다시 구해 `usePyodide.ts` 에 반영하세요. (jsDelivr 가 같은 버전의 파일을 바꾸는 일은 없어야 하지만, 버전을 올리고 해시를 잊은 경우 이 에러가 납니다.)

---

## 5. 남은 한계

- **런타임 wasm/휠에 SRI 불가** (2-c 참고)
- **자체 호스팅에 휠 없음** — CDN 차단 환경에서 numpy/pandas 4문제는 풀 수 없습니다. 넣으려면 35MB 를 Vercel 에서 서빙해야 하므로 의도적으로 제외했습니다
- **코어 13MB 자체는 줄일 수 없습니다** — Python 인터프리터 + 표준 라이브러리의 최소 크기입니다. 서비스워커 캐시로 재방문 비용만 0 으로 만들었습니다
