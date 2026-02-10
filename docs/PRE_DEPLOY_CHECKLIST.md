# Pre-deploy checklist

## 1) Set your domain (one time)
- Run:
  - `python tools/set_domain.py https://example.com`
- This replaces `https://YOUR_DOMAIN_HERE` across HTML + sitemap + manifest.

## 2) Run preflight checks
- Run:
  - `python tools/preflight_check.py`
- Fix any `[FAIL]` entries before deployment.

## 3) Verify locally (manual)
- Open `index.html` and check:
  - Main menu hover open/close feels right
  - Logo/banner loads
  - Notice pages open correctly
  - 404 page exists and links back to home

## 4) Deploy
- Apache: `htaccess_8052c42ab3` is included (optional caching/gzip)
- Netlify: `_headers` is included (optional caching)
- (선택) STEP18 보안 헤더/CSP 적용: `docs/SECURITY_HEADERS.md` 참고

## 5) After deploy
- Confirm these URLs load:
  - `/robots.txt`
  - `/sitemap.xml`
  - `/404.html`
- Run a quick share test (Kakao/Discord/etc.) to confirm OG image renders.

## Security verification
- [ ] CSP violations: **0** (check DevTools Console; see `CSP_VERIFY.md`)
- [ ] If minified assets changed, SRI hashes are regenerated and match the deployed files
