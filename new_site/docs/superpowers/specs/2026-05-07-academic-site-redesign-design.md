# Academic Site Redesign — Design Spec

**Date:** 2026-05-07
**Author:** Kiran Garimella (with Claude)
**Project root:** `/Users/kgarimella/Documents/personalWebpage/gvrkiran.github.io/new_site/`

## Goal

Replace Gemini's earlier 10-theme attempt with a redesign that feels professional, creative, and unpredictable. On every page load a different theme is chosen at random. The face-tracker portrait — the user's signature visual element — appears in every theme, and dark mode swaps it for the sunglasses variant. The result must satisfy two simultaneous constraints that often pull apart: a tenured-academic level of polish, and a designer-portfolio level of variety.

## Non-Goals

- Not a CMS. Content lives in `data.js`, edited by hand.
- Not a multi-page application. Home is one scrollable page; `publications.html` is the only deep page.
- Not a server-side app. All static. Hostable on GitHub Pages or any plain webserver.
- Not retaining: background videos, scroll-driven video, the existing Gemini stylesheet/themes.
- Not generating photorealistic AI portraits of the user. Real photo + filters only.

## Architecture: Shared Content + Theme-Controlled Layout Variants

Approach **B** from brainstorming. One source of truth for content (`data.js`), one DOM scaffold of universal sections, and a theme system that controls:

1. **Layout primitive** — which of 4 grid layouts the hero/section blocks use.
2. **Typography stack** — display, heading, body fonts.
3. **Color palette** — light and dark modes (each designed, not auto-inverted).
4. **Decoration vocabulary** — borders, shadows, textures, accents, ornaments.
5. **Face-tracker frame** — how the portrait is presented inside the theme's visual language.

A theme is a self-contained module: a CSS file (variables + theme-specific overrides) plus optional JS hooks for theme-specific behavior (e.g. the WebGL particle field in Theme 10). The base CSS provides layout primitives and resets; themes ride on top.

### Layout primitives

| ID | Name | Used by themes |
|----|------|---------------|
| L1 | Centered single column | Reading Room, Whitebox, Dither |
| L2 | Asymmetric two-column | Notebook, Risograph, Specimen |
| L3 | Magazine grid | Editorial, Brutalist Print |
| L4 | Full-bleed hero with overlay | Glitch, Particle Field |

Each primitive is a CSS Grid template the sections snap into. Themes do not invent new layouts; they pick one.

## Universal Elements (in every theme)

### Top navigation
Five items, in this order:

```
About · Publications · Projects · Teaching · Other
```

Plus a dark/light toggle on the right. Anchor-scrolls within the home page; "Publications" additionally has a "see all →" link inside the section that leads to `publications.html`.

The nav is themed (different bar style per theme: floating top-right, full-width band, sidebar in some) but always present, always legible, never overlapping content.

### Sections (in this order on the home page)
1. **Hero** — intro line, role, face-tracker, **quick-links bar (Email · CV · LinkedIn · Twitter · Scholar)**, optional marquee
2. **About** — bio paragraph, keywords, location, current role
3. **Projects** — current research agenda, 3–5 cards from `PROJECTS`
4. **Publications** — featured/recent papers preview + link to full `publications.html`
5. **Teaching** — current courses, link to `teaching.html`
6. **Other** — blog (Substack), talks/press, GitHub, contact block (CV and the four primary socials are already in the hero quick-links bar; this section is the deeper drawer)

### Quick-links bar (above the fold)
Five links rendered in the hero, visible on first load before any scroll:

```
Email · CV · LinkedIn · Twitter · Scholar
```

Sourced from `PROFILE.email`, `PROFILE.cvUrl`, `PROFILE.socials.linkedin`, `PROFILE.socials.twitter`, `PROFILE.socials.scholar` in `data.js`. (GitHub remains available in the "Other" section but is not in the prominent bar.)

Each theme styles this bar in its own decoration vocabulary — pill buttons in Whitebox/Particle Field, inline `·`-separated serif links in Reading Room/Editorial, hard-edged offset boxes in Brutalist Print, hand-drawn ovals with masking-tape-corner SVGs in Notebook, RGB-split mono labels in Glitch, dithered Mac OS push-buttons in Dither, type-specimen cells in Specimen, riso-grain stamps in Risograph. The links are always present, always above the fold, always clickable.

