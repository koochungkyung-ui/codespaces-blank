# 행운의 로또 번호 추첨기 & 포춘 스케치북

빌드 도구 없이 `index.html` 한 파일(HTML·CSS·JS)로 만든 정적 웹앱입니다. 화면 하나에 탭 4개(🍀 로또 · 🔮 운세 · 🃏 타로 · ✏️ 스케치북)가 있고, 한국어·영어·중국어·일본어를 지원합니다.

- 사이트: https://codespaces-blank-d5v.pages.dev/
- 저장소: https://github.com/koochungkyung-ui/lucky-lotto (공개, 2026-10-16에 `codespaces-blank`에서 이름 변경)
- Codespace 안의 작업 폴더 이름은 예전 그대로 `/workspaces/codespaces-blank`입니다. Cloudflare 프로젝트 이름과 `*.pages.dev` 주소도 예전 이름을 그대로 씁니다.

## 배포

- `main`에 푸시하면 Cloudflare Pages(프로젝트 `codespaces-blank`)가 자동으로 배포합니다. 빌드 단계는 없고, 저장소 루트가 그대로 공개됩니다. 그래서 이 파일도 `/CLAUDE.md` 주소로 누구나 볼 수 있으니 비밀 정보는 넣지 않습니다.
- 배포 결과는 커밋의 체크 런으로 확인합니다.
  `gh api repos/koochungkyung-ui/lucky-lotto/commits/<sha>/check-runs` → `cloudflare-workers-and-pages` 항목
- GitHub Pages는 꺼 두었습니다. Cloudflare만 씁니다.
- Codespace에 기본으로 들어 있는 `GITHUB_TOKEN`으로는 이 저장소에 푸시만 할 수 있습니다. 저장소 설정(공개 여부, Pages 등)은 바꿀 수 없으니, 그런 작업은 사용자에게 GitHub 웹 화면에서 하도록 안내합니다.
- 커밋, 푸시, 배포는 사용자가 요청할 때만 합니다.

## 커밋·배포 전 확인 (필수)

- 사용자가 IDE에 `index.html`을 열어 둔 채 채팅을 하므로, 파일에 엉뚱한 글자가 섞일 수 있습니다. 실제로 CSS 주석 뒤에 `네`가 들어가 배경 규칙 전체가 무시되고 화면이 가려진 적이 있습니다.
  → 커밋 전에 `git diff` 전체를 읽고, 바뀐 줄이 모두 의도한 것인지 확인합니다.
- 스크립트 문법 검사:
  `sed -n '/<script>/,/<\/script>/p' index.html | sed '1d;$d' > /tmp/check.js && node --check /tmp/check.js`
- 화면은 폰 폭(320·360·390px)으로 확인합니다. 헤드리스 Chromium(Playwright)으로 스크린샷을 찍으면 됩니다. Codespace에서 처음 쓸 때는 시스템 라이브러리 설치가 필요합니다(`npx playwright install chromium` 실행 시 안내가 나옵니다).

## index.html 구조

| 위치 | 내용 |
|---|---|
| `<head>` | Open Graph/트위터 공유 미리보기 태그, 미리보기 이미지는 `og-image.png` |
| `<style>` | 라이트/다크 색상 변수(`:root`, `body.dark`), 화면별 스타일, 맨 끝에 "한 화면 탭 레이아웃"과 폰용(`@media (max-width: 540px)`) 규칙 |
| `<body>` | 언어 버튼(`.lang-switch`), 다크모드 버튼, 탭 바(`.tab-nav`), 탭마다 하나씩 있는 `section.card` |
| 스크립트 `0. 다국어` | `I18N` 사전(`ko/en/zh/ja`), `t(key, vars)`, `tData()` |
| `0-1` ~ `8` | 탭 전환, 다크모드, 소리, 로또 추첨(`lotteryTypes`), 운세+달력, 타로, 스케치북, 콘페티, 토스트, `applyLanguage()` |

## 문구와 번역 규칙

- 화면에 보이는 문구는 코드에 직접 쓰지 않고 `I18N` 사전에 넣습니다. **4개 언어 모두에 같은 키**를 추가해야 합니다(빠지면 한국어로 대체되어 보입니다).
- HTML 고정 문구는 `data-i18n="키"`를 씁니다. 속성은 `data-i18n-aria`, `data-i18n-title`을 씁니다.
- JS로 만드는 문구는 `t('키', { 변수 })`를 씁니다. 운세 문장·띠·별자리·타로 해석 같은 데이터는 `I18N.<lang>.data`에 넣습니다.
- 결과 화면(운세·타로)은 상태를 저장해 두고 `render*()` 함수로 그립니다. 그래서 `applyLanguage()`가 언어를 바꿀 때 같은 결과를 새 언어로 다시 그릴 수 있습니다. 새 결과 화면을 추가할 때도 이 방식을 따르고, `applyLanguage()`에 다시 그리기 호출을 넣습니다.
- 공유 미리보기(`og:` 태그)는 SNS가 JS를 실행하지 않으므로 한국어로 고정입니다.

## 복권 규칙 (`lotteryTypes`)

| 키 | 기본 번호 | 보너스 번호 |
|---|---|---|
| `kr` 로또 6/45 | 6개 / 1~45 | 없음 (번호대별 공 색상) |
| `powerball` | 5개 / 1~69 | 1개 / 1~26 |
| `megamillions` | 5개 / 1~70 | 1개 / 1~24 (2025년 4월 변경 규칙) |
| `euromillions` | 5개 / 1~50 | 2개 / 1~12 |
| `eurojackpot` | 5개 / 1~50 | 2개 / 1~12 |

- 운세·타로에서 나온 번호는 한국 로또용입니다. 메인 추첨기로 보내면(`applyToMainLotto`) 한국 로또로 자동 전환됩니다.
- 복권 규칙이 바뀌면 이 표와 `I18N`의 `lot.<키>.rule` 문구도 함께 고칩니다.
- 해외복권 구매대행 사이트 링크는 사용자 결정으로 보류 중입니다. 각 복권의 공식 홈페이지 링크만 넣어 두었습니다.

## 화면 배치 주의

- 폰에서는 공이 고정 크기가 아니라 줄어들 수 있게 되어 있습니다(`flex: 0 1 36px; aspect-ratio: 1`). 한 줄에 공 6~7개와 A~E 표시가 들어가야 하므로, 공 크기를 다시 고정값으로 바꾸면 360px 폭에서 줄바꿈이 생깁니다.
- 페이지 전체는 스크롤되지 않습니다(`body`가 `100dvh`, `overflow: hidden`). 내용이 길면 각 카드 안에서 스크롤됩니다.

## 공유 미리보기 이미지

- `og-image.png`는 1200×630입니다. SVG를 resvg(`@resvg/resvg-js`)와 Pretendard 글꼴로 PNG로 바꿔서 만들었습니다.
- Pretendard에는 한자·가나가 없어서, 이미지 안에서는 "KO · EN · ZH · JA" 같은 영문 표기를 씁니다.
- 이미지를 바꾼 뒤 카카오톡에 예전 미리보기가 계속 나오면, [카카오 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 캐시를 초기화합니다.
