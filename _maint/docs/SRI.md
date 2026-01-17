# SRI (Subresource Integrity)

This site now adds **SRI integrity hashes** to local minified CSS/JS references.

## What changed
- All HTML files that reference these assets now include:
  - `integrity="sha256-..."`
  - `crossorigin="anonymous"`
- A manifest file is generated at:
  - `assets_hashes.json`

## When to regenerate
If you edit any of these files, you must regenerate hashes and re-inject SRI:
- `css/main.20260116_16.min.css`
- `js/main.20260116_16.min.js`
- `js/notice.20260116_16.min.js`

Run:
```bash
python _maint/tools/add_sri.py
```

## Notes
- SRI works for same-origin resources too.
- If you switch back to non-min files for development, you can either:
  - remove integrity attributes, or
  - run `add_sri.py` after changing references.
