# Ten New Templates — Implementation Plan

**Date:** 2026-07-05
**Target:** repo root (the live GitHub Pages site), NOT `new_site/`
**Deliverable:** themes 11–20 added to the existing reload-rotation, existing themes 1–10 untouched and fully working
**Audience:** this document is written for an AI model (or developer) executing the work. It assumes no prior context. Follow it phase by phase, in order.

---

## 0. How to use this document

- Execute phases in order: Phase 0 (safety) → Phase 1 (engine) → Phase 2 (conventions) → Phase 3 (the ten themes, one at a time) → Phase 4 (QA).
- After **every** theme you build, run the regression spot-check in §4.2 before moving on. The single most important requirement is that the ten existing themes keep working.
- Each theme in Phase 3 has: a concept, art direction, exact file list, implementation notes with specific techniques, per-device degradation tiers, and acceptance criteria. Do not ship a theme that fails its acceptance criteria; it is better to simplify an effect than to break the page.
- Commit after each theme with message `theme NN: <slug>`. Do not batch all ten into one commit.
- Budget guidance: themes are ordered easiest-first inside §3.14 so you get wins early. If you must cut scope, cut the "stretch" items marked ⭐ inside each theme spec, never the core.

---

## 1. Current architecture (facts, verified 2026-07-05)

### 1.1 Files that make up the theme system

| File | Role |
|---|---|
| `index.html` | Homepage. Fixed DOM skeleton: `.nav-bar`, hero (`.hero-section` with `.hero-bg`, `#heroName`, `#heroRole`, `#heroTagline`, `#quickLinks`, `#faceFrame`/`#faceImg`), then sections `#about`, `#projects`, `#publications`, `#teaching`, `#other` (each `section.section[data-section]` with `.section-heading` + `.section-body`), footer with `#themeName`, theme-picker overlay `#themePicker`. |
| `publications.html`, `tools.html`, `advice.html`, `comic.html` | Subpages that also load the theme engine. They have their own content markup but share nav/footer patterns. `teaching.html` exists but does NOT load the theme engine. |
| `js/theme-engine.js` | Runs synchronously in `<head>`. Picks a random theme 1–10 on reload (excluding `localStorage.last_theme`), keeps the theme across in-session navigation via `sessionStorage.current_theme`, honors `?theme=N` and `localStorage.forced_theme`. Sets `<html data-theme data-layout data-mode>`, injects `css/themes/NN-slug.css`, lazy-loads per-theme JS after DOMContentLoaded (currently hardcoded for themes 8/9/10), wires the dark-mode toggle, footer label, and the `?`-key theme picker. Exposes `window.__theme` (`THEMES`, `current`, `setMode`, `getMode`, `forceTheme(n)`, `clearForce`). |
| `css/tokens.css` | The theme contract: CSS custom properties every theme overrides (`--color-bg/fg/heading/accent/accent-2/muted`, `--font-display/heading/body/mono`, `--font-size-body`, `--line-height-body`, `--heading-tracking`, `--space-unit`, `--face-size`, `--btn-radius`, `--card-radius/bg/border/shadow`, `--nav-bg`, `--nav-backdrop`). Also defines the default dark-mode values under `html[data-mode="dark"]`. |
| `css/base.css` | Reset, the four layout primitives (`[data-layout="L1"]` narrow centered column, `L2` 2-column grid, `L3` 12-column grid, `L4` full-viewport hero with `.hero-bg` canvas layer), universal nav/footer/card/face-frame/picker styles, `prefers-reduced-motion` global kill-switch. |
| `css/themes/01…10-*.css` | One file per theme. Scoped with `html[data-theme="N"]` prefixes. Override tokens + add theme-specific decoration. |
| `js/theme-08-dither.js`, `js/theme-09-glitch.js`, `js/theme-10-particles.js` | Per-theme effect scripts. Pattern: IIFE, first lines bail out if `data-theme` doesn't match or `prefers-reduced-motion` is set or required DOM (`.hero-bg`) is absent. |
| `data.js` | All content: `window.PROFILE`, `KEYWORDS`, `HIGHLIGHTS`, `PROJECTS`, `PUBLICATIONS` (~large array with `{title, authors[], venue, year, links[], award?}`-shaped objects — read the file to confirm exact fields before using them), `TEACHING`, `TALKS`, `PRESS`. |
| `js/content.js` | Renders `data.js` into the section bodies on the homepage. Also adds folio numbers for themes 5/6 (note this existing pattern of small per-theme hooks; do not extend content.js for new themes — see §2.3). |
| `js/face-tracker.js` | Cursor-gaze portrait. Swaps `#faceImg` src across a grid of pre-rendered gaze images in `faces/` and `faces_with_sunglasses/` depending on cursor position and `data-mode`. |
| `js/nav.js` | Builds nav links. |

### 1.2 Existing themes (do not duplicate their territory)

1 Reading Room (bookish serif), 2 Whitebox (minimal), 3 Notebook (ruled paper), 4 Risograph (print grain), 5 Editorial (magazine), 6 Specimen (type specimen), 7 Brutalist Print, 8 Dither (1-bit retro), 9 Glitch (neon RGB-split), 10 Particle Field (flow-field canvas).

Already-covered aesthetics: print/editorial, retro-digital, neon-glitch, generic particles. The ten new themes go where these don't: **materials and light** (glass, foil, ink, paper), **the user's own research data as the visual** (star maps of publications), **spatial/immersive metaphors** (museum, OS desktop, map), and **concept pieces** (web-history time travel).

### 1.3 Load order and failure behavior

`theme-engine.js` runs before body paint; if a theme CSS file 404s, the page still renders with `tokens.css` defaults (plain but readable). `content.js` is independent of the theme engine, so content always renders even if a theme script throws. Preserve both properties: **a broken theme file must never blank the page.**

### 1.4 Fonts

`index.html` (and subpages) already load: EB Garamond, Fraunces, Inter, JetBrains Mono, Manrope, PT Serif, Source Serif 4, Space Grotesk, Space Mono, Syne. **Do not edit the `<link>` tags.** If a new theme needs another family, put `@import url('https://fonts.googleapis.com/css2?family=…&display=swap');` as the first line of that theme's own CSS file. Cost is only paid when that theme is active. Keep new imports to at most one family per theme; prefer the already-loaded list.

---

## 2. Non-negotiable invariants

