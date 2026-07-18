#!/usr/bin/env python3
"""
generate_pub_art.py — generate cohesive illustrations for publications.

Reads a manifest (JSON) of papers, each with a visual metaphor, and renders
one image per paper in a shared house style via the OpenAI Images API.

Usage:
  export OPENAI_API_KEY=...   (or source ~/.profile)
  python3 generate_pub_art.py manifest_2026.json

Notes:
  - Tries gpt-image-1 first, falls back to dall-e-3 automatically.
  - Writes PNGs next to the manifest under <outdir>/<slug>.png.
  - Skips images that already exist (delete a file to regenerate it).
"""

import base64
import json
import os
import sys
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

API_URL = "https://api.openai.com/v1/images/generations"

# House styles. Every prompt = STYLE + SUBJECT so the set stays cohesive.
STYLES = {
    "riso": (
        "Risograph print illustration, exactly two ink colors: deep indigo blue and warm "
        "vermilion orange-red on warm cream paper. Flat bold shapes, visible print grain, "
        "subtle misregistration of the two inks, generous negative space, playful minimal "
        "editorial style like a New Yorker spot illustration. Absolutely no text, no words, "
        "no letters, no numbers anywhere in the image. Subject: "
    ),
    "inkwash": (
        "Loose ink and watercolor wash editorial illustration on cream paper, confident black "
        "ink linework with muted indigo and burnt-orange washes, lots of white space, elegant "
        "and slightly whimsical, like an illustration for a science essay in a literary magazine. "
        "No text, no words, no letters anywhere. Subject: "
    ),
    "poster": (
        "Mid-century modern travel-poster style illustration, flat geometric shapes, textured "
        "screen-print look, limited palette of indigo, cream, mustard and vermilion, bold "
        "simplified forms, in the spirit of vintage WPA posters. No text, no words, no letters "
        "anywhere. Subject: "
    ),
    "woodcut": (
        "Woodcut linocut engraving illustration, bold carved black lines on cream paper with a "
        "single vermilion accent color, dramatic hatching, folk-art print texture. No text, no "
        "words, no letters anywhere. Subject: "
    ),
}


def load_key() -> str:
    key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not key:
        sys.exit("OPENAI_API_KEY is not set. `source ~/.profile` first.")
    return key


def call_api(key: str, model: str, prompt: str, quality: str) -> bytes:
    body = {"model": model, "prompt": prompt, "size": "1024x1024", "n": 1}
    if model == "gpt-image-1":
        body["quality"] = quality  # low | medium | high
    else:  # dall-e-3
        body["quality"] = "hd" if quality == "high" else "standard"
        body["response_format"] = "b64_json"
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=300) as resp:
        data = json.loads(resp.read())
    return base64.b64decode(data["data"][0]["b64_json"])


def generate(key: str, item: dict, outdir: str) -> str:
    slug, style = item["slug"], item.get("style", "riso")
    quality = item.get("quality", "high")
    path = os.path.join(outdir, item.get("outfile", f"{slug}.png"))
    if os.path.exists(path):
        return f"skip (exists): {path}"
    prompt = STYLES[style] + item["metaphor"]
    last_err = None
    for model in ("gpt-image-1", "dall-e-3"):
        for attempt in (1, 2):
            try:
                png = call_api(key, model, prompt, quality)
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, "wb") as f:
                    f.write(png)
                return f"ok [{model}]: {path}"
            except urllib.error.HTTPError as e:
                detail = e.read().decode()[:200]
                last_err = f"{model} HTTP {e.code}: {detail}"
                # 400/403 on gpt-image-1 usually means no access -> try dall-e-3
                if e.code in (400, 401, 403):
                    break
                time.sleep(8 * attempt)
            except Exception as e:  # network hiccup etc.
                last_err = f"{model}: {e}"
                time.sleep(8 * attempt)
    return f"FAILED {slug}: {last_err}"


def main() -> None:
    manifest_path = sys.argv[1] if len(sys.argv) > 1 else "manifest_2026.json"
    with open(manifest_path) as f:
        manifest = json.load(f)
    outdir = os.path.join(os.path.dirname(os.path.abspath(manifest_path)),
                          manifest.get("outdir", "."))
    key = load_key()
    items = manifest["items"]
    print(f"Generating {len(items)} images -> {outdir}")
    with ThreadPoolExecutor(max_workers=3) as pool:
        futures = {pool.submit(generate, key, it, outdir): it["slug"] for it in items}
        for fut in as_completed(futures):
            print(f"  {fut.result()}", flush=True)
    print("done.")


if __name__ == "__main__":
    main()
