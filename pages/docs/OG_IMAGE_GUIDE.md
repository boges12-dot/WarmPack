# OG 이미지(공유 썸네일) 커스터마이즈 가이드

이 사이트는 기본 공유 썸네일로 `assets/images/og-default.png`를 사용합니다.

## 파일 위치
- 기본 OG 이미지: `site/assets/images/og-default.png`
- 편집 템플릿(SVG): `site/assets/images/og-template.svg`

## 추천 커스터마이즈 방법
1) `og-template.svg`를 편집기(예: Figma/Illustrator/Inkscape/브라우저)로 열기
2) 텍스트를 서버명/슬로건으로 변경
3) PNG로 내보내기(Export) 
   - 크기: **1200×630**
   - 파일명: `og-default.png` (기존 파일을 덮어쓰기)
4) 모든 페이지의 `og:image`/`twitter:image`는 이미 `og-default.png`를 바라보도록 되어 있어 추가 수정이 필요 없습니다.

## 체크
- 이미지가 너무 어두우면 공유앱에서 글자가 안 보일 수 있어 대비를 올리는 것을 권장합니다.
- 파일명/경로를 바꾸고 싶다면, 모든 HTML의 `og:image`, `twitter:image`를 동일하게 바꿔주세요.
