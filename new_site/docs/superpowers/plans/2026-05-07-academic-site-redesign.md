# Academic Site Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Gemini's earlier 10-theme attempt with a polished redesign — 10 hand-designed themes selected at random on each reload, face-tracker portrait constant in all themes (sunglasses on dark mode), 5-item nav, prominent quick-links bar in hero, no videos.

**Architecture:** Shared HTML/data scaffold + per-theme CSS files + small theme-engine JS that picks one randomly on load (excluding last). Layout primitives (L1–L4) defined in base CSS; themes ride on top. Face-tracker, dark/light, and nav are theme-independent shared modules.

**Tech Stack:** Vanilla HTML/CSS/JS. No frameworks, no build step, no server. Static deployable to GitHub Pages or Apache. Google Fonts for typography. Python 3 (one-off) for AI image generation via OpenAI `gpt-image-1`.

**Spec:** [`docs/superpowers/specs/2026-05-07-academic-site-redesign-design.md`](../specs/2026-05-07-academic-site-redesign-design.md)

**Project root:** `/Users/kgarimella/Documents/personalWebpage/gvrkiran.github.io/new_site/`

---

## File Structure (final)

```
new_site/
├── index.html                  # home: nav, hero (face + quick-links), about, projects, pubs, teaching, other
├── publications.html           # full pub list, theme-aware
├── data.js                     # PROFILE, KEYWORDS, PROJECTS, PUBLICATIONS, TEACHING (existing)
│
├── css/
│   ├── base.css                # reset, layout primitives L1–L4, universal selectors
│   ├── tokens.css              # default CSS custom properties (theme contract)
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
│   ├── theme-engine.js         # random theme picker, mode toggle, ? overlay
│   ├── face-tracker.js         # cursor gaze tracking + sunglasses swap
│   ├── nav.js                  # nav rendering + smooth anchor scroll
│   ├── content.js              # populates sections from data.js
│   ├── theme-08-dither.js      # canvas Bayer dither (loaded only if theme 8)
│   ├── theme-09-glitch.js      # marquee + RGB-split parallax (loaded only if theme 9)
│   └── theme-10-particles.js   # canvas flow-field (loaded only if theme 10)
│
├── assets/
│   ├── faces/                  # existing: gaze webps
│   ├── faces_with_sunglasses/  # existing: same gaze positions, sunglasses on
│   ├── kiran_img.png           # copied from parent dir
│   ├── ai/
│   │   ├── 04-risograph-hero.png
│   │   ├── 05-editorial-hero.png
│   │   └── 07-brutalist-poster.png
│   └── ornaments/              # SVG ornaments per theme
│
├── scripts/
│   └── generate_ai_images.py   # OPENAI_API_KEY → assets/ai/
│
├── old/                        # legacy files moved here (rollback)
│
└── docs/
    └── superpowers/
        ├── specs/2026-05-07-academic-site-redesign-design.md
        └── plans/2026-05-07-academic-site-redesign.md  (this file)
```

---

## Verification Workflow

This is a static frontend project. Each task ends with a **verification step** that loads the site in the browser preview and checks visually + via console.

Standard verification routine (used in many tasks):

```
preview_start → loads / on a static server rooted at new_site/
preview_eval → run JS to force a specific theme: localStorage.setItem('forced_theme','2'); location.reload()
preview_screenshot → capture and inspect visually
preview_console_logs (pattern: 'error|warning') → check for JS errors
```

A theme-forcing query param is built into theme-engine.js (Phase 1, Task 1.2) so any theme can be loaded for inspection: `?theme=N`.

---

## Phase 0 — Setup

### Task 0.1: Stash legacy files into `old/`

**Files:**
- Move existing top-level into `old/`: `index.html`, `main.js`, `styles.css`, `scroll-video.js`, `video1.mp4`, `video2.mp4`, `video3.mp4`, `back_video2.mp4`, `back_video3.mp4`, `sunglasses.png`, `sunglasses1.png`, `regenerate_frames.sh`, `frames/`, `shape_predictor_68_face_landmarks.dat`, `home-research-atmosphere-v1.png` (if present), `projects.html`, `teaching.html`
- Keep at top level: `data.js`, `faces/`, `faces_with_sunglasses/`, `generate_sunglasses.py`, `assets/`, `publications.html`, `docs/`

- [ ] **Step 1: Create `old/` and move legacy files**

```bash
cd /Users/kgarimella/Documents/personalWebpage/gvrkiran.github.io/new_site
mkdir -p old
mv index.html main.js styles.css scroll-video.js \
   video1.mp4 video2.mp4 video3.mp4 back_video2.mp4 back_video3.mp4 \
   sunglasses.png sunglasses1.png regenerate_frames.sh \
   frames shape_predictor_68_face_landmarks.dat \
   projects.html teaching.html \
   old/ 2>/dev/null || true
# home-research-atmosphere-v1.png lives in assets/, leave it for now
```

- [ ] **Step 2: Confirm result**

```bash
ls -1 . | sort
```

Expected: `assets data.js docs faces faces_with_sunglasses generate_sunglasses.py old publications.html`. (publications.html will be rebuilt themed in Phase 4.)

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: stash Gemini-era files into old/ before redesign"
```

---

### Task 0.2: Create new directory skeleton

**Files:** Create `css/`, `css/themes/`, `js/`, `assets/ai/`, `assets/ornaments/`, `scripts/`. Copy `kiran_img.png` from parent into `assets/`.

- [ ] **Step 1: Create directories**

```bash
cd /Users/kgarimella/Documents/personalWebpage/gvrkiran.github.io/new_site
mkdir -p css/themes js assets/ai assets/ornaments scripts
```

- [ ] **Step 2: Copy headshot into assets**

```bash
cp ../kiran_img.png assets/kiran_img.png
ls -la assets/kiran_img.png
```

Expected: file exists, size ~tens-of-KB.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: create new directory skeleton"
```

---

## Phase 1 — Universal Foundation

This phase creates everything that's the same in all 10 themes: HTML scaffold, base CSS (reset + layout primitives), token contract, theme engine, face tracker, nav, content population. After Phase 1 the site loads but every theme renders identically (default tokens). Themes added in Phase 3 differentiate them.

### Task 1.1: Create `css/base.css` — reset, layout primitives, universal selectors

**Files:**
- Create: `css/base.css`

- [ ] **Step 1: Write `css/base.css`**

```css
/* css/base.css — reset, layout primitives, universal selectors */

/* Modern reset (Andy Bell / Josh Comeau hybrid) */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html, body { height: 100%; }
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-body);
  font-size: var(--font-size-body, 1rem);
  line-height: var(--line-height-body, 1.55);
  transition: background 240ms ease, color 240ms ease;
}
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; color: inherit; }
p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
a { color: inherit; text-decoration: none; }
button { background: none; border: 0; cursor: pointer; padding: 0; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Focus ring */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

/* Layout primitives — themes pick one via [data-layout] */

/* L1 — centered single column */
[data-layout="L1"] main { max-width: 64ch; margin: 0 auto; padding: 0 1.5rem; }
[data-layout="L1"] section.section { padding: 6rem 0; }
[data-layout="L1"] .hero-inner { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 2rem; }

/* L2 — asymmetric two-column */
[data-layout="L2"] main { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }
[data-layout="L2"] section.section { padding: 5rem 0; display: grid; grid-template-columns: 2fr 1fr; gap: 3rem; align-items: start; }
[data-layout="L2"] section.section > .section-aside { font-size: 0.9rem; }
[data-layout="L2"] .hero-inner { display: grid; grid-template-columns: 2fr 1fr; gap: 3rem; align-items: center; }
@media (max-width: 760px) {
  [data-layout="L2"] section.section,
  [data-layout="L2"] .hero-inner { grid-template-columns: 1fr; gap: 2rem; }
}

/* L3 — magazine grid, 12 col */
[data-layout="L3"] main { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }
[data-layout="L3"] section.section { padding: 5rem 0; display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.25rem; }
[data-layout="L3"] section.section > * { grid-column: span 12; }
[data-layout="L3"] .hero-inner { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.25rem; align-items: end; }
[data-layout="L3"] .hero-text { grid-column: 1 / span 7; }
[data-layout="L3"] .hero-portrait { grid-column: 8 / span 5; }
@media (max-width: 760px) {
  [data-layout="L3"] section.section { grid-template-columns: 1fr; }
  [data-layout="L3"] section.section > * { grid-column: 1; }
  [data-layout="L3"] .hero-inner { grid-template-columns: 1fr; }
  [data-layout="L3"] .hero-text, [data-layout="L3"] .hero-portrait { grid-column: 1; }
}

/* L4 — full-bleed hero with overlay content */
[data-layout="L4"] .hero-section { position: relative; min-height: 100vh; overflow: hidden; }
[data-layout="L4"] .hero-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
[data-layout="L4"] .hero-inner { position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 6rem 1.5rem 3rem; max-width: 1280px; margin: 0 auto; gap: 2rem; }
[data-layout="L4"] section.section { padding: 5rem 1.5rem; max-width: 1100px; margin: 0 auto; }

/* Universal nav structure (themes override visual treatment) */
.nav-bar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: var(--nav-bg, transparent);
  backdrop-filter: var(--nav-backdrop, none);
  -webkit-backdrop-filter: var(--nav-backdrop, none);
  transition: background 240ms ease;
}
.nav-brand { font-family: var(--font-display); font-weight: 700; font-size: 1.05rem; letter-spacing: var(--nav-brand-tracking, 0.08em); }
.nav-links { display: flex; gap: 1.4rem; align-items: center; }
.nav-links a { font-family: var(--font-body); font-size: 0.92rem; opacity: 0.92; }
.nav-links a:hover { opacity: 1; }
.nav-toggle { font-size: 1rem; padding: 0.4rem 0.7rem; border-radius: var(--btn-radius, 999px); border: 1px solid var(--color-fg); background: transparent; color: var(--color-fg); }
@media (max-width: 720px) {
  .nav-links { gap: 0.9rem; font-size: 0.85rem; }
  .nav-bar { padding: 0.7rem 1rem; }
}

/* Quick-links bar (theme styles via .quick-links a treatment) */
.quick-links { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.quick-links a {
  font-family: var(--font-body);
  font-size: 0.92rem;
  padding: 0.55rem 1rem;
  border: 1px solid var(--color-fg);
  border-radius: var(--btn-radius, 999px);
  background: transparent;
  transition: background 200ms ease, color 200ms ease, border-color 200ms ease;
}
.quick-links a:hover { background: var(--color-fg); color: var(--color-bg); }

/* Face-tracker frame (each theme overrides .face-frame) */
.face-frame {
  width: var(--face-size, 200px);
  height: var(--face-size, 200px);
  position: relative;
  overflow: hidden;
}
.face-frame img { width: 100%; height: 100%; object-fit: cover; transition: opacity 220ms ease; }

/* Section heading */
.section-heading {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.75rem, 3vw, 2.4rem);
  letter-spacing: var(--heading-tracking, 0);
  margin-bottom: 1.25rem;
  color: var(--color-heading, var(--color-fg));
}

/* Card primitive */
.card {
  padding: 1.25rem 1.4rem;
  background: var(--card-bg, transparent);
  border: var(--card-border, 1px solid var(--color-fg));
  border-radius: var(--card-radius, 0);
  box-shadow: var(--card-shadow, none);
}

/* Footer */
.site-footer {
  padding: 2rem 1.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.82rem;
  opacity: 0.7;
  border-top: 1px solid currentColor;
  margin-top: 4rem;
}

/* Theme-picker overlay (toggled by '?' key) */
.theme-picker-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,0.55);
  display: none;
  align-items: center; justify-content: center;
}
.theme-picker-overlay[data-open="true"] { display: flex; }
.theme-picker {
  background: var(--color-bg);
  color: var(--color-fg);
  border: 1px solid var(--color-fg);
  padding: 1.25rem 1.5rem;
  max-width: 420px;
  width: 90%;
}
.theme-picker h3 { margin-bottom: 0.5rem; font-family: var(--font-display); }
.theme-picker ul { list-style: none; padding: 0; margin: 0.75rem 0 0; display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; }
.theme-picker button { padding: 0.5rem 0.7rem; border: 1px solid var(--color-fg); width: 100%; text-align: left; font-size: 0.85rem; }
.theme-picker button[aria-current="true"] { background: var(--color-fg); color: var(--color-bg); }

/* Hidden helper */
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
```

- [ ] **Step 2: Commit**

```bash
git add css/base.css
git commit -m "feat(css): base reset, layout primitives L1-L4, universal selectors"
```

---

### Task 1.2: Create `css/tokens.css` — default CSS custom properties

**Files:**
- Create: `css/tokens.css`

These tokens are the **theme contract** — every theme must define these (or inherit defaults). Theme files override them inside `html[data-theme="N"]` selectors.

- [ ] **Step 1: Write `css/tokens.css`**

```css
/* css/tokens.css — default theme contract; themes override these */

:root {
  /* Colors (light mode defaults) */
  --color-bg: #fafafa;
  --color-fg: #111;
  --color-heading: #111;
  --color-accent: #1d4ed8;
  --color-accent-2: #1d4ed8;
  --color-muted: #555;

  /* Typography */
  --font-display: 'Inter', system-ui, sans-serif;
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  --font-size-body: 1rem;
  --line-height-body: 1.55;
  --heading-tracking: 0;
  --nav-brand-tracking: 0.08em;

  /* Layout & decoration */
  --space-unit: 1rem;
  --face-size: 200px;
  --btn-radius: 999px;
  --card-radius: 0;
  --card-bg: transparent;
  --card-border: 1px solid currentColor;
  --card-shadow: none;

  /* Nav background */
  --nav-bg: transparent;
  --nav-backdrop: none;
}

html[data-mode="dark"] {
  --color-bg: #0a0a0c;
  --color-fg: #f1f1f1;
  --color-heading: #ffffff;
  --color-muted: #aaa;
}
```

