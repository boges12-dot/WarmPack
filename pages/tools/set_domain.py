#!/usr/bin/env python3
"""Replace https://YOUR_DOMAIN_HERE placeholder across the site.

Usage:
  python tools/set_domain.py https://example.com

Notes:
- Keeps all page paths relative (good for GitHub Pages), while updating absolute URLs
  used by sitemap/canonical/OG/Twitter.
- Input is normalized to include a scheme and no trailing slash.
"""

from __future__ import annotations

import sys
import re
from pathlib import Path

PLACEHOLDER = "https://YOUR_DOMAIN_HERE"


def normalize_domain(raw: str) -> str:
    raw = raw.strip()
    if not raw:
        raise ValueError("Domain is empty")

    # Add scheme if missing
    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", raw):
        raw = "https://" + raw

    # Remove trailing slash
    raw = raw.rstrip("/")

    # Very light validation
    if "." not in raw.split("//", 1)[-1]:
        raise ValueError(f"Domain looks invalid: {raw}")

    return raw


def replace_in_file(path: Path, new_domain: str) -> bool:
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        # Skip binary files
        return False

    if PLACEHOLDER not in text:
        return False

    path.write_text(text.replace(PLACEHOLDER, new_domain), encoding="utf-8")
    return True


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python tools/set_domain.py https://example.com")
        return 2

    try:
        new_domain = normalize_domain(sys.argv[1])
    except Exception as e:
        print(f"Error: {e}")
        return 2

    site_root = Path(__file__).resolve().parents[1]

    targets = []
    targets.extend(site_root.rglob("*.html"))
    for name in ["sitemap.xml", "robots.txt", "site.webmanifest"]:
        p = site_root / name
        if p.exists():
            targets.append(p)
    docs_dir = site_root / "docs"
    if docs_dir.exists():
        targets.extend(docs_dir.rglob("*.md"))

    changed = 0
    for p in targets:
        if replace_in_file(p, new_domain):
            changed += 1

    print(f"Done. Updated {changed} file(s) to use: {new_domain}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
