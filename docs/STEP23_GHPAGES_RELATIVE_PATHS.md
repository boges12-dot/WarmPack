# STEP23 (2026-01-17) - GitHub Pages 호환 경로/검증 개선

## 변경 요약

1) **루트 절대경로 제거**
- HTML에서 `/favicon.ico`, `/assets/...`, `/site.webmanifest` 처럼 **슬래시로 시작하는 경로**를 모두 **상대경로**로 변경했습니다.
- GitHub Pages의 `https://username.github.io/repo/` 형태 배포에서, 루트 절대경로는 도메인 루트로 향해 404가 날 수 있어 이를 방지합니다.

2) robots.txt 수정
- `Sitemap: /sitemap.xml` → `Sitemap: sitemap.xml`

3) preflight_check.py 개선
- `rel="icon"` 은 여러 개가 정상(다양한 sizes/types)이라 중복 경고에서 제외
- 도메인이 아직 미정인 경우(`YOUR_DOMAIN_HERE`), 이를 **오류가 아닌 경고**로 처리

## 결과
- 프로젝트 페이지 형태 GitHub Pages 배포에서도 아이콘/manifest가 정상 로드됩니다.
- 도메인 설정 전에도 검증이 막히지 않습니다.