1. **Additive only.** New themes are new files: `css/themes/11…20-*.css` and `js/theme-NN-*.js`. The only shared files you may edit are `js/theme-engine.js` (Phase 1) and `css/base.css` (append-only, at the bottom, clearly commented). Never edit `index.html`, `content.js`, `data.js`, `face-tracker.js`, `nav.js`, `tokens.css`, or any `css/themes/01–10` file.
2. **Backups exist; keep them intact.** `backup_theme_system_2026-07-05/` holds a pre-change snapshot of every theme-system file. Do not modify or delete it. Additionally, commit the current git state before your first change (`git add -A && git commit -m "checkpoint before theme 11-20 work"`) so `git diff` cleanly shows everything you did.
3. **Existing themes must keep working.** After each theme lands, spot-check `?theme=2` and `?theme=9` per §4.2.
4. **The DOM contract is read-only.** Theme JS may *append* new elements (inside `.hero-bg`, or as new children of `body` with a `t{NN}-` class prefix, e.g. `t16-desktop`) and may *move* existing nodes only if it restores them on failure (only theme 16 does this, with the required try/catch). Theme JS must never delete existing nodes or rewrite `innerHTML` of content containers.
5. **Every theme works at four tiers:**
   - **Desktop full:** the complete experience, 60fps target.
   - **Mobile lite (≤760px):** heavy canvases/WebGL replaced by static or cheap CSS equivalents; touch replaces hover.
   - **Reduced motion:** `prefers-reduced-motion: reduce` → no animation, effects rendered in their final static state. `base.css` already kills CSS animation globally; each theme *script* must also check and bail (copy the guard from `js/theme-10-particles.js`).
   - **No JS:** the page must remain readable and navigable with theme CSS alone. Test by commenting out the script tag mentally: does the CSS alone still produce a decent page? Design each theme CSS so the answer is yes.
6. **Both modes.** Every theme styles `data-mode="light"` and `data-mode="dark"`. Dark is not an afterthought; each spec below defines what dark mode means for that theme.
7. **Subpages degrade gracefully.** Theme scripts key their heavy features off the presence of homepage-only DOM (`.hero-bg`, `#faceFrame`). On `publications/tools/advice/comic.html` the theme should deliver its palette, typography, card styling, and light decoration only.
8. **Performance budget.** Per-theme CSS ≤ 25KB, per-theme JS ≤ 40KB (exception: theme 16 ≤ 60KB; Three.js for theme 11 self-hosted at `js/lib/three.module.min.js`, loaded only by theme 11 via dynamic `import()`). Canvas/WebGL loops must pause when their container is offscreen (IntersectionObserver) and on `document.visibilitychange`.
9. **No external runtime dependencies** except Google Fonts and the self-hosted Three.js module. No CDNs for JS.
10. **Escape hatch.** The `?` key already opens the theme picker on every theme; verify it still works on each new theme (especially 16 and 18, which capture pointer/keyboard attention). Immersive themes must additionally handle `Escape` to defuse their most intrusive effect (documented per theme).

---

## Phase 0 — Safety net (mostly done, verify)

- [x] Folder snapshot `backup_theme_system_2026-07-05/` (already created — verify it exists and contains `css/themes/*.css`, `js/*.js`, the five theme-enabled HTML files, `data.js`).
- [ ] Git checkpoint commit as described in §2.2.
- [ ] Start a local server for testing: `python3 -m http.server 8000` from repo root (required — `file://` breaks localStorage/fetch semantics). All manual testing happens at `http://localhost:8000/?theme=NN`.

---

## Phase 1 — Theme engine v2

Edit `js/theme-engine.js` only. Behavior for themes 1–10 must remain byte-for-byte identical in effect.

### 1a. Generalize the theme table

Add a `js` field (per-theme lazy script path, replacing the hardcoded 8/9/10 ternary) and append the ten new rows:

```js
const THEMES = [
  { n: 1,  slug: 'reading-room',    name: 'Reading Room',    layout: 'L1' },
  { n: 2,  slug: 'whitebox',        name: 'Whitebox',        layout: 'L1' },
  { n: 3,  slug: 'notebook',        name: 'Notebook',        layout: 'L2' },
  { n: 4,  slug: 'risograph',       name: 'Risograph',       layout: 'L2' },
  { n: 5,  slug: 'editorial',       name: 'Editorial',       layout: 'L3' },
  { n: 6,  slug: 'specimen',        name: 'Specimen',        layout: 'L2' },
  { n: 7,  slug: 'brutalist-print', name: 'Brutalist Print', layout: 'L3' },
  { n: 8,  slug: 'dither',          name: 'Dither',          layout: 'L1', js: 'js/theme-08-dither.js' },
  { n: 9,  slug: 'glitch',          name: 'Glitch',          layout: 'L4', js: 'js/theme-09-glitch.js' },
  { n: 10, slug: 'particle-field',  name: 'Particle Field',  layout: 'L4', js: 'js/theme-10-particles.js' },
  { n: 11, slug: 'vitrine',         name: 'Vitrine',         layout: 'L4', js: 'js/theme-11-vitrine.js' },
  { n: 12, slug: 'observatory',     name: 'Observatory',     layout: 'L4', js: 'js/theme-12-observatory.js' },
  { n: 13, slug: 'popup',           name: 'Pop-Up',          layout: 'L1', js: 'js/theme-13-popup.js' },
  { n: 14, slug: 'ink',             name: 'Ink',             layout: 'L4', js: 'js/theme-14-ink.js' },
  { n: 15, slug: 'holofoil',        name: 'Holofoil',        layout: 'L2', js: 'js/theme-15-holofoil.js' },
  { n: 16, slug: 'desk-os',         name: 'Desk OS',         layout: 'L1', js: 'js/theme-16-deskos.js' },
  { n: 17, slug: 'atlas',           name: 'Atlas',           layout: 'L2', js: 'js/theme-17-atlas.js' },
  { n: 18, slug: 'nocturne',        name: 'Nocturne',        layout: 'L1', js: 'js/theme-18-nocturne.js' },
  { n: 19, slug: 'herbarium',       name: 'Herbarium',       layout: 'L2', js: 'js/theme-19-herbarium.js' },
  { n: 20, slug: 'wayback',         name: 'Wayback',         layout: 'L1', js: 'js/theme-20-wayback.js' },
];
const MAX = THEMES.length; // use everywhere a bound is needed
```

### 1b. Replace every hardcoded bound

There are four `>= 1 && <= 10` style checks (`urlTheme`, `forcedTheme`, `sessionTheme`, and `forceTheme(n)`); change all to `>= 1 && <= MAX`. The random pick already derives from `THEMES`, so it needs no change.

### 1c. Replace the lazyScript ternary

```js
const lazyScript = theme.js || null;
```

### 1d. Footer label

`#${theme.n}/10` → `#${theme.n}/${MAX}`. Keep the surrounding wording exactly as it is in the file (the root copy reads "Designed with Claude. Reload for a different template (…)").

### 1e. Equal-probability pool

No change needed — the existing candidates filter over `THEMES` gives all 20 equal probability, excluding only the immediately-previous theme.

### 1f. Acceptance criteria for Phase 1

