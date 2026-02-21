# hybrid_site_v2_2 (GitHub Pages friendly)

- 모든 경로를 **상대경로**로 구성해서 GitHub Pages(프로젝트 페이지)에서도 CSS/이미지 경로가 깨지지 않게 했습니다.
## 도메인 설정 (중요)
`sitemap.xml`, `canonical`, `OG/Twitter` 메타 태그에는 `https://YOUR_DOMAIN_HERE` placeholder가 들어 있습니다.
배포 도메인이 정해지면 아래 스크립트로 **한 번에 치환**하세요.

```bash
# site 폴더에서 실행
python tools/set_domain.py https://example.com
```

- 입력은 `example.com` 처럼 스킴 없이 넣어도 되고, 자동으로 `https://`가 붙습니다.
- 마지막 `/`는 자동으로 제거됩니다.

## Deploy quick start
1) Set domain: `python tools/set_domain.py https://example.com`
2) Run checks: `python tools/preflight_check.py`
3) See: `docs/PRE_DEPLOY_CHECKLIST.md`

