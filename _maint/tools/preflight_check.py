#!/usr/bin/env python3
"""
Preflight check for this static site.

Checks
1) Placeholder domain presence (https://YOUR_DOMAIN_HERE)
2) Broken local links (href/src)  - best effort
3) Duplicate key meta/link tags in <head>

Usage:
  python _maint/tools/preflight_check.py

Exit code:
  0 = OK
  1 = issues found
"""
from __future__ import annotations

import os
import re
from html.parser import HTMLParser
from urllib.parse import urlparse

PLACEHOLDER = "https://YOUR_DOMAIN_HERE"

SKIP_PREFIXES = ("#", "mailto:", "tel:", "javascript:")
EXTERNAL_SCHEMES = ("http", "https", "data", "blob")


class HeadTagParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_head = False
        self.tags: list[tuple[str, dict[str, str]]] = []

    def handle_starttag(self, tag, attrs):
        t = tag.lower()
        if t == "head":
            self.in_head = True
        if self.in_head:
            self.tags.append((t, {k: (v or "") for k, v in attrs}))

    def handle_endtag(self, tag):
        if tag.lower() == "head":
            self.in_head = False


def read_text(path: str) -> str:
    try:
        return open(path, "r", encoding="utf-8", errors="ignore").read()
    except Exception:
        return ""


def iter_text_files(root: str):
    for dirpath, _, files in os.walk(root):
        for f in files:
            if f.startswith("."):
                continue
            if not any(f.lower().endswith(ext) for ext in (".html", ".xml", ".txt", ".json", ".webmanifest", ".md")):
                continue
            yield os.path.join(dirpath, f)


def check_placeholders(root: str) -> list[str]:
    hits = []
    for p in iter_text_files(root):
        data = read_text(p)
        if PLACEHOLDER in data:
            hits.append(os.path.relpath(p, root))
    return hits


REF_RE = re.compile(r'(?:href|src)\s*=\s*["\']([^"\']+)["\']', re.IGNORECASE)


def is_external(url: str) -> bool:
    try:
        parsed = urlparse(url)
    except Exception:
        return False
    return bool(parsed.scheme and parsed.scheme.lower() in EXTERNAL_SCHEMES)


def normalize_local_ref(url: str) -> str:
    return url.split("#", 1)[0].split("?", 1)[0].strip()


def resolve_local_path(site_root: str, html_path: str, ref: str) -> str:
    if ref.startswith("/"):
        return os.path.normpath(os.path.join(site_root, ref.lstrip("/")))
    return os.path.normpath(os.path.join(os.path.dirname(html_path), ref))


def check_links(site_root: str) -> list[tuple[str, str, str]]:
    broken: list[tuple[str, str, str]] = []
    html_files: list[str] = []
    for dirpath, _, files in os.walk(site_root):
        for f in files:
            if f.lower().endswith(".html"):
                html_files.append(os.path.join(dirpath, f))

    for html_path in html_files:
        rel_html = os.path.relpath(html_path, site_root)
        txt = read_text(html_path)
        for m in REF_RE.finditer(txt):
            url = (m.group(1) or "").strip()
            if not url or url.startswith(SKIP_PREFIXES):
                continue
            if is_external(url):
                continue

            ref = normalize_local_ref(url)
            if not ref:
                continue

            resolved = resolve_local_path(site_root, html_path, ref)
            if not os.path.exists(resolved):
                broken.append((rel_html, url, os.path.relpath(resolved, site_root)))
    return broken


def check_duplicate_head(site_root: str):
    dup_head = []
    for dirpath, _, files in os.walk(site_root):
        for f in files:
            if not f.lower().endswith(".html"):
                continue
            p = os.path.join(dirpath, f)
            rel = os.path.relpath(p, site_root)
            txt = read_text(p)
            parser = HeadTagParser()
            try:
                parser.feed(txt)
            except Exception:
                continue

            counts: dict[str, int] = {}

            def bump(key: str):
                counts[key] = counts.get(key, 0) + 1

            for tag, attrs in parser.tags:
                if tag == "meta":
                    name = (attrs.get("name") or "").lower().strip()
                    prop = (attrs.get("property") or "").lower().strip()
                    charset = "charset" in {k.lower() for k in attrs.keys()}

                    if charset:
                        bump("meta:charset")
                    if name == "viewport":
                        bump("meta:viewport")
                    if name == "description":
                        bump("meta:description")
                    if name.startswith("twitter:"):
                        bump(f"meta:twitter:{name}")
                    if prop.startswith("og:"):
                        bump(f"meta:og:{prop}")

                if tag == "link":
                    relv = (attrs.get("rel") or "").lower().strip()
                    if relv == "canonical":
                        bump("link:canonical")
                    if relv in ("icon", "apple-touch-icon", "manifest"):
                        bump(f"link:{relv}")

            dups = [k for k, v in counts.items() if v > 1 and k not in ('link:icon',)]
            # NOTE: multiple rel=icon entries (sizes/types) are normal, so we ignore link:icon duplicates
            if dups:
                dup_head.append((rel, dups))
    return dup_head


def main() -> int:
    site_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    has_issues = False

    ph = check_placeholders(site_root)
    if ph:
        # Domain is intentionally left as YOUR_DOMAIN_HERE until set_domain.py is run.
        print("[WARN] Domain placeholder still present (run _maint/tools/set_domain.py when you decide the domain):")
        for p in ph:
            print(f"  - {p}")
        print()

    broken = check_links(site_root)
    if broken:
        has_issues = True
        print(f"[ISSUE] Broken local href/src refs detected: {len(broken)}")
        for html_rel, ref, resolved in broken[:80]:
            print(f"  - {html_rel} -> {ref} (missing {resolved})")
        if len(broken) > 80:
            print(f"  - ... and {len(broken) - 80} more")
        print()

    dup_head = check_duplicate_head(site_root)
    if dup_head:
        has_issues = True
        print("[ISSUE] Duplicate key <head> tags detected:")
        for html_rel, dups in dup_head:
            print(f"  - {html_rel}: {dups}")
        print()

    if not has_issues:
        print("[OK] Preflight checks passed.")
        return 0

    print("Preflight finished with issues.")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
