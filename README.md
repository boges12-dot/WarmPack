# hybrid_site_v2_2 (GitHub Pages friendly)

- 모든 경로를 **상대경로**로 구성해서 GitHub Pages(프로젝트 페이지)에서도 CSS/이미지 경로가 깨지지 않게 했습니다.
- `assets/images/` 에 `banner.gif`, `logo.png` 를 넣어 사용합니다. (WebP가 있으면 자동으로 WebP 우선)

## 도메인 설정 (중요)
`sitemap.xml`, `canonical`, `OG/Twitter` 메타 태그에는 `https://YOUR_DOMAIN_HERE` placeholder가 들어 있습니다.
배포 도메인이 정해지면 아래 스크립트로 **한 번에 치환**하세요.

```bash
# site 폴더에서 실행
python _maint/tools/set_domain.py https://example.com
```

- 입력은 `example.com` 처럼 스킴 없이 넣어도 되고, 자동으로 `https://`가 붙습니다.
- 마지막 `/`는 자동으로 제거됩니다.

## Deploy quick start
1) Set domain: `python _maint/tools/set_domain.py https://example.com`
2) Run checks: `python _maint/tools/preflight_check.py`
3) See: `_maint/docs/PRE_DEPLOY_CHECKLIST.md`

## 운영 링크(다운로드/커뮤니티) 설정
HTML을 직접 수정하지 않고, 아래 JSON 파일에 **URL만** 넣으면 버튼이 자동으로 연결됩니다.

- 다운로드: `data/downloads.json`
  - `client.url` : 클라이언트 파일 링크
  - `patch.url`  : 패치/업데이트 링크
- 커뮤니티: `data/community.json`
  - `kakao.url` / `telegram.url` / `support.url`

URL이 비어있으면 버튼 클릭 시 안내만 뜨도록(점프 방지) 처리되어 있습니다.


---

## 데이터 파일 빠른 검증(선택)
Node.js가 있으면 아래로 `data/*.json` 형식/중복/id 등을 빠르게 점검할 수 있습니다.

```bash
cd site
node _maint/tools/validate-data.mjs
```

## 공지 운영 가이드
- 공지 추가/수정 방법: `_maint/docs/NOTICES_GUIDE.md`
- 샘플 템플릿: `data/notices.template.json`

## 정리 후보(삭제는 선택)
- 현재 참조되지 않는 파일 후보: `_maint/docs/CLEANUP_CANDIDATES.md`