- [ ] **Step 2: Commit**

```bash
git add css/tokens.css
git commit -m "feat(css): default token contract"
```

---

### Task 1.3: Create `index.html` — universal scaffold

**Files:**
- Create: `index.html`

Single-page layout. Sections in order: hero, about, projects, publications (preview + link to full page), teaching, other. Top nav with 5 anchors. Hero contains face-tracker slot, name, role, quick-links bar.

- [ ] **Step 1: Write `index.html`**

```html
<!doctype html>
<html lang="en" data-theme="2" data-mode="light" data-layout="L1">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Kiran Garimella</title>
  <meta name="description" content="Kiran Garimella — Assistant Professor at Rutgers. Computational social science, misinformation, AI for the public good." />

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,900&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&family=Manrope:wght@300;400;600;700&family=PT+Serif:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,700;1,8..60,400&family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&family=Syne:wght@500;700;800&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <!-- theme-engine.js injects the chosen theme stylesheet before first paint -->
  <script src="js/theme-engine.js"></script>
</head>
<body>
  <a class="visually-hidden" href="#about">Skip to content</a>

  <header class="nav-bar" role="banner">
    <a class="nav-brand" href="#top">K.G.</a>
    <nav class="nav-links" id="navLinks" aria-label="Primary"></nav>
    <button class="nav-toggle" id="modeToggle" aria-label="Toggle dark mode">☀</button>
  </header>

  <main id="top">

    <section class="hero-section section" data-section="hero">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="hero-inner">
        <div class="hero-text">
          <h1 class="hero-name" id="heroName">Kiran Garimella</h1>
          <p class="hero-role" id="heroRole"></p>
          <p class="hero-tagline" id="heroTagline"></p>
          <div class="quick-links" id="quickLinks" aria-label="Quick links"></div>
        </div>
        <div class="hero-portrait">
          <div class="face-frame" id="faceFrame">
            <img id="faceImg" alt="Kiran Garimella" />
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="about" data-section="about">
      <h2 class="section-heading">About</h2>
      <div class="section-body" id="aboutBody"></div>
    </section>

    <section class="section" id="projects" data-section="projects">
      <h2 class="section-heading">Projects</h2>
      <div class="section-body" id="projectsBody"></div>
    </section>

    <section class="section" id="publications" data-section="publications">
      <h2 class="section-heading">Publications</h2>
      <div class="section-body" id="pubsBody"></div>
      <p class="section-cta"><a href="publications.html">See full list →</a></p>
    </section>

    <section class="section" id="teaching" data-section="teaching">
      <h2 class="section-heading">Teaching</h2>
      <div class="section-body" id="teachingBody"></div>
    </section>

    <section class="section" id="other" data-section="other">
      <h2 class="section-heading">Other</h2>
      <div class="section-body" id="otherBody"></div>
    </section>

  </main>

  <footer class="site-footer">
    <span id="copyright">© Kiran Garimella</span>
    <span id="themeName"></span>
    <a href="#top">↑ Top</a>
  </footer>

  <div class="theme-picker-overlay" id="themePicker">
    <div class="theme-picker">
      <h3>Themes</h3>
      <p style="font-size:0.82rem;opacity:0.7">Press Esc to close. Click to apply.</p>
      <ul id="themePickerList"></ul>
    </div>
  </div>

  <script src="data.js"></script>
  <script src="js/face-tracker.js"></script>
  <script src="js/nav.js"></script>
  <script src="js/content.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: index.html universal scaffold"
```

---

### Task 1.4: Create `js/theme-engine.js` — random theme picker, mode toggle, ? overlay

**Files:**
- Create: `js/theme-engine.js`

Runs **before** body paint (it's in `<head>`) so the theme stylesheet is injected synchronously. Picks a theme excluding the previous load. Exposes a `__theme` global with helpers for the picker overlay.

- [ ] **Step 1: Write `js/theme-engine.js`**

```javascript
/* js/theme-engine.js
 * Runs in <head> before body paint.
 * - Picks a random theme [1..10] excluding last_theme (localStorage).
 * - Honors ?theme=N URL override and localStorage.forced_theme override.
 * - Sets <html data-theme>, data-layout, data-mode.
 * - Injects css/themes/NN-name.css synchronously.
 * - Wires the mode toggle and ? overlay after DOMContentLoaded.
 */
(function () {
  'use strict';

  const THEMES = [
    { n: 1,  slug: 'reading-room',     name: 'Reading Room',    layout: 'L1' },
    { n: 2,  slug: 'whitebox',         name: 'Whitebox',        layout: 'L1' },
    { n: 3,  slug: 'notebook',         name: 'Notebook',        layout: 'L2' },
    { n: 4,  slug: 'risograph',        name: 'Risograph',       layout: 'L2' },
    { n: 5,  slug: 'editorial',        name: 'Editorial',       layout: 'L3' },
    { n: 6,  slug: 'specimen',         name: 'Specimen',        layout: 'L2' },
    { n: 7,  slug: 'brutalist-print',  name: 'Brutalist Print', layout: 'L3' },
    { n: 8,  slug: 'dither',           name: 'Dither',          layout: 'L1' },
    { n: 9,  slug: 'glitch',           name: 'Glitch',          layout: 'L4' },
    { n: 10, slug: 'particle-field',   name: 'Particle Field',  layout: 'L4' },
  ];

  const url = new URL(location.href);
  const urlTheme = parseInt(url.searchParams.get('theme'), 10);
  const forcedTheme = parseInt(localStorage.getItem('forced_theme') || '', 10);
  const last = parseInt(localStorage.getItem('last_theme') || '', 10);

  let pick;
  if (urlTheme >= 1 && urlTheme <= 10) {
    pick = urlTheme;
  } else if (forcedTheme >= 1 && forcedTheme <= 10) {
    pick = forcedTheme;
  } else {
    const candidates = THEMES.filter(t => t.n !== last).map(t => t.n);
    pick = candidates[Math.floor(Math.random() * candidates.length)];
  }
  localStorage.setItem('last_theme', String(pick));

  const theme = THEMES.find(t => t.n === pick);
  const padded = String(theme.n).padStart(2, '0');
  const cssHref = `css/themes/${padded}-${theme.slug}.css`;

  document.documentElement.setAttribute('data-theme', String(theme.n));
  document.documentElement.setAttribute('data-layout', theme.layout);

  // Mode (light/dark)
  let mode = localStorage.getItem('mode');
  if (!mode) mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-mode', mode);

  // Inject theme CSS synchronously (linked, not inlined, to keep things cacheable)
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssHref;
  document.head.appendChild(link);

  // Optional theme-specific JS (lazy, after DOMContentLoaded)
  const lazyScript = (theme.n === 8) ? 'js/theme-08-dither.js'
                  : (theme.n === 9) ? 'js/theme-09-glitch.js'
                  : (theme.n === 10) ? 'js/theme-10-particles.js'
                  : null;

  // Public API
  window.__theme = {
    THEMES,
    current: theme,
    setMode(newMode) {
      mode = newMode;
      document.documentElement.setAttribute('data-mode', newMode);
      localStorage.setItem('mode', newMode);
      window.dispatchEvent(new CustomEvent('modechange', { detail: { mode: newMode } }));
    },
    getMode() { return mode; },
    forceTheme(n) {
      if (n >= 1 && n <= 10) {
        localStorage.setItem('forced_theme', String(n));
        location.reload();
      }
    },
    clearForce() {
      localStorage.removeItem('forced_theme');
      location.reload();
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    // Footer name
    const themeName = document.getElementById('themeName');
    if (themeName) themeName.textContent = `designed in: ${theme.name} · #${theme.n}/10`;

    // Mode toggle
    const btn = document.getElementById('modeToggle');
    if (btn) {
      const update = () => { btn.textContent = (window.__theme.getMode() === 'dark') ? '☾' : '☀'; };
      update();
      btn.addEventListener('click', () => {
        window.__theme.setMode(window.__theme.getMode() === 'dark' ? 'light' : 'dark');
        update();
      });
      window.addEventListener('modechange', update);
    }

    // Theme picker overlay (? key)
    const overlay = document.getElementById('themePicker');
    const list = document.getElementById('themePickerList');
    if (overlay && list) {
      list.innerHTML = THEMES.map(t =>
        `<li><button data-theme="${t.n}" ${t.n === theme.n ? 'aria-current="true"' : ''}>${t.n}. ${t.name}</button></li>`
      ).join('');
      list.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-theme]');
        if (!b) return;
        window.__theme.forceTheme(parseInt(b.dataset.theme, 10));
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === '?' && !e.target.matches('input, textarea')) {
          e.preventDefault();
          overlay.setAttribute('data-open', overlay.getAttribute('data-open') === 'true' ? 'false' : 'true');
        } else if (e.key === 'Escape') {
          overlay.setAttribute('data-open', 'false');
        }
      });
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.setAttribute('data-open', 'false');
      });
    }

    // Lazy theme JS
    if (lazyScript) {
      const s = document.createElement('script');
      s.src = lazyScript;
      s.defer = true;
      document.body.appendChild(s);
    }
  });
})();
```

- [ ] **Step 2: Commit**

```bash
git add js/theme-engine.js
git commit -m "feat(js): theme engine — random pick, mode toggle, picker overlay"
```

---

### Task 1.5: Create `js/face-tracker.js` — gaze tracking + sunglasses swap

**Files:**
- Create: `js/face-tracker.js`

The `faces/` and `faces_with_sunglasses/` folders contain webps named `gaze_pxX_pyY_256.webp` where X and Y are pitch/yaw bins. We map cursor position → bin → filename. The folder used (`faces` vs `faces_with_sunglasses`) is determined by `data-mode` and updated reactively on mode change.

- [ ] **Step 1: Discover the available gaze bins**

```bash
ls /Users/kgarimella/Documents/personalWebpage/gvrkiran.github.io/new_site/faces/ | head -30
ls /Users/kgarimella/Documents/personalWebpage/gvrkiran.github.io/new_site/faces/ | wc -l
ls /Users/kgarimella/Documents/personalWebpage/gvrkiran.github.io/new_site/faces_with_sunglasses/ | wc -l
```

Expected: a list of `gaze_pxX_pyY_256.webp` filenames; equal counts in both folders.

- [ ] **Step 2: Write `js/face-tracker.js`**

```javascript
/* js/face-tracker.js
 * Cursor-driven gaze tracking. Maps cursor position to nearest available gaze bin
 * and swaps <img> src. On data-mode=dark, uses faces_with_sunglasses/.
 */
