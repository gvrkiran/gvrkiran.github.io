/* js/theme-12-observatory.js
 * Observatory — every publication in window.PUBLICATIONS becomes a star in the
 * hero sky. Co-authorship (excluding Kiran Garimella) draws constellation lines.
 * Dark mode = an explorable night sky; light mode = an engraved celestial chart
 * of the SAME data. Palette is read from CSS custom props (--t12-star / --t12-line
 * / --t12-bg) so one Canvas 2D renderer serves both looks.
 *
 * Tiers:
 *  - Desktop: full twinkle + parallax + hover hit-test + shooting stars, ~60fps.
 *  - Mobile (<=760px): <=150 stars, no parallax, tap = tooltip.
 *  - Reduced motion: ONE static frame, no rAF loop.
 *  - No-JS: CSS .hero-bg::before paints a decorative starfield (see CSS).
 * Subpages lack .hero-bg -> canvas is skipped entirely.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '12') return;

  const html = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const bg = document.querySelector('.hero-bg');
  const pubs = window.PUBLICATIONS;
  const hasData = Array.isArray(pubs) && pubs.length > 0;

  // Subpage (no hero) or missing data -> palette+type+CSS only; nothing to draw.
  if (!bg || !hasData) return;

  // Signal that JS is live so the CSS placeholder starfield hides.
  html.classList.add('t12-js');

  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------------- Canvas setup ---------------- */
  const canvas = document.createElement('canvas');
  // pointer-events:auto is required: .hero-bg is pointer-events:none (base.css),
  // so without this the canvas never receives pointermove and hover does nothing.
  // The canvas sits at z-index 0 (behind hero content at z-index 1), so links/pills
  // still take clicks; the canvas only gets events over empty sky.
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:auto;';
  bg.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // Tooltip (styled by CSS as .t12-tip).
  const tip = document.createElement('div');
  tip.className = 't12-tip';
  tip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tip);

  // Interactivity hint under the hero.
  const heroInner = bg.parentNode && bg.parentNode.querySelector('.hero-inner');
  if (heroInner) {
    const hint = document.createElement('div');
    hint.className = 't12-hint';
    hint.innerHTML = '<span>hover a star</span>';
    bg.parentNode.appendChild(hint);
  }

  let w = 0, h = 0, dpr = 1;
  const KIRAN = 'kiran garimella';

  /* ---------------- Palette (read from CSS custom props) ---------------- */
  let PAL = { bg: '#050a18', star: '#fff7e6', line: 'rgba(125,211,252,0.25)', glow: '#f6c667', hatch: false };
  function readColors() {
    const cs = getComputedStyle(html);
    PAL.bg = cs.getPropertyValue('--t12-bg').trim() || PAL.bg;
    PAL.star = cs.getPropertyValue('--t12-star').trim() || PAL.star;
    PAL.line = cs.getPropertyValue('--t12-line').trim() || PAL.line;
    PAL.glow = cs.getPropertyValue('--t12-glow').trim() || PAL.glow;
    PAL.hatch = (cs.getPropertyValue('--t12-hatch').trim() === '1');
  }

  /* ---------------- Build the star catalogue ---------------- */
  // Cap stars on mobile (~150). Keep the most recent when capping.
  const CAP = isMobile ? 150 : pubs.length;

  // Deterministic 32-bit string hash -> used for venue band + jitter seeds.
  function hashStr(s) {
    let hsh = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      hsh ^= s.charCodeAt(i);
      hsh = Math.imul(hsh, 16777619) >>> 0;
    }
    return hsh >>> 0;
  }
  // Seeded pseudo-random in [0,1) from an integer seed (mulberry32 step).
  function seededRand(seed) {
    let t = (seed + 0x6d2b79f5) >>> 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Determine numeric year range for x-scaling. "Unpublished"/NaN -> newest band.
  let minYear = Infinity, maxYear = -Infinity;
  for (const p of pubs) {
    const y = parseInt(String(p == null ? '' : p.year), 10);
    if (!isNaN(y)) { if (y < minYear) minYear = y; if (y > maxYear) maxYear = y; }
  }
  if (!isFinite(minYear)) { minYear = 2010; maxYear = 2026; }
  if (minYear === maxYear) maxYear = minYear + 1;

  // Pre-select which pubs become stars (mobile cap keeps the newest).
  let source = pubs;
  if (CAP < pubs.length) {
    source = pubs
      .map((p, i) => ({ p, i, y: (function () { const n = parseInt(String(p && p.year), 10); return isNaN(n) ? maxYear + 1 : n; })() }))
      .sort((a, b) => b.y - a.y)
      .slice(0, CAP)
      .map((o) => o.p);
  }

  // Star objects with layout in NORMALIZED [0,1] space (recomputed to px on resize).
  const stars = [];
  source.forEach((p, idx) => {
    if (!p) return;
    const yearStr = String(p.year == null ? '' : p.year);
    const yNum = parseInt(yearStr, 10);
    const seed = hashStr((p.title || '') + '|' + (p.venue || '') + '|' + idx);
    const jitterX = (seededRand(seed) - 0.5);
    const jitterY = (seededRand(seed ^ 0x9e3779b9) - 0.5);

    // X = year across width; unpublished/NaN -> newest band (far right) + jitter.
    let nx;
    if (isNaN(yNum)) {
      nx = 0.9 + jitterX * 0.08;               // recent/newest band, right side
    } else {
      nx = (yNum - minYear) / (maxYear - minYear);
      nx = 0.06 + nx * 0.88 + jitterX * 0.05;  // margins + gentle jitter
    }
    nx = Math.min(0.98, Math.max(0.02, nx));

    // Y = seeded venue-hash band, so a venue clusters into a horizontal stratum.
    const vHash = hashStr((p.venue || 'unknown').toLowerCase());
    const band = (vHash % 1000) / 1000;        // 0..1
    let ny = 0.08 + band * 0.84 + jitterY * 0.06;
    ny = Math.min(0.96, Math.max(0.04, ny));

    const recent = !isNaN(yNum) && yNum >= (maxYear - 1);
    const baseR = 1 + seededRand(seed ^ 0x1234) * 2 + (recent ? 1 : 0); // 1..3 (+1 recent)

    // Co-authors excluding Kiran (used to build constellation edges).
    const coauthors = Array.isArray(p.authors)
      ? p.authors.map((a) => String(a).trim().toLowerCase()).filter((a) => a && a !== KIRAN)
      : [];

    // Click target: pub's first link, else full publications list.
    let href = 'publications.html';
    if (Array.isArray(p.links) && p.links.length && p.links[0] && p.links[0].href) {
      href = p.links[0].href;
    }

    stars.push({
      nx, ny, baseR,
      x: 0, y: 0, r: baseR,
      phase: seededRand(seed ^ 0xabcd) * Math.PI * 2,   // twinkle phase
      speed: 0.6 + seededRand(seed ^ 0x55aa) * 0.9,      // twinkle speed
      title: p.title || 'Untitled',
      venue: p.venue || '',
      year: yearStr || (p.status || ''),
      href,
      coauthors,
      bright: 0,        // hover highlight 0..1
      edges: [],        // indices of connected stars
      inConstellation: false,
    });
  });

  /* ---------------- Constellation edges from shared co-authors ---------------- */
  // For every pair sharing >=1 author (not Kiran), consider an edge; keep short
  // edges only and cap ~2 per star to avoid a hairball.
  (function buildEdges() {
    const EDGE_CAP = 2;
    // Map author -> star indices, so we only compare stars that actually share one.
    const byAuthor = new Map();
    stars.forEach((s, i) => {
      s.coauthors.forEach((a) => {
        if (!byAuthor.has(a)) byAuthor.set(a, []);
        byAuthor.get(a).push(i);
      });
    });
    // Candidate pairs (dedup via a Set of "min-max").
    const seenPair = new Set();
    const candidates = [];
    byAuthor.forEach((idxs) => {
      if (idxs.length < 2) return;
      // Cap combinatorial blow-up for very prolific co-authors.
      const lim = Math.min(idxs.length, 12);
      for (let a = 0; a < lim; a++) {
        for (let b = a + 1; b < lim; b++) {
          const i = idxs[a], j = idxs[b];
          const key = i < j ? i + ':' + j : j + ':' + i;
          if (seenPair.has(key)) continue;
          seenPair.add(key);
          candidates.push([i, j]);
        }
      }
    });
    // Sort candidates by (normalized) length; add shortest first, honoring caps.
    const LEN_MAX = 0.22; // normalized distance threshold (keeps lines tidy)
    candidates.forEach((c) => {
      const A = stars[c[0]], B = stars[c[1]];
      c.push(Math.hypot(A.nx - B.nx, A.ny - B.ny));
    });
    candidates.sort((p, q) => p[2] - q[2]);
    for (const [i, j, d] of candidates) {
      if (d > LEN_MAX) break;
      if (stars[i].edges.length >= EDGE_CAP || stars[j].edges.length >= EDGE_CAP) continue;
      stars[i].edges.push(j);
      stars[j].edges.push(i);
    }
  })();

  /* ---------------- Optional: constellation of the day ---------------- */
  // Pick a connected-ish clump of 5–7 stars and give it a playful fake name.
  const FAKE_NAMES = [
    'The Forwarded Message', "The Tipline's Bell", 'Corona Encrypta',
    'The Data Donor', 'Ursa Viralis', 'The Polarizer', 'Nova Whatsappia',
    'The Retracted Claim', 'Fornax Fact-Check',
  ];
  let constellationLabel = null; // { text, x, y } in normalized coords
  (function constellationOfTheDay() {
    if (!stars.length) return;
    const day = Math.floor(Date.now() / 86400000);
    // Deterministic seed star for the day.
    let seedIdx = day % stars.length;
    // Prefer a star that actually has edges (a real little constellation).
    for (let k = 0; k < stars.length; k++) {
      const cand = (seedIdx + k) % stars.length;
      if (stars[cand].edges.length) { seedIdx = cand; break; }
    }
    const pickedSet = new Set([seedIdx]);
    const queue = [seedIdx];
    while (queue.length && pickedSet.size < 7) {
      const cur = queue.shift();
      for (const nb of stars[cur].edges) {
        if (pickedSet.size >= 7) break;
        if (!pickedSet.has(nb)) { pickedSet.add(nb); queue.push(nb); }
      }
    }
    // Top up with nearest neighbours if the clump is too small.
    if (pickedSet.size < 5) {
      const origin = stars[seedIdx];
      const near = stars
        .map((s, i) => ({ i, d: Math.hypot(s.nx - origin.nx, s.ny - origin.ny) }))
        .sort((a, b) => a.d - b.d);
      for (const n of near) { if (pickedSet.size >= 6) break; pickedSet.add(n.i); }
    }
    let cx = 0, cy = 0;
    pickedSet.forEach((i) => { stars[i].inConstellation = true; cx += stars[i].nx; cy += stars[i].ny; });
    const n = pickedSet.size || 1;
    constellationLabel = {
      text: FAKE_NAMES[day % FAKE_NAMES.length],
      nx: cx / n,
      ny: cy / n,
    };
  })();

  /* ---------------- Spatial hash grid for O(1)-ish hit-testing ---------------- */
  let grid = new Map();
  let cellSize = 60;
  function cellKey(cx, cy) { return cx + ',' + cy; }
  function rebuildGrid() {
    grid = new Map();
    cellSize = Math.max(40, Math.min(w, h) / 12);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const cx = (s.x / cellSize) | 0;
      const cy = (s.y / cellSize) | 0;
      const k = cellKey(cx, cy);
      let arr = grid.get(k);
      if (!arr) { arr = []; grid.set(k, arr); }
      arr.push(i);
    }
  }
  function hitTest(px, py) {
    const cx = (px / cellSize) | 0;
    const cy = (py / cellSize) | 0;
    let best = -1, bestD = Infinity;
    for (let gx = cx - 1; gx <= cx + 1; gx++) {
      for (let gy = cy - 1; gy <= cy + 1; gy++) {
        const arr = grid.get(cellKey(gx, gy));
        if (!arr) continue;
        for (const i of arr) {
          const s = stars[i];
          const d = Math.hypot(px - s.x, py - s.y);
          const hitR = Math.max(12, s.r + 9);
          if (d < hitR && d < bestD) { bestD = d; best = i; }
        }
      }
    }
    return best;
  }

  /* ---------------- Sizing ---------------- */
  function layout() {
    for (const s of stars) { s.x = s.nx * w; s.y = s.ny * h; }
    rebuildGrid();
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = bg.clientWidth; h = bg.clientHeight;
    if (w === 0 || h === 0) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layout();
  }

  /* ---------------- Pointer / parallax / hover ---------------- */
  let px = -9999, py = -9999;       // pointer within hero (px)
  let parX = 0, parY = 0;           // parallax offset (eased)
  let targParX = 0, targParY = 0;
  let hovered = -1;

  function updateHover() {
    // The field is drawn translated by (parX,parY); test the pointer in that
    // same space so hit-testing stays accurate under parallax.
    const next = (px > -1) ? hitTest(px - parX, py - parY) : -1;
    if (next !== hovered) {
      hovered = next;
      if (hovered >= 0) {
        const s = stars[hovered];
        tip.innerHTML =
          '<span class="t12-tip-title"></span><br><span class="t12-tip-meta"></span>';
        tip.querySelector('.t12-tip-title').textContent = s.title;
        tip.querySelector('.t12-tip-meta').textContent =
          [s.venue, s.year].filter(Boolean).join(' · ');
        tip.setAttribute('data-show', '1');
        canvas.style.cursor = 'pointer';
      } else {
        tip.setAttribute('data-show', '0');
        canvas.style.cursor = '';
      }
    }
    if (hovered >= 0) positionTip();
  }
  function positionTip() {
    const s = stars[hovered];
    const r = bg.getBoundingClientRect();
    let tx = r.left + s.x + parX + 14;
    let ty = r.top + s.y + parY - 10;
    // keep on screen
    const tw = tip.offsetWidth || 200, thh = tip.offsetHeight || 40;
    if (tx + tw > window.innerWidth - 8) tx = window.innerWidth - tw - 8;
    if (ty + thh > window.innerHeight - 8) ty = window.innerHeight - thh - 8;
    if (ty < 8) ty = 8;
    tip.style.left = tx + 'px';
    tip.style.top = ty + 'px';
  }

  function onPointerMove(e) {
    const r = bg.getBoundingClientRect();
    px = e.clientX - r.left;
    py = e.clientY - r.top;
    if (!isMobile) {
      targParX = ((px / Math.max(w, 1)) - 0.5) * -16; // ±8px field shift
      targParY = ((py / Math.max(h, 1)) - 0.5) * -16;
    }
    if (reduced) { updateHover(); } // static mode still supports hover
  }
  function onPointerLeave() {
    px = py = -9999;
    targParX = targParY = 0;
    if (reduced) updateHover();
    else { hovered = -1; tip.setAttribute('data-show', '0'); canvas.style.cursor = ''; }
  }

  function navigate() {
    if (hovered >= 0) { window.location.href = stars[hovered].href; }
  }

  if (isTouch) {
    // Tap = show tooltip; second tap on the same star = navigate.
    canvas.addEventListener('pointerdown', (e) => {
      const r = bg.getBoundingClientRect();
      px = e.clientX - r.left; py = e.clientY - r.top;
      const prev = hovered;
      updateHover();
      if (hovered >= 0 && hovered === prev) navigate();
    }, { passive: true });
  } else {
    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });
    canvas.addEventListener('click', navigate);
  }

  /* ---------------- Shooting stars & meteors ---------------- */
  let meteor = null;           // { x, y, vx, vy, life, max }
  let nextMeteorAt = 0;
  function scheduleMeteor(now) { nextMeteorAt = now + 20000 + Math.random() * 20000; } // 20–40s
  function spawnMeteor() {
    const fromLeft = Math.random() < 0.5;
    const startX = fromLeft ? -20 : w + 20;
    const startY = Math.random() * h * 0.6;
    const dir = fromLeft ? 1 : -1;
    const sp = 7 + Math.random() * 5;
    meteor = {
      x: startX, y: startY,
      vx: dir * sp, vy: sp * (0.35 + Math.random() * 0.3),
      life: 0, max: 60 + Math.random() * 30,
    };
  }

  /* ---------------- Drawing ---------------- */
  function drawStarShape(s, radius, alpha) {
    ctx.globalAlpha = alpha;
    if (PAL.hatch) {
      // Engraved chart: filled ink dot + tiny cross-hatch ticks.
      ctx.fillStyle = PAL.star;
      ctx.beginPath();
      ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
      ctx.fill();
      if (radius >= 2) {
        ctx.strokeStyle = PAL.star;
        ctx.lineWidth = 0.6;
        const t = radius + 2.5;
        ctx.beginPath();
        ctx.moveTo(s.x - t, s.y); ctx.lineTo(s.x + t, s.y);
        ctx.moveTo(s.x, s.y - t); ctx.lineTo(s.x, s.y + t);
        ctx.stroke();
      }
    } else {
      // Night sky: soft glow + warm-white core.
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, radius * 3.2);
      g.addColorStop(0, PAL.star);
      g.addColorStop(0.4, PAL.star);
      g.addColorStop(1, 'rgba(255,247,230,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(s.x, s.y, radius * 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function render(now) {
    if (w === 0 || h === 0) { resize(); if (w === 0 || h === 0) return; }

    // Clear to sky/paper.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Ease parallax.
    if (!reduced) {
      parX += (targParX - parX) * 0.06;
      parY += (targParY - parY) * 0.06;
    }
    ctx.save();
    ctx.translate(parX, parY);

    // 1) Constellation lines.
    ctx.lineWidth = 1;
    if (PAL.hatch) ctx.setLineDash([2, 3]); else ctx.setLineDash([]);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      for (const j of s.edges) {
        if (j <= i) continue; // draw each edge once
        const t = stars[j];
        const lit = (i === hovered || j === hovered);
        ctx.strokeStyle = lit ? PAL.glow : PAL.line;
        ctx.globalAlpha = lit ? 0.9 : 1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    ctx.setLineDash([]);

    // 2) Stars.
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      // Twinkle (skipped when reduced -> static).
      let tw = 1;
      if (!reduced) tw = 0.72 + 0.28 * Math.sin(now * 0.001 * s.speed + s.phase);

      // Hover brighten ×3 with quick ease.
      const wantBright = (i === hovered) ? 1 : 0;
      s.bright += (wantBright - s.bright) * (reduced ? 1 : 0.25);

      let radius = s.r * (1 + s.bright * 0.9);
      let alpha = Math.min(1, (0.55 + 0.45 * tw) * (1 + s.bright * 2)); // ~×3 on hover
      if (s.inConstellation && !PAL.hatch) alpha = Math.min(1, alpha + 0.15);
      drawStarShape(s, radius, alpha);

      // Bold ring for constellation-of-the-day members.
      if (s.inConstellation) {
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = PAL.glow;
        ctx.lineWidth = PAL.hatch ? 0.8 : 1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius + 3.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    // 3) Constellation-of-the-day label.
    if (constellationLabel) {
      ctx.globalAlpha = PAL.hatch ? 0.85 : 0.7;
      ctx.fillStyle = PAL.glow;
      ctx.font = "italic 13px 'Fraunces', Georgia, serif";
      ctx.textAlign = 'center';
      ctx.fillText(constellationLabel.text, constellationLabel.nx * w, constellationLabel.ny * h - 16);
      ctx.globalAlpha = 1;
      ctx.textAlign = 'start';
    }

    // 4) Meteor (dark mode only; a bright streak reads oddly on paper).
    if (!reduced && !PAL.hatch) {
      if (!meteor && now >= nextMeteorAt) { spawnMeteor(); }
      if (meteor) {
        meteor.x += meteor.vx; meteor.y += meteor.vy; meteor.life++;
        const tailLen = 90;
        const tx = meteor.x - meteor.vx / Math.hypot(meteor.vx, meteor.vy) * tailLen;
        const ty = meteor.y - meteor.vy / Math.hypot(meteor.vx, meteor.vy) * tailLen;
        const fade = 1 - meteor.life / meteor.max;
        const grad = ctx.createLinearGradient(meteor.x, meteor.y, tx, ty);
        grad.addColorStop(0, PAL.star);
        grad.addColorStop(1, 'rgba(255,247,230,0)');
        ctx.strokeStyle = grad;
        ctx.globalAlpha = Math.max(0, fade);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.globalAlpha = 1;
        if (meteor.life > meteor.max || meteor.x < -60 || meteor.x > w + 60 || meteor.y > h + 60) {
          meteor = null; scheduleMeteor(now);
        }
      }
    }

    ctx.restore();
  }

  /* ---------------- Loop with pause controls ---------------- */
  let raf = null;
  let running = false;
  let heroVisible = true;
  let pageVisible = true;

  function frame(now) {
    if (!running) return;
    if (!isTouch && !reduced) updateHover();
    render(now || performance.now());
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (running || reduced) return;
    if (!heroVisible || !pageVisible) return;
    running = true;
    scheduleMeteor(performance.now());
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }

  // IntersectionObserver: pause when hero scrolls offscreen.
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        heroVisible = e.isIntersecting;
        if (heroVisible) start(); else stop();
      }
    }, { threshold: 0 });
    io.observe(bg);
  }
  document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    if (pageVisible) start(); else stop();
  });

  window.addEventListener('resize', () => {
    resize();
    if (reduced) render(performance.now()); // keep the single static frame correct
  });
  window.addEventListener('modechange', () => {
    setTimeout(() => {
      readColors();
      if (reduced || !running) render(performance.now()); // repaint under new palette
    }, 60);
  });

  /* ---------------- Boot ---------------- */
  readColors();
  resize();
  // If the hero has zero size at first paint (fonts/layout), retry shortly.
  if (w === 0 || h === 0) {
    let tries = 0;
    const iv = setInterval(() => {
      resize();
      if ((w > 0 && h > 0) || ++tries > 20) {
        clearInterval(iv);
        reduced ? render(performance.now()) : start();
      }
    }, 60);
  } else if (reduced) {
    // Reduced motion: render exactly ONE static frame; support hover, no loop.
    render(performance.now());
  } else {
    start();
  }
})();
