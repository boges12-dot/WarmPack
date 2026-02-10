# CSP Verify Guide

This site ships with a strict Content-Security-Policy (CSP) for a static deployment.
Use this guide after deployment to confirm there are **zero CSP violations** in real browsers.

## 1) How to check CSP violations
1. Open the deployed site in Chrome/Edge.
2. Open DevTools → **Console**.
3. Reload the page (Ctrl+R).
4. Look for messages containing:
   - `Content Security Policy`
   - `Refused to load`
   - `violates the following Content Security Policy directive`

If you see any CSP errors, note the blocked URL and directive.

## 2) Common causes
- External scripts / widgets added later (analytics, chat, embeds)
- Fonts loaded from CDNs
- Images from external domains
- Inline scripts/styles (should be avoided)

## 3) How to safely relax CSP (minimal change)
Prefer allowing only what you need and only from trusted domains.

### Example A: allow Google Analytics script
Add the domain to `script-src`:
- `script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com;`

### Example B: allow external images (e.g., CDN)
Add the domain to `img-src`:
- `img-src 'self' data: https://cdn.example.com;`

### Example C: allow fonts from a CDN
Add domains to `font-src` and (if needed) `style-src`:
- `font-src 'self' https://fonts.gstatic.com;`
- `style-src 'self' https://fonts.googleapis.com;`

## 4) Recommended workflow
1. Deploy with strict CSP.
2. Visit top pages and check Console.
3. If violations appear, relax CSP **minimally**.
4. Re-check until Console is clean.

## 5) Notes
- CSP rules are applied via `/_headers` (Netlify-like) and `htaccess_8052c42ab3` (Apache).
- Keep `object-src 'none'` and `frame-ancestors 'none'` unless you have a specific embed requirement.