### Face-tracker (the constant signature)
- Cursor-following gaze, using the existing `faces/gaze_*.webp` set.
- On dark-mode toggle, the image source switches to `faces_with_sunglasses/gaze_*.webp`. Same gaze logic, sunglasses ON.
- Each theme controls only the **frame** (size, border, filter, position). The tracking + sunglasses-swap behavior is theme-independent shared JS.
- Smooth swap on toggle (cross-fade, ~200ms) so it feels like the user puts on sunglasses, not like the image hard-cuts.

### Dark/light toggle behavior
- Independent of the random theme — toggle persists in `localStorage` as a separate key.
- Default mode on first visit follows `prefers-color-scheme`.
- Each theme has both modes designed by hand (not algorithmically inverted).

### Theme rotation
- On reload, pick a theme uniformly at random from 1–10 **excluding** the previously-shown one (recorded in `localStorage` as `last_theme`).
- Footer subtly displays the current theme name and number ("designed in: Editorial · #5 of 10").
- Pressing `?` opens a small overlay with the theme list and a "shuffle" button to preview specific themes without reloading. Useful for the user to inspect work; not a primary user feature.

## The 10 Themes

Three restrained, three designerly, four flashy. Each has a defined palette, type stack, layout primitive, decoration vocabulary, and face-tracker treatment.

**Font policy:** font names below are the *target reference* for the theme's flavor. Where a paid foundry font is named (Söhne, Reckless, GT Sectra, ChicagoFLF), we ship a Google-Fonts free equivalent that hits the same character. Mappings are listed in the implementation plan, not here. No paid fonts are loaded in production.

### 1. Reading Room *(restrained, A)*
- **Layout:** L1 centered single column, ~62ch wide
- **Type:** EB Garamond body, small caps for headings, single accent weight
- **Palette light:** off-white #fbfaf6, ink #1a1a1a, accent #6b1d1d (oxblood)
- **Palette dark:** ink #15140f, paper #ece7d8, accent #c98a8a
- **Decoration:** drop caps, thin horizontal rules, no shadows, no gradients
- **Face frame:** small grayscale circle (96px) at top, like a paper masthead portrait
- **Marquee:** none
- **Vibe:** Scott Aaronson, Tim Berners-Lee. Pure type. Whitespace is the design.

### 2. Whitebox *(restrained, A)*
- **Layout:** L1 centered single column, ~70ch wide
- **Type:** Inter (400/600/800), tight tracking on display sizes
- **Palette light:** #ffffff, near-black #0b0b0d, single accent #1d4ed8 (cobalt)
- **Palette dark:** #0a0a0c, #f5f5f7, accent #93c5fd
- **Decoration:** hairline 1px borders, generous spacing, no shadows
- **Face frame:** clean square 120px, hairline border, top-right of hero
- **Vibe:** Stripe Press, Linear changelog. Confident restraint.

### 3. Notebook *(restrained-leaning, A/B)*
- **Layout:** L2 asymmetric two-column, narrow text column + wider margin notes
- **Type:** Source Serif body + JetBrains Mono for margin notes/captions
- **Palette light:** cream #f4ecd8, ink #2d2a26, red pen #b3322c
- **Palette dark:** worn-leather #2a241d, cream type #f0e6cf, accent #e89b88
- **Decoration:** subtle paper noise texture, hand-drawn SVG arrows from margin to body, underlines that look pen-drawn (rough.js-style), occasional doodle SVG ornament
- **Face frame:** polaroid taped to the page — white border, masking-tape SVG corners, ~3° rotation
- **Marquee:** a slow scrolling "field notes" ticker with recent updates
- **Vibe:** Robin Sloan, researcher's lab notebook.

### 4. Risograph *(designerly, B)*
- **Layout:** L2 asymmetric two-column
- **Type:** Söhne or Manrope display + serif body (PT Serif)
- **Palette light:** off-white #f5f1ea + riso fluoro red #ff5454 + riso cobalt #2c50e0 (mix produces warm purple where overlapped)
- **Palette dark:** charcoal #1c1a16 + same two riso accents at higher saturation
- **Decoration:** SVG grain overlay (3–5% opacity), slightly off-register colored shapes, halftone dots, thick ink edges
- **Face frame:** 2-color riso duotone of the portrait (CSS `mix-blend-mode: multiply` of two color layers), grain texture on top
- **Hero image:** AI-generated riso-style abstract editorial illustration (1024×1024)
- **Vibe:** Ken Garland, contemporary indie poster shop.

