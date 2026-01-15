WarmPack GitHub Pages 배포용
===========================

배포 주소(프로젝트 페이지): https://boges12-dot.github.io/WarmPack/

이 빌드는 base path를 '/WarmPack/'로 고정해둔 버전입니다.
- 어떤 하위 페이지(/pages/... )에서도 CSS/JS가 정상 로딩됩니다.
- 루트(/)가 아닌 /WarmPack/ 아래에서 동작하도록 설계됨

배포 방법
1) GitHub 저장소 WarmPack의 기본 브랜치(main) 루트에 아래 폴더/파일이 있도록 업로드
   - index.html
   - css/
   - js/
   - pages/

2) Settings → Pages에서
   - Source: Deploy from a branch
   - Branch: main / (root) 선택
