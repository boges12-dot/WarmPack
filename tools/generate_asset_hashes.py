#!/usr/bin/env python3
"""Generate SHA256 hashes for key assets.

Creates site/assets_hashes.json with sha256 (hex) and SRI (base64) for minified CSS/JS.

Usage:
  python tools/generate_asset_hashes.py
"""

from __future__ import annotations

import base64
import hashlib
import json
import os
from pathlib import Path

SITE_ROOT = Path(__file__).resolve().parents[1]
OUT_FILE = SITE_ROOT / "assets_hashes.json"

TARGET_PATTERNS = [
    "css/*.min.css",
    "js/*.min.js",
]


def hash_file(p: Path) -> dict:
    data = p.read_bytes()
    sha = hashlib.sha256(data).digest()
    return {
        "path": str(p.relative_to(SITE_ROOT)).replace("\\\\", "/"),
        "sha256_hex": hashlib.sha256(data).hexdigest(),
        "sri_sha256": "sha256-" + base64.b64encode(sha).decode("ascii"),
        "bytes": len(data),
    }


def main() -> None:
    items = []
    for pat in TARGET_PATTERNS:
        for p in sorted(SITE_ROOT.glob(pat)):
            if p.is_file():
                items.append(hash_file(p))

    payload = {
        "generated_at": "local",
        "count": len(items),
        "items": items,
    }
    OUT_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_FILE} with {len(items)} items")


if __name__ == "__main__":
    os.chdir(SITE_ROOT)
    main()