- `?theme=N` works for N = 1…20 (11–20 will render with default tokens until their CSS lands — that's fine and must not error).
- Reload cycles through all 20 (verify `last_theme` in localStorage changes).
- Themes 8/9/10 still load their scripts (check Network tab).
- Theme picker overlay lists 20 entries in a 2-column grid; if 20 items overflow the small picker box, append a `max-height: 70vh; overflow-y: auto;` rule for `.theme-picker ul` to the END of `css/base.css` with a comment `/* v2: picker scroll for 20 themes */`.

---

## Phase 2 — Conventions for the new themes

### 2.1 File and naming conventions

- CSS: `css/themes/NN-slug.css`, first line a comment header like the existing files: `/* Theme NN — Name. Layout: LX. <one-line concept> */`.
- JS: `js/theme-NN-slug.js`, IIFE, with this exact guard prologue (copied pattern from theme-10):

```js
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== 'NN') return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // per-theme: if (reduced) either return or render static final state
```

- All theme-created DOM gets class prefix `tNN-` (e.g. `t12-sky`, `t16-window`). All theme CSS selectors scoped under `html[data-theme="NN"]`.
- Seeded randomness: several themes generate per-visit layouts. Use a tiny mulberry32 PRNG seeded from `Date.now()` so reloads differ but a single page-life is stable. Inline the 4-line mulberry32 into each theme JS that needs it (self-contained files, no shared utils module).

### 2.2 Shared CSS additions (append-only, end of base.css)

Add one block, commented `/* ===== v2 additions (themes 11–20) — appended, safe to delete ===== */`, containing only:
- the picker scroll fix (§1f, if needed);
- `.t-fixed-layer { position: fixed; inset: 0; pointer-events: none; }` — a reusable full-viewport decoration layer several themes use;
- nothing else. Everything else lives in per-theme files.

### 2.3 Data access rule

Themes may **read** `window.PUBLICATIONS`, `window.PROJECTS`, etc. (they're global by the time DOMContentLoaded fires, since `data.js` loads before theme lazy scripts run). Themes must tolerate missing/short arrays (subpages load `data.js` too, but don't rely on it — check `Array.isArray` and length). Never write to these globals. Never modify `content.js`.

### 2.4 Three.js (theme 11 only)

Download `three.module.min.js` (r160+ or current) into `js/lib/`. Theme 11's script uses `import('./lib/three.module.min.js')` inside a feature check; classic-script IIFEs can use dynamic import. If the import fails (old browser), theme 11 falls back to its CSS-only look, which must already be excellent.

---

## Phase 3 — The ten themes

Common spec vocabulary: "hero" = `.hero-section` on index; "cards" = `.card`/`.other-card` items; "portrait" = `#faceFrame`; "plaque"/"label" styling applies to `.section-heading`.

---

### Theme 11 — **Vitrine** (glass, light, sparkle) · layout L4

**Concept.** The page as an exhibition vitrine: content on floating panes of frosted glass, lit by moving underwater-style light caustics, with tiny specular glints that answer the cursor. This is the flagship "translucent, sparkling" theme.

**Art direction.**
- Light mode: background is a very slow animated gradient field (soft sky blues `#dbeafe`→`#f0f9ff`→ pale violet `#ede9fe`, 40s loop, `background-size: 300%` position animation). Dark mode: deep glass at night — near-black blue `#060913` with faint aurora-like gradient blobs (accent cyan `#7dd3fc`, violet `#c4b5fd` at 8–12% opacity).
- Cards: `background: rgba(255,255,255,0.35)` (dark: `rgba(255,255,255,0.06)`), `backdrop-filter: blur(18px) saturate(1.6)`, 1px top/left inner highlight via `box-shadow: inset 0 1px 0 rgba(255,255,255,0.6)`, `border-radius: 20px`, large soft outer shadow. Nav bar gets the same treatment (`--nav-bg`/`--nav-backdrop` tokens exist for exactly this).
- Type: Manrope for display/headings (weight 800, tight tracking), Inter body. Headings get a subtle glass treatment: `background: linear-gradient(...); -webkit-background-clip: text; color: transparent` with a white→pale-blue vertical gradient plus a 1px `text-shadow` lift.
- Portrait: inside a rounded-rectangle "glass block" — the existing `#faceFrame` gets thick translucent border, chromatic edge via two stacked `box-shadow`s (1px cyan offset left, 1px pink offset right) and a diagonal glare streak (`::after` with a rotated white linear-gradient at 12% opacity).

**Signature interactions (JS, `theme-11-vitrine.js`).**
1. *Cursor as light source:* on `pointermove`, write `--lx`/`--ly` (viewport %) to `document.documentElement.style`. Card CSS uses `background-image: radial-gradient(400px circle at var(--lx) var(--ly), rgba(255,255,255,0.25), transparent 60%)` layered above the frost so panes catch the light as the cursor passes. Throttle with rAF.
2. *Caustics canvas in `.hero-bg`:* a WebGL fragment shader rendering classic caustics (sum of 3–4 moving voronoi/noise octaves, `pow()` sharpened, tinted to theme accent, ~15% opacity, half-resolution framebuffer scaled up). ~120 lines. Pause offscreen. Mobile: skip entirely; use the CSS gradient only.
3. *Sparkles:* 24 absolutely-positioned 4-pointed-star SVGs (`t11-glint`) scattered by seeded PRNG across the hero, each animating opacity/scale on randomized 3–7s delays. CSS animation so reduced-motion kills it for free.
4. ⭐ *Stretch — true refraction:* dynamic-import Three.js; add one slowly rotating torus-knot or icosahedron of `MeshPhysicalMaterial { transmission: 1, thickness: 2, roughness: 0.05, ior: 1.5 }` behind the hero text, refracting an `EquirectangularReflectionMapping` env made from a tiny generated gradient canvas. Desktop only, `devicePixelRatio` capped at 1.5. If skipped, the theme is still complete.

**Subpages:** frost cards + gradient background + cursor-light; no canvas.
**No-JS:** gradient + frost + static glints (CSS keyframes) — still clearly "the glass theme".
**Acceptance:** 60fps scroll on a mid laptop; text contrast ≥ 4.5:1 on frosted panes in both modes (tune pane opacity until true); `backdrop-filter` fallback (`@supports not (backdrop-filter: blur(1px))` → raise pane opacity to 0.85).

---

### Theme 12 — **Observatory** (publications as a star atlas) · layout L4

**Concept.** Every publication in `data.js` becomes a star in the hero sky. Co-authorship draws constellation lines. Reload the site, and a researcher's life's work is literally a night sky you can explore. Light mode flips the same data into an 18th-century engraved celestial chart. No other academic site has this.

**Art direction.**
- Dark (default feel): `#050a18` sky, stars in warm white `#fff7e6`, constellation lines `rgba(125,211,252,0.25)`, faint milky-way noise band (pre-drawn radial gradients on the canvas). Sections below the hero: deep navy panels, thin `1px solid rgba(125,211,252,0.2)` rules, headings in Fraunces with astronomical flourish — small `✦` before each heading (CSS `::before`), and coordinate-style metadata line under each heading (`RA 12h 34m · DEC +05° 12′` — decorative, generated in CSS `attr()`/static content).
- Light: cream laid paper `#f5efdd`, stars become engraved dots + tiny cross-hatches in sepia ink `#4a3b22`, constellation lines dotted, an ornate border (double rule + corner rosettes via CSS) around the hero. Same canvas, two render palettes read from CSS custom properties (`--t12-star`, `--t12-line`, `--t12-bg` — read them with `getComputedStyle` like theme-10 does).
- Type: Fraunces (display), Source Serif 4 (body), JetBrains Mono for the coordinate labels.
- Portrait: circular, framed as a telescope eyepiece — thick dark ring + inner crosshair lines at 10% opacity (`::before`).

**The star map (JS, `theme-12-observatory.js`).**
1. Read `window.PUBLICATIONS`. Map each pub → star: `x` = year scaled across width (min/max year from data, with jitter), `y` = seeded hash of venue string → band, radius 1–3px (+1 if `award`-ish field present — inspect data.js for the actual field name; if absent, use recency), twinkle phase random.
2. Constellations: build co-author graph — for every pair of pubs sharing ≥1 non-Garimella author, add an edge; keep edges under a length threshold and cap at ~2 per star (else it becomes a hairball). Draw as faint polylines.
3. Interaction: `pointermove` hit-test (spatial grid, not O(n) per frame); hovered star brightens ×3, its edges light up, and a small HTML tooltip (`t12-tip`, styled like a chart label) shows `title — venue year`. Click → `location.href = 'publications.html'` (or the pub's first link if present).
4. Twinkle: subtle per-star sine opacity; parallax: the whole field translates ±8px against cursor. Both off under reduced motion (render one static frame).
5. Shooting star: every 20–40s, one meteor streak (2% chance per second, max one concurrent). ⭐ Stretch: a "constellation of the day" — pick 5–7 stars, draw them bold with a name label like "The Forwarded Message" (fun fake constellation names in an array).
6. Mobile: cap at 150 stars, no parallax, tap = tooltip.
7. Subpages: no canvas; `publications.html` gets the paper/sky styling only. (⭐ Stretch: tiny 80px star-strip header on publications.html.)

**No-JS:** hero shows a CSS starfield (3 layered `radial-gradient` dot patterns) — decorative but empty of data; content unaffected.
**Acceptance:** with the real `PUBLICATIONS` array (~100+ items) the map stays legible and hit-testing is accurate; canvas redraws only on rAF while hero visible; both palettes verified.

---

### Theme 13 — **Pop-Up** (paper theater) · layout L1

**Concept.** The page is a pop-up book. Each section is a spread that folds open as it scrolls into view; the portrait is a die-cut paper doll; torn-paper edges divide sections. Dark mode turns it into an Indonesian/Indian shadow-puppet theater: indigo paper, warm backlight, silhouettes.

**Art direction.**
- Light: warm stock `#f6efe3` with visible grain — inline SVG `feTurbulence` noise as a data-URI background at 4% opacity. Accents: folk-print vermillion `#c9452c` and marigold `#e8a13a`. Cards look die-cut: solid paper `#fffdf6`, `border-radius: 4px`, hard offset shadow (`box-shadow: 0 6px 0 -2px rgba(120,90,50,0.25)`) suggesting card stock thickness, tiny notch "tabs" via `::before` rectangles.
- Section dividers: torn edge — an inline-SVG jagged path as `border-image` or a `::after` strip between sections, alternating direction.
- Dark: `#141830` paper, content cards become warm-lit cutouts (`background:#1c2142` with `box-shadow: 0 0 40px rgba(232,161,58,0.15)` backlight), decorative silhouette shapes (banyan tree, birds — simple SVG paths at 10% white).
- Type: Fraunces 900 for headings (storybook), PT Serif body.
- Portrait: rectangle with 6px white paper border, slight rotate(-2deg), two layered offset shadows = stacked card.

**Motion (JS + CSS, `theme-13-popup.js`).**
1. Give each `section.section` `perspective: 1200px` (CSS). Children of `.section-body` plus the heading get initial `transform: rotateX(78deg); transform-origin: 50% 100%; opacity: 0`.
   **No-JS safety:** these initial states are applied ONLY under `html.t13-js` — the script adds that class immediately; without JS everything is visible and static.
2. IntersectionObserver at 25% visibility adds `.is-open` to the section → children animate to `rotateX(0)` with 60–90ms stagger (CSS transitions, `transition-delay` via `:nth-child`), with a slight overshoot cubic-bezier(0.2, 0.9, 0.3, 1.15) — the "pop".
3. Scroll-linked fold ⭐: where `animation-timeline: view()` is supported, replace the binary open with a scroll-scrubbed fold (progressive enhancement via `@supports (animation-timeline: view())`).
4. Drifting paper birds: 3 small SVG origami birds cross the viewport slowly at different depths (CSS keyframes, 60–120s, pointer-events none, `.t-fixed-layer`).
5. Reduced motion: script bails before adding `t13-js`; page is fully open and static.

**Subpages:** paper grain, die-cut cards, torn dividers; no fold animations except the simple fade-up on cards (CSS only).
**Acceptance:** no layout shift when sections open (transforms only); nothing animates on reduced motion; no-JS page fully readable (verify by blocking the script).

---

### Theme 14 — **Ink** (sumi-e fluid simulation) · layout L4

**Concept.** A live ink-in-water simulation fills the hero; moving the cursor stirs real swirling ink. Headings reveal themselves with brush strokes; a red seal stamp signs the page. Dark mode inverts to white ink on black paper — equally beautiful.

**Art direction.**
- Light: paper `#f7f4ec` (slight warm), ink near-black `#16161a` with blue undertone, accent = cinnabar seal red `#b3352b`. Dark: paper `#101013`, ink rendered white/silver.
- Type: EB Garamond (headings, generous size, true italics for the tagline), Source Serif 4 body. Wide letter-spacing on small-caps section labels.
- The seal: a square stamp (SVG, rounded square outline containing "KG" in a seal-script-ish geometric monogram — draw it as an inline SVG path, don't use a font) placed after the hero tagline and next to the footer copyright, in seal red with slight rotation and a grainy mask (feTurbulence opacity mask) so it looks hand-stamped.
- Cards: no borders; instead a single ink keyline under the heading (brush-textured: an SVG stroke with irregular width) and generous whitespace. `--card-border: none`, hierarchy via type alone.

**The fluid (JS, `theme-14-ink.js`).**
1. Implement the standard GPU "stable fluids" pipeline (Stam) on WebGL: velocity + dye framebuffers (half-float where available; fall back to byte textures), passes: advection → curl/vorticity confinement (small) → divergence → ~20 Jacobi pressure iterations → gradient subtract → dye advection with dissipation ~0.98. This is a well-known ~300-line implementation; write it dependency-free. Render dye as ink: map dye density through a paper→ink color ramp (read colors from CSS custom props `--t14-paper`, `--t14-ink`).
2. Pointer adds velocity + dye splats along the drag path; on load, an autonomous "brush" performs one scripted S-curve stroke over 2.5s so the hero opens with a living stroke even before the user moves.
3. Sim resolution: 128–256 grid regardless of canvas size; dye texture ≤ 512. Pause when hero offscreen/tab hidden.
4. Mobile: replace sim with a static ink-wash: 2–3 large blurred radial gradients + the noise mask (CSS in the theme file, applied under a `t14-static` class the JS sets, or by a `@media (max-width: 760px)` default with JS opting desktop out).
5. Reduced motion: static wash (same as mobile), no autonomous stroke.
6. Brush-reveal headings: each `.section-heading` gets a `clip-path`/mask sweep on first intersection (CSS transition of `mask-position` over a brush-texture mask image — inline SVG data-URI), 600ms, once. Under reduced motion: visible immediately.

**Subpages:** paper/ink palette, seal in footer, brush keylines; no sim.
**No-JS:** static wash + everything readable.
**Acceptance:** sim stable (no NaN blowups after 5 min of aggressive scribbling); ≥ 50fps desktop; WebGL-unavailable fallback verified (force by making `getContext` return null in devtools once).

---

### Theme 15 — **Holofoil** (holographic trading card) · layout L2

**Concept.** The hero is an oversized holographic trading card of Kiran — tilting toward the pointer, rainbow foil sweeping across as it moves, glitter under the surface. Sections read as pages of a collector's binder; each publication/project is a mini-card, and awards get "holo rare" treatment. Playful, but immaculately produced.

**Art direction.**
- The big card (`t15-card`, JS-built wrapper around the existing `.hero-inner` content — wrap, don't replace): 3:4-ish rounded rectangle, dark charcoal base `#1b1d26`, portrait top, name as card title, `HIGHLIGHTS`/role as card stats, a small set-symbol + card number "№ 001/020" (wink at the theme counter).
- Foil layers (all `::before/::after` + one extra div): (a) rainbow: two overlaid `linear-gradient(115deg, transparent 20%, #ff008450, #fca50050, #22d3ee50, transparent 80%)` whose `background-position` follows `--px/--py`; (b) glitter: a repeating radial dot pattern (data-URI) with `mix-blend-mode: color-dodge`, masked by a `feTurbulence` noise data-URI so sparkle clusters look organic; (c) glare: white radial at pointer. This is the well-documented CSS "pokemon card" stack — implement it from scratch with those three layers.
- Binder pages: light mode `#e9e9ef` felt-grey background with a 3-column grid of "card pockets" — each `.card` gets a plastic-sleeve look: 1px light border, top glare streak, slight inner shadow. Dark mode: midnight binder `#0d0e14`, foil reads much louder.
- Type: Space Grotesk everywhere; stats in Space Mono. Rarity glyphs: ● common, ◆ project, ★ award.

**Interaction (JS, `theme-15-holofoil.js`).**
1. Pointer over the big card → rAF-throttled `--px/--py` (0–1) and `transform: rotateY/rotateX` (max ±10°) with `perspective(900px)`; spring back on leave (CSS transition 600ms).
2. `deviceorientation` tilt on mobile where permission-free (Android); otherwise a gentle automatic 8s foil sweep animation so mobile still shimmers.
3. Mini-cards: hover applies a cheap single-layer foil sweep; items whose data has an award field get the full glitter layer + ★.
4. Reduced motion: no tilt, no sweep; foil frozen at a pleasing diagonal.

**Subpages:** binder background + sleeve cards + hover foil; publications.html becomes literally a binder of cards — this one's subpage story is its best.
**No-JS:** card renders flat with the static foil gradient. Fine.
**Acceptance:** tilt never causes text blur (use `will-change: transform` and integer-ish angles); `mix-blend-mode` layers don't tank scrolling (isolate with `contain: paint` on the card); light/dark verified.

---

### Theme 16 — **Desk OS** ("KiranOS") · layout L1 · *the big one*

**Concept.** The homepage boots into a tiny operating system. Menu bar, wallpaper, desktop icons — About.txt, Publications.db, Projects, Teaching.app, Comics.png, Advice.md, Terminal — each opening a draggable window containing the real section content. A working toy terminal ships commands and easter eggs. "Reader Mode" restores the normal page. Visitors remember this one forever.

**Build strategy (JS, `theme-16-deskos.js` — the only theme allowed to move DOM).**
1. On DOMContentLoaded, wrap everything in try/catch. `try {` build `t16-desktop` (fixed, inset 0): menu bar (left: ⌘-ish glyph + "KiranOS" + File/View/Help fake menus; right: live clock, battery glyph, theme name), wallpaper (subtle gradient + tiny KG seal watermark), icon grid, dock. Then for each `section.section[data-section]`, **move** (`appendChild` — preserves listeners) the section node into a hidden window shell `t16-window` (title bar with close/min/zoom traffic lights + title, content area with the section inside, resize handle). Set `document.body.dataset.t16 = 'on'` which CSS uses to hide normal flow (`main > * { display: none }` scoped under `[data-t16="on"]`).
   `} catch (e) { /* restore: move any relocated sections back to <main>, remove t16 nodes, delete dataset flag */ }` — the page must survive any mid-build exception.
2. Windows: absolute-positioned; drag via pointer events on title bar (pointer capture); z-order = click-to-front (incrementing z counter); close hides; minimize animates to dock; zoom toggles a maximized rect. Cascade initial positions (each +24px offset). Persist nothing — every boot is fresh.
3. Boot sequence: 1.6s black screen with "KiranOS 2.0 — 20 themes installed" + progress bar; skipped entirely if `sessionStorage.t16_booted`, on reduced motion, or on any key/click (skippable is mandatory).
4. Terminal window (built from scratch, ~150 lines): prompt `kiran@rutgers ~ %`. Commands: `help`, `ls` (lists sections), `open <section|page>` (opens window / navigates), `theme <n>` (calls `window.__theme.forceTheme(n)`), `mode dark|light`, `whoami` (prints tagline), `clear`, `exit`. Easter eggs: `sudo tenure` → "Permission granted. Congratulations."; `rm -rf /` → fake cascade of "deleting publications… just kidding." Unknown command → "command not found (try `help`)".
5. Menu "View → Reader Mode" and pressing `Escape` both call the restore routine from step 1's catch-block (factor it as `teardown()`): sections return to `<main>` in original order, desktop removed, flag cleared. This doubles as the calm-view escape hatch (§2.10).
6. Mobile (≤760px): no free-floating windows. Desktop becomes a phone home screen: icon grid; tapping opens the section as a full-screen sheet with a top bar and back button (same window shells, different CSS). Dock hidden.
7. Subpages: no desktop. Style the whole page as one maximized window: title bar strip at top of `<main>` content area via CSS only (`body::before` bar + traffic-light dots), window-chrome border. Cheap, charming, zero JS relocation.
8. Reduced motion: no boot, no minimize animation; windows open/close instantly. No-JS: CSS applies only window-chrome cosmetics to the normal flow — fully readable.

**Art direction.** Platinum-era UI: `#d9d9e0` wallpaper-adjacent greys, 1px `#7c7c88` window borders, pinstripe title bars (repeating-linear-gradient), Inter for UI at 13px, JetBrains Mono in terminal (phosphor green on near-black). Dark mode: graphite windows `#26262e`, wallpaper deep blue, terminal unchanged. Icons: inline SVG, single-color line style, 40×40.
**Acceptance:** all six windows open/drag/close without console errors; terminal commands all work; Escape/Reader-Mode restores a pixel-normal page (diff `document.body.innerHTML` sanity: sections back under `<main>` in order); `?` picker still opens (ensure terminal swallows keys only while focused); mobile sheet flow works; teardown path tested by throwing deliberately during build once in dev.

---

### Theme 17 — **Atlas** (expedition cartography) · layout L2

**Concept.** The site as a hand-surveyed map of a research territory. Generative topographic contours mean the terrain is different on every reload; a dashed expedition route draws itself from section to section as you scroll, with numbered waypoint pins. Ties directly to the research identity (global information flows, fieldwork in India).

**Art direction.**
- Light: chart paper `#f2ecdc`, contours in terracotta `#c07a52` at 25% opacity, water-blue accents `#3f6f8f`, graticule grid (1px lines every 120px at 6% opacity, CSS background). Headings in Fraunces small-caps with letterspacing; coordinates line under each heading in JetBrains Mono (decorative, e.g. `40.4990° N, 74.4474° W — New Brunswick sheet` for About; pick plausible coords per section: Rutgers, Delhi, Geneva, etc. — hardcode in CSS `content`).
- Cards: map-inset style — double-rule border (`outline` + `border` combo), small corner ticks, title on a white "label patch".
- Compass rose: inline SVG, top-right of hero, rotates a few degrees with scroll (JS sets `--t17-rot`).
- Portrait: oval cartouche — `border-radius: 50%`, engraved frame (3 concentric ring shadows), `filter: sepia(0.35) contrast(1.05)`.
- Dark: night navigation chart — `#0c1420` paper, contours in phosphor `#39d98a` at 18%, route in amber, graticule slightly brighter. Genuinely different mood, same geometry.

**Generative terrain + route (JS, `theme-17-atlas.js`).**
1. Terrain: value-noise field (2 octaves, seeded mulberry32) sampled on a coarse grid across the full document height × width; run marching squares at 5–6 elevation thresholds; emit SVG paths into one absolutely-positioned full-document SVG behind content (`t17-terrain`, z-index below text, `pointer-events: none`). Regenerate on significant resize only (debounced). Cap total path points (~8k) for perf. Every reload = new landmass.
2. Route: compute anchor points at each section's heading position; build a smooth catmull-rom path through them with lateral wobble; render as dashed stroke; set `stroke-dasharray = pathLength` and drive `stroke-dashoffset` from scroll progress (rAF + scroll listener) so the expedition line draws as you read. Waypoint pins: numbered circles (1–5) that stamp in (scale pop) when the route reaches them.
3. Reduced motion: route fully drawn, pins placed, compass static, terrain still generated (static is fine — it's the *reload* that varies).
4. Mobile: fewer contour thresholds (3), route simplified to the left margin.

**Subpages:** paper + graticule + inset cards + compass in footer; no terrain/route (or ⭐ terrain at low density).
**No-JS:** paper, grid, cartouche, inset cards — a handsome flat map sheet.
**Acceptance:** contours never overlap text illegibly (they sit at ≤25% opacity under everything); scroll-draw is smooth (path precomputed, only dashoffset changes per frame); regeneration on reload confirmed visually twice.

---

### Theme 18 — **Nocturne** (night museum, flashlight cursor) · layout L1

**Concept.** After-hours in a gallery. The room is dark; your cursor is a warm flashlight beam; each section is a spotlit exhibit with an engraved brass plaque. The dimness is theatrical but never hides content — lit pools cover every exhibit, and the beam adds discovery on top.

**Art direction.**
- Dark (primary): walls `#0b0a09`, exhibits on `#141210` panels inside heavy frames (`border: 10px solid #241f18` + inner gold fillet `outline: 1px solid #8a6d3b40`), each with a "picture light" — a top-mounted warm glow (`::before`: elliptical radial-gradient `rgba(255,196,110,0.14)` fading down). Every section is *pre-lit* by its picture light: base legibility never depends on the flashlight.
- Plaques: `.section-heading` restyled as brass — small caps PT Serif, letterspaced, on a gradient brass plate (`linear-gradient(#b08d57, #8a6d3b)`) with engraved text effect (`color:#2b2118; text-shadow: 0 1px 0 rgba(255,255,255,0.35)`), plus a second line in small italic: "EXHIBIT II · mixed media · 2011– " (per-section via CSS).
- Portrait: oil-portrait treatment — ornate frame (layered box-shadows), canvas texture overlay (noise data-URI at 8%), warm vignette.
- Light mode: daytime white-cube gallery — `#f4f3f0` walls, exhibits on white plinth cards with precise soft shadows, museum-sans labels (Inter small caps), skylight gradient at top. No flashlight in light mode (it's daytime); the wall-label typography carries it.

**Flashlight (JS, `theme-18-nocturne.js`, ~90 lines).**
1. One `.t-fixed-layer` div (`t18-dim`) with `background: radial-gradient(circle 260px at var(--fx) var(--fy), transparent 0 55%, rgba(0,0,0,0.55) 100%)` — i.e., the room dims to 55% *around* a clear beam; inside lit pools content is always ≥ readable because dimming maxes at 55% and picture lights punch through (layer sits below nav/picker z-index, above wallpaper, `mix-blend-mode: multiply`).
2. Beam eases toward the pointer (lerp at 0.12/frame) for a heavy, physical feel; a faint warm tint at the beam center (`rgba(255,196,110,0.06)` inner stop).
3. Escape toggles the layer off (lights on); touch devices and reduced motion never create it. Small hint in the footer area: "🔦 esc toggles the lights".
4. On section intersection, its frame gets a slow 400ms glow-up (transition of the picture-light opacity) — the exhibit "notices you".

**Subpages:** gallery walls, frames, plaques; flashlight only on index (subpages are working archives, keep them fully lit).
**No-JS:** fully lit gallery with picture lights (pure CSS) — already lovely.
**Acceptance:** WCAG-ish legibility with the dim layer active (spot-check body text inside an unlit region: must still be readable, ≥ ~3:1 — tune max dim); no jank (the layer is one composited element; only CSS vars change per frame); Escape works; light mode is a complete distinct look, not an inversion.

---

### Theme 19 — **Herbarium** (generative pressed-botany archive) · layout L2

**Concept.** The page is a herbarium folder: content mounted on specimen sheets with washi tape, labeled in taxonomic style ("*Misinformatio forwardii* GARIMELLA, 2020"). Vines grow up the margins as you scroll — generated fresh each reload, one plant seeded per project. Dark mode becomes cyanotype photograms (Prussian blue, white silhouettes), the oldest scientific imaging aesthetic there is.

**Art direction.**
- Light: archive cream `#f7f2e7`; sheets (`.card` and section panels) in brighter `#fdfaf1` with 1px warm border, corner shadows, and two washi-tape strips (`::before/::after`: rotated translucent rectangles with subtle stripe gradient). Specimen labels: bottom-right of each card, JetBrains Mono 10px, ruled box: `COLL. K. GARIMELLA · DET. 2026 · LOC. NEW BRUNSWICK` plus a Latinized binomial from the item title (JS generates: first word latinized + "ii"/"ensis" suffix — decorative humor, keep it subtle).
- Greens: leaf `#5b7a4a`, stem `#6e5a3a`, bloom accents dusty rose `#c4788a` and marigold.
- Type: EB Garamond (headings, italic binomials), Source Serif 4 body.
- Dark (cyanotype): everything Prussian blue `#0f2d52`→`#123a6b` gradient sheets, all line-work and botanical drawings inverted to white at 85%, type in `#e8f1ff`. The vines render white — photogram style. One CSS palette swap via custom properties; the JS reads current colors like theme-10 does.

**Growing vines (JS, `theme-19-herbarium.js`).**
1. One full-document absolutely-positioned SVG (`t19-garden`) in each margin (or single SVG spanning page, drawing only in the outer 90px gutters; under 760px: single left gutter, 32px, sparse).
2. Growth model: recursive branching curves (simple L-system: F[+F]F[-F]F variants, 4 iterations, or hand-rolled recursive quadratic-bezier branching — either is fine), seeded per reload; one "species" per entry in `PROJECTS` (leaf shape index, flower color, branching angle derived from a title hash). Plants rooted at intervals matching section positions.
3. Growth = scroll: precompute every segment with a `depth` value (its position along the plant); reveal segments whose depth ≤ scrollProgress × maxDepth (set `stroke-dashoffset` per path or toggle small groups). Leaves/flowers pop (scale transition) when their parent segment appears. Scrolling up does NOT retract (growth is monotonic — pleasant, avoids churn).
4. Reduced motion: garden fully grown on load. Resize: regenerate debounced.
5. ⭐ Stretch: bees/butterfly — one tiny SVG wanderer that follows a noise path near the blooms, 20s loop, desktop only.

**Subpages:** sheets, tape, labels; a single modest pre-grown sprig in the top-left corner (static SVG generated on load).
**No-JS:** sheets/tape/labels intact; margins empty. Fine.
**Acceptance:** vines never overlap text (strictly gutter-clipped via SVG `clipPath`); scroll handler is rAF-throttled; cyanotype mode verified; per-reload variation confirmed.

---

### Theme 20 — **Wayback** (30 years of the web in one scroll) · layout L1

**Concept.** The page time-travels. The hero renders as a 1994 GeoCities homepage; each section down the page jumps an era — 2001 table-era corporate, 2008 glossy Web 2.0, 2013 flat design, 2019 dark-mode minimalism — until "Other" arrives in 2026 as a glass site (a wink at theme 11). A year scrubber pins to the edge tracking your position in history. For someone who studies online platforms, this is the perfect signature theme, and it's the most shareable thing on the site.

**Era mapping (scoped almost entirely in CSS — each block scoped to its section):**

| Section | Era | Treatment (all per-section CSS under `html[data-theme="20"]`) |
|---|---|---|
| hero | **1994** | `background:#c0c0c0`; Times New Roman; name in `#000080`; links blue+underlined; beveled "buttons" (`border: 2px outset`); starry-gif-style tiled bg behind the portrait (CSS-drawn checkerdots); blinking "NEW!" badge (CSS steps() blink); fake visitor counter (seven-segment style, JS random 6-digit number); horizontal rule with `border-style: ridge`; portrait becomes 90s webcam: low-res feel via `image-rendering: pixelated` + slight `saturate(1.4)`. An "under construction" striped bar (CSS repeating-linear-gradient, black/yellow) as hero divider. |
| about | **2001** | White bg, `#e0e0e0` table-like bordered boxes (`border:1px solid #999` collapsed grid), Verdana/Tahoma 11px vibes (font-family: Verdana, size bump for actual readability: 14px), navy header bars on cells, a left "sidebar" strip (decorative), tiny 88×31-style badges row (CSS-drawn: "W3C VALID", "BEST VIEWED 800×600"). |
| projects | **2008** | Web 2.0: glossy gradient header pills (`linear-gradient(#8ee0ff,#2aa0e0)`), rounded 12px, wet-floor reflections on the heading (`-webkit-box-reflect` where supported, else skip), candy badge "BETA" rotated on the corner, Lucida Grande/Trebuchet, drop shadows everywhere, a faux "Digg this" chip. |
| publications | **2013** | Flat era: white cards, no shadows, 1px `#e5e7eb` hairlines, cornflower `#3b82f6` links, Helvetica/Arial, ALL-CAPS grey microcopy, ghost buttons. Basically proto-Bootstrap. |
| teaching | **2019** | Dark-mode minimal: `#0f1115` panel era, Inter, 8px-radius cards with soft shadow, purple gradient accent text, pill tags — the Medium/Stripe look. |
| other | **2026** | Present day: glassmorphism panes matching theme 11's card recipe (explicit cross-reference: reuse the same values), variable-feel type (Manrope), oklch-bright accents, generous radius. |
| footer | **beyond** | Tiny wink: "you've reached the present · reload for another timeline". |

- The page background cross-fades era by era: define per-section wrapper backgrounds; between sections insert thin "time seam" dividers — a gradient strip with the year label ("— 2008 —", JetBrains Mono) via `::before` on each section.
- Dark mode: each era's night variant (1994 → black bg + `#00ff00` terminal green text + grey bevels; 2001 → navy; 2008 → glossy on graphite; 2013 → charcoal flat; 2019 native; 2026 dark glass). Scope: `html[data-theme="20"][data-mode="dark"] section[data-section="…"]`.

**JS (`theme-20-wayback.js`, small):**
1. Year scrubber: fixed right-edge vertical track (hidden ≤ 760px) with years 1994→2026; a marker interpolates by scroll position between section anchors; current era's year highlighted. Clicking a year smooth-scrolls to its section.
2. Visitor counter: random 6-digit number, +1 tick every few seconds while hero visible.
3. ⭐ Clippy-descendant: in the 2001 section, a small CSS-drawn paperclip pops from the corner once per session: "It looks like you're reading about misinformation research. Need help?" with [Yes][No] — both dismiss it; No triggers a second bubble "Wise choice." Session-flagged, reduced-motion-skipped, never reappears.
4. Cursor trail ⭐: sparkle trail following the cursor ONLY while inside the 1994 hero (element-scoped pointermove; capped at 12 nodes; desktop only).
5. Reduced motion: no blink, no trail, no clippy, no counter tick; scrubber static but functional.

**Subpages:** pick ONE era per page for a clean look: publications=2013 flat, tools=2008 glossy, advice=2001, comic=1994. (Pure CSS scoping per page: add `body[data-page]`? No — don't touch HTML. Instead key off `location.pathname` in the theme JS by setting `html.dataset.t20page`, with CSS defaulting subpages to the 2013 look when JS is absent.)
**No-JS:** all eras render (they're CSS-scoped); no scrubber/counter/clippy. Fully readable.
**Acceptance:** every era's section passes contrast checks (esp. 1994 dark-mode green-on-black: use `#33ff66` at 15px+); the joke never blocks reading (clippy dismissible, once per session); seams align with section boundaries at all viewport widths.

---

### 3.14 Recommended build order (easiest → hardest, momentum-friendly)

1. **15 Holofoil** (CSS-heavy, small JS)
2. **18 Nocturne** (CSS + 90-line JS)
3. **13 Pop-Up** (CSS + observer)
4. **17 Atlas** (SVG generation, moderate)
5. **19 Herbarium** (SVG generation, moderate)
6. **11 Vitrine** (shader + polish; ⭐ Three.js last)
7. **12 Observatory** (data plumbing + canvas)
8. **20 Wayback** (large CSS surface, small JS)
9. **14 Ink** (WebGL fluid — hardest single effect)
10. **16 Desk OS** (most JS, most interaction QA)

---

## Phase 4 — QA

### 4.1 Full matrix (run after all ten land)

For each theme 11–20: `?theme=NN` on `index.html`, `publications.html`, `tools.html`, `advice.html`, `comic.html` × light + dark × desktop (~1280px) + mobile (375px, devtools). Check: no console errors, no horizontal scrollbar, nav/footer intact, `?` picker opens and lists 20, mode toggle works, content readable everywhere.

### 4.2 Regression spot-check (run after EVERY theme)

- `?theme=2` (Whitebox) and `?theme=9` (Glitch) on index: render identical to before (compare against `backup_theme_system_2026-07-05/` copies if unsure), no console errors, glitch script still loads.
- Reload index 5× without params: themes rotate, no repeats of the immediately-previous theme, footer counter reads `#N/20`.

### 4.3 Special-case checks

- Reduced motion: OS setting or devtools emulation, verify themes 11, 12, 13, 14, 16, 18, 20 show static-but-complete states.
- No-JS: block each `theme-NN-*.js` in devtools request blocking; page must remain readable and styled.
- WebGL unavailable (11, 12, 14): stub `HTMLCanvasElement.prototype.getContext` to return null in console; reload; CSS fallback must appear.
- Theme 16 teardown: open desktop, press Escape → normal page; open again via View menu is NOT required (one-way restore per pageview is acceptable).
- Keyboard: tab through index on 11, 16, 18 — focus visible (base.css `:focus-visible` outline must not be obscured by fixed layers; fixed layers are `pointer-events: none` except t16 windows).

### 4.4 Performance

- Chrome Performance panel, 4× CPU throttle: scroll each of 11/12/14/17/19 — main thread must not show long-task pileups; effects pause when hero is scrolled out (check rAF stops via Performance monitor FPS).
- Lighthouse on `?theme=15` and `?theme=16` (representative CSS-heavy and JS-heavy): performance ≥ 85 mobile.

---

## Phase 5 — Rollback

If anything is wrong post-deploy:
1. Immediate: `git revert` the offending theme commit (themes are isolated per commit).
2. Nuclear: copy `backup_theme_system_2026-07-05/` contents back over the repo root files it mirrors, commit, push.
3. A single broken theme can be pulled from rotation by deleting its row in `THEMES` (numbering of others is unaffected since `n` is explicit).

---

## Appendix A — Per-theme file checklist

| # | Slug | CSS | JS | Reads data.js | WebGL | Moves DOM |
|---|---|---|---|---|---|---|
| 11 | vitrine | `css/themes/11-vitrine.css` | `js/theme-11-vitrine.js` (+ optional `js/lib/three.module.min.js`) | no | yes (caustics; ⭐ three) | no |
| 12 | observatory | `css/themes/12-observatory.css` | `js/theme-12-observatory.js` | PUBLICATIONS | canvas 2D | no |
| 13 | popup | `css/themes/13-popup.css` | `js/theme-13-popup.js` | no | no | no |
| 14 | ink | `css/themes/14-ink.css` | `js/theme-14-ink.js` | no | yes (fluid) | no |
| 15 | holofoil | `css/themes/15-holofoil.css` | `js/theme-15-holofoil.js` | PROJECTS/PUBS (rarity) | no | wraps hero-inner only |
| 16 | desk-os | `css/themes/16-desk-os.css` | `js/theme-16-deskos.js` | no | no | **yes — with teardown** |
| 17 | atlas | `css/themes/17-atlas.css` | `js/theme-17-atlas.js` | no | SVG | no |
| 18 | nocturne | `css/themes/18-nocturne.css` | `js/theme-18-nocturne.js` | no | no | no |
| 19 | herbarium | `css/themes/19-herbarium.css` | `js/theme-19-herbarium.js` | PROJECTS (species) | SVG | no |
| 20 | wayback | `css/themes/20-wayback.css` | `js/theme-20-wayback.js` | no | no | no |

## Appendix B — Things the executor must NOT do

- Do not refactor existing themes "while you're in there".
- Do not add a build step, bundler, or npm. This site is plain files on GitHub Pages.
- Do not edit `new_site/` — it's a sandbox, out of scope.
- Do not change the random-rotation logic beyond the bound generalization.
- Do not introduce cookies/analytics/external requests (fonts + self-hosted three only).
- Do not let any theme script run when its `data-theme` doesn't match (the guard prologue is mandatory).