(function () {
  'use strict';

  const img = document.getElementById('faceImg');
  const frame = document.getElementById('faceFrame');
  if (!img || !frame) return;

  // Step A: enumerate available bins from filenames.
  // We hardcode a parse of the canonical naming because we cannot list a
  // directory from the browser; instead, we declare the known set here and
  // populate it from the filesystem listing during build/commit.
  // Bins are the cross product of these pitch/yaw values found in /faces.
  // (Generated by `ls faces/`, see Task 1.5 Step 1.)
  const PX_VALUES = [-15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15];
  const PY_VALUES = [-15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15];

  function fname(px, py) {
    const fmt = (v) => `${v < 0 ? '-' : ''}${Math.abs(v)}p0`;
    // The actual naming uses 'p' for the decimal: e.g. gaze_px0p0_py12p0_256.webp
    return `gaze_px${fmt(px)}_py${fmt(py)}_256.webp`;
  }

  function nearest(values, v) {
    return values.reduce((best, x) => Math.abs(x - v) < Math.abs(best - v) ? x : best, values[0]);
  }

  function folder() {
    return document.documentElement.getAttribute('data-mode') === 'dark'
      ? 'faces_with_sunglasses' : 'faces';
  }

  let lastSrc = '';
  function setSrc(px, py) {
    const f = `${folder()}/${fname(px, py)}`;
    if (f !== lastSrc) { img.src = f; lastSrc = f; }
  }

  // Initial face — looking straight ahead
  setSrc(0, 0);

  // Throttle mousemove
  let raf = 0;
  let pendingX = 0, pendingY = 0;
  function onMove(e) {
    pendingX = e.clientX;
    pendingY = e.clientY;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const rect = frame.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // Map cursor offset to gaze axis. Yaw (px) follows horizontal cursor relative to face center.
      // Range is clamped at +/- 15 (the max bin).
      const dx = pendingX - cx;
      const dy = pendingY - cy;
      const maxDist = Math.max(window.innerWidth, window.innerHeight) / 2;
      const px = Math.max(-15, Math.min(15, (dx / maxDist) * 15));
      const py = Math.max(-15, Math.min(15, (dy / maxDist) * 15));
      setSrc(nearest(PX_VALUES, Math.round(px / 3) * 3), nearest(PY_VALUES, Math.round(py / 3) * 3));
    });
  }
  window.addEventListener('mousemove', onMove, { passive: true });

  // Touch fallback
  window.addEventListener('touchmove', (e) => {
    if (!e.touches || !e.touches.length) return;
    onMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
  }, { passive: true });

  // Mode change: swap folder + cross-fade
  window.addEventListener('modechange', () => {
    img.style.opacity = '0';
    setTimeout(() => {
      lastSrc = ''; setSrc(0, 0);
      img.style.opacity = '1';
    }, 220);
  });
  img.style.transition = 'opacity 220ms ease';

  // Reduced motion: skip mousemove tracking, use neutral gaze
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.removeEventListener('mousemove', onMove);
    setSrc(0, 0);
  }
})();
```

- [ ] **Step 3: Verify the bin values match real filenames**

```bash
ls /Users/kgarimella/Documents/personalWebpage/gvrkiran.github.io/new_site/faces/ | head -3
```

If the real filenames use different decimal formatting (e.g. `gaze_px0_py12_256.webp` without `p0`), update the `fname()` function accordingly. The canonical sample observed earlier was `gaze_px0p0_py12p0_256.webp`.

- [ ] **Step 4: Commit**

```bash
git add js/face-tracker.js
git commit -m "feat(js): face tracker — cursor gaze + sunglasses-on-dark swap"
```

---

### Task 1.6: Create `js/nav.js` — render nav links + smooth anchor scroll

**Files:**
- Create: `js/nav.js`

- [ ] **Step 1: Write `js/nav.js`**

```javascript
/* js/nav.js — render the 5-item nav, smooth-scroll anchors */
(function () {
  'use strict';
  const links = [
    { label: 'About',        href: '#about' },
    { label: 'Publications', href: '#publications' },
    { label: 'Projects',     href: '#projects' },
    { label: 'Teaching',     href: '#teaching' },
    { label: 'Other',        href: '#other' },
  ];
  const nav = document.getElementById('navLinks');
  if (!nav) return;
  nav.innerHTML = links.map(l => `<a href="${l.href}">${l.label}</a>`).join('');
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
```

- [ ] **Step 2: Commit**

```bash
git add js/nav.js
git commit -m "feat(js): nav rendering + smooth scroll"
```

---

### Task 1.7: Create `js/content.js` — populate sections from `data.js`

**Files:**
- Create: `js/content.js`

- [ ] **Step 1: Write `js/content.js`**

```javascript
/* js/content.js — populate hero + sections from PROFILE / KEYWORDS / PROJECTS / PUBLICATIONS / TEACHING in data.js */
(function () {
  'use strict';
  const P = window.PROFILE || {};
  const KEYWORDS    = window.KEYWORDS    || [];
  const PROJECTS    = window.PROJECTS    || [];
  const PUBS        = window.PUBLICATIONS || [];
  const TEACH       = window.TEACHING    || [];

  const $ = (id) => document.getElementById(id);

  // Hero
  if ($('heroName')) $('heroName').textContent = P.name || 'Kiran Garimella';
  if ($('heroRole')) $('heroRole').textContent = P.role || '';
  if ($('heroTagline')) $('heroTagline').textContent = P.tagline || '';

  // Quick links — Email, CV, LinkedIn, Twitter, Scholar
  const ql = $('quickLinks');
  if (ql) {
    const s = P.socials || {};
    const items = [
      { label: 'Email',    href: P.email ? `mailto:${P.email}` : null },
      { label: 'CV',       href: P.cvUrl || s.cv || null },
      { label: 'LinkedIn', href: s.linkedin || null },
      { label: 'Twitter',  href: s.twitter  || null },
      { label: 'Scholar',  href: s.scholar  || null },
    ].filter(it => it.href);
    ql.innerHTML = items.map(it => `<a href="${it.href}" target="_blank" rel="noopener">${it.label}</a>`).join('');
  }

  // About
  const aboutBody = $('aboutBody');
  if (aboutBody) {
    const tags = KEYWORDS.map(k => `<span class="kw">${k}</span>`).join('');
    aboutBody.innerHTML = `
      <p class="about-para">${P.tagline || ''}</p>
      <p class="about-meta">${P.role || ''} · ${P.location || ''}</p>
      <div class="kw-list">${tags}</div>
    `;
  }

  // Projects (top 5)
  const projBody = $('projectsBody');
  if (projBody) {
    projBody.innerHTML = PROJECTS.slice(0, 5).map(p => {
      const tags = (p.tags || []).map(t => `<span class="kw">${t}</span>`).join('');
      return `
        <article class="card project-card">
          <h3>${p.title}</h3>
          <p>${p.summary}</p>
          <div class="kw-list">${tags}</div>
        </article>`;
    }).join('');
  }

  // Publications preview (top 5)
  const pubsBody = $('pubsBody');
  if (pubsBody) {
    pubsBody.innerHTML = PUBS.slice(0, 5).map(p => {
      const authors = Array.isArray(p.authors) ? p.authors.join(', ') : (p.authors || '');
      const links = (p.links || []).map(l => `<a href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join(' · ');
      return `
        <article class="card pub-card">
          <h3>${p.title}</h3>
          <p class="pub-meta">${authors} · <em>${p.venue || ''}</em> · ${p.year || ''}</p>
          ${links ? `<p class="pub-links">${links}</p>` : ''}
        </article>`;
    }).join('');
  }

  // Teaching
  const teachBody = $('teachingBody');
  if (teachBody) {
    if (TEACH.length === 0) {
      teachBody.innerHTML = `<p>Course materials and pedagogy notes coming back online.</p>`;
    } else {
      teachBody.innerHTML = TEACH.map(t => `
        <article class="card">
          <h3>${t.title}</h3>
          <p>${t.summary || ''}</p>
        </article>`).join('');
    }
  }

  // Other (blog, talks, github, contact)
  const otherBody = $('otherBody');
  if (otherBody) {
    const s = P.socials || {};
    const links = [
      P.blog    ? { label: 'Blog (Substack)', href: P.blog } : null,
      s.github  ? { label: 'GitHub',          href: s.github } : null,
      P.email   ? { label: 'Email',           href: `mailto:${P.email}` } : null,
    ].filter(Boolean);
    otherBody.innerHTML = `
      <ul class="other-list">${links.map(l => `<li><a href="${l.href}" target="_blank" rel="noopener">${l.label}</a></li>`).join('')}</ul>
    `;
  }

  // Copyright
  const cr = $('copyright');
  if (cr) cr.textContent = `© ${new Date().getFullYear()} Kiran Garimella`;
})();
```

- [ ] **Step 2: Commit**

```bash
git add js/content.js
git commit -m "feat(js): populate sections from data.js"
```

---

### Task 1.8: Smoke test — site loads, default theme renders

- [ ] **Step 1: Start preview server**

Use `preview_start` rooted at `new_site/`. The page should load `index.html` and render the default theme (theme 2 set in the `<html data-theme="2">` attribute, before the engine kicks in — but the engine then chooses one randomly).

- [ ] **Step 2: Verify page loads with no console errors**

```
preview_console_logs (pattern: 'error|warning')
```

Expected: no errors. (May see 404 for the not-yet-created theme CSS file — note this and proceed.)

- [ ] **Step 3: Force theme 2 (Whitebox) for inspection later**

```
preview_eval: localStorage.setItem('forced_theme','2'); location.reload()
```

(Theme CSS files don't exist yet — the page will render only base.css + tokens.css. That's correct for this checkpoint.)

- [ ] **Step 4: Verify face tracker tracks cursor**

```
preview_eval: document.getElementById('faceImg').src
```

Should return a URL ending in `gaze_px0p0_py0p0_256.webp` (initial neutral face).

Move the cursor (or use `preview_click`) — the src should change.

- [ ] **Step 5: Commit checkpoint**

No new files; this is a verification-only step. If a fix is needed, fix and commit.

---

## Phase 2 — AI Image Generation

### Task 2.1: Write `scripts/generate_ai_images.py`

**Files:**
- Create: `scripts/generate_ai_images.py`

Python script that calls OpenAI `gpt-image-1` for the 3 needed images, writes PNGs to `assets/ai/`. Idempotent: skips files that exist.

- [ ] **Step 1: Write the script**

```python
#!/usr/bin/env python3
"""generate_ai_images.py — one-off generator for theme hero images.

Reads OPENAI_API_KEY from env. Generates 3 images at medium quality, 1024x1024.
Idempotent: skips files that already exist.

Usage:
    OPENAI_API_KEY=sk-... python3 scripts/generate_ai_images.py
"""

import base64
import json
import os
import sys
import urllib.request
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parents[1] / "assets" / "ai"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPTS = {
    "04-risograph-hero.png": (
        "A 2-color risograph print poster, fluoro red and cobalt blue, slightly off-register, "
        "abstract editorial composition with overlapping geometric shapes representing networks "
        "and information flow. Heavy paper grain texture, ink-edge feel, no text, no people. "
        "Composition is vertical, balanced, white margins on all sides. Hand-printed indie poster aesthetic."
    ),
    "05-editorial-hero.png": (
        "Wide-format abstract editorial illustration in an ivory and gold palette, "
        "evoking the cover of a quiet international research journal. Soft textures, hairline ink "
        "strokes suggesting a global communication network. No text, no people. Calm, dignified, "
        "spacious composition. New York Times Magazine sensibility."
    ),
    "07-brutalist-poster.png": (
        "A brutalist Swiss-style poster composition: oversized geometric shapes, hard edges, "
        "chartreuse and deep black on cream newsprint. Heavy grid feel, wedge-serif typographic "
        "fragments visible but unreadable, 1970s academic poster sensibility. No legible text, "
        "no people, no logos. Confident, austere, a little weird."
    ),
}


def request_image(prompt: str, api_key: str) -> bytes:
    """Call OpenAI Images API and return raw PNG bytes."""
    body = json.dumps({
        "model": "gpt-image-1",
        "prompt": prompt,
        "size": "1024x1024",
        "quality": "medium",
        "n": 1,
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        payload = json.load(resp)
    b64 = payload["data"][0]["b64_json"]
    return base64.b64decode(b64)


def main() -> int:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY not set; aborting (themes will fall back to SVG placeholders).", file=sys.stderr)
        return 2

    for filename, prompt in PROMPTS.items():
        out = OUT_DIR / filename
        if out.exists():
            print(f"skip (exists): {out.name}")
            continue
        print(f"generating: {out.name} ...")
        try:
            data = request_image(prompt, api_key)
        except Exception as e:
            print(f"  FAILED: {e}", file=sys.stderr)
            continue
        out.write_bytes(data)
        print(f"  wrote {out} ({len(data)//1024} KB)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 2: Make executable**

```bash
chmod +x scripts/generate_ai_images.py
```

- [ ] **Step 3: Commit**

```bash
git add scripts/generate_ai_images.py
git commit -m "feat(scripts): AI image generator using OpenAI gpt-image-1"
```

---

### Task 2.2: Run the generator

- [ ] **Step 1: Run it (sources OPENAI_API_KEY from user shell)**

```bash
cd /Users/kgarimella/Documents/personalWebpage/gvrkiran.github.io/new_site
# Source the user's shell so OPENAI_API_KEY is in env
zsh -c 'source ~/.zshrc 2>/dev/null; source ~/.zprofile 2>/dev/null; OPENAI_API_KEY="$OPENAI_API_KEY" python3 scripts/generate_ai_images.py'
```

If the env var isn't in the shell config, ask the user to either export it or paste it once. Never log the key.

- [ ] **Step 2: Verify the 3 images exist**

```bash
ls -la assets/ai/
```

Expected: 3 PNG files between 100KB and 1.5MB each.

- [ ] **Step 3: Commit the generated images**

```bash
git add assets/ai/
git commit -m "assets: add AI-generated hero images for themes 4, 5, 7"
```

If generation failed or the key wasn't available, skip the commit — the affected themes (4 Risograph, 5 Editorial, 7 Brutalist) will fall back to SVG placeholders. Note this in the QA pass and revisit later.

---

## Phase 3 — Themes (1 of 10 each)

Each theme task creates a single CSS file at `css/themes/NN-name.css`. The file uses a `html[data-theme="N"]` selector to scope all overrides.

### Task 3.1: Theme 2 — Whitebox (do this first; simplest validation of the system)

**Files:**
- Create: `css/themes/02-whitebox.css`

**Layout:** L1. **Vibe:** Stripe Press / Linear restraint. Inter, near-monochrome, single cobalt accent.

- [ ] **Step 1: Write `css/themes/02-whitebox.css`**

```css
/* Theme 2 — Whitebox. Layout: L1. */

html[data-theme="2"] {
  --color-bg: #ffffff;
  --color-fg: #0b0b0d;
  --color-heading: #0b0b0d;
  --color-accent: #1d4ed8;
  --color-accent-2: #93c5fd;
  --color-muted: #6b7280;

  --font-display: 'Inter', system-ui, sans-serif;
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;

  --line-height-body: 1.65;
  --heading-tracking: -0.02em;

  --face-size: 140px;
  --btn-radius: 999px;
  --card-bg: transparent;
  --card-border: 1px solid #e5e7eb;
  --card-radius: 12px;
  --card-shadow: 0 1px 2px rgba(0,0,0,0.02);
}
html[data-theme="2"][data-mode="dark"] {
  --color-bg: #0a0a0c;
  --color-fg: #f3f4f6;
  --color-heading: #ffffff;
  --color-accent: #93c5fd;
  --color-accent-2: #1d4ed8;
  --color-muted: #9ca3af;
  --card-border: 1px solid #1f2937;
}

html[data-theme="2"] .nav-bar {
  --nav-bg: rgba(255,255,255,0.85);
  --nav-backdrop: blur(12px) saturate(120%);
  border-bottom: 1px solid #f3f4f6;
}
html[data-theme="2"][data-mode="dark"] .nav-bar {
  --nav-bg: rgba(10,10,12,0.85);
  border-bottom-color: #1f2937;
}

html[data-theme="2"] .hero-name {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.4rem, 7vw, 4.6rem);
  letter-spacing: -0.025em;
  line-height: 1.05;
}
html[data-theme="2"] .hero-role {
  margin-top: 0.6rem;
  font-size: 1.1rem;
  color: var(--color-muted);
  font-weight: 500;
}
html[data-theme="2"] .hero-tagline {
  margin-top: 1rem;
  font-size: 1.15rem;
  max-width: 52ch;
  color: var(--color-fg);
}

html[data-theme="2"] .face-frame {
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
}
html[data-theme="2"][data-mode="dark"] .face-frame {
  border-color: #1f2937;
  background: #0f1014;
}

html[data-theme="2"] .quick-links { margin-top: 1.5rem; gap: 0.45rem; }
html[data-theme="2"] .quick-links a {
  border-color: #e5e7eb;
  color: var(--color-fg);
  font-weight: 500;
  font-size: 0.92rem;
  padding: 0.5rem 1rem;
}
html[data-theme="2"] .quick-links a:hover {
  background: var(--color-fg);
  color: var(--color-bg);
  border-color: var(--color-fg);
}
html[data-theme="2"][data-mode="dark"] .quick-links a { border-color: #1f2937; }

html[data-theme="2"] .section-heading {
  font-weight: 700;
  font-size: clamp(1.6rem, 2.6vw, 2rem);
  letter-spacing: -0.02em;
  color: var(--color-heading);
  margin-bottom: 1.6rem;
}

html[data-theme="2"] .card { padding: 1.4rem 1.6rem; }
html[data-theme="2"] .card h3 { font-weight: 700; font-size: 1.1rem; letter-spacing: -0.01em; margin-bottom: 0.4rem; }
html[data-theme="2"] .card p { color: var(--color-muted); }

html[data-theme="2"] .kw-list { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 1rem; }
html[data-theme="2"] .kw {
  font-size: 0.78rem; padding: 0.2rem 0.6rem;
  border-radius: 999px; background: #f3f4f6; color: #374151;
}
html[data-theme="2"][data-mode="dark"] .kw { background: #111317; color: #d1d5db; }

html[data-theme="2"] .section-cta a { color: var(--color-accent); font-weight: 600; }
html[data-theme="2"] .other-list { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.5rem; }
html[data-theme="2"] .other-list a { padding: 0.7rem 1rem; border: 1px solid #e5e7eb; border-radius: 12px; display: block; }
html[data-theme="2"][data-mode="dark"] .other-list a { border-color: #1f2937; }
```

- [ ] **Step 2: Verify**

```
preview_eval: localStorage.setItem('forced_theme','2'); location.reload()
preview_screenshot
```

Check:
- [ ] No layout shift / flash of unstyled content
- [ ] Hero name large, weight 800, tracking tight
- [ ] Face frame is a clean rounded square, hairline border
- [ ] Quick links render as 5 pill buttons
- [ ] Nav bar has subtle backdrop blur
- [ ] Toggle to dark mode (click ☀): face dons sunglasses, palette flips, no harsh contrast jumps
- [ ] Move cursor: face tracks
- [ ] No console errors

- [ ] **Step 3: Commit**

```bash
git add css/themes/02-whitebox.css
git commit -m "feat(theme): 02 Whitebox"
```

---

### Task 3.2: Theme 1 — Reading Room

**Files:**
- Create: `css/themes/01-reading-room.css`

**Layout:** L1. **Vibe:** Aaronson / Narayanan. EB Garamond. Drop caps. Oxblood accent.

- [ ] **Step 1: Write `css/themes/01-reading-room.css`**

```css
/* Theme 1 — Reading Room. Layout: L1. */

html[data-theme="1"] {
  --color-bg: #fbfaf6;
  --color-fg: #1a1a1a;
  --color-heading: #1a1a1a;
  --color-accent: #6b1d1d;
  --color-accent-2: #b08585;
  --color-muted: #5a5854;

  --font-display: 'EB Garamond', Georgia, serif;
  --font-heading: 'EB Garamond', Georgia, serif;
  --font-body: 'EB Garamond', Georgia, serif;

  --font-size-body: 1.08rem;
  --line-height-body: 1.7;
  --heading-tracking: 0.02em;
  --nav-brand-tracking: 0.16em;

  --face-size: 96px;
  --btn-radius: 0;
}
html[data-theme="1"][data-mode="dark"] {
  --color-bg: #15140f;
  --color-fg: #ece7d8;
  --color-heading: #fff8e7;
  --color-accent: #d6a3a3;
}

html[data-theme="1"] .nav-bar { --nav-bg: transparent; border-bottom: 1px solid currentColor; }
html[data-theme="1"] .nav-brand { font-variant: small-caps; letter-spacing: 0.18em; font-weight: 600; }
html[data-theme="1"] .nav-links a { font-variant: small-caps; letter-spacing: 0.12em; font-size: 0.85rem; }
html[data-theme="1"] .nav-toggle { border: 1px solid currentColor; border-radius: 0; }

html[data-theme="1"] .face-frame {
  border-radius: 50%;
  filter: grayscale(100%) contrast(0.95);
  border: 1px solid currentColor;
}

html[data-theme="1"] .hero-inner { gap: 1.2rem; }
html[data-theme="1"] .hero-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  letter-spacing: 0.01em;
  line-height: 1.1;
}
html[data-theme="1"] .hero-role { font-style: italic; color: var(--color-muted); font-size: 1.05rem; }
html[data-theme="1"] .hero-tagline { font-size: 1.15rem; max-width: 52ch; }

html[data-theme="1"] .quick-links { gap: 0; justify-content: center; }
html[data-theme="1"] .quick-links a {
  border: 0;
  border-radius: 0;
  padding: 0.2rem 0.6rem;
  font-style: italic;
  position: relative;
}
html[data-theme="1"] .quick-links a:not(:last-child)::after {
  content: '·';
  position: absolute;
  right: -0.05em;
  opacity: 0.6;
}
html[data-theme="1"] .quick-links a:hover { background: transparent; color: var(--color-accent); }

html[data-theme="1"] .section-heading {
  font-weight: 600;
  font-style: italic;
  font-size: 1.6rem;
  text-align: center;
  border-bottom: 1px solid currentColor;
  padding-bottom: 0.5rem;
  margin-bottom: 1.4rem;
}

html[data-theme="1"] .about-para { font-size: 1.2rem; line-height: 1.7; }
html[data-theme="1"] .about-para::first-letter {
  font-size: 3.2em;
  float: left;
  line-height: 0.9;
  padding: 0.05em 0.1em 0 0;
  font-weight: 700;
  color: var(--color-accent);
}

html[data-theme="1"] .card { border: 0; border-top: 1px solid currentColor; border-radius: 0; padding: 1rem 0; }
html[data-theme="1"] .card h3 { font-weight: 600; font-size: 1.2rem; }
html[data-theme="1"] .card p { color: var(--color-fg); }

html[data-theme="1"] .kw-list { gap: 0.4rem; }
html[data-theme="1"] .kw { font-style: italic; font-size: 0.9rem; opacity: 0.7; padding: 0; }
html[data-theme="1"] .kw::before { content: '— '; }

html[data-theme="1"] .pub-meta { font-style: italic; color: var(--color-muted); }
html[data-theme="1"] .other-list { list-style: none; padding: 0; }
html[data-theme="1"] .other-list li { padding: 0.4rem 0; border-top: 1px solid currentColor; }
```

- [ ] **Step 2: Verify**

```
preview_eval: localStorage.setItem('forced_theme','1'); location.reload()
preview_screenshot
```

Check:
- [ ] Body text is EB Garamond, ~1.08rem, line-height 1.7
- [ ] Face is grayscale circle 96px
- [ ] Hero quick-links are inline italic with `·` separators (not pills)
- [ ] About paragraph has a drop-cap in oxblood
- [ ] Section headings are centered italic with horizontal rule
- [ ] Dark mode: cream-on-ink, accent shifts to dusty rose

- [ ] **Step 3: Commit**

```bash
git add css/themes/01-reading-room.css
git commit -m "feat(theme): 01 Reading Room"
```

---

### Task 3.3: Theme 3 — Notebook

**Files:**
- Create: `css/themes/03-notebook.css`
- Create: `assets/ornaments/notebook-arrow.svg`
- Create: `assets/ornaments/notebook-tape.svg`

**Layout:** L2. **Vibe:** researcher's notebook. Cream paper, serif + mono mix, hand-drawn arrows, polaroid face.

- [ ] **Step 1: Create the SVG ornaments**

```bash
cat > /Users/kgarimella/Documents/personalWebpage/gvrkiran.github.io/new_site/assets/ornaments/notebook-arrow.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="40" viewBox="0 0 80 40" fill="none">
  <path d="M2 25 Q 20 5, 50 20 T 75 18" stroke="#b3322c" stroke-width="2" stroke-linecap="round" fill="none" stroke-dasharray="0,0" />
  <path d="M68 13 L 76 18 L 70 25" stroke="#b3322c" stroke-width="2" stroke-linecap="round" fill="none" />
</svg>
SVG
```

```bash
cat > /Users/kgarimella/Documents/personalWebpage/gvrkiran.github.io/new_site/assets/ornaments/notebook-tape.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="60" height="22" viewBox="0 0 60 22" fill="none">
  <rect x="2" y="3" width="56" height="16" fill="#fef9c3" opacity="0.85" transform="rotate(-3 30 11)" />
  <rect x="2" y="3" width="56" height="16" fill="none" stroke="#d4cf9a" stroke-width="0.5" transform="rotate(-3 30 11)" stroke-dasharray="3,2" />
</svg>
SVG
```

- [ ] **Step 2: Write `css/themes/03-notebook.css`**

```css
/* Theme 3 — Notebook. Layout: L2. */

html[data-theme="3"] {
  --color-bg: #f4ecd8;
  --color-fg: #2d2a26;
  --color-heading: #2d2a26;
  --color-accent: #b3322c;
  --color-accent-2: #6e8b3d;
  --color-muted: #7a6f5e;

  --font-display: 'Source Serif 4', Georgia, serif;
  --font-heading: 'Source Serif 4', Georgia, serif;
  --font-body: 'Source Serif 4', Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;

  --line-height-body: 1.65;
  --face-size: 180px;
  --btn-radius: 8px;
}
html[data-theme="3"][data-mode="dark"] {
  --color-bg: #2a241d;
  --color-fg: #f0e6cf;
  --color-heading: #fff;
  --color-accent: #e89b88;
  --color-muted: #b8a98c;
}

/* Paper noise via subtle SVG noise data-uri */
html[data-theme="3"] body {
  background-image:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.18  0 0 0 0 0.16  0 0 0 0 0.14  0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  background-blend-mode: multiply;
  background-size: 200px 200px;
}

html[data-theme="3"] .nav-bar { --nav-bg: rgba(244,236,216,0.85); --nav-backdrop: blur(8px); border-bottom: 1px dashed currentColor; }
html[data-theme="3"][data-mode="dark"] .nav-bar { --nav-bg: rgba(42,36,29,0.85); }
html[data-theme="3"] .nav-brand { font-family: var(--font-mono); font-size: 0.95rem; }
html[data-theme="3"] .nav-links a { font-family: var(--font-mono); font-size: 0.85rem; }

html[data-theme="3"] .face-frame {
  background: #fff;
  padding: 0.6rem 0.6rem 1.4rem;
  box-shadow: 4px 6px 0 rgba(0,0,0,0.08), 6px 12px 18px rgba(0,0,0,0.05);
  transform: rotate(-2.6deg);
  position: relative;
  width: 200px;
  height: 240px;
}
html[data-theme="3"] .face-frame img { width: 100%; height: 180px; object-fit: cover; }
html[data-theme="3"] .face-frame::before {
  content: '';
  position: absolute;
  top: -10px; left: 50%;
  transform: translateX(-50%) rotate(-3deg);
  width: 60px; height: 22px;
  background: url('../../assets/ornaments/notebook-tape.svg') no-repeat center/contain;
}

html[data-theme="3"] .hero-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1.05;
}
html[data-theme="3"] .hero-role { font-family: var(--font-mono); font-size: 0.95rem; color: var(--color-muted); margin-top: 0.4rem; }
html[data-theme="3"] .hero-tagline { font-size: 1.1rem; max-width: 50ch; margin-top: 0.8rem; }

html[data-theme="3"] .quick-links { margin-top: 1rem; }
html[data-theme="3"] .quick-links a {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  padding: 0.4rem 0.8rem;
  border: 1.5px solid currentColor;
  border-radius: 18px 12px 16px 10px; /* hand-drawn-ish */
  background: rgba(255,255,255,0.5);
}
html[data-theme="3"][data-mode="dark"] .quick-links a { background: rgba(0,0,0,0.25); }

html[data-theme="3"] .section-heading {
  font-family: var(--font-display);
  font-weight: 700;
  font-style: italic;
  position: relative;
  display: inline-block;
}
html[data-theme="3"] .section-heading::after {
  content: '';
  display: block;
  width: 60px; height: 6px;
  background: url('../../assets/ornaments/notebook-arrow.svg') no-repeat center/contain;
  margin-top: 4px;
  margin-left: 0.4em;
}

html[data-theme="3"] .card {
  background: rgba(255,255,255,0.45);
  border: 1px dashed currentColor;
  border-radius: 4px;
  padding: 1rem 1.2rem;
}
html[data-theme="3"][data-mode="dark"] .card { background: rgba(0,0,0,0.18); }
html[data-theme="3"] .card h3 { font-family: var(--font-display); font-style: italic; font-weight: 700; }

html[data-theme="3"] .kw { font-family: var(--font-mono); font-size: 0.72rem; padding: 0.15rem 0.5rem; background: rgba(179,50,44,0.12); border: 1px solid rgba(179,50,44,0.4); border-radius: 999px; }

html[data-theme="3"] .other-list { list-style: none; padding: 0; }
html[data-theme="3"] .other-list li { padding: 0.5rem 0; border-bottom: 1px dashed currentColor; }
html[data-theme="3"] .other-list li::before { content: '— '; color: var(--color-accent); }
```

- [ ] **Step 3: Verify**

```
preview_eval: localStorage.setItem('forced_theme','3'); location.reload()
preview_screenshot
```

Check:
- [ ] Cream paper background with subtle noise
- [ ] Face is a polaroid, slightly rotated, with masking-tape SVG at top-center
- [ ] Quick-links use mono font, hand-drawn-ish irregular border-radius
- [ ] Section headings have an SVG arrow underline
- [ ] Cards have dashed borders
- [ ] Dark mode: warm leather brown

- [ ] **Step 4: Commit**

```bash
git add css/themes/03-notebook.css assets/ornaments/notebook-arrow.svg assets/ornaments/notebook-tape.svg
git commit -m "feat(theme): 03 Notebook"
```

---

### Task 3.4: Theme 4 — Risograph

**Files:**
- Create: `css/themes/04-risograph.css`

**Layout:** L2. **Vibe:** 2-color riso print. Söhne→Manrope, PT Serif. Fluoro red + cobalt + grain.

- [ ] **Step 1: Write `css/themes/04-risograph.css`**

```css
/* Theme 4 — Risograph. Layout: L2. */

html[data-theme="4"] {
  --color-bg: #f5f1ea;
  --color-fg: #14110d;
  --color-heading: #14110d;
  --color-accent: #ff5454;
  --color-accent-2: #2c50e0;
  --color-muted: #5b574e;

  --font-display: 'Manrope', system-ui, sans-serif;
  --font-heading: 'Manrope', system-ui, sans-serif;
  --font-body: 'PT Serif', Georgia, serif;

  --face-size: 200px;
  --btn-radius: 0;
}
html[data-theme="4"][data-mode="dark"] {
  --color-bg: #1c1a16;
  --color-fg: #f0ebde;
  --color-accent: #ff7373;
  --color-accent-2: #5b80ff;
}

/* Grain overlay on body */
html[data-theme="4"] body::before {
  content: '';
  position: fixed; inset: 0;
  pointer-events: none; z-index: 1;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='1.6' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.07 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  mix-blend-mode: multiply;
}

html[data-theme="4"] .nav-bar { --nav-bg: transparent; }
html[data-theme="4"] .nav-brand { color: var(--color-accent); font-weight: 800; letter-spacing: 0.04em; }
html[data-theme="4"] .nav-links a { font-weight: 600; }

html[data-theme="4"] .face-frame {
  border: 0;
  border-radius: 0;
  position: relative;
  filter: contrast(1.05);
}
/* Riso duotone via two layered images using mix-blend-mode */
html[data-theme="4"] .face-frame img {
  filter: grayscale(100%) contrast(1.2);
  mix-blend-mode: multiply;
}
html[data-theme="4"] .face-frame::before {
  content: '';
  position: absolute; inset: 0;
  background: var(--color-accent);
  mix-blend-mode: screen;
  opacity: 0.55;
  pointer-events: none;
}
html[data-theme="4"] .face-frame::after {
  content: '';
  position: absolute; inset: 4px -8px -6px 6px;
  background: var(--color-accent-2);
  mix-blend-mode: multiply;
  opacity: 0.35;
  z-index: -1;
  pointer-events: none;
}

html[data-theme="4"] .hero-name {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.4rem, 7vw, 4.4rem);
  letter-spacing: -0.03em;
  color: var(--color-accent-2);
  text-shadow: 3px 3px 0 var(--color-accent);
}
html[data-theme="4"][data-mode="dark"] .hero-name { color: var(--color-accent); text-shadow: 3px 3px 0 var(--color-accent-2); }
html[data-theme="4"] .hero-role { font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.85rem; color: var(--color-fg); }
html[data-theme="4"] .hero-tagline { font-family: var(--font-body); font-size: 1.1rem; max-width: 50ch; }

html[data-theme="4"] .quick-links a {
  border: 2px solid var(--color-fg);
  background: var(--color-bg);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.78rem;
  padding: 0.55rem 1rem;
  box-shadow: 3px 3px 0 var(--color-accent);
}
html[data-theme="4"] .quick-links a:hover { background: var(--color-accent); color: var(--color-bg); border-color: var(--color-accent); }

html[data-theme="4"] .section-heading {
  font-family: var(--font-display);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: var(--color-accent-2);
  text-shadow: 2px 2px 0 var(--color-accent);
}

html[data-theme="4"] .card {
  background: rgba(255,255,255,0.5);
  border: 2px solid var(--color-fg);
  border-radius: 0;
  box-shadow: 6px 6px 0 var(--color-accent-2);
}
html[data-theme="4"][data-mode="dark"] .card { background: rgba(0,0,0,0.35); }
html[data-theme="4"] .card h3 { font-family: var(--font-display); font-weight: 800; }

html[data-theme="4"] .kw { background: var(--color-accent); color: #fff; font-weight: 700; font-size: 0.72rem; padding: 0.15rem 0.55rem; border-radius: 0; text-transform: uppercase; }

/* AI hero image used as section divider between hero and about, if present */
html[data-theme="4"] #about::before {
  content: '';
  display: block;
  height: 240px;
  margin-bottom: 2rem;
  background: url('../../assets/ai/04-risograph-hero.png') no-repeat center/cover;
  filter: contrast(1.05);
}
```

- [ ] **Step 2: Verify**

```
preview_eval: localStorage.setItem('forced_theme','4'); location.reload()
preview_screenshot
```

Check:
- [ ] Grain overlay visible faintly
- [ ] Hero name uses cobalt + red drop-shadow combo
- [ ] Face frame shows red duotone effect with cobalt offset behind
- [ ] Quick-links are square with hard offset shadow
- [ ] If AI image exists, it appears as hero of the About section

- [ ] **Step 3: Commit**

```bash
git add css/themes/04-risograph.css
git commit -m "feat(theme): 04 Risograph"
```

---

### Task 3.5: Theme 5 — Editorial

**Files:**
- Create: `css/themes/05-editorial.css`

**Layout:** L3. **Vibe:** NYT Magazine / Stripe Press. Fraunces display + Inter body. Drop caps. Folio numbers.

- [ ] **Step 1: Write `css/themes/05-editorial.css`**

```css
/* Theme 5 — Editorial. Layout: L3. */

html[data-theme="5"] {
  --color-bg: #f8f5ee;
  --color-fg: #14110d;
  --color-heading: #14110d;
  --color-accent: #b08a3a;
  --color-accent-2: #6f5320;
  --color-muted: #6e6a60;

  --font-display: 'Fraunces', 'EB Garamond', Georgia, serif;
  --font-heading: 'Fraunces', 'EB Garamond', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;

  --font-size-body: 1rem;
  --line-height-body: 1.65;
  --face-size: 320px;
  --btn-radius: 0;
}
html[data-theme="5"][data-mode="dark"] {
  --color-bg: #1d1518;
  --color-fg: #f5ecdf;
  --color-heading: #fff;
  --color-accent: #d6b56a;
  --color-accent-2: #f1d99d;
}

html[data-theme="5"] .nav-bar { border-bottom: 1px solid currentColor; --nav-bg: var(--color-bg); }
html[data-theme="5"] .nav-brand { font-family: var(--font-display); font-weight: 900; font-style: italic; font-size: 1.4rem; letter-spacing: 0; }
html[data-theme="5"] .nav-links a { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.18em; font-weight: 600; }

html[data-theme="5"] .hero-text { padding-top: 2.5rem; }
html[data-theme="5"] .hero-name {
  font-family: var(--font-display);
  font-variation-settings: "opsz" 144;
  font-weight: 900;
  font-size: clamp(3.4rem, 9vw, 6.8rem);
  letter-spacing: -0.04em;
  line-height: 0.95;
}
html[data-theme="5"] .hero-role { font-style: italic; font-family: var(--font-display); font-size: 1.2rem; color: var(--color-accent-2); margin-top: 0.4rem; }
html[data-theme="5"] .hero-tagline { font-family: var(--font-body); font-size: 1.05rem; max-width: 48ch; margin-top: 1.2rem; column-count: 1; }

html[data-theme="5"] .face-frame {
  width: 100%;
  height: clamp(280px, 36vw, 460px);
  border-radius: 0;
  position: relative;
  filter: sepia(15%) contrast(1.05);
}
html[data-theme="5"] .face-frame::after {
  content: 'Kiran Garimella · Photographed at Rutgers · 2026';
  position: absolute; left: 0; bottom: -1.6rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: var(--color-muted);
  text-transform: uppercase;
}

html[data-theme="5"] .quick-links { margin-top: 1.4rem; gap: 0; flex-wrap: wrap; }
html[data-theme="5"] .quick-links a {
  border: 0;
  border-right: 1px solid currentColor;
  border-radius: 0;
  padding: 0.2rem 0.7rem 0.2rem 0;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 600;
}
html[data-theme="5"] .quick-links a:last-child { border-right: 0; }
html[data-theme="5"] .quick-links a:hover { background: transparent; color: var(--color-accent); }

html[data-theme="5"] .section { position: relative; }
html[data-theme="5"] .section-heading {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(2rem, 4vw, 3rem);
  letter-spacing: -0.03em;
  grid-column: 1 / span 12;
  position: relative;
}
html[data-theme="5"] .section-heading::before {
  content: attr(data-folio);
  position: absolute;
  top: 0.2em;
  left: -2.6rem;
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  color: var(--color-muted);
  font-family: var(--font-body);
  font-weight: 600;
}

/* Section bodies span middle of grid */
html[data-theme="5"] section.section .section-body { grid-column: 2 / span 10; }
html[data-theme="5"] #about .section-body { grid-column: 2 / span 7; column-count: 2; column-gap: 2rem; }
@media (max-width: 900px) { html[data-theme="5"] #about .section-body { column-count: 1; } }

html[data-theme="5"] .about-para::first-letter {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 4em;
  float: left;
  line-height: 0.85;
  padding: 0.05em 0.1em 0 0;
  color: var(--color-accent);
}

html[data-theme="5"] .card { border: 0; border-top: 1px solid currentColor; border-radius: 0; padding: 1.2rem 0; box-shadow: none; }
html[data-theme="5"] .card h3 { font-family: var(--font-display); font-weight: 700; font-size: 1.4rem; }

html[data-theme="5"] .kw { font-style: italic; font-size: 0.85rem; padding: 0; background: none; border: 0; }
html[data-theme="5"] .kw::before { content: '— '; color: var(--color-accent); }

/* Use the AI hero image as a horizontal divider between sections */
html[data-theme="5"] #projects::before {
  content: '';
  display: block;
  grid-column: 1 / -1;
  height: 200px;
  margin-bottom: 2rem;
  background: url('../../assets/ai/05-editorial-hero.png') no-repeat center/cover;
}
```

- [ ] **Step 2: Inject `data-folio` attributes via JS**

The folio numbers (`01`, `02`, …) are theme-specific, so they belong in a small theme-aware block in `js/content.js`. Add this lines at the very end of the existing IIFE in `js/content.js`:

```javascript
  // Theme 5 (Editorial) folio numbers on section headings
  if (document.documentElement.getAttribute('data-theme') === '5') {
    document.querySelectorAll('section.section[data-section] .section-heading').forEach((h, i) => {
      h.setAttribute('data-folio', String(i + 1).padStart(2, '0'));
    });
  }
```

Locate the closing `})();` of the IIFE in `js/content.js` and insert the snippet just before it.

- [ ] **Step 3: Verify**

```
preview_eval: localStorage.setItem('forced_theme','5'); location.reload()
preview_screenshot
```

Check:
- [ ] Hero name is enormous Fraunces, weight 900, optical-size 144
- [ ] Face has a small editorial caption underneath
- [ ] Folio numbers (`01`, `02`, ...) appear left of each section heading
- [ ] About body breaks into 2 columns on desktop
- [ ] Drop cap on About paragraph in gold
- [ ] AI image appears as horizontal divider before Projects

- [ ] **Step 4: Commit**

```bash
git add css/themes/05-editorial.css js/content.js
git commit -m "feat(theme): 05 Editorial"
```

---

### Task 3.6: Theme 6 — Specimen

**Files:**
- Create: `css/themes/06-specimen.css`

**Layout:** L2. **Vibe:** Klim / Pangram type catalog. Variable-font animation. Type-as-art.

- [ ] **Step 1: Write `css/themes/06-specimen.css`**

```css
/* Theme 6 — Specimen. Layout: L2. */

html[data-theme="6"] {
  --color-bg: #ffffff;
  --color-fg: #0a0a0a;
  --color-heading: #0a0a0a;
  --color-accent: #e6007a;
  --color-accent-2: #7df9c1;
  --color-muted: #767676;

  --font-display: 'Inter', system-ui, sans-serif;
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --face-size: 220px;
}
html[data-theme="6"][data-mode="dark"] {
  --color-bg: #060914;
  --color-fg: #f5f5f5;
  --color-heading: #fff;
  --color-accent: #7df9c1;
  --color-accent-2: #e6007a;
}

html[data-theme="6"] .nav-bar { --nav-bg: var(--color-bg); border-bottom: 1px solid currentColor; }
html[data-theme="6"] .nav-brand { font-variation-settings: "wght" 800; font-size: 1.05rem; }

html[data-theme="6"] .hero-name {
  font-family: var(--font-display);
  font-variation-settings: "wght" 800, "slnt" 0;
  font-size: clamp(3rem, 12vw, 9rem);
  line-height: 0.85;
  letter-spacing: -0.05em;
  animation: specimen-axis 8s ease-in-out infinite alternate;
}
@keyframes specimen-axis {
  0%   { font-variation-settings: "wght" 300, "slnt" 0; letter-spacing: 0.04em; }
  100% { font-variation-settings: "wght" 900, "slnt" -8; letter-spacing: -0.06em; }
}
@media (prefers-reduced-motion: reduce) {
  html[data-theme="6"] .hero-name { animation: none; }
}

html[data-theme="6"] .hero-role {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  color: var(--color-muted);
  margin-top: 0.6rem;
}
html[data-theme="6"] .hero-role::before { content: 'role / '; color: var(--color-accent); }
html[data-theme="6"] .hero-tagline { font-size: 1.05rem; max-width: 50ch; margin-top: 1rem; }

html[data-theme="6"] .face-frame {
  border: 1px solid currentColor;
  border-radius: 0;
  position: relative;
}
html[data-theme="6"] .face-frame::after {
  content: 'AaBbCc';
  position: absolute; bottom: -28px; left: 0;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-muted);
}

html[data-theme="6"] .quick-links { gap: 0.4rem; }
html[data-theme="6"] .quick-links a {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  text-transform: lowercase;
  letter-spacing: 0;
  border: 1px solid currentColor;
  border-radius: 0;
  padding: 0.4rem 0.8rem;
}
html[data-theme="6"] .quick-links a::before { content: '→ '; color: var(--color-accent); }

html[data-theme="6"] .section-heading {
  position: relative;
  padding-left: 4rem;
  font-variation-settings: "wght" 800;
  font-size: clamp(2rem, 4vw, 3rem);
  letter-spacing: -0.03em;
}
html[data-theme="6"] .section-heading::before {
  content: attr(data-folio);
  position: absolute;
  left: 0; top: 0.2em;
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--color-accent);
  font-variation-settings: "wght" 700;
}

html[data-theme="6"] .card {
  border: 1px solid currentColor;
  border-radius: 0;
  padding: 1rem 1.2rem;
}
html[data-theme="6"] .card h3 { font-variation-settings: "wght" 700; font-size: 1.1rem; letter-spacing: -0.01em; }
html[data-theme="6"] .card p { color: var(--color-muted); }

html[data-theme="6"] .kw { font-family: var(--font-mono); font-size: 0.72rem; padding: 0.15rem 0.5rem; border: 1px solid currentColor; border-radius: 0; background: none; }

html[data-theme="6"] .other-list { list-style: none; padding: 0; }
html[data-theme="6"] .other-list li { padding: 0.5rem 0; border-bottom: 1px solid currentColor; }
html[data-theme="6"] .other-list li::before { content: '— '; color: var(--color-accent); }
```

- [ ] **Step 2: Reuse the folio injection from Task 3.5**

The folio injection in `js/content.js` was scoped to theme 5. Update it to apply to theme 6 as well. Find the line:

```javascript
  if (document.documentElement.getAttribute('data-theme') === '5') {
```

Replace with:

```javascript
  const themeNum = document.documentElement.getAttribute('data-theme');
  if (themeNum === '5' || themeNum === '6') {
```

- [ ] **Step 3: Verify**

```
preview_eval: localStorage.setItem('forced_theme','6'); location.reload()
preview_screenshot
```

Check:
- [ ] Hero name slowly animates between weight 300 (with positive tracking) and weight 900 (with slant). Smooth, ~8s cycle.
- [ ] Face frame has a tiny `AaBbCc` specimen caption below
- [ ] Section headings have folio numbers in mono on the left
- [ ] Quick-links are mono, lowercase, with `→` arrow

- [ ] **Step 4: Commit**

```bash
git add css/themes/06-specimen.css js/content.js
git commit -m "feat(theme): 06 Specimen"
```

---

### Task 3.7: Theme 7 — Brutalist Print

**Files:**
- Create: `css/themes/07-brutalist-print.css`

**Layout:** L3. **Vibe:** Pentagram brutalism. Heavy black grid. Wedge serif. Chartreuse / red accent.

- [ ] **Step 1: Write `css/themes/07-brutalist-print.css`**

```css
/* Theme 7 — Brutalist Print. Layout: L3. */

html[data-theme="7"] {
  --color-bg: #efece4;
  --color-fg: #050505;
  --color-heading: #050505;
  --color-accent: #d4ff00;
  --color-accent-2: #ff3b00;
  --color-muted: #2b2b2b;

  --font-display: 'Fraunces', 'GT Sectra', Georgia, serif;   /* wedge feel via Fraunces opsz */
  --font-heading: 'Fraunces', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;

  --face-size: 240px;
  --btn-radius: 0;
}
html[data-theme="7"][data-mode="dark"] {
  --color-bg: #0c0c0c;
  --color-fg: #efece4;
  --color-heading: #fff;
  --color-accent: #ff3b00;
  --color-accent-2: #d4ff00;
}

html[data-theme="7"] .nav-bar {
  --nav-bg: var(--color-fg);
  color: var(--color-bg);
  padding: 0.6rem 1.5rem;
  border-bottom: 6px solid var(--color-fg);
}
html[data-theme="7"] .nav-bar .nav-brand,
html[data-theme="7"] .nav-bar .nav-links a { color: var(--color-bg); font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; }
html[data-theme="7"] .nav-toggle { background: var(--color-accent); color: var(--color-fg); border: 0; }

html[data-theme="7"] .face-frame {
  border: 6px solid var(--color-fg);
  border-radius: 0;
  box-shadow: 12px 12px 0 var(--color-fg);
}

html[data-theme="7"] .hero-name {
  font-family: var(--font-display);
  font-variation-settings: "opsz" 144, "wght" 900;
  font-size: clamp(3rem, 10vw, 7.5rem);
  line-height: 0.88;
  letter-spacing: -0.05em;
  text-transform: uppercase;
}
html[data-theme="7"] .hero-name::after {
  content: '·';
  display: inline-block;
  margin-left: 0.05em;
  color: var(--color-accent);
}
html[data-theme="7"] .hero-role { font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.85rem; padding: 0.2rem 0.5rem; background: var(--color-fg); color: var(--color-bg); display: inline-block; margin-top: 0.4rem; }
html[data-theme="7"] .hero-tagline { font-size: 1.1rem; max-width: 52ch; margin-top: 1rem; font-weight: 500; }

html[data-theme="7"] .quick-links { margin-top: 1.4rem; gap: 0.5rem; }
html[data-theme="7"] .quick-links a {
  font-family: var(--font-body);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.78rem;
  padding: 0.6rem 1rem;
  border: 4px solid var(--color-fg);
  border-radius: 0;
  background: var(--color-bg);
  box-shadow: 6px 6px 0 var(--color-fg);
}
html[data-theme="7"] .quick-links a:hover { background: var(--color-accent); color: var(--color-fg); transform: translate(-2px, -2px); box-shadow: 8px 8px 0 var(--color-fg); }

html[data-theme="7"] .section { border-top: 4px solid var(--color-fg); }
html[data-theme="7"] .section-heading {
  font-family: var(--font-display);
  font-variation-settings: "opsz" 144, "wght" 900;
  text-transform: uppercase;
  font-size: clamp(2.4rem, 5vw, 4rem);
  letter-spacing: -0.04em;
  color: var(--color-fg);
  background: var(--color-accent);
  padding: 0.4rem 0.8rem;
  display: inline-block;
  margin-bottom: 1.2rem;
  grid-column: 1 / span 12;
  width: max-content;
}

html[data-theme="7"] .card {
  border: 4px solid var(--color-fg);
  border-radius: 0;
  background: var(--color-bg);
  box-shadow: 8px 8px 0 var(--color-fg);
  padding: 1.3rem 1.5rem;
}
html[data-theme="7"] .card h3 { font-family: var(--font-display); font-weight: 900; font-size: 1.4rem; text-transform: uppercase; letter-spacing: -0.01em; }
html[data-theme="7"] .kw { background: var(--color-accent); color: var(--color-fg); font-weight: 800; text-transform: uppercase; font-size: 0.68rem; padding: 0.15rem 0.5rem; border-radius: 0; letter-spacing: 0.06em; }

html[data-theme="7"] .other-list { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; }
html[data-theme="7"] .other-list a { display: block; padding: 0.7rem 1rem; border: 4px solid var(--color-fg); font-weight: 800; text-transform: uppercase; }
html[data-theme="7"] .other-list a:hover { background: var(--color-accent); }

/* AI poster image as section divider */
html[data-theme="7"] #projects::before {
  content: '';
  display: block;
  grid-column: 1 / -1;
  height: 240px;
  margin-bottom: 1.5rem;
  background: url('../../assets/ai/07-brutalist-poster.png') no-repeat center/cover;
  border: 4px solid var(--color-fg);
  box-shadow: 8px 8px 0 var(--color-accent);
}
```

- [ ] **Step 2: Verify**

```
preview_eval: localStorage.setItem('forced_theme','7'); location.reload()
preview_screenshot
```

Check:
- [ ] Nav is solid black bar with white uppercase links
- [ ] Hero name is enormous, all caps, with chartreuse dot trailing it
- [ ] Face has thick 6px black border + 12px hard offset shadow
- [ ] Quick-links are oversized boxes with 6px offsets
- [ ] Section headings are chartreuse-bg blocks with bold serif
- [ ] Cards have thick borders and offset shadows

- [ ] **Step 3: Commit**

```bash
git add css/themes/07-brutalist-print.css
git commit -m "feat(theme): 07 Brutalist Print"
```

---

### Task 3.8: Theme 8 — Dither

**Files:**
- Create: `css/themes/08-dither.css`
- Create: `js/theme-08-dither.js`

**Layout:** L1. **Vibe:** System 7. Chicago-style headings. 1-bit dithered portrait via canvas Bayer matrix.

- [ ] **Step 1: Write `js/theme-08-dither.js`**

```javascript
/* js/theme-08-dither.js — applies 4x4 Bayer dither to the face image (canvas) */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '8') return;

  const img = document.getElementById('faceImg');
  const frame = document.getElementById('faceFrame');
  if (!img || !frame) return;

  // Replace face <img> with a <canvas>; original img kept in shadow for src updates
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  canvas.className = 'face-canvas';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  frame.insertBefore(canvas, img);
  img.style.display = 'none';
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  // 4x4 Bayer matrix (values 0..15)
  const BAYER = [
    [ 0,  8,  2, 10],
    [12,  4, 14,  6],
    [ 3, 11,  1,  9],
    [15,  7, 13,  5],
  ];

  function ditherFromImg() {
    if (!img.complete || !img.naturalWidth) return;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = data.data;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const r = d[i], g = d[i+1], b = d[i+2];
        const lum = 0.299*r + 0.587*g + 0.114*b;
        const t = (BAYER[y & 3][x & 3] + 0.5) * (255 / 16);
        const v = lum > t ? 255 : 0;
        d[i] = d[i+1] = d[i+2] = v;
      }
    }
    ctx.putImageData(data, 0, 0);
  }

  // Re-dither whenever the underlying img.src changes (face tracker mutates it)
  const obs = new MutationObserver(() => {
    if (img.complete && img.naturalWidth) ditherFromImg();
    else img.addEventListener('load', ditherFromImg, { once: true });
  });
  obs.observe(img, { attributes: true, attributeFilter: ['src'] });
  if (img.complete && img.naturalWidth) ditherFromImg();
  else img.addEventListener('load', ditherFromImg, { once: true });
})();
```

- [ ] **Step 2: Write `css/themes/08-dither.css`**

```css
/* Theme 8 — Dither. Layout: L1. */

