/* js/theme-17-atlas.js
 * Theme 17 — Atlas. Expedition cartography.
 *
 * Homepage (has [data-section]):
 *   1. TERRAIN — a value-noise elevation field (2 octaves) seeded fresh each
 *      reload (mulberry32 from Date.now()). Marching squares at 5–6 thresholds
 *      emit contour <path>s into ONE absolutely-positioned full-document SVG
 *      (.t17-terrain) placed BEHIND content (z-index 0 inside <main>, whose
 *      sections are z-index 1; pointer-events:none).
 *      Stroke color/opacity read live from CSS custom props so it flips
 *      light↔dark. New landmass on every load; regenerates only on significant
 *      resize (debounced). Total path points capped (~8k) for perf.
 *   2. ROUTE — anchor points at each section heading's vertical position; a
 *      smooth catmull-rom path (with slight lateral wobble) drawn as a dashed
 *      stroke. stroke-dasharray = pathLength; stroke-dashoffset driven from
 *      scroll progress (rAF + passive scroll) so the expedition line draws as
 *      you read. Numbered waypoint pins (1–5) "stamp in" as the route reaches.
 *   3. COMPASS — inline SVG, top-right of hero, rotates a few degrees with
 *      scroll (sets --t17-rot).
 *
 * Subpages (no [data-section]): NO terrain, NO route, NO compass — the CSS
 *   already gives a handsome flat sheet + footer compass. We bail early.
 *
 * Tiers:
 *   Desktop full — everything, ~60fps, rAF only while hero visible + tab shown.
 *   Mobile (≤760px) — 3 contour thresholds; route simplified toward left margin.
 *   Reduced motion — route FULLY drawn, pins placed, compass static, terrain
 *     still generated (static). No scroll-driven animation, no loops.
 *   No-JS — this file no-ops; CSS sheet remains fully readable.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '17') return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const root = document.documentElement;
  const SVGNS = 'http://www.w3.org/2000/svg';
  root.classList.add('t17-js');

  const isMobile = () => window.innerWidth <= 760;

  /* ---------- mulberry32 (seeded PRNG) ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // fresh seed every reload → new landmass
  let seed = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;

  /* ---------- live palette (day chart vs night nav) ---------- */
  const pal = {
    contour: '#c07a52', contourAlpha: 0.25,
    route: '#b5623b', water: '#3f6f8f', pin: '#b5623b'
  };
  function readColors() {
    const cs = getComputedStyle(root);
    const g = (n, f) => (cs.getPropertyValue(n).trim() || f);
    pal.contour = g('--t17-contour', pal.contour);
    pal.contourAlpha = parseFloat(g('--t17-contour-alpha', '0.25')) || 0.25;
    pal.route = g('--t17-route', pal.route);
    pal.water = g('--t17-water', pal.water);
    pal.pin = g('--t17-pin', pal.pin);
  }
  readColors();

  /* ================================================================
   *  Homepage vs subpage
   * ================================================================ */
  const hasSections = !!document.querySelector('[data-section]');
  if (!hasSections) return;   // subpages: CSS-only. Nothing to build.

  const main = document.getElementById('top') || document.body;

  /* ================================================================
   *  DOCUMENT METRICS
   * ================================================================ */
  function docHeight() {
    return Math.max(
      root.scrollHeight,
      document.body ? document.body.scrollHeight : 0,
      window.innerHeight
    );
  }

  /* ================================================================
   *  VALUE-NOISE FIELD (2 octaves), seeded
   *  A lattice of pseudo-random gradients bilinearly interpolated; we sum
   *  two octaves. Cheap, deterministic per seed, smooth enough for contours.
   * ================================================================ */
  function makeNoise(rng) {
    // hashed value at integer lattice point (i,j) for a given octave
    const perm = new Uint8Array(512);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = (rng() * (i + 1)) | 0;
      const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
    }
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a, b, t) => a + (b - a) * t;
    const val = (ix, iy) => {
      // value in [-1,1]
      const h = perm[(perm[ix & 255] + iy) & 255];
      return (h / 255) * 2 - 1;
    };
    function octave(x, y) {
      const x0 = Math.floor(x), y0 = Math.floor(y);
      const fx = fade(x - x0), fy = fade(y - y0);
      const v00 = val(x0, y0), v10 = val(x0 + 1, y0);
      const v01 = val(x0, y0 + 1), v11 = val(x0 + 1, y0 + 1);
      return lerp(lerp(v00, v10, fx), lerp(v01, v11, fx), fy);
    }
    return function (x, y) {
      // 2 octaves
      return octave(x, y) * 0.65 + octave(x * 2.03 + 5.1, y * 2.03 + 9.7) * 0.35;
    };
  }

  /* ================================================================
   *  MARCHING SQUARES → contour polylines
   *  Sample noise on a coarse grid over the full document. For each of N
   *  thresholds, walk cells and emit line segments; stitch into polylines.
   *  Returns array of {level, points:[[x,y],...]} in document pixel space.
   * ================================================================ */
  function marchingSquares(field, cols, rows, cellW, cellH, thresholds, pointBudget) {
    const contours = [];
    let emitted = 0;
    // interpolate crossing on an edge between values a (t0) and b (t1)
    const interp = (t, a, b) => (Math.abs(b - a) < 1e-6 ? 0.5 : (t - a) / (b - a));

    for (let li = 0; li < thresholds.length && emitted < pointBudget; li++) {
      const T = thresholds[li];
      // collect raw segments for this level, then greedily stitch
      const segs = [];
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const tl = field[r * cols + c];
          const tr = field[r * cols + c + 1];
          const br = field[(r + 1) * cols + c + 1];
          const bl = field[(r + 1) * cols + c];
          let idx = 0;
          if (tl > T) idx |= 8;
          if (tr > T) idx |= 4;
          if (br > T) idx |= 2;
          if (bl > T) idx |= 1;
          if (idx === 0 || idx === 15) continue;
          const x = c * cellW, y = r * cellH;
          // edge crossing points
          const top = [x + cellW * interp(T, tl, tr), y];
          const right = [x + cellW, y + cellH * interp(T, tr, br)];
          const bottom = [x + cellW * interp(T, bl, br), y + cellH];
          const left = [x, y + cellH * interp(T, tl, bl)];
          // segment table (ambiguous cases split simply)
          switch (idx) {
            case 1: case 14: segs.push([left, bottom]); break;
            case 2: case 13: segs.push([bottom, right]); break;
            case 3: case 12: segs.push([left, right]); break;
            case 4: case 11: segs.push([top, right]); break;
            case 5: segs.push([left, top]); segs.push([bottom, right]); break;
            case 6: case 9: segs.push([top, bottom]); break;
            case 7: case 8: segs.push([left, top]); break;
            case 10: segs.push([left, bottom]); segs.push([top, right]); break;
          }
        }
      }
      if (!segs.length) continue;
      // greedy stitch: connect segments whose endpoints coincide (rounded)
      const key = (pt) => (Math.round(pt[0]) + ',' + Math.round(pt[1]));
      const startMap = new Map();
      segs.forEach((s, i) => {
        const k = key(s[0]);
        if (!startMap.has(k)) startMap.set(k, []);
        startMap.get(k).push(i);
      });
      const used = new Uint8Array(segs.length);
      for (let i = 0; i < segs.length && emitted < pointBudget; i++) {
        if (used[i]) continue;
        const poly = [segs[i][0], segs[i][1]];
        used[i] = 1;
        emitted += 2;
        // extend forward
        let guard = 0;
        while (guard++ < 4000 && emitted < pointBudget) {
          const tail = poly[poly.length - 1];
          const cand = startMap.get(key(tail));
          let next = -1;
          if (cand) { for (const ci of cand) { if (!used[ci]) { next = ci; break; } } }
          if (next < 0) break;
          used[next] = 1;
          poly.push(segs[next][1]);
          emitted += 1;
        }
        if (poly.length >= 2) contours.push({ level: li, points: poly });
      }
    }
    return contours;
  }

  /* build the SVG path `d` from a polyline (simple polyline; contours are
     already smooth-ish because the field is smooth). Round to 1 decimal. */
  function polyToPath(points) {
    let d = 'M' + points[0][0].toFixed(1) + ' ' + points[0][1].toFixed(1);
    for (let i = 1; i < points.length; i++) {
      d += 'L' + points[i][0].toFixed(1) + ' ' + points[i][1].toFixed(1);
    }
    return d;
  }

  /* ================================================================
   *  TERRAIN SVG
   * ================================================================ */
  let terrainSVG = null;
  let terrainW = 0, terrainH = 0;

  function buildTerrain() {
    if (terrainSVG && terrainSVG.parentNode) terrainSVG.parentNode.removeChild(terrainSVG);
    terrainSVG = null;

    const W = window.innerWidth;
    const H = docHeight();
    terrainW = W; terrainH = H;

    const rng = mulberry32(seed);
    const noise = makeNoise(rng);

    // coarse grid: cell size scales with viewport; mobile is coarser + fewer levels
    const cell = isMobile() ? 46 : 34;
    const cols = Math.max(4, Math.ceil(W / cell) + 1);
    const rows = Math.max(4, Math.ceil(H / cell) + 1);
    const cellW = W / (cols - 1);
    const cellH = H / (rows - 1);

    // Noise coordinate scale: sample so there are ~featX "mountains" across the
    // width and a proportional number down the (taller) document height. This
    // is resolution-independent — same look whether the grid is coarse or fine.
    const featX = isMobile() ? 3.5 : 5.5;
    const featY = featX * (H / Math.max(W, 1));
    const sx = featX / Math.max(cols - 1, 1);
    const sy = featY / Math.max(rows - 1, 1);

    const field = new Float32Array(cols * rows);
    let min = Infinity, max = -Infinity;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = noise(c * sx, r * sy);
        field[r * cols + c] = val;
        if (val < min) min = val;
        if (val > max) max = val;
      }
    }
    // normalize field to [0,1] for stable thresholds
    const span = (max - min) || 1;
    for (let i = 0; i < field.length; i++) field[i] = (field[i] - min) / span;

    // thresholds: 5–6 desktop, 3 mobile, evenly spaced away from the edges
    const nLevels = isMobile() ? 3 : (window.innerHeight < 700 ? 5 : 6);
    const thresholds = [];
    for (let i = 1; i <= nLevels; i++) thresholds.push(i / (nLevels + 1));

    const budget = 8000;
    const contours = marchingSquares(field, cols, rows, cellW, cellH, thresholds, budget);

    // build SVG
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 't17-terrain');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.width = W + 'px';
    svg.style.height = H + 'px';

    const gfrag = document.createDocumentFragment();
    // higher levels (inner rings = higher elevation) render slightly stronger
    for (const cont of contours) {
      const path = document.createElementNS(SVGNS, 'path');
      path.setAttribute('d', polyToPath(cont.points));
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', pal.contour);
      // inner (higher) contours a touch bolder & more opaque, but capped
      const lvlFrac = (cont.level + 1) / (nLevels + 1);
      const op = Math.min(pal.contourAlpha, pal.contourAlpha * (0.6 + 0.55 * lvlFrac));
      path.setAttribute('stroke-width', (0.8 + lvlFrac * 0.7).toFixed(2));
      path.setAttribute('stroke-opacity', op.toFixed(3));
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('stroke-linecap', 'round');
      path.dataset.lvl = lvlFrac.toFixed(3);   // remembered for recolor
      gfrag.appendChild(path);
    }
    svg.appendChild(gfrag);
    // insert as FIRST child of <main> so it spans document flow height behind content
    main.insertBefore(svg, main.firstChild);
    terrainSVG = svg;
  }

  function recolorTerrain() {
    if (!terrainSVG) return;
    terrainSVG.querySelectorAll('path').forEach((p) => {
      p.setAttribute('stroke', pal.contour);
      const lvlFrac = parseFloat(p.dataset.lvl) || 0.5;
      const op = Math.min(pal.contourAlpha, pal.contourAlpha * (0.6 + 0.55 * lvlFrac));
      p.setAttribute('stroke-opacity', op.toFixed(3));
    });
  }

  /* ================================================================
   *  EXPEDITION ROUTE  (catmull-rom through section anchors)
   * ================================================================ */
  let routeSVG = null;
  let routePath = null;
  let routeLen = 0;
  let pins = [];          // {el, group, t (0..1 along route), stamped}

  // Catmull-Rom → cubic bezier path string through pts [[x,y],...]
  function catmullRom(pts) {
    if (pts.length < 2) return '';
    let d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += 'C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ' ' +
                 c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ' ' +
                 p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d;
  }

  function sectionAnchors() {
    const secs = Array.from(document.querySelectorAll('[data-section]'));
    const W = window.innerWidth;
    const mobile = isMobile();
    // route hugs the left-ish margin so it never crosses the reading column too much.
    // desktop: gentle serpentine within a left band; mobile: simplified toward left margin.
    const bandMin = mobile ? 16 : Math.max(28, (W - Math.min(1100, W - 48)) / 2 * 0.5);
    const bandMax = mobile ? 40 : bandMin + 120;
    const rng = mulberry32(seed ^ 0x9e3779b9);
    const anchors = [];
    secs.forEach((s, i) => {
      const rect = s.getBoundingClientRect();
      const yTop = rect.top + window.scrollY;
      // anchor near the section heading (top area of each section)
      const y = yTop + Math.min(rect.height * 0.18, 70) + 40;
      // lateral wobble across the band, alternating a bit
      const base = mobile
        ? bandMin + (bandMax - bandMin) * (0.3 + 0.4 * rng())
        : bandMin + (bandMax - bandMin) * ((i % 2 === 0 ? 0.25 : 0.75) + (rng() - 0.5) * 0.35);
      anchors.push([Math.max(10, base), y]);
    });
    // Terminal anchor near the page bottom so the expedition line runs all the way
    // down the page, not just to the last section's heading.
    if (anchors.length) {
      const last = anchors[anchors.length - 1];
      const bottomY = (typeof docHeight === 'function' ? docHeight() : root.scrollHeight) - 48;
      if (bottomY > last[1] + 80) anchors.push([last[0], bottomY]);
    }
    return anchors;
  }

  function buildRoute() {
    if (routeSVG && routeSVG.parentNode) routeSVG.parentNode.removeChild(routeSVG);
    routeSVG = null; routePath = null; pins = [];

    const anchors = sectionAnchors();
    if (anchors.length < 2) return;

    const W = window.innerWidth;
    const H = docHeight();

    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 't17-route-layer');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.width = W + 'px';
    svg.style.height = H + 'px';

    // The expedition line must look DASHED and also DRAW ON as you scroll.
    // Composition:
    //   • `dashed` — the visible route, a repeating dash pattern (the look).
    //   • a growing <mask> containing `reveal` — a wide solid white stroke whose
    //     own stroke-dashoffset shrinks from routeLen→0, uncovering the dashed
    //     line progressively. Driving one dashoffset per frame is cheap.
    // A hidden `measure` path gives us the true path length once.
    const d = catmullRom(anchors);
    const sw = isMobile() ? 1.6 : 2;

    const measure = document.createElementNS(SVGNS, 'path');
    measure.setAttribute('d', d);
    measure.setAttribute('fill', 'none');
    measure.setAttribute('stroke', 'none');
    svg.appendChild(measure);
    routeLen = (measure.getTotalLength ? measure.getTotalLength() : 0) || 1;

    const dashed = document.createElementNS(SVGNS, 'path');
    dashed.setAttribute('d', d);
    dashed.setAttribute('fill', 'none');
    dashed.setAttribute('stroke', pal.route);
    dashed.setAttribute('stroke-width', sw);
    dashed.setAttribute('stroke-linecap', 'butt');
    dashed.setAttribute('stroke-dasharray', '7 6');
    svg.appendChild(dashed);

    const defs = document.createElementNS(SVGNS, 'defs');
    const mask = document.createElementNS(SVGNS, 'mask');
    const maskId = 't17-route-mask';
    mask.setAttribute('id', maskId);
    mask.setAttribute('maskUnits', 'userSpaceOnUse');
    mask.setAttribute('x', '0'); mask.setAttribute('y', '0');
    mask.setAttribute('width', W); mask.setAttribute('height', H);
    const reveal = document.createElementNS(SVGNS, 'path');
    reveal.setAttribute('d', d);
    reveal.setAttribute('fill', 'none');
    reveal.setAttribute('stroke', '#fff');
    reveal.setAttribute('stroke-width', '8');   // wider than dashed → full cover
    reveal.setAttribute('stroke-linecap', 'round');
    reveal.setAttribute('stroke-dasharray', routeLen);
    reveal.setAttribute('stroke-dashoffset', reduced ? 0 : routeLen);
    mask.appendChild(reveal);
    defs.appendChild(mask);
    svg.insertBefore(defs, svg.firstChild);
    dashed.setAttribute('mask', 'url(#' + maskId + ')');

    routePath = { dashed: dashed, reveal: reveal };

    // waypoint pins at each anchor
    const nPins = Math.min(5, anchors.length);
    for (let i = 0; i < nPins; i++) {
      const a = anchors[i];
      const g = document.createElementNS(SVGNS, 'g');
      g.setAttribute('class', 't17-pin');
      g.setAttribute('transform', 'translate(' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ')');
      // pin: teardrop-ish circle with a center dot + number
      const ring = document.createElementNS(SVGNS, 'circle');
      ring.setAttribute('r', '11');
      ring.setAttribute('fill', 'var(--t17-label-bg, #fbf7ec)');
      ring.setAttribute('stroke', pal.pin);
      ring.setAttribute('stroke-width', '2');
      const num = document.createElementNS(SVGNS, 'text');
      num.setAttribute('class', 't17-pin-num');
      num.setAttribute('x', '0'); num.setAttribute('y', '0.5');
      num.setAttribute('text-anchor', 'middle');
      num.setAttribute('dominant-baseline', 'central');
      num.setAttribute('font-size', '11');
      num.setAttribute('fill', pal.pin);
      num.textContent = String(i + 1);
      g.appendChild(ring);
      g.appendChild(num);
      // "stamp in": the pin's content is centered at local (0,0), so a trailing
      // scale() on `translate(x y) scale(s)` pivots about the pin center — the
      // pin pops in place. (Attribute transform; transition maps to CSS.)
      g.style.opacity = reduced ? '1' : '0';
      g.style.transition = reduced ? 'none' : 'opacity 260ms ease, transform 320ms cubic-bezier(.2,1.5,.35,1)';
      g.dataset.base = 'translate(' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ')';
      if (!reduced) g.setAttribute('transform', g.dataset.base + ' scale(0.1)');
      svg.appendChild(g);
      // t along route ≈ fraction by index (anchors are in path order)
      pins.push({ group: g, t: (i) / Math.max(1, nPins - 1), stamped: reduced });
    }

    // route sits behind content, above terrain-ish (same z-index 1 layer stack;
    // appended after terrain so slightly in front of contours but still behind text)
    main.insertBefore(svg, terrainSVG ? terrainSVG.nextSibling : main.firstChild);
    routeSVG = svg;

    if (reduced) {
      // fully drawn + pins placed, no animation
      routePath.reveal.setAttribute('stroke-dashoffset', 0);
      routeProgress = 1;
    } else {
      routeProgress = 0;
      applyRouteProgress(scrollProgress());
    }
  }

  /* current normalized scroll progress 0..1 over the document */
  function scrollProgress() {
    const denom = Math.max(root.scrollHeight - window.innerHeight, 1);
    return Math.min(1, Math.max(0, window.scrollY / denom));
  }

  let routeProgress = 0;
  function applyRouteProgress(prog) {
    if (!routePath) return;
    // reveal a little ahead of the viewport so the line is drawn as you reach it
    const ahead = Math.min(1, (window.scrollY + window.innerHeight * 0.7) /
      Math.max(root.scrollHeight, 1));
    const p = Math.max(prog, ahead);
    // monotonic-ish but allow it to track scroll up too for a live feel
    routeProgress = p;
    routePath.reveal.setAttribute('stroke-dashoffset', (routeLen * (1 - p)).toFixed(1));
    // stamp pins whose position along route has been passed
    for (const pin of pins) {
      if (!pin.stamped && p >= pin.t - 0.02) {
        pin.stamped = true;
        pin.group.style.opacity = '1';
        pin.group.setAttribute('transform', pin.group.dataset.base);
      }
    }
  }

  /* ================================================================
   *  COMPASS ROSE (hero, top-right) — inline SVG, rotates with scroll
   * ================================================================ */
  let compass = null;
  function buildCompass() {
    const bg = document.querySelector('.hero-bg');
    if (!bg || document.querySelector('.t17-compass')) return;
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 't17-compass');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');
    const water = pal.water, route = pal.route;
    // outer ring + tick marks + 8-point rose + N marker
    svg.innerHTML =
      '<circle cx="50" cy="50" r="46" fill="none" stroke="' + water + '" stroke-width="1.2" opacity="0.7"/>' +
      '<circle cx="50" cy="50" r="40" fill="none" stroke="' + water + '" stroke-width="0.6" opacity="0.5"/>' +
      tickMarks(water) +
      // 4 minor points (diagonals), lighter
      '<path d="M50 50 L58 42 L50 14 L42 42 Z" fill="' + water + '" opacity="0.35"/>' +
      '<path d="M50 50 L58 58 L86 50 L58 42 Z" fill="' + water + '" opacity="0.2"/>' +
      '<path d="M50 50 L42 58 L50 86 L58 58 Z" fill="' + water + '" opacity="0.35"/>' +
      '<path d="M50 50 L42 42 L14 50 L42 58 Z" fill="' + water + '" opacity="0.2"/>' +
      // main N-S needle: N in route/terracotta, S in water
      '<path d="M50 50 L56 44 L50 10 L44 44 Z" fill="' + route + '"/>' +
      '<path d="M50 50 L56 56 L50 90 L44 56 Z" fill="' + water + '" opacity="0.85"/>' +
      '<circle cx="50" cy="50" r="3.2" fill="' + route + '"/>' +
      '<text x="50" y="8" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="' + route + '">N</text>';
    bg.appendChild(svg);
    compass = svg;
  }
  function tickMarks(color) {
    let s = '';
    for (let i = 0; i < 72; i++) {
      const ang = (i / 72) * Math.PI * 2;
      const major = (i % 9 === 0);
      const r1 = major ? 40 : 43;
      const x1 = 50 + Math.cos(ang) * r1, y1 = 50 + Math.sin(ang) * r1;
      const x2 = 50 + Math.cos(ang) * 46, y2 = 50 + Math.sin(ang) * 46;
      s += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) +
           '" y2="' + y2.toFixed(1) + '" stroke="' + color + '" stroke-width="' + (major ? 1 : 0.5) +
           '" opacity="' + (major ? 0.6 : 0.35) + '"/>';
    }
    return s;
  }
  function recolorCompass() {
    if (!compass) return;
    compass.remove();
    compass = null;
    buildCompass();
  }

  /* ================================================================
   *  rAF LOOP — compass rotation + route progress (only when hero visible)
   * ================================================================ */
  let rafId = 0;
  let heroVisible = true;
  let dirty = true;

  function tick() {
    rafId = 0;
    if (document.hidden) return;   // paused only when tab hidden; route must track full-page scroll
    // compass: rotate a few degrees with scroll (subtle)
    const sp = scrollProgress();
    if (compass) {
      root.style.setProperty('--t17-rot', (sp * 26 - 6).toFixed(2) + 'deg');
    }
    applyRouteProgress(sp);
    // idle when nothing changing? keep it light: re-schedule only if a scroll
    // arrived since last frame (dirty). Otherwise stop until next scroll.
    if (dirty) {
      dirty = false;
      rafId = requestAnimationFrame(tick);
    }
  }
  function requestTick() {
    dirty = true;
    if (!rafId && !document.hidden) rafId = requestAnimationFrame(tick);
  }

  function onScroll() {
    if (reduced) return;
    requestTick();
  }

  /* ================================================================
   *  RESIZE (debounced) — regenerate terrain + route on SIGNIFICANT change
   * ================================================================ */
  let lastW = window.innerWidth, lastH = window.innerHeight;
  let resizeTimer = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const dw = Math.abs(window.innerWidth - lastW);
      const dh = Math.abs(window.innerHeight - lastH);
      const docChanged = Math.abs(docHeight() - terrainH) > 120;
      // significant width change → new terrain (keep SAME seed so it's stable
      // within a session; the spec wants a NEW landmass per RELOAD, not per resize)
      if (dw > 80 || docChanged) {
        lastW = window.innerWidth; lastH = window.innerHeight;
        buildTerrain();
        buildRoute();
        if (!reduced) requestTick();
      } else if (dh > 60) {
        // height-only change (e.g. mobile URL bar) → just re-anchor route
        lastH = window.innerHeight;
        buildRoute();
        if (!reduced) requestTick();
      }
    }, 260);
  }

  /* ================================================================
   *  VISIBILITY — pause rAF when hero offscreen / tab hidden
   * ================================================================ */
  function observeHero() {
    const hero = document.querySelector('.hero-section') || main;
    if (!('IntersectionObserver' in window) || !hero) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        heroVisible = e.isIntersecting;
        if (heroVisible && !reduced) requestTick();
      }
    }, { rootMargin: '120px' });
    io.observe(hero);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    } else if (!reduced && heroVisible) {
      requestTick();
    }
  });

  window.addEventListener('modechange', () => setTimeout(() => {
    readColors();
    recolorTerrain();
    recolorCompass();
    if (routePath) {
      routePath.dashed.setAttribute('stroke', pal.route);
    }
    pins.forEach((p) => {
      const ring = p.group.querySelector('circle');
      const num = p.group.querySelector('text');
      if (ring) ring.setAttribute('stroke', pal.pin);
      if (num) num.setAttribute('fill', pal.pin);
    });
  }, 60));

  /* ================================================================
   *  INIT
   * ================================================================ */
  function init() {
    buildTerrain();
    buildRoute();
    buildCompass();
    observeHero();
    if (!reduced) {
      window.addEventListener('scroll', onScroll, { passive: true });
      requestTick();   // draw initial state for whatever is in view
    }
    window.addEventListener('resize', onResize);
  }
  init();

  // content/cards render after this script may run; heights shift. Rebuild once
  // things settle so route anchors + terrain height match final layout.
  window.addEventListener('load', () => setTimeout(() => {
    lastW = window.innerWidth; lastH = window.innerHeight;
    buildTerrain();
    buildRoute();
    if (!reduced) requestTick();
  }, 220));
})();
