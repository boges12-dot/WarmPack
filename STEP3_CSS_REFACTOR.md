# 광어 서버 3단계 — CSS 구조 분리

## 변경 사항
- css/style.css는 기존 CSS 파일 4개를 순서대로 불러오는 진입점으로 변경
- css/modules/layout-and-navigation.css: 기본 레이아웃, 메뉴, 사냥터/스킬/보스 기본 스타일
- css/modules/items-and-components.css: 장비, 아이템 카드 등
- css/modules/page-adjustments.css: 배너, 서버 소개/홍보, 아이템 및 사냥터 보정 스타일
- css/modules/boss-cards.css: 필드 보스 카드, 드롭 미리보기, 레이드 카드

## 안정성 원칙
- 원본 style.css 규칙은 삭제하거나 순서를 바꾸지 않고 연속 구간으로 나눴습니다.
- 모든 HTML의 기존 css/style.css 링크는 그대로 유지합니다.
- JS, HTML, 이미지, 아이템/사냥터 내용은 변경하지 않았습니다.
- 기존 base.css, content.css 등은 그대로 보존합니다. 추후 중복 정리는 화면 테스트 후 진행합니다.
- GitHub Pages에서 index.html이 저장소 루트에 오도록 압축 해제 후 내부 파일들을 저장소 루트에 복사하세요.

## 검사 및 주의
- 네 파일을 이어 붙인 문자열이 원본 style.css와 정확히 동일함을 검증했습니다.
- 정적 CSS 분할 검사만 완료했습니다. 브라우저에서 PC/모바일 화면, 메뉴, 보스 카드 등을 추가 확인해야 합니다.
- 기존 CSS의 url(...) 경로가 있다면 분리로 기준 경로가 달라질 수 있으므로 검사했습니다.