html[data-theme="8"] {
  --color-bg: #ffffff;
  --color-fg: #1d1d1d;
  --color-heading: #1d1d1d;
  --color-accent: #4a4a4a;
  --color-muted: #555;

  --font-display: 'Inter', system-ui, sans-serif;
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --face-size: 220px;
  --btn-radius: 0;
}
html[data-theme="8"][data-mode="dark"] {
  --color-bg: #0a0a0a;
  --color-fg: #e8e8e8;
  --color-accent: #aaaaaa;
}

/* Scanline overlay */
html[data-theme="8"] body::before {
  content: '';
  position: fixed; inset: 0;
  pointer-events: none; z-index: 1;
  background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 3px);
  mix-blend-mode: multiply;
}
html[data-theme="8"][data-mode="dark"] body::before {
  background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.06) 2px, rgba(255,255,255,0.06) 3px);
  mix-blend-mode: screen;
}

html[data-theme="8"] .nav-bar { --nav-bg: var(--color-bg); border-bottom: 1px solid currentColor; }
html[data-theme="8"] .nav-brand { font-family: var(--font-display); font-weight: 800; font-size: 1rem; letter-spacing: 0; }
html[data-theme="8"] .nav-links a { font-size: 0.85rem; }

html[data-theme="8"] .face-frame {
  width: 280px;
  height: 320px;
  border: 1px solid var(--color-fg);
  border-radius: 0;
  background: var(--color-bg);
  position: relative;
  padding: 28px 0 0 0;
  overflow: visible;
}
html[data-theme="8"] .face-frame::before {
  /* classic Mac OS title bar with stripes + close button */
  content: 'kiran.bmp';
  position: absolute; top: 0; left: 0; right: 0; height: 22px;
  background: repeating-linear-gradient(0deg, currentColor 0 1px, transparent 1px 3px);
  color: currentColor;
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  border-bottom: 1px solid currentColor;
}
html[data-theme="8"] .face-frame::after {
  content: '';
  position: absolute; left: 6px; top: 6px;
  width: 11px; height: 11px;
  border: 1px solid currentColor;
  background: var(--color-bg);
}
html[data-theme="8"] .face-canvas {
  width: 100% !important;
  height: calc(100% - 28px) !important;
  image-rendering: pixelated;
}

