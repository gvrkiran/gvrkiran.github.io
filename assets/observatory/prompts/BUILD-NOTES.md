# Observatory media build notes

The Observatory uses five GPT Image keyframes, five Higgsfield Seedance 2.0 Mini camera legs, and one targeted connector repair. It has no audio and no separate mobile video render.

## Visual direction

The selected B+C direction combines a terracotta architectural cutaway with a nocturne observatory palette: Rutgers-inspired red brick, warm ivory stone, deep navy night, aged brass, dark wood, restrained scarlet and signal-teal information trails, and museum-quality handcrafted miniature realism. Every image keeps a central forward passage so the camera can travel continuously from room to room. No text or logos are baked into the images.

## Keyframes

1. Orrery Atrium — arrival and profile
2. Signal Lab — research and projects
3. Evidence Archive — publications
4. Question Foundry — teaching and mentoring
5. Public Commons — tools, comics, advice, writing, and contact

The source PNGs and web-ready WebP posters live in `assets/observatory/stills/`.

## Video chain

All five clips were rendered at 1280×720, 24 fps, 5 seconds, without audio. Each prompt required one continuous forward move, no cuts, no teleporting, and a slow final drift suitable for scroll scrubbing. The preceding clip's actual last frame was used as the next clip's start image.

| Leg | Higgsfield job | Transition |
| --- | --- | --- |
| 01 | `b85e51ef-544e-4a00-980a-15d3f972d77c` | Orrery Atrium → Signal Lab |
| 02 | `079a573a-4eb9-428f-9224-3abb14cf6955` | Signal Lab → Evidence Archive |
| 03 | `7f9bd0b1-6315-45d5-b360-6da5759fefce` | Evidence Archive → Question Foundry |
| 04 | `a16ba007-04be-4bbc-88a4-efac75680a40` | Question Foundry → Public Commons path |
| 05 | `9475b303-1945-46a2-a3a1-c03338477525` | Public Commons → dawn skyline finale |

Each leg cost 12.5 credits, for an initial 62.5 Higgsfield credits. A frame audit found that the first three seams were exact but the Teaching → Other handoff jumped from the garden path to a different doorway composition. One start-and-end-frame-locked connector (`f2ab65d1-3fd0-4fca-84b2-89141efaa8d5`) repaired that physical passage for 12.5 additional credits, bringing the final total to 75 credits.

The deployment encodes use H.264, CRF 20, GOP 8, `yuv420p`, `faststart`, and no audio. Raw clips and seam-QA frames are retained locally next to the encoded assets for future iteration.

The Projects leg contained two model-generated internal jumps near 1.4s and 3.7s. The deployed `02-signal-lab-iris.mp4` replaces both with brief circular doorway wipes. Unlike the earlier blurred repair, every visible frame remains crisp, and the final frame still matches the Publications clip's opening composition.

## Runtime choices

- Desktop: scroll-scrubbed video, loaded just before each room is reached.
- Mobile and reduced-motion: lightweight WebP posters only.
- The standalone entry point is `observatory.html`. It is also registered as theme 27 (`3D Observatory`) in the main site's refresh rotation and theme picker.
- Room portals embed only the selected page content. Their original site headers and footers are suppressed, while compact return/full-page controls float over the upper-right corner.
