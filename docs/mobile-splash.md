# 모바일 스플래시

두 가지입니다. 하나는 **실제로 빠져 있던 것**을 채운 것이고, 하나는 새로 넣은 연출입니다.

| 대상 | 무엇 | 기술 |
|---|---|---|
| 앱 (PWA) | iOS 홈 화면에서 켤 때의 **실행 화면** | `apple-touch-startup-image` PNG 24개 |
| 소개 사이트 | 모바일에서 페이지 진입 시 **짧은 커버** | CSS 애니메이션만 |

---

## 1. 앱 — iOS 실행 화면 (버그 수정)

### 왜 필요했나

PWA 스플래시는 플랫폼마다 다릅니다.

| | 동작 |
|---|---|
| **Android / Chrome** | 웹앱 manifest 의 `name` · `background_color` · 512px 아이콘으로 **자동 생성**합니다. 이미 잘 나오고 있었습니다 |
| **iOS / Safari** | **자동 생성이 없습니다.** `apple-touch-startup-image` 가 없으면 **흰 화면**이 뜨다가 앱이 그려집니다 |

이 앱에서는 그 공백이 특히 깁니다. 홈 화면에서 켜면 흰 화면 → 앱 셸 → 그 위에 Pyodide 로드가 이어져서, 아이콘도 제목도 없는 빈 화면이 몇 초씩 보입니다. **고장난 것처럼 보입니다.**

### 왜 파일이 24개인가

iOS 는 이미지 하나를 늘려 쓰지 않습니다. **기기의 CSS 크기 · 픽셀 비율 · 방향이 정확히 일치하는** `<link>` 를 찾고, 없으면 흰 화면으로 돌아갑니다.

```html
<link rel="apple-touch-startup-image"
      media="(device-width: 390px) and (device-height: 844px)
             and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      href="/splash/splash-390x844@3x.png" />
```

- **iPhone 12종 — 세로만.** 코딩 사이트를 휴대폰 가로로 켜는 경우는 드물고, 안 맞으면 지금과 같은 흰 화면이라 **손해가 없습니다**
- **iPad 6종 — 세로·가로 둘 다.** 태블릿은 가로로 쓰는 일이 흔합니다

합계 24개 · **134KB**. 단색 배경에 작은 마크뿐이라 64색 팔레트로 저장하면 하나에 몇 KB입니다.

### 서비스워커에서 제외

`vite.config.ts` 의 `globIgnores` 에 `splash/**` 를 넣었습니다.

이 파일들은 **iOS 가 홈 화면 추가·실행 시점에만** 읽습니다. 실행 중인 앱은 한 번도 요청하지 않습니다. 프리캐시에 넣으면 **모든 방문자가 134KB를 받아** iOS 홈 화면 사용자만 쓰는 파일을 저장하게 됩니다.

### 생성

```bash
pip install pillow
python3 scripts/make-ios-splash.py
```

- `public/splash/` 의 PNG 를 다시 만들고, **`index.html` 의 `<link>` 태그까지 직접 갱신**합니다 (`<!-- ios-splash:start -->` ~ `end` 사이). 손으로 붙여 넣을 게 없고 몇 번을 돌려도 결과가 같습니다
- CI 에는 이미지 도구가 없으므로 **수동 실행 + 결과 커밋**입니다. 브랜딩이 바뀔 때만 돌리면 됩니다
- 중간 산출물을 `public/splash/links.html` 로 두지 않았습니다 — `public/` 에 두면 빌드에 복사돼 `/splash/links.html` 로 **공개 배포**됩니다

### 디자인

배경은 `#fafafa` — manifest 의 `background_color` 와 같습니다. 실행 화면과 앱의 첫 프레임이 **같은 색**이라 전환이 없습니다. 어두운 스플래시를 썼다면 밝은 앱으로 넘어가며 번쩍입니다.

마크는 짧은 쪽 변 기준으로 크기를 잡아서, 아이폰과 12.9" 아이패드에서 **같은 광학 크기**로 보입니다.

Menlo 로 그립니다. JetBrains Mono 는 시스템 폰트가 아니고, 이 크기에 대문자 + 넓은 자간이면 둘을 구분하기 어렵습니다. Pillow 에는 letter-spacing 이 없어서 **글자를 하나씩** 그립니다.

