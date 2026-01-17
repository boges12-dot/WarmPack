# STEP20 Improvements (no domain required)

This step improves developer tooling and validation without needing a real domain.

## What changed
- `_maint/tools/preflight_check.py` was fixed and improved:
  - Properly resolves absolute paths like `/assets/...` from site root.
  - Best-effort local href/src validation.
  - Detects duplicate key `<head>` tags.

## How to use
From the `site/` folder:
```bash
python _maint/tools/preflight_check.py
```

> Note: You can ignore the placeholder-domain warnings until you decide your final domain.