html[data-theme="8"] .hero-name { font-family: var(--font-display); font-weight: 700; font-size: clamp(2.2rem, 6vw, 3.6rem); letter-spacing: -0.02em; }
html[data-theme="8"] .hero-role { font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-muted); margin-top: 0.4rem; }
html[data-theme="8"] .hero-tagline { font-size: 1.05rem; max-width: 50ch; margin-top: 0.8rem; }

html[data-theme="8"] .quick-links { gap: 0.4rem; justify-content: center; }
html[data-theme="8"] .quick-links a {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.82rem;
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--color-fg);
  border-radius: 6px;
  box-shadow: 2px 2px 0 var(--color-fg);
  background: var(--color-bg);
}
html[data-theme="8"] .quick-links a:hover { background: var(--color-fg); color: var(--color-bg); }

html[data-theme="8"] .section-heading { font-weight: 800; font-size: clamp(1.6rem, 3vw, 2.2rem); }
html[data-theme="8"] .card {
  border: 1px solid var(--color-fg);
  border-radius: 0;
  padding: 1.1rem 1.3rem;
  box-shadow: 3px 3px 0 var(--color-fg);
  background: var(--color-bg);
}
html[data-theme="8"] .card h3 { font-weight: 800; }
html[data-theme="8"] .kw { font-family: var(--font-mono); font-size: 0.7rem; padding: 0.15rem 0.45rem; border: 1px solid currentColor; background: none; border-radius: 0; }