---

## 2. 소개 사이트 — 모바일 진입 커버

### 애니메이션은 CSS, 기억은 스크립트 한 줄

커버 자체는 **CSS 애니메이션만**입니다. 스크립트가 로드되지 않아 커버가 안 걷히는 상황이 아예 없습니다.

다만 "새로고침할 때마다 다시 뜨는" 문제는 CSS 로 풀 수 없습니다. **CSS 에는 이전 방문을 기억할 수단이 없습니다** — `:target` 은 URL 프래그먼트라 새로고침에 그대로 남고, `:visited` 는 개인정보 보호 때문에 색 외에는 아무것도 바꾸지 못합니다.

그래서 `<head>` 에 **한 줄짜리 인라인 스크립트**를 넣었습니다.

```js
try{var k='pq_splash_seen';
  if(sessionStorage.getItem(k)){document.documentElement.className='splash-seen'}
  else{sessionStorage.setItem(k,'1')}}catch(e){}
```

### `script-src 'none'` → 해시, `'unsafe-inline'` 이 아닙니다

이 구분이 중요합니다. 지키려던 건 "JS 0줄"이라는 **순수성**이었는데, 실제 보안 가치는 **"주입된 스크립트는 실행될 수 없다"** 입니다.

```
script-src 'sha256-c6s0qxWxvKwC7zdUcanPCJaCzZVRObdVwhAxxlyJwp4='
```

해시가 정확히 일치하는 그 스크립트 **하나만** 실행됩니다. 공격자가 넣은 `<script>` 는 내용이 다르므로 여전히 차단됩니다. `'unsafe-inline'` 이었다면 아무 인라인 스크립트나 돌았을 테니, 전혀 다른 이야기입니다. 앱 쪽 CSP 도 이미 같은 방식을 씁니다(다크모드 선반영 스크립트).

`default-src`·`connect-src` 는 그대로 `'none'` 이고, `src=` 외부 스크립트는 애초에 허용 목록에 없습니다.

### 해시가 어긋나면 빌드가 실패합니다

스크립트를 고치고 해시를 안 바꾸면 **브라우저가 조용히 차단**합니다. 커버가 매번 다시 뜰 뿐 에러는 안 보여서, 몇 달 모르고 지나갈 수 있는 종류입니다.

그래서 `build-site.mjs` 가 생성된 페이지에서 **해시를 직접 계산해** `site/vercel.json` 에 써 넣고, `--check` 모드에서는 다르면 실패시킵니다. 함께 막는 것:

| 상황 | 결과 |
|---|---|
| 해시 불일치 | `check:site` 실패 + 올바른 값 출력 |
| 인라인 스크립트가 2개 이상 | 빌드 실패 |
| `<script src=...>` 추가 | 빌드 실패 |

세 가지 모두 일부러 깨뜨려 실패하는 것을 확인했습니다.

### 실제 동작 확인

같은 탭에서 iframe 을 세 번 로드해 측정했습니다.

```
로드 1: html.class="(없음)"      .splash display=grid
로드 2: html.class="splash-seen"  .splash display=none
로드 3: html.class="splash-seen"  .splash display=none
```

`sessionStorage` 라 **탭 단위**입니다 — 새 탭이나 다음 방문에는 다시 한 번 보입니다. 같은 세션 안에서 조르지 않으면서 브랜드 인상은 남기는 지점입니다. (`localStorage` 였다면 영원히 한 번뿐입니다.)

스크립트는 스타일시트보다 **위**에 있습니다. 재방문 시 패널이 잠깐 그려졌다 사라지는 게 아니라 **아예 그려지지 않습니다.**

### 내용을 막지 않습니다

페이지는 첫 프레임부터 **아래에 완전히 그려져 있습니다.** 커버는 그 위를 0.52초 덮고 0.42초에 걸쳐 위로 빠집니다. 총 **0.94초**. 아무것도 기다리지 않고, DOM 에 콘텐츠가 그대로 있으므로 검색엔진에도 영향이 없습니다.

### 안 보이는 경우가 기본값입니다

