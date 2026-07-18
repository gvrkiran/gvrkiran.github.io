#!/usr/bin/env python3
"""Build manifest_all.json from papers-meta.json for generate_pub_art.py.

Emits one item per unique slug whose PNG is missing from originals/.
Workflow when papers-meta.json gains entries:
  python3 build_manifest.py
  python3 generate_pub_art.py manifest_all.json   # writes 1024px PNGs to originals/
  sh make_web_copies.sh                            # converts to 720px webp in papers/
(originals/ is gitignored; the site serves papers/*.webp)
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
meta = json.load(open(os.path.join(HERE, "papers-meta.json")))["papers"]

seen = set()
items = []
for m in meta:
    slug = m["slug"]
    if slug in seen:
        continue
    seen.add(slug)
    if os.path.exists(os.path.join(HERE, "originals", f"{slug}.png")):
        continue
    items.append({"slug": slug, "title": m["match"], "metaphor": m["metaphor"]})

manifest = {"outdir": "originals", "items": items}
out = os.path.join(HERE, "manifest_all.json")
json.dump(manifest, open(out, "w"), indent=1, ensure_ascii=False)
print(f"{len(seen)} unique slugs; {len(items)} images to generate -> {out}")