html[data-theme="8"] .other-list { list-style: none; padding: 0; }
html[data-theme="8"] .other-list li { padding: 0.4rem 0; }
html[data-theme="8"] .other-list a { padding: 0.5rem 1rem; border: 1px solid currentColor; box-shadow: 2px 2px 0 currentColor; display: inline-block; }
```

- [ ] **Step 3: Verify**

```
preview_eval: localStorage.setItem('forced_theme','8'); location.reload()
preview_screenshot
```

Check:
- [ ] Face renders as 1-bit dithered (visible Bayer pattern, only black/white)
- [ ] Face is wrapped in a classic Mac window with `kiran.bmp` title bar and a small close-square at top-left
- [ ] Subtle scanline overlay on full page
- [ ] Quick-links look like Mac push-buttons (rounded slightly, hard 2px offset)
- [ ] Move cursor: face still tracks, dither re-applies on each src change
- [ ] Toggle dark: face inverts (because img source is whitelike but logic re-runs)

- [ ] **Step 4: Commit**

```bash
git add css/themes/08-dither.css js/theme-08-dither.js
git commit -m "feat(theme): 08 Dither + canvas Bayer dither"
```

---

### Task 3.9: Theme 9 — Glitch / Neon

**Files:**
- Create: `css/themes/09-glitch.css`
- Create: `js/theme-09-glitch.js`

**Layout:** L4 full-bleed. **Vibe:** Active Theory / FWA. Dark, neon, RGB-split, marquee.

- [ ] **Step 1: Write `js/theme-09-glitch.js`**

```javascript
/* js/theme-09-glitch.js
 * - Builds a marquee strip in the hero
 * - Adds magnetic parallax to the face frame on cursor proximity
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '9') return;

  // Marquee
  const heroText = document.querySelector('.hero-text');
  if (heroText) {
    const kws = (window.KEYWORDS || []).concat(window.KEYWORDS || []).concat(window.KEYWORDS || []);
    const m = document.createElement('div');
    m.className = 'glitch-marquee';
    m.innerHTML = `<div class="glitch-marquee-track">${kws.map(k => `<span>${k}</span><span class="dot">·</span>`).join('')}</div>`;
    heroText.appendChild(m);
  }

  // Magnetic parallax on face
  const frame = document.getElementById('faceFrame');
  if (!frame) return;
  let raf = 0, mx = 0, my = 0;
  window.addEventListener('mousemove', (e) => {
    const r = frame.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top  + r.height / 2);
    const dist = Math.hypot(dx, dy);
    const max = 260;
    if (dist > max) { mx = my = 0; }
    else {
      const k = (1 - dist / max) * 12; // up to 12px pull
      mx = (dx / Math.max(dist, 1)) * k;
      my = (dy / Math.max(dist, 1)) * k;
    }
    if (!raf) raf = requestAnimationFrame(() => {
      raf = 0;
      frame.style.transform = `translate(${mx.toFixed(1)}px, ${my.toFixed(1)}px)`;
    });
  }, { passive: true });
})();
```

- [ ] **Step 2: Write `css/themes/09-glitch.css`**

```css
/* Theme 9 — Glitch / Neon. Layout: L4. */