### 5. Editorial *(designerly, B)*
- **Layout:** L3 magazine grid, 12-col with multi-col body in About section
- **Type:** Fraunces (variable optical-size) for display, Inter for body
- **Palette light:** ivory #f8f5ee, ink #14110d, accent gold #b08a3a
- **Palette dark:** deep aubergine #1d1518, paper #f5ecdf, accent #d6b56a
- **Decoration:** drop caps (Fraunces 9pt opsz), folio numbers next to sections, hairline column rules, justified body text in About, masthead-style header
- **Face frame:** large featured portrait (320–420px) with editorial caption ("Kiran Garimella, photographed at Rutgers, 2026") and a folio number
- **Hero image:** AI-generated wide editorial-style abstract image as section divider (1536×640 if API supports, else 1024×1024 cropped)
- **Vibe:** NYT Magazine, Stripe Press author page.

### 6. Specimen *(designerly, B)*
- **Layout:** L2 asymmetric, but the entire hero is treated as a typographic specimen sheet
- **Type:** Inter Variable (we drive `font-variation-settings` for live wght/slnt animation), display only at giant sizes
- **Palette light:** white, type-black #0a0a0a, accent magenta #e6007a
- **Palette dark:** type-white #f5f5f5, deep blue-black #060914, accent #7df9c1
- **Decoration:** large numerals next to sections (01, 02, 03), specimen-page metadata (axis values, tracking, leading) shown as small captions, type slowly animates wght axis 400→800 over 6s
- **Face frame:** one cell in a 4×3 typographic grid — same dimensions as the glyphs around it
- **Vibe:** Klim, Pangram Pangram, Grilli Type catalog.

### 7. Brutalist Print *(flashy, C)*
- **Layout:** L3 magazine grid with thick black gridlines visible
- **Type:** Reckless or GT Sectra (slab/wedge serif) display + Inter body
- **Palette light:** newsprint #efece4, ink #050505, accent chartreuse #d4ff00
- **Palette dark:** asphalt #0c0c0c, newsprint #efece4, accent #ff3b00
- **Decoration:** 4–6px black borders on every block, hard offset shadows (8–12px solid black), oversized section numbers, all-caps small caption labels, no soft edges anywhere
- **Face frame:** hard-edged box with thick black border and 12px solid offset shadow, oversized
- **Hero image:** AI-generated typographic poster element (1024×1024)
- **Vibe:** Pentagram brutalism, Wim Crouwel — confident, never messy.

### 8. Dither *(flashy, C)*
- **Layout:** L1 centered single column
- **Type:** ChicagoFLF or Chicago-style fallback (system) for headings, Inter for body, monospace for OS chrome
- **Palette light:** classic Mac white #ffffff, near-black #1d1d1d, accent #4a4a4a
- **Palette dark:** terminal black #0a0a0a, phosphor white #e8e8e8 (intentionally cool, no warmth), accent #aaaaaa
- **Decoration:** 1-bit dithered patterns, scanline overlay (1px every 3px @ 5% opacity), classic Mac OS window chrome around sections
- **Face frame:** the portrait passes through a Bayer-dither shader (canvas) to render as 1-bit black/white, framed in a classic Mac window with title bar "kiran.bmp"
- **Vibe:** System 7, Susan Kare. Retro but tight, not kitsch.

### 9. Glitch / Neon *(flashy, D)*
- **Layout:** L4 full-bleed hero with overlay content
- **Type:** Space Mono + Syne for display
- **Palette light:** rarely seen — even in light mode this theme leans dark; off-black #111114, near-white #f1f1f1, neon accent #00e6ff + #ff007a
- **Palette dark:** void #050507, signal cyan #00e6ff, hot magenta #ff007a, occasional lime #adff2f
- **Decoration:** glitch text shadows (RGB split), CRT scanline overlay, thin animated noise gradient, marquee strip with keywords scrolling
- **Face frame:** RGB-split layered portrait with subtle jitter on hover, magnetic to cursor (slight parallax)
- **Vibe:** Active Theory, FWA-tier homepage. The "flashy" theme done well.

