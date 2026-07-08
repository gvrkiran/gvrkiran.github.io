/* js/theme-23-perennial.js
 * Theme 23 — Perennial (generative flow-field print). Layout L4.
 * Every reload pulls a one-of-one print: a mulberry32-seeded 3-octave value
 * noise field steers particles that draw single low-alpha segments per step
 * onto a parchment canvas that NEVER clears — convergence zones accumulate to
 * deep ink. The print "sets" after a fixed iteration cap, then the rAF stops.
 *   - serial plate (bottom-left): print №, seed, field, live stroke counter
 *   - space / ↻ button: new seed, new print (registration marks pulse)
 *   - mode toggle: SAME seed re-inked — light = Meridian/Oxide, dark = Cyanotype
 * No Math.random() in drawing logic: everything derives from the seed, so a
 * given serial always reconstructs the same print. Homepage only.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '23') return;

  const root = document.documentElement;
  root.classList.add('t23-js');

  const bg = document.querySelector('.hero-bg');
  if (!bg) return; // subpages: studio dressing is pure CSS.

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 760px)').matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  /* ---------------- fields (canvas palettes) ---------------- */
  const FIELDS = {
    meridian: {
      label: 'meridian',
      paper: '#ece3d0',
      inks: ['#12100b', '#1e1a12', '#2c2618'],
      accent: '#c8452b',
    },
    oxide: {
      label: 'oxide',
      paper: '#e9dfcd',
      inks: ['#241408', '#38200c', '#452c12'],
      accent: '#b4531e',
    },
    cyanotype: {
      label: 'cyanotype',
      paper: '#10263f',
      inks: ['#dce8f2', '#c3d8ea', '#a9c6de'],
      accent: '#dfc389',
    },
  };

  /* ---------------- deterministic machinery ---------------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Seeded 2D value noise, 3 octaves. */
  function makeField(rand) {
    const perm = new Uint8Array(512);
    const base = new Uint8Array(256);
    for (let i = 0; i < 256; i++) base[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = (rand() * (i + 1)) | 0;
      const t = base[i]; base[i] = base[j]; base[j] = t;
    }
    for (let i = 0; i < 512; i++) perm[i] = base[i & 255];

    function lattice(x, y) { return perm[(perm[x & 255] + y) & 255] / 255; }
    function smooth(t) { return t * t * (3 - 2 * t); }
    function n2(x, y) {
      const xi = Math.floor(x), yi = Math.floor(y);
      const fx = x - xi, fy = y - yi;
      const u = smooth(fx), v = smooth(fy);
      const a = lattice(xi, yi), b = lattice(xi + 1, yi);
      const c = lattice(xi, yi + 1), d = lattice(xi + 1, yi + 1);
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    }
    return function fbm(x, y) {
      return (n2(x, y) + 0.5 * n2(x * 2.13 + 31.7, y * 2.13 + 11.3) + 0.25 * n2(x * 4.31 + 77.7, y * 4.31 + 41.1)) / 1.75;
    };
  }

  /* ---------------- canvas + chrome ---------------- */
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  bg.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const marks = document.createElement('div');
  marks.className = 't23-marks';
  marks.setAttribute('aria-hidden', 'true');
  marks.innerHTML = '<span></span><span></span><span></span><span></span>';
  bg.appendChild(marks);

  const plate = document.createElement('div');
  plate.className = 't23-plate';
  plate.innerHTML =
    '<span class="t23-serial">print <b>№KG-0000</b> · seed 000000 · field meridian · edition 1/1</span><br>' +
    '<span class="t23-count">0 strokes</span>' +
    '<button class="t23-regen" type="button" aria-label="Draw a new print">↻ regenerate</button>' +
    '<kbd>space</kbd>';
  bg.appendChild(plate);
  const serialEl = plate.querySelector('.t23-serial');
  const countEl = plate.querySelector('.t23-count');
  const regenBtn = plate.querySelector('.t23-regen');

  /* ---------------- print state ---------------- */
  const COUNT = small ? 420 : 820;          // particles
  const CAP = reduced ? 620 : (small ? 1000 : 1500); // iterations until the print sets
  const SUB = small ? 4 : 5;                // iterations per rAF frame
  const STEP = 2.1;                         // px per segment
  const SCALE = 0.0021;                     // noise frequency

  const px = new Float32Array(COUNT), py = new Float32Array(COUNT);
  const life = new Int16Array(COUNT);
  const inkIdx = new Uint8Array(COUNT);     // 0..2 ink shade, 3 = accent

  let seed = 0, rand = null, fbm = null, field = FIELDS.meridian;
  let iter = 0, strokes = 0, raf = 0, watchdog = 0, lastTick = 0, running = false;
  let W = 0, H = 0;
  let onScreen = true;

  function sizeCanvas() {
    W = bg.clientWidth; H = bg.clientHeight;
    canvas.width = Math.max(2, Math.round(W * DPR));
    canvas.height = Math.max(2, Math.round(H * DPR));
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
  }

  function pickField() {
    if (root.getAttribute('data-mode') === 'dark') return FIELDS.cyanotype;
    // seed-picked between the two light fields (deterministic per print)
    return mulberry32(seed ^ 0xF1E7D)() < 0.55 ? FIELDS.meridian : FIELDS.oxide;
  }

  function spawn(i) {
    px[i] = rand() * W;
    py[i] = rand() * H;
    life[i] = 90 + (rand() * 170) | 0;
    const r = rand();
    inkIdx[i] = r < 0.055 ? 3 : (r * 3) | 0;
  }

  function serialText() {
    const hex = ('000000' + seed.toString(16)).slice(-6).toUpperCase();
    return 'print <b>№KG-' + hex.slice(0, 4) + '</b> · seed ' + hex +
      ' · field ' + field.label + ' · edition 1/1';
  }

  function updateCount(final) {
    countEl.textContent = strokes.toLocaleString('en-US') + ' strokes' + (final ? ' · set' : '');
  }

  /* One iteration: every particle draws one segment. Batched into 4 paths
     (3 ink shades + accent) so alpha still accumulates across iterations. */
  function iterate() {
    for (let bucket = 0; bucket < 4; bucket++) {
      ctx.globalAlpha = bucket === 3 ? 0.085 : 0.05;
      ctx.strokeStyle = bucket === 3 ? field.accent : field.inks[bucket];
      ctx.beginPath();
      for (let i = 0; i < COUNT; i++) {
        if (inkIdx[i] !== bucket) continue;
        const a = fbm(px[i] * SCALE, py[i] * SCALE) * Math.PI * 4;
        const nx = px[i] + Math.cos(a) * STEP;
        const ny = py[i] + Math.sin(a) * STEP;
        ctx.moveTo(px[i], py[i]);
        ctx.lineTo(nx, ny);
        px[i] = nx; py[i] = ny;
        if (--life[i] <= 0 || nx < -8 || nx > W + 8 || ny < -8 || ny > H + 8) spawn(i);
      }
      ctx.stroke();
    }
    strokes += COUNT;
    iter++;
  }

  /* rAF drives the press in visible tabs. In hidden/occluded windows Chrome
     starves rAF entirely, so a watchdog timeout keeps printing, catching up
     proportionally to elapsed wall time (full print ≈ 8s regardless of tick
     rate). Whichever twin fires first cancels the other — single chain. */
  function frame(fromWatchdog) {
    if (fromWatchdog) {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    } else {
      raf = 0;
      if (watchdog) { clearTimeout(watchdog); watchdog = 0; }
    }
    if (!running) return;
    let n = SUB;
    if (fromWatchdog) {
      const elapsed = performance.now() - lastTick;
      n = Math.min(CAP - iter, Math.max(SUB, Math.round(CAP * elapsed / 8000)));
    }
    for (let s = 0; s < n && iter < CAP; s++) iterate();
    if (iter % 12 === 0 || fromWatchdog) updateCount(false);
    if (iter >= CAP) { running = false; updateCount(true); return; }
    schedule();
  }
  function schedule() {
    lastTick = performance.now();
    raf = requestAnimationFrame(() => frame(false));
    if (watchdog) clearTimeout(watchdog);
    watchdog = setTimeout(() => { watchdog = 0; frame(true); }, 360);
  }
  function start() {
    if (running || iter >= CAP || !onScreen) return;
    running = true;
    schedule();
  }
  function stop() {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (watchdog) { clearTimeout(watchdog); watchdog = 0; }
  }

  function newPrint(reuseSeed) {
    stop();
    if (!reuseSeed) seed = (Date.now() ^ (performance.now() * 1000)) >>> 0;
    rand = mulberry32(seed);
    fbm = makeField(rand);
    field = pickField();
    root.setAttribute('data-t23-field', field.label);
    sizeCanvas();
    ctx.globalAlpha = 1;
    ctx.fillStyle = field.paper;
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < COUNT; i++) spawn(i);
    iter = 0; strokes = 0;
    serialEl.innerHTML = serialText();
    updateCount(false);

    // registration marks pulse
    if (!reduced) {
      root.classList.add('t23-pulse');
      setTimeout(() => root.classList.remove('t23-pulse'), 500);
    }

    if (reduced) {
      // Draw the whole print in a few quick bursts — static, no animation.
      const chunk = () => {
        const until = Math.min(iter + 160, CAP);
        while (iter < until) iterate();
        if (iter < CAP) setTimeout(chunk, 0);
        else updateCount(true);
      };
      chunk();
    } else {
      start();
    }
  }

  /* ---------------- events ---------------- */
  regenBtn.addEventListener('click', () => newPrint(false));

  window.addEventListener('keydown', (e) => {
    if (e.key !== ' ' && e.code !== 'Space') return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    // only regenerate while the sheet is in view — otherwise let space scroll
    const r = bg.getBoundingClientRect();
    if (r.bottom < 80 || r.top > innerHeight - 80) return;
    e.preventDefault();
    newPrint(false);
  });

  // Mode toggle re-inks the SAME print (same seed, new field).
  window.addEventListener('modechange', () => {
    setTimeout(() => newPrint(true), 40);
  });

  if (!reduced) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        onScreen = entries[0].isIntersecting;
        if (onScreen) start(); else stop();
      }, { threshold: 0.01 }).observe(bg);
    }
    // Hidden tabs keep printing via the watchdog (work is capped — the print
    // simply sets); on refocus, kick the scheduler in case a queued frame died.
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && running) { stop(); start(); }
    });
  }

  let rt = 0;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      // Re-pull the same print at the new sheet size (deterministic redraw).
      newPrint(true);
    }, 280);
  }, { passive: true });

  /* ---------------- boot ---------------- */
  newPrint(false);
})();