```css
.splash { display: none; }

@media (max-width: 768px) and (prefers-reduced-motion: no-preference) {
  .splash { display: grid; animation: splash-leave ... forwards; }
}
```

기본이 `display: none` 입니다. 데스크톱, 모션 최소화 설정, 두 쿼리가 적용되지 않는 환경 — **어디서든 커버에 갇히지 않고 그냥 안 보입니다.** 반대로 짰다면(기본 표시 + 조건부 숨김) 애니메이션이 안 돌아가는 환경에서 페이지가 영구히 가려집니다.

### 연출

사이트의 어휘를 그대로 씁니다 — 스피너가 아니라 **선**입니다.

```
  0.04s  ›           쉐브론이 떠오르며 등장 (favicon 모양)
  0.08s  PYQUESTS    워드마크가 떠오르며 등장
  0.20s  ─────       머리카락 선이 좌우로 그어짐
  0.52s              패널이 위로 빠짐
  0.94s              끝
```

쉐브론은 `<img>` 가 아니라 **CSS 테두리 두 개**로 그립니다. 이미지였다면 자기가 속한 애니메이션과 경쟁하는 두 번째 요청이 됩니다.

> 작성 중 직접 만든 버그: 쉐브론은 `transform: rotate(-45deg)` 로 회전해 두는데, 워드마크와 같은 키프레임(`translateY`)을 쓰면 **transform 이 한 속성이라 회전이 지워집니다.** 전용 키프레임으로 분리하고 `translateY(5px) rotate(-45deg)` 순서로 썼습니다 — 순서가 반대면 5px 이 화면 기준이 아니라 회전된 축을 따라갑니다.

---

## 3. 모바일 레이아웃 (같이 고친 것)

소개 사이트를 **280 · 320 · 360 · 390 · 414 · 768px** 에서 실측했습니다. 320px 에서 가로 스크롤이 생겼습니다.

```
320px -> viewport=320 scrollWidth=350   article.demo 가 30px 밀려 나옴
```

`grid-template-columns: repeat(auto-fit, minmax(330px, 1fr))` 때문입니다. 그리드 트랙은 **고정 최소값 아래로 줄어들지 않아서**, 320px 화면에서 트랙이 330px 를 고수하며 뷰포트를 넘깁니다.

```css
/* 최소값을 사용 가능 폭으로 제한 */
grid-template-columns: repeat(auto-fit, minmax(min(330px, 100%), 1fr));
```

수정 후 전 구간 `scrollWidth == viewport`.

> 헤드리스 Chrome 은 창을 **500px 아래로 줄이지 않습니다.** `--window-size=390` 으로 찍으면 500px 로 렌더해서 390px 로 잘라낸 그림이 나와 **없는 넘침이 있는 것처럼 보입니다.** 고정 폭 iframe 안에 넣고 `scrollWidth` 를 읽어야 정직하게 측정됩니다.

---

## 4. 직접 확인할 것

### iOS 실행 화면

1. iPhone Safari 로 앱 접속 → 공유 → **홈 화면에 추가**
2. 홈 화면 아이콘으로 **실행**
3. 흰 화면이 아니라 **`›` + PYQUESTS** 가 보여야 함
4. 화면이 그대로 앱으로 이어지고, 배경색이 바뀌며 번쩍이지 않아야 함

안 보이면 그 기기 크기가 목록에 없는 것입니다. Safari 에서 `window.screen.width`/`height`/`devicePixelRatio` 를 확인해 `IPHONES`/`IPADS` 에 추가하고 다시 생성하면 됩니다.

### 소개 사이트 커버

1. 휴대폰(또는 768px 이하)에서 접속 → 약 1초짜리 검은 커버
2. **새로고침** → 다시 나오지 않아야 함
3. **새 탭**에서 열기 → 다시 한 번 나와야 함
4. 설정에서 **동작 줄이기**를 켜면 → 커버가 아예 안 나와야 함
5. 데스크톱 → 안 나와야 함
6. 개발자도구 콘솔에 **CSP 위반이 없어야 함** (로컬 `python3 -m http.server` 는 헤더를 안 보내므로 배포본에서 확인)