### 10. Particle Field *(flashy, D)*
- **Layout:** L4 full-bleed hero
- **Type:** Inter for everything; type stays calm to let the canvas do the work
- **Palette light:** cool white #fafbfd, ink #0a0e1a, particle color #2563eb at 30% alpha
- **Palette dark:** deep space #050a14, paper #e6ecf5, particle color #93c5fd at 60% alpha
- **Decoration:** full-bleed canvas with a flow-field particle system reacting to cursor (Perlin noise field driving particle velocity, ~3000 particles, additive blending, soft trails)
- **Face frame:** centered 200px portrait with a soft glow rim; particles flow around (avoid) the portrait region, giving it gravitational presence
- **Vibe:** Bruno Simon's portfolio, Active Theory — restrained version. Calm motion, not seizure-inducing.

## Where Existing Gimmicks Live

| Gimmick | Status | Where |
|---------|--------|-------|
| Face tracker | Universal | All 10 themes |
| Sunglasses-on-dark-mode swap | Universal | All 10 themes |
| Marquee text | Selective | Themes 3 (Notebook), 9 (Glitch), 5 (Editorial — masthead-style) |
| Background videos | Removed | None |
| Scroll-driven video | Removed | None |
| Glitch text effect | Selective | Theme 9 only |
| WebGL/canvas | Selective | Themes 8 (dither shader), 10 (particle field) |

## File Structure

```
new_site/
├── index.html                 # single home page, content scaffold
├── publications.html          # full publications list, theme-aware (uses theme CSS variables)
├── projects.html              # legacy — kept but redirected/embedded into home; decide at impl time
├── teaching.html              # legacy — kept but redirected/embedded into home; decide at impl time
├── data.js                    # PROFILE / KEYWORDS / PROJECTS / PUBLICATIONS / TEACHING (existing, kept)
│
├── css/
│   ├── base.css               # reset, typography baseline, layout primitives L1–L4, universal nav, face-tracker frame slot
│   ├── tokens.css             # CSS custom properties consumed by themes
│   └── themes/
│       ├── 01-reading-room.css
│       ├── 02-whitebox.css
│       ├── 03-notebook.css
│       ├── 04-risograph.css
│       ├── 05-editorial.css
│       ├── 06-specimen.css
│       ├── 07-brutalist-print.css
│       ├── 08-dither.css
│       ├── 09-glitch.css
│       └── 10-particle-field.css
│
├── js/
│   ├── theme-engine.js        # random theme picker, CSS file loader, footer/keyboard shortcut wiring
│   ├── face-tracker.js        # cursor-binned gaze image swap + sunglasses-on-dark logic
│   ├── nav.js                 # nav rendering, anchor scrolling, mobile menu
│   ├── content.js             # populates sections from data.js
│   ├── theme-09-glitch.js     # marquee + RGB-split parallax (loaded only when theme 9 is active)
│   ├── theme-10-particles.js  # canvas flow-field (loaded only when theme 10 is active)
│   └── theme-08-dither.js     # canvas Bayer dither of portrait (loaded only when theme 8 is active)
│
├── assets/
│   ├── faces/                 # existing — gaze webps
│   ├── faces_with_sunglasses/ # existing — gaze webps with sunglasses
│   ├── kiran_img.png          # existing headshot (referenced from parent dir or copied in)
│   ├── ai/
│   │   ├── 04-risograph-hero.png
│   │   ├── 05-editorial-hero.png
│   │   └── 07-brutalist-poster.png
│   └── ornaments/             # SVG ornaments per theme (notebook arrows, brutalist rules, etc.)
│
├── scripts/
│   └── generate_ai_images.py  # one-off script using OPENAI_API_KEY env var → writes assets/ai/
│
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-05-07-academic-site-redesign-design.md   # this file
```

The legacy files at the repo root (`main.js`, `styles.css`, `scroll-video.js`, `video1.mp4`, `video2.mp4`, `video3.mp4`, `back_video2.mp4`, `back_video3.mp4`) will be moved to `old/` rather than deleted, so the user can roll back. The implementation plan handles the cutover.

## AI Image Generation

A one-off Python script (`scripts/generate_ai_images.py`) using `OPENAI_API_KEY` from the environment. Generates the 3 needed images:

