# 타이포그래피

## 1. 한글이 디자인된 적이 없었습니다

폰트를 바꾸려고 들여다보다 찾은 것입니다.

```
Inter           한글 글리프 없음
Outfit          한글 글리프 없음
JetBrains Mono  한글 글리프 없음
```

세 폰트 전부 **라틴 전용**입니다. 그런데 이 사이트는 내용의 대부분이 한글입니다. 즉 **한글은 웹폰트를 거치지 않고 OS 기본 폰트로 렌더링되고 있었습니다.**

| OS | 실제로 보이던 한글 |
|---|---|
| macOS | Apple SD Gothic Neo |
| Windows | 맑은 고딕 |
| Android | Noto Sans CJK |

기기마다 자간·굵기·줄높이가 달라서, 디자인을 맞출 수가 없는 상태였습니다. 맑은 고딕과 Apple SD Gothic Neo 는 특히 인상이 많이 다릅니다.

### 코드 블록은 더 나빴습니다

`--font-mono: 'JetBrains Mono', monospace` 였는데, JetBrains Mono 에 한글이 없고 **브라우저가 떨어지는 `monospace` 기본값에도 한글이 없습니다.** 그래서 한 단계 더 떨어져 **비례폭 폰트**로 그려졌습니다.

즉 `<pre>` 안의 한글 주석과 문자열이 **고정폭이 아니었습니다.**

## 2. 바꾼 것

| 토큰 | 전 | 후 |
|---|---|---|
| `--font-sans` | Inter | **Pretendard** → Inter → system-ui |
| `--font-display` | Outfit | **Pretendard** → Inter → system-ui |
| `--font-mono` | JetBrains Mono → monospace | JetBrains Mono → **Nanum Gothic Coding** → monospace |

### Pretendard 를 고른 이유

- **라틴이 Inter 와 거의 같은 비례**입니다. 한글을 채워 넣으면서 기존 영문·숫자 인상이 거의 그대로 유지됩니다
- 중성적이고 획이 정확해서 이 사이트의 방향(에디토리얼 · 고대비 · 장식 없음)과 맞습니다
- 가변 폰트라 400~800 을 **파일 하나**로 덮습니다
- OFL 라이선스

### Outfit 을 뺀 이유

제목 폰트였는데 **한글이 없었습니다.** 즉 한글 제목은 Outfit 으로 그려진 적이 한 번도 없고, 영문 제목만 Outfit, 한글 제목은 시스템 폰트였습니다. **한 화면에 두 개의 서로 다른 제목 서체**가 있었던 셈입니다.

이제 제목도 Pretendard 입니다. 기하학적 성격은 사라지지만, 한글과 영문이 같은 서체가 되는 쪽이 낫다고 판단했습니다.

### 폴백 순서가 의미를 가집니다

```css
--font-sans: 'Pretendard Variable', Pretendard, 'Inter', system-ui, ...;
```

Inter 를 **남겨 뒀습니다.** jsDelivr 가 막힌 네트워크(학교·회사 — Pyodide 때문에 이미 대비해 둔 바로 그 환경)에서는 Pretendard 가 안 오고, 그때 Inter 가 영문을 받습니다. 한글은 그 경우 예전처럼 OS 폰트로 떨어집니다 — 지금보다 나빠지지는 않습니다.

## 3. 용량 — dynamic subset

한글 폰트는 큽니다. 완성형만 2,350자, 실제로는 11,000자가 넘습니다. 통짜로 받으면 **1MB 이상**입니다.

그래서 **dynamic subset** 판을 씁니다.

```
pretendardvariable-dynamic-subset.css   @font-face 92개, 전부 unicode-range
```

브라우저가 **페이지에 실제로 나오는 음절 블록만** 내려받습니다. 첫 화면 기준 보통 수십 KB 수준입니다.

`Nanum Gothic Coding` 은 Google Fonts 가 같은 방식으로 쪼개 줍니다 (`@font-face` 186개).

### 서비스워커

`cdn.jsdelivr.net/gh/orioncactus/pretendard@` 경로를 `CacheFirst` 로 추가했습니다. 기존 jsDelivr 규칙은 `/pyodide/` 만 매칭해서 폰트 조각이 매번 다시 받아졌습니다. URL 에 버전(`@v1.3.9`)이 박혀 있어 1년 캐시가 안전합니다.

## 4. CSP

Pretendard 는 Google Fonts 에 없어서 출처를 추가해야 했습니다.

| 프로젝트 | 변경 |
|---|---|
| 앱 | `style-src` · `font-src` 에 `https://cdn.jsdelivr.net` 추가 |
| 소개 사이트 | 동일 |

앱 쪽은 **새로운 신뢰 관계가 아닙니다** — jsDelivr 는 이미 Pyodide·sql.js 때문에 `script-src` 에 들어가 있습니다. 스크립트를 허용하던 출처에 폰트를 추가하는 것이라 범위가 넓어지지 않습니다.

소개 사이트 쪽은 새 출처입니다. 다만 **폰트와 스타일시트뿐**이고 `script-src` 는 여전히 해시 하나로 잠겨 있습니다 (`default-src 'none'` 도 그대로).

`verify:csp` 에 두 directive 를 추가했습니다. 빠뜨리면 브라우저가 폰트를 차단하는데, **깨진 티가 안 납니다** — 그냥 예전처럼 시스템 폰트로 보일 뿐이라 몇 달 모를 수 있습니다.

## 5. 확인한 것

같은 페이지를 두 번 렌더링해 비교했습니다. jsDelivr 를 막은 쪽이 "전"입니다.

```bash
--host-resolver-rules="MAP cdn.jsdelivr.net 127.0.0.1:1"
```

한글 본문·제목 모두 눈에 띄게 달라집니다. 여기 Mac 에서는 "전"이 Apple SD Gothic Neo 라 그럭저럭 봐줄 만한데, **Windows 의 맑은 고딕이면 차이가 훨씬 큽니다.**

### 직접 확인할 것

1. **Windows 와 macOS 에서 같은 화면**을 열어 한글이 같아 보이는지 — 이게 이 작업의 목적입니다
2. **코드 블록 안 한글 주석**이 고정폭인지 (예: 문제 설명의 `# 코드를 작성하세요`)
3. 개발자도구 Network 에서 `PretendardVariable.subset.*.woff2` 가 **몇 개만** 받아지는지 (전부 받아지면 subset 이 동작하지 않는 것)
4. 콘솔에 **CSP 위반이 없는지** — 있으면 폰트가 차단되고 조용히 예전 모습으로 돌아갑니다

## 6. 하지 않은 것

- **자체 호스팅.** dynamic subset 은 파일이 수백 개라 저장소에 넣기 부담스럽습니다. jsDelivr 가 막힌 환경에서는 Inter + 시스템 한글로 떨어지는데, 이는 현재 상태와 같아서 퇴보가 아닙니다
- **랜딩 페이지 전용 서브셋.** 소개 사이트는 텍스트가 빌드 시점에 고정이라 쓰이는 글자만 추출해 10KB 미만으로 만들 수 있습니다. `pyftsubset` 이 필요하고, 지금 효과 대비 복잡도가 큽니다
- **D2Coding.** 한국 코딩 폰트의 표준이지만 Google Fonts 에 없고 용량이 큽니다. Nanum Gothic Coding 이 같은 역할을 subset 으로 해 줍니다
