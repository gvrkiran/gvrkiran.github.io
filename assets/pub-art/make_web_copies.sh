#!/bin/sh
# Convert originals/*.png (1024px, gitignored) to papers/*.webp (720px, served).
# Skips files whose webp already exists; delete a webp to redo it.
cd "$(dirname "$0")" || exit 1
mkdir -p papers
n=0
for f in originals/*.png; do
  slug=$(basename "$f" .png)
  [ -f "papers/$slug.webp" ] && continue
  cwebp -quiet -q 82 -resize 720 0 "$f" -o "papers/$slug.webp" && n=$((n+1))
done
echo "converted $n new image(s); papers/ now has $(ls papers | wc -l | tr -d ' ') files"
