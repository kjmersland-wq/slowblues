#!/usr/bin/env python3
"""Find a usable lead photo on Wikimedia Commons for an artist (read-only).

    python scripts/commons_image.py "Mississippi John Hurt" "Jeff Healey"

Takes the lead image of the English Wikipedia article, then reads the file's OWN
Commons description page metadata and only accepts PD / CC0 / CC BY / CC BY-SA
(CLAUDE.md). Prints image URL, photographer credit, license and the file page to
verify by eye. Files that are fair-use/non-free on Wikipedia are not on Commons
and are reported as "no free image".
"""
from __future__ import annotations

import json
import re
import sys
import urllib.parse
import urllib.request

UA = {"User-Agent": "SlowBluesTool/1.0 (https://www.slow-blues.com)"}
OK_LICENSE = re.compile(r"^(public domain|pd\b|cc0|cc[- ]by(?:[- ]sa)?\b)", re.I)


def api(host: str, **params) -> dict:
    url = f"https://{host}/w/api.php?" + urllib.parse.urlencode({**params, "format": "json"})
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def strip_html(s: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s or "")).strip()


def lead_image(title: str) -> dict | None:
    d = api("en.wikipedia.org", action="query", titles=title, prop="pageimages", piprop="original|name", redirects=1)
    page = next(iter(d["query"]["pages"].values()))
    return {"file": page.get("pageimage")} if page.get("pageimage") else None


def commons_meta(filename: str) -> dict | None:
    d = api("commons.wikimedia.org", action="query", titles=f"File:{filename}", prop="imageinfo",
            iiprop="url|extmetadata", iiurlwidth=1200)
    page = next(iter(d["query"]["pages"].values()))
    info = (page.get("imageinfo") or [None])[0]
    if not info:
        return None
    m = info["extmetadata"]
    lic = m.get("LicenseShortName", {}).get("value", "")
    return {
        "file": filename,
        "url": info["thumburl"] if info.get("thumburl") else info["url"],
        "original": info["url"],
        "license": lic,
        "allowed": bool(OK_LICENSE.match(lic)),
        "artist": strip_html(m.get("Artist", {}).get("value", "")),
        "date": strip_html(m.get("DateTimeOriginal", {}).get("value", "")),
        "page": f"https://commons.wikimedia.org/wiki/File:{urllib.parse.quote(filename.replace(' ', '_'))}",
    }


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    for name in sys.argv[1:]:
        li = lead_image(name)
        meta = commons_meta(li["file"]) if li else None
        if not meta:
            print(f"{name}: no free image found (lead image missing or not on Commons)")
            continue
        flag = "OK " if meta["allowed"] else "NOT ALLOWED"
        print(f"{name}: [{flag}] {meta['license']} | {meta['artist']} | {meta['date']}\n  {meta['url']}\n  verify: {meta['page']}")


if __name__ == "__main__":
    main()
