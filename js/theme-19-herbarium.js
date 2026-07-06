/* js/theme-19-herbarium.js
 * Theme 19 — Herbarium. Generative pressed-botany archive.
 *
 * Homepage: ONE full-document SVG (.t19-garden) draws recursive branching
 * vines in the outer margins ONLY (strictly clipped to the gutters so they
 * never overlap text). Vines are seeded fresh each reload (mulberry32 from
 * Date.now()) — one "species" per window.PROJECTS entry, rooted at section
 * positions. Growth is tied to scroll and is MONOTONIC (never retracts).
 * Also injects a Latinized binomial under the hero name, and a taxonomic
 * label + generated binomial onto every specimen sheet (.card / .other-card).
 *
 * Subpages (no [data-section]): only a small static pre-grown corner sprig +
 * sheet labels. No scroll-growth.
 *
 * Dark mode = cyanotype: vines render white (read live via getComputedStyle).
 * Reduced motion: the garden is drawn fully grown on load, no loop.
 * No-JS: nothing here runs; CSS sheets/tape/labels remain fully readable.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '19') return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const root = document.documentElement;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const small = () => window.innerWidth < 760;

  /* ---------- mulberry32 (seeded PRNG) ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const seed = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
  let rng = mulberry32(seed);

  /* ---------- tiny string hash (stable per title) ---------- */
  function hash(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  /* ---------- live palette (cream vs cyanotype) ---------- */
  const palette = {
    leaf: '#5b7a4a', leaf2: '#7d9463', stem: '#6e5a3a',
    bloom: '#c4788a', bloom2: '#d99a3c', alpha: 0.9
  };
  function readColors() {
    const cs = getComputedStyle(root);
    const g = (n, f) => (cs.getPropertyValue(n).trim() || f);
    palette.leaf = g('--t19-leaf', palette.leaf);
    palette.leaf2 = g('--t19-leaf-2', palette.leaf2);
    palette.stem = g('--t19-stem', palette.stem);
    palette.bloom = g('--t19-bloom', palette.bloom);
    palette.bloom2 = g('--t19-bloom-2', palette.bloom2);
    palette.alpha = parseFloat(g('--t19-vine-alpha', '0.9')) || 0.9;
  }
  readColors();

  /* ================================================================
   *  BINOMIAL / LABEL generation (tasteful Latinization)
   * ================================================================ */
  const GENERA = ['Misinformatio', 'Rumoria', 'Viralis', 'Datastilla', 'Nodus',
    'Rhizonet', 'Cryptogramma', 'Polaritas', 'Algorithma', 'Signalia',
    'Fabula', 'Chatteria', 'Memetica', 'Retiaria'];
  const EPITHET_SUFFIX = ['ii', 'ensis', 'ana', 'oides', 'ata', 'ifolia'];
  const STOP = { the: 1, a: 1, an: 1, of: 1, on: 1, in: 1, and: 1, for: 1, to: 1, with: 1 };

  function latinize(word) {
    let w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!w) return '';
    // trim trailing vowel cluster so a suffix reads cleanly, then attach.
    w = w.replace(/(?:[aeiou]+)$/, '');
    if (w.length < 3) w = word.toLowerCase().replace(/[^a-z]/g, '').slice(0, 4);
    return w;
  }
  function firstMeaningfulWord(title) {
    const parts = String(title).split(/[\s\-—:]+/).filter(Boolean);
    for (const p of parts) {
      const clean = p.toLowerCase().replace(/[^a-z]/g, '');
      if (clean && !STOP[clean]) return p;
    }
    return parts[0] || 'species';
  }
  function makeBinomial(title) {
    const h = hash(String(title));
    const genus = GENERA[h % GENERA.length];
    let stem = latinize(firstMeaningfulWord(title));
    if (!stem) stem = 'herba';
    const suf = EPITHET_SUFFIX[(h >>> 5) % EPITHET_SUFFIX.length];
    const epithet = (stem + suf).replace(/(.)\1{2,}$/, '$1$1');
    return { genus, epithet, auth: 'GARIMELLA, 20' + (10 + (h % 16)) };
  }

  /* ================================================================
   *  SHEET LABELS  (bottom-right taxonomic label on every card)
   * ================================================================ */
  function labelCards() {
    const cards = document.querySelectorAll(
      'html[data-theme="19"] .card, html[data-theme="19"] .other-card'
    );
    cards.forEach((card) => {
      if (card.querySelector('.t19-label')) return;
      const titleEl = card.querySelector('h3, .other-feature-title');
      const title = titleEl ? titleEl.textContent : (card.textContent || 'specimen').slice(0, 40);
      const b = makeBinomial(title);
      const accH = hash(title + '·acc');
      const acc = String(1000 + (accH % 8999));
      const label = document.createElement('div');
      label.className = 't19-label';
      label.setAttribute('aria-hidden', 'true');
      label.innerHTML =
        '<span class="t19-binom">' + b.genus + ' ' + b.epithet +
        ' <span class="t19-auth">' + b.auth + '</span></span>' +
        'COLL. K. GARIMELLA · DET. 2026<br>' +
        'LOC. NEW BRUNSWICK · No. ' + acc;
      card.appendChild(label);
    });
  }

  /* Hero binomial (derived from the site owner's name / role). */
  function labelHero() {
    const nameEl = document.getElementById('heroName');
    const holder = document.querySelector('.hero-text');
    if (!nameEl || !holder || document.querySelector('.t19-hero-binomial')) return;
    const b = makeBinomial((nameEl.textContent || 'Garimella') + ' academicus');
    const p = document.createElement('p');
    p.className = 't19-hero-binomial';
    p.setAttribute('aria-hidden', 'true');
    p.innerHTML = b.genus + ' ' + b.epithet +
      '<span class="t19-auth">DET. 2026</span>';
    const role = document.getElementById('heroRole');
    if (role && role.parentNode === holder) holder.insertBefore(p, role.nextSibling);
    else nameEl.insertAdjacentElement('afterend', p);
  }

  labelHero();
  labelCards();

  /* ================================================================
   *  Is this the growing homepage, or a static subpage?
   * ================================================================ */
  const hasSections = !!document.querySelector('[data-section]');

  /* ================================================================
   *  PLANT GENERATION  (recursive branching quadratic beziers)
   *  Each plant produces:
   *   - segments: {d, len, depth}  (path data, length, reveal-depth 0..1)
   *   - organs:   {x, y, kind, depth, ...}  leaves & blooms that "pop"
   *  `depth` is normalized document-Y of the feature so growth tracks scroll.
   * ================================================================ */
  function buildPlant(spec, docH) {
    const segs = [];
    const organs = [];
    const r = mulberry32(spec.seed);
    const rand = (a, b) => a + (b - a) * r();

    const baseX = spec.baseX;           // x within the gutter band
    const baseY = spec.rootY;           // document-space root y (bottom of plant)
    const grow = spec.grow;             // +1 toward top-of-page, plant climbs up
    const height = spec.height;         // vertical reach in px
    const dir = spec.dir;               // -1 vine leans left, +1 right (into gutter)

    // reveal-depth helper: map a document-Y to 0..1 (top=0 .. bottom=1),
    // but we want lower-on-page plants to grow later, i.e. depth grows with Y.
    const depthAt = (y) => Math.min(1, Math.max(0, y / docH));

    const angDelta = spec.angle;        // branching half-angle (radians)
    const leafShape = spec.leafShape;

    // Recursive branch. p0 = start point, ang = heading (radians, 0 = up),
    // len = this segment length, depthLevel = recursion depth.
    function branch(x, y, ang, len, level) {
      if (level > 4 || len < 8) return;
      // heading: 0 points up the page (decreasing y). add gentle sway.
      const sway = Math.sin((y + spec.seed) * 0.02) * 0.15;
      const a = ang + sway;
      const ex = x + Math.sin(a) * len * dir;
      const ey = y - Math.cos(a) * len * grow;   // climb up the page
      // control point bows the stem outward into the gutter
      const cx = x + Math.sin(a) * len * 0.5 * dir + dir * len * 0.18;
      const cy = y - Math.cos(a) * len * 0.5 * grow;

      const d = 'M' + x.toFixed(1) + ' ' + y.toFixed(1) +
                ' Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) +
                ' ' + ex.toFixed(1) + ' ' + ey.toFixed(1);
      // approximate arc length for stroke-dash reveal
      const len2 = Math.hypot(ex - x, ey - y) * 1.08;
      const segDepth = depthAt(Math.min(y, ey));
      segs.push({ d: d, len: len2, depth: segDepth, w: Math.max(1, 3.2 - level * 0.6) });

      // leaves along this segment (alternate sides)
      const nLeaves = level < 3 ? 2 : 1;
      for (let i = 0; i < nLeaves; i++) {
        if (r() > 0.72) continue;
        const t = 0.35 + i * 0.4;
        const lx = x + (ex - x) * t;
        const ly = y + (ey - y) * t;
        const side = (i % 2 === 0 ? 1 : -1) * dir;
        organs.push({
          kind: 'leaf', x: lx, y: ly,
          rot: (a * 180 / Math.PI) + side * 52,
          scale: rand(0.8, 1.25), shape: leafShape,
          depth: depthAt(ly)
        });
      }

      // terminal blooms
      if (level >= 2 && r() < 0.5) {
        organs.push({
          kind: 'bloom', x: ex, y: ey,
          scale: rand(0.75, 1.15),
          color: (r() < 0.66 ? 'a' : 'b'),
          depth: depthAt(ey)
        });
      }

      // branch children: an F[+F]F[-F]F-flavoured split
      const nextLen = len * rand(0.72, 0.86);
      if (level < 4) {
        branch(ex, ey, a - angDelta * rand(0.7, 1.15), nextLen, level + 1);
        if (r() < 0.85) branch(ex, ey, a + angDelta * rand(0.7, 1.15), nextLen * rand(0.85, 1), level + 1);
        // occasional straight continuation to keep a main stem
        if (level < 2 || r() < 0.5) branch(ex, ey, a + rand(-0.1, 0.1), nextLen * 0.92, level + 1);
      }
    }

    const trunkLen = height * 0.26;
    branch(baseX, baseY, rand(-0.12, 0.12), trunkLen, 0);
    return { segs, organs, spec };
  }

  /* ================================================================
   *  SVG BUILD  (homepage garden)
   * ================================================================ */
  let garden = null;         // <svg>
  let clipLeftRect = null, clipRightRect = null;
  let pathNodes = [];        // {seg, el, revealed}
  let organNodes = [];       // {organ, el, revealed}
  let maxScroll = 0;         // monotonic reveal threshold (0..1)
  let butterfly = null, blooms = [];

  /* Gutter bands are computed from the ACTUAL empty margins of the L2 layout
     so vines can never reach the text. base.css: main { max-width:1100px;
     margin:0 auto; padding:0 1.5rem } — the 24px padding lives INSIDE the box,
     so text starts 24px in from the content-box edge, and the empty margin is
     (W - 1100)/2 per side. We draw flush to the viewport edge and stop at
     least 8px short of the content box. If there is no real margin (narrow
     viewports where the box fills the screen), we draw only inside the 24px
     padding strip on the left — still short of the text. */
  const PAD = 24;                 // main's horizontal padding
  const CONTENT_MAX = 1100;
  function gutterBands() {
    const W = window.innerWidth;
    const boxW = Math.min(CONTENT_MAX, W);          // content box incl. padding
    const margin = Math.max(0, (W - boxW) / 2);     // empty space each side
    if (!small() && margin >= 44) {
      const band = Math.min(96, margin - 8);        // flush to edge, 8px clear of box
      return [
        { x0: 0, w: band },
        { x0: W - band, w: band }
      ];
    }
    // No real gutter (or mobile): sparse strip inside the left padding only.
    return [{ x0: 0, w: Math.max(16, PAD - 4) }];   // ≤20px, text starts at 24px
  }

  function makeSVG(docH) {
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 't19-garden');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', window.innerWidth);
    svg.setAttribute('height', docH);
    svg.setAttribute('viewBox', '0 0 ' + window.innerWidth + ' ' + docH);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.height = docH + 'px';

    // clipPath restricting all drawing to the gutter bands
    const defs = document.createElementNS(SVGNS, 'defs');
    const clip = document.createElementNS(SVGNS, 'clipPath');
    clip.setAttribute('id', 't19-gutterclip');
    clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
    gutterBands().forEach((b, i) => {
      const rect = document.createElementNS(SVGNS, 'rect');
      rect.setAttribute('x', b.x0);
      rect.setAttribute('y', 0);
      rect.setAttribute('width', b.w);
      rect.setAttribute('height', docH);
      clip.appendChild(rect);
      if (i === 0) clipLeftRect = rect; else clipRightRect = rect;
    });
    defs.appendChild(clip);
    svg.appendChild(defs);

    const g = document.createElementNS(SVGNS, 'g');
    g.setAttribute('clip-path', 'url(#t19-gutterclip)');
    svg.appendChild(g);
    svg._layer = g;
    return svg;
  }

  function leafPath(shape) {
    // a few pressed-leaf silhouettes (unit ~ length 18)
    switch (shape) {
      case 0: return 'M0 0 C6 -5 12 -3 16 0 C12 3 6 5 0 0 Z';        // ovate
      case 1: return 'M0 0 C4 -7 10 -8 16 -1 C10 2 4 3 0 0 Z';       // lanceolate
      case 2: return 'M0 0 C5 -4 9 -9 8 -1 C13 -4 15 1 8 3 C9 6 4 4 0 0 Z'; // lobed
      default: return 'M0 0 C7 -4 13 -2 15 0 C13 3 7 5 0 0 Z';
    }
  }

  function buildGarden() {
    teardownGarden();
    const projects = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];
    const docH = Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0,
      window.innerHeight
    );
    const bands = gutterBands();

    garden = makeSVG(docH);
    // insert as first child of <main> so it spans document flow height
    const main = document.getElementById('top') || document.body;
    main.insertBefore(garden, main.firstChild);
    const layer = garden._layer;

    // Root plants at intervals matching section vertical positions.
    const sections = Array.from(document.querySelectorAll('[data-section]'));
    const rootYs = sections.map((s) => {
      const rect = s.getBoundingClientRect();
      return rect.top + window.scrollY + rect.height * 0.92; // root near section bottom
    });

    const specs = [];
    const seedList = projects.length ? projects : [0, 1, 2, 3, 4, 5];
    seedList.forEach((proj, i) => {
      const title = proj && proj.title ? proj.title : ('specimen-' + i);
      const h = hash(title + '#' + i);
      const band = bands[i % bands.length];
      const dir = (band.x0 === 0) ? 1 : -1;   // left band leans right (inward), right band leans left
      const baseX = (band.x0 === 0)
        ? band.x0 + 6 + (h % Math.max(8, band.w * 0.4))
        : band.x0 + band.w - 6 - (h % Math.max(8, band.w * 0.4));
      const rootY = rootYs.length
        ? rootYs[i % rootYs.length] + (rng() - 0.5) * 60
        : docH * (0.2 + 0.13 * i);
      specs.push({
        seed: (h ^ seed) >>> 0,
        baseX: baseX,
        rootY: Math.min(docH - 10, rootY),
        grow: 1,
        dir: dir,
        height: Math.min(rootY, 260 + (h % 200)),
        angle: 0.32 + ((h >>> 8) % 100) / 300,     // ~0.32..0.65 rad
        leafShape: h % 3,
        band: band
      });
    });

    pathNodes = [];
    organNodes = [];
    blooms = [];

    specs.forEach((spec) => {
      const plant = buildPlant(spec, docH);
      plant.segs.forEach((seg) => {
        const el = document.createElementNS(SVGNS, 'path');
        el.setAttribute('d', seg.d);
        el.setAttribute('fill', 'none');
        el.setAttribute('stroke', palette.stem);
        el.setAttribute('stroke-width', seg.w);
        el.setAttribute('stroke-linecap', 'round');
        el.setAttribute('opacity', palette.alpha);
        el.style.strokeDasharray = seg.len;
        el.style.strokeDashoffset = reduced ? 0 : seg.len;
        if (!reduced) el.style.transition = 'stroke-dashoffset 700ms ease';
        layer.appendChild(el);
        pathNodes.push({ seg: seg, el: el, revealed: reduced });
      });
      plant.organs.forEach((org) => {
        let el;
        if (org.kind === 'leaf') {
          el = document.createElementNS(SVGNS, 'path');
          el.setAttribute('d', leafPath(org.shape));
          el.setAttribute('fill', (org.shape % 2) ? palette.leaf : palette.leaf2);
          el.setAttribute('opacity', palette.alpha);
          el.setAttribute('transform',
            'translate(' + org.x.toFixed(1) + ' ' + org.y.toFixed(1) + ') ' +
            'rotate(' + org.rot.toFixed(0) + ') scale(' + org.scale.toFixed(2) + ')');
        } else {
          el = document.createElementNS(SVGNS, 'g');
          const petals = 5;
          const col = org.color === 'a' ? palette.bloom : palette.bloom2;
          for (let k = 0; k < petals; k++) {
            const pe = document.createElementNS(SVGNS, 'ellipse');
            const ang = (k / petals) * Math.PI * 2;
            pe.setAttribute('cx', (Math.cos(ang) * 3.4).toFixed(1));
            pe.setAttribute('cy', (Math.sin(ang) * 3.4).toFixed(1));
            pe.setAttribute('rx', '2.6'); pe.setAttribute('ry', '1.5');
            pe.setAttribute('fill', col);
            pe.setAttribute('transform', 'rotate(' + (ang * 180 / Math.PI).toFixed(0) + ' ' +
              (Math.cos(ang) * 3.4).toFixed(1) + ' ' + (Math.sin(ang) * 3.4).toFixed(1) + ')');
            el.appendChild(pe);
          }
          const core = document.createElementNS(SVGNS, 'circle');
          core.setAttribute('r', '1.8');
          core.setAttribute('fill', palette.bloom2);
          el.appendChild(core);
          el.setAttribute('transform',
            'translate(' + org.x.toFixed(1) + ' ' + org.y.toFixed(1) + ') scale(' + org.scale.toFixed(2) + ')');
          blooms.push({ x: org.x, y: org.y });
        }
        el.setAttribute('opacity', reduced ? palette.alpha : 0);
        el.style.transformBox = 'fill-box';
        el.style.transformOrigin = 'center';
        // "pop": start scaled down, grow in
        el.style.transition = reduced ? 'none' : 'opacity 400ms ease, transform 500ms cubic-bezier(.2,1.3,.4,1)';
        el.dataset.baseTransform = el.getAttribute('transform');
        if (!reduced) {
          el.setAttribute('transform', el.dataset.baseTransform + ' scale(0.01)');
        }
        layer.appendChild(el);
        organNodes.push({ organ: org, el: el, revealed: reduced });
      });
    });

    // If reduced motion, everything is already at final state.
    if (reduced) { maxScroll = 1; buildButterfly(); return; }

    // initial reveal for whatever is already in view
    maxScroll = 0;
    updateReveal(scrollProgress());
    buildButterfly();
  }

  function scrollProgress() {
    const docH = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    return Math.min(1, Math.max(0, window.scrollY / docH));
  }

  /* Monotonic reveal: threshold only ever increases. depth ≤ threshold shows. */
  function updateReveal(prog) {
    // reveal a little ahead of the viewport bottom so vines are drawn as you reach them
    const viewDepth = Math.min(1, (window.scrollY + window.innerHeight * 0.85) /
      Math.max(document.documentElement.scrollHeight, 1));
    const threshold = Math.max(maxScroll, viewDepth, prog);
    if (threshold <= maxScroll && maxScroll > 0) return;
    maxScroll = threshold;
    for (let i = 0; i < pathNodes.length; i++) {
      const n = pathNodes[i];
      if (!n.revealed && n.seg.depth <= threshold) {
        n.el.style.strokeDashoffset = 0;
        n.revealed = true;
      }
    }
    for (let i = 0; i < organNodes.length; i++) {
      const n = organNodes[i];
      if (!n.revealed && n.organ.depth <= threshold) {
        n.el.setAttribute('opacity', palette.alpha);
        n.el.setAttribute('transform', n.el.dataset.baseTransform);
        n.revealed = true;
      }
    }
  }

  /* ---------- recolor on mode change (cyanotype swap) ---------- */
  function recolor() {
    readColors();
    for (const n of pathNodes) {
      n.el.setAttribute('stroke', palette.stem);
      n.el.setAttribute('opacity', palette.alpha);
    }
    for (const n of organNodes) {
      const o = n.organ;
      if (o.kind === 'leaf') {
        n.el.setAttribute('fill', (o.shape % 2) ? palette.leaf : palette.leaf2);
      } else {
        const col = o.color === 'a' ? palette.bloom : palette.bloom2;
        n.el.querySelectorAll('ellipse').forEach((e) => e.setAttribute('fill', col));
        n.el.querySelectorAll('circle').forEach((e) => e.setAttribute('fill', palette.bloom2));
      }
      if (n.revealed) n.el.setAttribute('opacity', palette.alpha);
    }
    if (sprigSVG) recolorSprig();
    if (butterfly) butterfly.setAttribute('fill', palette.bloom);
  }

  /* ================================================================
   *  BUTTERFLY  (optional stretch) — desktop only, ~20s noise loop
   * ================================================================ */
  let bfRAF = 0, bfT0 = 0;
  function buildButterfly() {
    if (reduced || small() || !garden || blooms.length === 0) return;
    const g = document.createElementNS(SVGNS, 'g');
    g.setAttribute('class', 't19-butterfly');
    const body = document.createElementNS(SVGNS, 'g');
    // two wings + body
    const mk = (d, f) => { const p = document.createElementNS(SVGNS, 'path'); p.setAttribute('d', d); p.setAttribute('fill', f); return p; };
    body.appendChild(mk('M0 0 C-6 -5 -9 -1 -7 3 C-4 5 -1 3 0 0 Z', palette.bloom));
    body.appendChild(mk('M0 0 C6 -5 9 -1 7 3 C4 5 1 3 0 0 Z', palette.bloom));
    const abd = document.createElementNS(SVGNS, 'ellipse');
    abd.setAttribute('rx', '0.9'); abd.setAttribute('ry', '3.2'); abd.setAttribute('fill', palette.stem);
    body.appendChild(abd);
    g.appendChild(body);
    g.setAttribute('opacity', '0.85');
    garden._layer.appendChild(g);
    butterfly = g;
    butterfly._body = body;
    bfT0 = performance.now();
  }

  function butterflyFrame(now) {
    if (!butterfly || document.hidden) { bfRAF = 0; return; }
    const t = (now - bfT0) / 20000; // 20s loop
    // wander between blooms with a smooth noise-ish path
    const i = Math.floor(t) % blooms.length;
    const j = (i + 1) % blooms.length;
    const f = t - Math.floor(t);
    const ease = f * f * (3 - 2 * f);
    const b0 = blooms[i], b1 = blooms[j];
    const wobble = Math.sin(now * 0.004) * 10;
    const x = b0.x + (b1.x - b0.x) * ease + Math.sin(now * 0.002) * 14;
    const y = b0.y + (b1.y - b0.y) * ease + wobble;
    const flap = 0.6 + Math.abs(Math.sin(now * 0.018)) * 0.4;
    butterfly.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
    butterfly._body.setAttribute('transform', 'scale(' + flap.toFixed(2) + ' 1)');
    bfRAF = requestAnimationFrame(butterflyFrame);
  }
  function startButterfly() {
    if (butterfly && !bfRAF && !document.hidden) bfRAF = requestAnimationFrame(butterflyFrame);
  }

  /* ================================================================
   *  STATIC CORNER SPRIG  (subpages) — pre-grown, no scroll
   * ================================================================ */
  let sprigSVG = null;
  function recolorSprig() {
    if (!sprigSVG) return;
    sprigSVG.querySelectorAll('path.t19-sp-stem').forEach((p) => p.setAttribute('stroke', palette.stem));
    sprigSVG.querySelectorAll('path.t19-sp-leaf').forEach((p, i) => p.setAttribute('fill', i % 2 ? palette.leaf : palette.leaf2));
    sprigSVG.querySelectorAll('.t19-sp-bloom ellipse').forEach((e) => e.setAttribute('fill', palette.bloom));
  }
  function buildSprig() {
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 't19-sprig');
    svg.setAttribute('viewBox', '0 0 120 150');
    svg.setAttribute('aria-hidden', 'true');
    const r = mulberry32(seed);
    const layer = document.createElementNS(SVGNS, 'g');
    svg.appendChild(layer);

    // small pre-grown plant rooted bottom-left of the box
    const segs = [];
    (function branch(x, y, ang, len, lvl) {
      if (lvl > 3 || len < 6) return;
      const ex = x + Math.sin(ang) * len;
      const ey = y - Math.cos(ang) * len;
      const cx = x + Math.sin(ang) * len * 0.5 + 6;
      const cy = y - Math.cos(ang) * len * 0.5;
      const p = document.createElementNS(SVGNS, 'path');
      p.setAttribute('class', 't19-sp-stem');
      p.setAttribute('d', 'M' + x + ' ' + y + ' Q' + cx + ' ' + cy + ' ' + ex + ' ' + ey);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', palette.stem);
      p.setAttribute('stroke-width', Math.max(1, 2.6 - lvl * 0.6));
      p.setAttribute('stroke-linecap', 'round');
      layer.appendChild(p);
      // leaf
      const lf = document.createElementNS(SVGNS, 'path');
      lf.setAttribute('class', 't19-sp-leaf');
      lf.setAttribute('d', leafPath(lvl % 3));
      lf.setAttribute('fill', lvl % 2 ? palette.leaf : palette.leaf2);
      lf.setAttribute('transform', 'translate(' + ((x + ex) / 2).toFixed(1) + ' ' + ((y + ey) / 2).toFixed(1) +
        ') rotate(' + (ang * 180 / Math.PI + 50).toFixed(0) + ')');
      layer.appendChild(lf);
      if (lvl >= 2) {
        const bg = document.createElementNS(SVGNS, 'g');
        bg.setAttribute('class', 't19-sp-bloom');
        for (let k = 0; k < 5; k++) {
          const a = (k / 5) * Math.PI * 2;
          const e = document.createElementNS(SVGNS, 'ellipse');
          e.setAttribute('cx', (Math.cos(a) * 3).toFixed(1));
          e.setAttribute('cy', (Math.sin(a) * 3).toFixed(1));
          e.setAttribute('rx', '2.3'); e.setAttribute('ry', '1.3');
          e.setAttribute('fill', palette.bloom);
          bg.appendChild(e);
        }
        bg.setAttribute('transform', 'translate(' + ex.toFixed(1) + ' ' + ey.toFixed(1) + ')');
        layer.appendChild(bg);
      }
      branch(ex, ey, ang - (0.4 + r() * 0.3), len * 0.78, lvl + 1);
      if (r() < 0.8) branch(ex, ey, ang + (0.4 + r() * 0.3), len * 0.72, lvl + 1);
    })(20, 145, 0.1, 46, 0);

    document.body.appendChild(svg);
    sprigSVG = svg;
  }

  function teardownGarden() {
    if (bfRAF) { cancelAnimationFrame(bfRAF); bfRAF = 0; }
    butterfly = null;
    if (garden && garden.parentNode) garden.parentNode.removeChild(garden);
    garden = null; pathNodes = []; organNodes = []; blooms = [];
  }

  /* ================================================================
   *  SCROLL / RESIZE / VISIBILITY wiring
   * ================================================================ */
  let ticking = false;
  function onScroll() {
    if (reduced || !garden) return;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        updateReveal(scrollProgress());
        ticking = false;
      });
    }
  }

  let resizeTimer = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (hasSections) {
        rng = mulberry32(seed);           // same seed → stable-ish regeneration
        buildGarden();
        startButterfly();
      }
    }, 250);
  }

  // Pause butterfly when garden scrolls offscreen; resume when visible.
  let io = null;
  function observeGarden() {
    if (!('IntersectionObserver' in window) || !garden) return;
    if (io) io.disconnect();
    io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) startButterfly();
        else if (bfRAF) { cancelAnimationFrame(bfRAF); bfRAF = 0; }
      }
    }, { rootMargin: '200px' });
    io.observe(garden);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (bfRAF) { cancelAnimationFrame(bfRAF); bfRAF = 0; }
    } else {
      startButterfly();
    }
  });

  window.addEventListener('modechange', () => setTimeout(recolor, 60));

  /* ================================================================
   *  INIT
   * ================================================================ */
  if (hasSections) {
    // homepage — full growing garden
    buildGarden();
    observeGarden();
    startButterfly();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    // recompute after fonts/content settle (heights shift as cards render)
    window.addEventListener('load', () => setTimeout(() => { if (hasSections) { buildGarden(); observeGarden(); startButterfly(); } }, 200));
  } else {
    // subpage — static pre-grown corner sprig only
    buildSprig();
    window.addEventListener('modechange', () => setTimeout(recolor, 60));
  }
})();
