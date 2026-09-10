# Publications — Astra edition

Open `publications-cave-astra.html`. This edition uses `data.js` and the existing
connected H3 films and stills in `assets/archive-below`.

## Interaction

- Enter cave: play the entrance journey to the first junction.
- Map & navigation, Open map, or M: preview and travel to any of five junctions
  or eighteen publication years. The persistent junction panel opens that junction
  in the map. Travel follows the connected passages in either direction.
- Scroll, W/S, or up/down: take over camera movement. Play resumes it.
- Select a year at a junction: follow its passage to the first visible papers.
- Click a paper object or its numbered scene button to open publication details.
- The permanent numbered paper bar opens every paper in the year, including
  papers outside the camera view. Expand the bar to browse their titles.
- Back to year selection / Escape: retrace the gallery and branch.
- Publications: search all 117 entries, including unpublished work.
- Reduced motion: still junction previews and direct access to the publication list.

## Files

- `astra.css`: Saira Condensed / IBM Plex typography, layout, map, responsive UI.
- `engine.js`: connected video playback, manual seeking, frame-synchronized targets.
- `tracking.js`: independent object tracks, reviewed geometry corrections,
  polygon hit testing, and duplicate detection suppression.
- `astra.js`: map, junction and year routing, paper shelf, search, particles.

Runtime dependencies include `data.js`, the original segmentation JavaScript,
`assets/archive-below/stills/graph/`, the entrance still, and the original videos.
Include those when deploying this edition. The source cave page is unchanged.

## Tracking and verification

The original detector sometimes loses objects, combines light or floor regions
with a tablet, or assigns two paper IDs to the same object. This edition keeps
fragments separate, filters low-confidence detections, uses the actual displayed
video frame, and applies reviewed corrections for 2012, 2014, and 2022.
Scene buttons are 44 pixels, spaced apart, and moved away from interface panels.
All papers remain accessible through the numbered paper bar, including 2020's
paper 10, whose original detector track points to an edge crystal rather than
a publication tablet. On narrow screens some objects are outside the film crop.

Run the geometry audit from the repository root:

```sh
node assets/archive-astra/tools/audit-tracking.cjs
```

## Local preview

```sh
python3 assets/archive-below/tools/serve_archive.py --port 8137
```

Visit http://127.0.0.1:8137/publications-cave-astra.html. Byte-range support is
necessary for efficient manual video seeking.
