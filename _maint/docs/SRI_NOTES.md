# SRI (Subresource Integrity) notes

This build adds `integrity="sha256-..."` and `crossorigin="anonymous"` attributes to local CSS/JS references.

Why:
- Detects unexpected asset changes (helps catch partial uploads / CDN issues).
- Makes it harder for injected asset modifications to go unnoticed.

If you later change/minify assets again, re-run:
- `python _maint/tools/generate_asset_hashes.py`
- `python _maint/tools/add_sri.py`

Files generated:
- `assets_hashes.json`
- Updated `*.html` tags for minified CSS/JS