| Filename | Theme | Prompt sketch |
|---------|-------|--------------|
| `04-risograph-hero.png` | Risograph | "2-color risograph print poster, fluoro red and cobalt, off-register, abstract editorial composition with geometric shapes representing networks and information flow, grain texture, white margin" |
| `05-editorial-hero.png` | Editorial | "Wide-format abstract editorial illustration, ivory and gold palette, serif-magazine sensibility, evoking research and global communication, subtle textures, no text" |
| `07-brutalist-poster.png` | Brutalist Print | "Brutalist Swiss-poster typographic composition, all-caps wedge serif, chartreuse on newsprint, hard offsets, geometric forms, 1970s academic poster sensibility, no readable words" |

All saved to `assets/ai/`. The script is idempotent: it skips files that already exist. We commit the generated PNGs to the repo so reloading doesn't re-call the API.

If `OPENAI_API_KEY` is unavailable at implementation time, the implementation falls back to placeholder SVG patterns and the affected themes still ship.

## Behavior Specifications

### Theme rotation algorithm
```
on page load:
  last = localStorage.getItem('last_theme')   // string '1'..'10' or null
  candidates = [1..10] minus last (if present)
  pick = uniform random from candidates
  localStorage.setItem('last_theme', pick)
  document.documentElement.setAttribute('data-theme', pick)
  load corresponding CSS file (and theme JS if applicable)
```

### Dark/light toggle
```
on toggle click:
  mode = current === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-mode', mode)
  localStorage.setItem('mode', mode)
  face-tracker swaps source folder (faces ↔ faces_with_sunglasses) with cross-fade
```

On first visit, `mode` follows `window.matchMedia('(prefers-color-scheme: dark)')`.

### Face tracker
- On `mousemove` (throttled to ~30fps), compute bin coordinates from cursor position relative to viewport center.
- Map to closest available `gaze_pxX_pyY_256.webp` filename.
- Set `<img src>` to `faces/<filename>` if light, `faces_with_sunglasses/<filename>` if dark.
- Preload the 8 most-likely-next images on idle to avoid flicker.

### Keyboard shortcut
- `?` opens a small panel listing the 10 themes; click to apply (no reload). Press Esc to close.

### Mobile
- Nav collapses to a hamburger or bottom-bar (theme decides).
- Face tracker still works (it tracks touch/scroll position on mobile, with a gentle drift fallback when no input).
- Particle field theme (10) reduces particle count to ~800 on small screens; falls back to static image on `prefers-reduced-motion`.
- All themes pass `prefers-reduced-motion`: marquee → static, particles → static, glitch jitter → off.

## Quality Bar (the "do a good job" criteria)

Every theme must pass these checks before shipping:

1. **Type pairings are deliberate.** No system-font fallbacks visibly used; no overlapping/clipped text at any common viewport (320, 768, 1024, 1440, 1920).
2. **Both modes are hand-designed.** Dark mode is not algorithmic inversion. Each theme has its own dark-mode palette tested for contrast (WCAG AA on body text minimum).
3. **Face-tracker frame feels native.** It is integrated into the theme's design language — not a generic webp pasted into a styled page.
4. **Nav is always elegant and never overlapping content.** It is themed. It is legible in both modes. Contact, Pubs, etc. links never clip.
5. **No layout shift on theme load.** The theme CSS loads before first paint; no flash-of-unstyled-content.
6. **Decoration vocabulary is consistent within a theme.** If a theme uses hard offsets, every shadow is hard. If it uses hairlines, every border is a hairline. No mix.
7. **Performance budget**: Initial HTML+CSS+critical JS < 60KB gzipped. AI images served as compressed PNG (or WebP if supported), each ≤ 250KB. Particle theme initializes in < 200ms on 2019-class hardware.

## Open Questions / Decisions to Defer to Implementation

- Whether to keep the legacy `projects.html` and `teaching.html` as separate pages or merge into the home page entirely. Likely merge into home and remove the legacy pages, but verify with the user during implementation.
- Final selection of riso/editorial/brutalist AI image prompts — iterate during implementation.
- Whether the marquee in Editorial (theme 5) reads as "masthead style" — may simplify to no marquee if it competes with the magazine grid.

## Out of Scope

- Analytics, A/B testing, theme preference persistence beyond `last_theme` and `mode`.
- Automated screenshot/visual regression testing of all 10 themes.
- A mechanism for the user to author new themes through a UI.
- Server-side rendering or pre-rendering.