html[data-theme="9"] {
  --color-bg: #050507;
  --color-fg: #f1f1f1;
  --color-heading: #ffffff;
  --color-accent: #00e6ff;
  --color-accent-2: #ff007a;
  --color-muted: #8a8a92;

  --font-display: 'Syne', system-ui, sans-serif;
  --font-heading: 'Syne', system-ui, sans-serif;
  --font-body: 'Space Mono', ui-monospace, monospace;

  --face-size: 280px;
  --btn-radius: 0;
}
/* Theme 9 is dark by default; "light" mode is just a slightly brighter dark */
html[data-theme="9"][data-mode="light"] {
  --color-bg: #0d0d12;
  --color-fg: #f5f5f7;
}

/* Animated noise gradient bg for L4 hero */
html[data-theme="9"] .hero-bg {
  background:
    radial-gradient(circle at 30% 30%, rgba(0,230,255,0.12), transparent 50%),
    radial-gradient(circle at 70% 60%, rgba(255,0,122,0.10), transparent 55%),
    #050507;
}
html[data-theme="9"] .hero-bg::before {
  content: '';
  position: absolute; inset: 0;
  background-image: repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.04) 2px 3px);
  pointer-events: none;
  mix-blend-mode: screen;
}

html[data-theme="9"] .nav-bar { --nav-bg: rgba(5,5,7,0.55); --nav-backdrop: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.06); }
html[data-theme="9"] .nav-brand { color: var(--color-accent); font-weight: 800; }
html[data-theme="9"] .nav-links a { color: var(--color-fg); font-family: var(--font-body); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.1em; }

html[data-theme="9"] .face-frame {
  border-radius: 0;
  border: 1px solid rgba(255,255,255,0.15);
  filter: contrast(1.1) saturate(1.05);
  position: relative;
  transition: transform 220ms cubic-bezier(.2,.8,.2,1);
  box-shadow: 0 0 60px rgba(0,230,255,0.25), 0 0 120px rgba(255,0,122,0.18);
}
html[data-theme="9"] .face-frame img {
  /* Subtle RGB split on the portrait via duplicated drop-shadows */
  filter:
    drop-shadow(2px 0 0 rgba(0,230,255,0.55))
    drop-shadow(-2px 0 0 rgba(255,0,122,0.55))
    contrast(1.05) saturate(1.1);
}

html[data-theme="9"] .hero-name {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(3rem, 9vw, 6rem);
  letter-spacing: -0.04em;
  color: var(--color-heading);
  position: relative;
  text-shadow: 2px 0 0 var(--color-accent), -2px 0 0 var(--color-accent-2);
  animation: rgb-jitter 4s steps(8) infinite;
}
@keyframes rgb-jitter {
  0%, 95%, 100% { text-shadow: 2px 0 0 var(--color-accent), -2px 0 0 var(--color-accent-2); }
  96% { text-shadow: 6px 0 0 var(--color-accent), -6px 0 0 var(--color-accent-2); transform: translateX(-2px); }
  98% { text-shadow: 1px 1px 0 var(--color-accent), -3px -1px 0 var(--color-accent-2); transform: translateX(2px); }
}
@media (prefers-reduced-motion: reduce) { html[data-theme="9"] .hero-name { animation: none; } }

html[data-theme="9"] .hero-role { font-family: var(--font-body); text-transform: uppercase; letter-spacing: 0.18em; font-size: 0.75rem; color: var(--color-accent); margin-top: 0.4rem; }
html[data-theme="9"] .hero-tagline { font-family: var(--font-body); color: var(--color-muted); max-width: 50ch; margin-top: 1rem; font-size: 0.95rem; }

html[data-theme="9"] .quick-links { margin-top: 1.4rem; gap: 0.5rem; }
html[data-theme="9"] .quick-links a {
  font-family: var(--font-body);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.5rem 0.9rem;
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 0;
  background: rgba(255,255,255,0.02);
  color: var(--color-fg);
  position: relative;
  text-shadow: 1px 0 0 var(--color-accent), -1px 0 0 var(--color-accent-2);
}
html[data-theme="9"] .quick-links a:hover { background: var(--color-accent); color: var(--color-bg); border-color: var(--color-accent); text-shadow: none; }

html[data-theme="9"] .glitch-marquee { margin-top: 1.4rem; overflow: hidden; mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%); }
html[data-theme="9"] .glitch-marquee-track { display: flex; gap: 1rem; white-space: nowrap; animation: marquee-scroll 28s linear infinite; }
html[data-theme="9"] .glitch-marquee-track span { font-family: var(--font-body); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.18em; color: var(--color-muted); }
html[data-theme="9"] .glitch-marquee-track span.dot { color: var(--color-accent); }
@keyframes marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { html[data-theme="9"] .glitch-marquee-track { animation: none; } }

html[data-theme="9"] .section-heading { font-family: var(--font-display); font-weight: 700; color: var(--color-heading); }
html[data-theme="9"] .card { border: 1px solid rgba(255,255,255,0.1); border-radius: 0; background: rgba(255,255,255,0.02); padding: 1.2rem 1.4rem; }
html[data-theme="9"] .card h3 { color: var(--color-accent); font-family: var(--font-display); font-weight: 700; }
html[data-theme="9"] .card p { color: var(--color-muted); font-family: var(--font-body); }
html[data-theme="9"] .kw { font-family: var(--font-body); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.18rem 0.55rem; border: 1px solid var(--color-accent); border-radius: 0; background: transparent; color: var(--color-accent); }
html[data-theme="9"] .other-list a { color: var(--color-accent); }
```

- [ ] **Step 3: Verify**

```
preview_eval: localStorage.setItem('forced_theme','9'); location.reload()
preview_screenshot
```

Check:
- [ ] Hero is full-bleed dark with subtle radial cyan/magenta glows
- [ ] Hero name has cyan/magenta RGB-split shadow with periodic jitter (visible if you watch ~4s)
- [ ] Marquee scrolls keywords across the hero
- [ ] Face frame has neon glow ring
- [ ] On mouse near face, frame has gentle parallax pull
- [ ] Quick-links have subtle RGB-split text-shadow

- [ ] **Step 4: Commit**

```bash
git add css/themes/09-glitch.css js/theme-09-glitch.js
git commit -m "feat(theme): 09 Glitch + marquee + face parallax"
```

---

### Task 3.10: Theme 10 — Particle Field

**Files:**
- Create: `css/themes/10-particle-field.css`
- Create: `js/theme-10-particles.js`

**Layout:** L4 full-bleed. **Vibe:** Bruno Simon-lite. Cursor-reactive flow-field canvas.

- [ ] **Step 1: Write `js/theme-10-particles.js`**

```javascript
/* js/theme-10-particles.js
 * Cursor-reactive flow-field particle system rendered into .hero-bg.
 * ~3000 particles desktop / ~800 mobile. Skipped on prefers-reduced-motion.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '10') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const bg = document.querySelector('.hero-bg');
  if (!bg) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
  bg.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const small = window.innerWidth < 760;
  const COUNT = small ? 800 : 3000;
  const particles = [];
  let w = 0, h = 0, mx = -9999, my = -9999;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = bg.clientWidth; h = bg.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  // Perlin-ish noise: simple pseudo-noise from sin combinations (good enough for visual)
  function noiseAngle(x, y, t) {
    return (
      Math.sin(x * 0.0035 + t * 0.0006) +
      Math.cos(y * 0.0030 - t * 0.0005) +
      Math.sin((x + y) * 0.0020 + t * 0.0004)
    ) * Math.PI;
  }

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0, vy: 0,
      life: Math.random() * 200,
    });
  }

  bg.addEventListener('mousemove', (e) => {
    const r = bg.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
  });
  bg.addEventListener('mouseleave', () => { mx = my = -9999; });

  // Avoidance region for the face portrait
  function getFaceRect() {
    const f = document.getElementById('faceFrame');
    if (!f) return null;
    const r = f.getBoundingClientRect();
    const br = bg.getBoundingClientRect();
    return {
      cx: r.left - br.left + r.width / 2,
      cy: r.top  - br.top  + r.height / 2,
      r: Math.max(r.width, r.height) / 2 + 24,
    };
  }

  let t0 = performance.now();
  function frame() {
    const t = performance.now() - t0;
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim() || '#fafbfd';
    // Soft trail
    ctx.globalAlpha = 0.08;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;

    const stroke = getComputedStyle(document.documentElement).getPropertyValue('--color-particle').trim() || 'rgba(37,99,235,0.4)';
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 0.7;

    const face = getFaceRect();
    for (let p of particles) {
      let a = noiseAngle(p.x, p.y, t);
      // Cursor influence
      if (mx > -1) {
        const dx = mx - p.x, dy = my - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 220) {
          const targ = Math.atan2(dy, dx) + Math.PI; // particles flow away from cursor
          a = a * 0.4 + targ * 0.6;
        }
      }
      let nvx = Math.cos(a) * 1.2;
      let nvy = Math.sin(a) * 1.2;
      // Avoid the face circle (push outward)
      if (face) {
        const fdx = p.x - face.cx, fdy = p.y - face.cy;
        const fd = Math.hypot(fdx, fdy);
        if (fd < face.r) {
          nvx += (fdx / Math.max(fd, 1)) * 1.8;
          nvy += (fdy / Math.max(fd, 1)) * 1.8;
        }
      }
      p.vx = p.vx * 0.92 + nvx * 0.08;
      p.vy = p.vy * 0.92 + nvy * 0.08;
      const px = p.x, py = p.y;
      p.x += p.vx; p.y += p.vy;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();

      p.life--;
      if (p.life < 0 || p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) {
        p.x = Math.random() * w; p.y = Math.random() * h;
        p.vx = p.vy = 0; p.life = 200 + Math.random() * 200;
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
```

- [ ] **Step 2: Write `css/themes/10-particle-field.css`**

```css
/* Theme 10 — Particle Field. Layout: L4. */

