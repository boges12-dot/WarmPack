#!/usr/bin/env python3
"""Add Subresource Integrity (SRI) hashes to local CSS/JS references.

- Computes sha256 base64 for referenced assets.
- Adds integrity="sha256-..." and crossorigin="anonymous" when missing.
- Only touches <link ... href="..."> and <script ... src="..."> that point to local files.

Usage:
  python _maint/tools/add_sri.py
"""

from __future__ import annotations

import base64
import hashlib
import os
import re
from pathlib import Path

SITE_ROOT = Path(__file__).resolve().parents[1]

HTML_GLOB = "**/*.html"

# Match link tags with href
LINK_RE = re.compile(
    r"<link(?P<attrs>[^>]*?)href=\"(?P<href>[^\"]+)\"(?P<tail>[^>]*)>",
    re.IGNORECASE,
)

# Match script tags with src
SCRIPT_RE = re.compile(
    r"<script(?P<attrs>[^>]*?)src=\"(?P<src>[^\"]+)\"(?P<tail>[^>]*)>(?P<body>\\s*)</script>",
    re.IGNORECASE,
)

INTEGRITY_RE = re.compile(r"\bintegrity=\"[^\"]+\"", re.IGNORECASE)
CROSSORIGIN_RE = re.compile(r"\bcrossorigin=\"[^\"]+\"", re.IGNORECASE)


def sha256_sri(path: Path) -> str:
    data = path.read_bytes()
    digest = hashlib.sha256(data).digest()
    b64 = base64.b64encode(digest).decode("ascii")
    return f"sha256-{b64}"


def is_local_asset(url: str) -> bool:
    # Exclude absolute URLs, protocol-relative, data: URIs
    u = url.strip()
    if u.startswith("http://") or u.startswith("https://") or u.startswith("//"):
        return False
    if u.startswith("data:"):
        return False
    # Exclude anchors/mailto/tel
    if u.startswith("#") or u.startswith("mailto:") or u.startswith("tel:"):
        return False
    return True


def normalize_path(url: str) -> Path:
    # Remove query/hash
    clean = url.split("#", 1)[0].split("?", 1)[0]
    # Treat leading / as site-root relative
    if clean.startswith("/"):
        clean = clean.lstrip("/")
    return (SITE_ROOT / clean).resolve()


def add_attrs(tag_attrs: str, tail: str, integrity: str) -> str:
    out_attrs = tag_attrs
    out_tail = tail
    if not INTEGRITY_RE.search(out_attrs + out_tail):
        out_tail = out_tail + f' integrity="{integrity}"'
    if not CROSSORIGIN_RE.search(out_attrs + out_tail):
        out_tail = out_tail + ' crossorigin="anonymous"'
    return out_attrs + out_tail


def process_html(path: Path) -> tuple[bool, list[str]]:
    original = path.read_text(encoding="utf-8", errors="replace")
    updated = original
    notes: list[str] = []

    def repl_link(m: re.Match) -> str:
        href = m.group("href")
        if not is_local_asset(href):
            return m.group(0)
        asset_path = normalize_path(href)
        if not asset_path.exists() or not asset_path.is_file():
            return m.group(0)
        try:
            integrity = sha256_sri(asset_path)
        except Exception:
            return m.group(0)
        attrs = m.group("attrs")
        tail = m.group("tail")
        new_attrs_tail = add_attrs(attrs, tail, integrity)
        notes.append(f"link:{href}")
        return f"<link{new_attrs_tail}href=\"{href}\">"

    def repl_script(m: re.Match) -> str:
        src = m.group("src")
        if not is_local_asset(src):
            return m.group(0)
        asset_path = normalize_path(src)
        if not asset_path.exists() or not asset_path.is_file():
            return m.group(0)
        try:
            integrity = sha256_sri(asset_path)
        except Exception:
            return m.group(0)
        attrs = m.group("attrs")
        tail = m.group("tail")
        body = m.group("body")
        new_attrs_tail = add_attrs(attrs, tail, integrity)
        notes.append(f"script:{src}")
        return f"<script{new_attrs_tail}src=\"{src}\">{body}</script>"

    updated = LINK_RE.sub(repl_link, updated)
    updated = SCRIPT_RE.sub(repl_script, updated)

    changed = updated != original
    if changed:
        path.write_text(updated, encoding="utf-8")
    return changed, notes


def main() -> None:
    html_files = sorted(SITE_ROOT.glob(HTML_GLOB))
    total_changed = 0
    total_tags = 0
    for f in html_files:
        changed, notes = process_html(f)
        if changed:
            total_changed += 1
            total_tags += len(notes)
    print(f"Updated {total_changed} HTML files, added attrs to {total_tags} tags.")


if __name__ == "__main__":
    os.chdir(SITE_ROOT)
    main()
