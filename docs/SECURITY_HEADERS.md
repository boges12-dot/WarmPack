# STEP18: Security headers (recommended)

This site is static and loads all assets from the same origin.
So we can use a **strict** Content Security Policy (CSP) and a small set of baseline security headers.

## What was added

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()`
- `Content-Security-Policy: ...` (default: self only)

These are applied via:
- `site/_headers` (Netlify-style)
- `site/.htaccess` (Apache)

## CSP notes

Current CSP assumes:
- No inline `<script>` / inline `<style>`
- No third-party scripts/fonts (Google Fonts, analytics, widgets)

If you add external resources later, you must relax the relevant directives (e.g. `script-src`, `style-src`, `font-src`, `connect-src`).

## HSTS (optional)

HSTS is **commented out** by default. Only enable it when:
- Your domain is served over HTTPS
- You are sure HTTPS will stay enabled

Then uncomment one of:
- Netlify `_headers`: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- Apache `.htaccess`: `Header set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"`