html[data-theme="10"] {
  --color-bg: #fafbfd;
  --color-fg: #0a0e1a;
  --color-heading: #0a0e1a;
  --color-accent: #2563eb;
  --color-accent-2: #93c5fd;
  --color-muted: #4b5563;
  --color-particle: rgba(37,99,235,0.35);

  --font-display: 'Inter', system-ui, sans-serif;
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;

  --face-size: 220px;
  --btn-radius: 999px;
}
html[data-theme="10"][data-mode="dark"] {
  --color-bg: #050a14;
  --color-fg: #e6ecf5;
  --color-heading: #fff;
  --color-accent: #93c5fd;
  --color-particle: rgba(147,197,253,0.55);
}

html[data-theme="10"] .nav-bar { --nav-bg: rgba(250,251,253,0.55); --nav-backdrop: blur(12px); }
html[data-theme="10"][data-mode="dark"] .nav-bar { --nav-bg: rgba(5,10,20,0.55); }

html[data-theme="10"] .hero-bg { background: var(--color-bg); }

html[data-theme="10"] .face-frame {
  border-radius: 50%;
  border: 1px solid var(--color-accent);
  box-shadow: 0 0 80px var(--color-accent-2);
}
html[data-theme="10"] .face-frame img { border-radius: 50%; }

html[data-theme="10"] .hero-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(2.6rem, 7vw, 4.8rem);
  letter-spacing: -0.03em;
  line-height: 1.05;
}
html[data-theme="10"] .hero-role { color: var(--color-muted); font-size: 1rem; margin-top: 0.4rem; }
html[data-theme="10"] .hero-tagline { font-size: 1.1rem; max-width: 50ch; margin-top: 0.8rem; }

html[data-theme="10"] .quick-links { margin-top: 1.4rem; gap: 0.45rem; }
html[data-theme="10"] .quick-links a {
  border: 1px solid var(--color-accent);
  color: var(--color-fg);
  background: rgba(255,255,255,0.4);
  backdrop-filter: blur(6px);
  font-size: 0.9rem; padding: 0.55rem 1rem;
}
html[data-theme="10"][data-mode="dark"] .quick-links a { background: rgba(255,255,255,0.04); }
html[data-theme="10"] .quick-links a:hover { background: var(--color-accent); color: var(--color-bg); }

html[data-theme="10"] .section-heading { font-weight: 700; font-size: clamp(1.6rem, 3vw, 2.2rem); letter-spacing: -0.02em; }
html[data-theme="10"] .card { background: rgba(255,255,255,0.5); backdrop-filter: blur(8px); border: 1px solid rgba(0,0,0,0.06); border-radius: 16px; padding: 1.2rem 1.4rem; }
html[data-theme="10"][data-mode="dark"] .card { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); }
html[data-theme="10"] .card h3 { font-weight: 700; }
html[data-theme="10"] .kw { background: rgba(37,99,235,0.08); color: var(--color-accent); padding: 0.2rem 0.55rem; border-radius: 999px; font-size: 0.78rem; }
html[data-theme="10"] .other-list a { display: inline-block; padding: 0.5rem 0.9rem; border: 1px solid var(--color-accent); border-radius: 999px; }
```

- [ ] **Step 3: Verify**

```
preview_eval: localStorage.setItem('forced_theme','10'); location.reload()
preview_screenshot
```

Check:
- [ ] Hero shows ~3000 thin particles flowing in a coherent field
- [ ] Cursor near hero pushes particles away
- [ ] Face frame is round with soft glow; particles avoid the face region (visible empty halo)
- [ ] Tagline/text remains crisp on top of particles (canvas behind via z-index)
- [ ] Toggle dark: particle color shifts; canvas continues animating

- [ ] **Step 4: Commit**

```bash
git add css/themes/10-particle-field.css js/theme-10-particles.js
git commit -m "feat(theme): 10 Particle Field + flow-field canvas"
```

---

## Phase 4 — Polish

### Task 4.1: Theme `publications.html`

**Files:**
- Create: `publications.html` (rebuilds the existing one to share theme tokens)

The full publications page shares the theme-engine. It loads the same chosen-at-random theme, the same nav/footer, but its body is a long list rendered from `PUBLICATIONS` in `data.js`.

- [ ] **Step 1: Write `publications.html`**

```html
<!doctype html>
<html lang="en" data-theme="2" data-mode="light" data-layout="L1">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Publications · Kiran Garimella</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,900&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&family=Manrope:wght@300;400;600;700&family=PT+Serif:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,700;1,8..60,400&family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&family=Syne:wght@500;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <script src="js/theme-engine.js"></script>
  <style>
    .pub-list { list-style: none; padding: 0; }
    .pub-list li { padding: 1rem 0; border-bottom: 1px solid currentColor; }
    .pub-list h3 { font-weight: 600; font-size: 1.1rem; margin-bottom: 0.2rem; }
    .pub-meta { color: var(--color-muted); font-size: 0.92rem; }
    .pub-links { margin-top: 0.4rem; font-size: 0.88rem; }
    .pub-links a { color: var(--color-accent); margin-right: 0.6rem; }
    .pub-year-heading { margin-top: 2rem; font-family: var(--font-display); font-weight: 700; font-size: 1.4rem; opacity: 0.7; }
  </style>
</head>
<body>
  <header class="nav-bar">
    <a class="nav-brand" href="index.html">K.G.</a>
    <nav class="nav-links" id="navLinks" aria-label="Primary"></nav>
    <button class="nav-toggle" id="modeToggle" aria-label="Toggle dark mode">☀</button>
  </header>
  <main id="top">
    <section class="section">
      <h1 class="section-heading">Publications</h1>
      <div id="pubsAll"></div>
    </section>
  </main>
  <footer class="site-footer">
    <span id="copyright"></span>
    <span id="themeName"></span>
    <a href="#top">↑ Top</a>
  </footer>
  <div class="theme-picker-overlay" id="themePicker"><div class="theme-picker"><h3>Themes</h3><ul id="themePickerList"></ul></div></div>

  <script src="data.js"></script>
  <script src="js/nav.js"></script>
  <script>
    (function () {
      const $ = (id) => document.getElementById(id);
      const PUBS = window.PUBLICATIONS || [];
      // Group by year
      const byYear = {};
      PUBS.forEach(p => {
        const y = String(p.year || 'Other');
        (byYear[y] = byYear[y] || []).push(p);
      });
      const years = Object.keys(byYear).sort((a, b) => {
        const aN = parseInt(a, 10), bN = parseInt(b, 10);
        if (isNaN(aN) && isNaN(bN)) return a.localeCompare(b);
        if (isNaN(aN)) return -1;
        if (isNaN(bN)) return 1;
        return bN - aN;
      });
      const wrap = $('pubsAll');
      wrap.innerHTML = years.map(y => {
        const items = byYear[y].map(p => {
          const authors = Array.isArray(p.authors) ? p.authors.join(', ') : (p.authors || '');
          const links = (p.links || []).map(l => `<a href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join(' · ');
          return `<li><h3>${p.title}</h3><p class="pub-meta">${authors} · <em>${p.venue || ''}</em></p>${links ? `<p class="pub-links">${links}</p>` : ''}</li>`;
        }).join('');
        return `<h2 class="pub-year-heading">${y}</h2><ul class="pub-list">${items}</ul>`;
      }).join('');
      $('copyright').textContent = `© ${new Date().getFullYear()} Kiran Garimella`;
    })();
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify**

```
preview_eval: location.href = '/publications.html'
preview_screenshot
```

Check:
- [ ] Page picks a random theme on load (different one each reload)
- [ ] Pubs grouped by year, descending
- [ ] Each pub has title, authors, venue (italic), and link list
- [ ] Nav and footer look themed

- [ ] **Step 3: Commit**

```bash
git add publications.html
git commit -m "feat: themed publications.html"
```

---

### Task 4.2: Mobile + reduced-motion QA across all 10 themes

This task is a **QA pass**, not a code change. It verifies that every theme behaves at viewports `375 × 667` (small mobile), `768 × 1024` (tablet), `1280 × 800` (laptop). For each, capture a screenshot and verify against the quality bar.

- [ ] **Step 1: Set the preview viewport to mobile and walk all 10 themes**

For each theme N in 1..10:
```
preview_resize: 375 × 667
preview_eval: localStorage.setItem('forced_theme', String(N)); location.reload()
preview_screenshot
preview_console_logs (pattern: 'error|warning')
```

Verify:
- [ ] Nav doesn't overlap content
- [ ] Quick-links wrap onto multiple lines without breaking
- [ ] Face is appropriately sized (not >75% viewport width)
- [ ] No horizontal scroll
- [ ] Hero text is readable (no clipping)
- [ ] No console errors

Repeat at `768 × 1024` and `1280 × 800`.

- [ ] **Step 2: Verify reduced-motion**

For themes 6 (specimen axis animation), 9 (RGB jitter + marquee), 10 (particle field):

```
preview_eval:
  Object.defineProperty(window.matchMedia('(prefers-reduced-motion: reduce)'), 'matches', { value: true });
  location.reload()
```

Check that animations are paused / particle field never starts.

- [ ] **Step 3: Fix any issues found inline**

If a theme has overflow, clipping, or animation issues at any viewport, fix the theme's CSS and re-verify. Commit per fix:

```bash
git add css/themes/<file>.css
git commit -m "fix(theme NN): mobile/reduced-motion polish"
```

---

### Task 4.3: Final integration — clear forced theme, real reload-to-shuffle test

- [ ] **Step 1: Clear any forced-theme override**

```
preview_eval: localStorage.removeItem('forced_theme'); localStorage.removeItem('last_theme'); location.reload()
```

- [ ] **Step 2: Reload 10 times, log the chosen theme each time**

```
preview_eval: const seen=[]; for(let i=0;i<5;i++){location.reload(); break;} 
```

(Reload-in-loop is awkward with eval; instead, manually `preview_eval: location.reload()` 10 times in succession and `preview_eval: __theme.current.name` after each, recording results.)

Verify:
- [ ] At least 6 distinct themes appear in 10 reloads (uniform-ish distribution)
- [ ] Same theme never appears twice in a row

- [ ] **Step 3: Verify dark/light persistence**

```
preview_eval: __theme.setMode('dark'); 
preview_eval: location.reload();
preview_eval: __theme.getMode() // should still be 'dark'
```

- [ ] **Step 4: Verify face tracker swaps face folder on dark toggle**

```
preview_eval: __theme.setMode('dark'); document.getElementById('faceImg').src
```

Should contain `faces_with_sunglasses/`.

```
preview_eval: __theme.setMode('light'); document.getElementById('faceImg').src
```

Should contain `faces/`.

- [ ] **Step 5: Verify ? overlay**

```
preview_eval: document.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }))
preview_screenshot
```

Should show a panel listing the 10 themes.

```
preview_eval: document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
```

Panel closes.

- [ ] **Step 6: Commit checkpoint (no new files; record outcome)**

```bash
git commit --allow-empty -m "qa: integration verified across 10 themes"
```

---

### Task 4.4: README touch-up

**Files:**
- Modify: README at repo root (if exists) or skip

This is a personal site; if there's a top-level README at the repo (one level up), add a short note about the rebuild.

- [ ] **Step 1: Check for README**

```bash
ls /Users/kgarimella/Documents/personalWebpage/gvrkiran.github.io/ | grep -i readme
```

If present, append a one-line note. If absent, skip and do not create one.

- [ ] **Step 2: Commit if changed**

```bash
git add ../README.md
git commit -m "docs: note redesign in repo README"
```

---

## Self-Review Checklist (Run after writing all tasks)

- [ ] Every spec section maps to at least one task: Architecture (Phase 1), 10 themes (Phase 3 tasks 3.1–3.10), Universal nav (Task 1.3, 1.6), Quick-links bar (Task 1.7), Face tracker (Task 1.5), Dark/light + sunglasses (Task 1.5 + each theme), Theme rotation (Task 1.4), Mobile/reduced-motion (Task 4.2), Publications page (Task 4.1), AI image generation (Phase 2).
- [ ] No "TBD"/"TODO"/"appropriate"/"similar to" placeholders.
- [ ] Type/method/property names consistent: `__theme`, `getMode/setMode/forceTheme`, `data-theme`, `data-mode`, `data-layout`, `forced_theme`, `last_theme`, `mode`, `faceImg`, `faceFrame`, `quickLinks`, `navLinks`.
- [ ] Every code-changing step has the actual code shown.
- [ ] Every step has either a verification check or a commit (most have both).

---

## Execution Notes

- Start by running Phase 0, then Phase 1 in order. Verify at Task 1.8 before any theme work.
- Phase 2 (AI images) can run concurrently with Phase 3 — themes that depend on the images (4, 5, 7) have `background-image: url()` references; if the image is missing, the section just renders without the divider, no broken layout.
- Phase 3 themes are independent of each other; can be done in any order or in parallel by separate subagents.
- Phase 4 must be last (depends on all themes existing).
- Total commit count expectation: ~22 commits (Phase 0: 3 · Phase 1: 7 · Phase 2: 2 · Phase 3: 10 · Phase 4: ~3).
