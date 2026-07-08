/* js/theme-22-foundry.js
 * Theme 22 — Foundry (type-specimen particle glyph). Layout L4.
 * The hero letter is cast from thousands of ink grains sampled from the
 * glyph's own outline (Fraunces 900):
 *   - the cursor carves the letter hollow (local repulsion),
 *   - a click / tap anywhere in the hero recasts it,
 *   - it cycles through the letters of the name on a slow timer.
 * Homepage only (guards on .hero-bg). Reduced motion: one static frame.
 * Colors come from CSS custom props (--t22-ink rgb triplet, --t22-accent) and
 * are re-read on the modechange event, so the night proof inverts live.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '22') return;

  const root = document.documentElement;
  root.classList.add('t22-js');

  const bg = document.querySelector('.hero-bg');
  if (!bg) return; // subpages: specimen styling is pure CSS.

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 760px)').matches;

  // Unique letters of the name, in order of first appearance.
  const LETTERS = (function () {
    const seen = [];
    for (const ch of 'KIRANGARIMELLA') if (seen.indexOf(ch) === -1) seen.push(ch);
    return seen; // K I R A N G M E L
  })();
  let letterIdx = 0;

  const N = small ? 3600 : 9000;      // grains
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  bg.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const caption = document.createElement('div');
  caption.className = 't22-caption';
  caption.setAttribute('aria-hidden', 'true');
  caption.innerHTML = 'now casting <b>K</b>' + (reduced ? '' : ' — click to recast');
  bg.appendChild(caption);
  const capLetter = caption.querySelector('b');

  // Typed state
  const x = new Float32Array(N), y = new Float32Array(N);
  const vx = new Float32Array(N), vy = new Float32Array(N);
  const hx = new Float32Array(N), hy = new Float32Array(N);
  const sz = new Float32Array(N);
  const accent = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    sz[i] = 1.3 + Math.random() * 1.3;
    accent[i] = Math.random() < 0.02 ? 1 : 0;
  }

  let W = 0, H = 0;
  let inkColor = 'rgb(23,19,16)', accColor = '#d8360f';

  function readColors() {
    const cs = getComputedStyle(root);
    const ink = (cs.getPropertyValue('--t22-ink') || '23,19,16').trim();
    inkColor = 'rgb(' + ink + ')';
    accColor = (cs.getPropertyValue('--t22-accent') || '#d8360f').trim();
  }
  readColors();

  function sizeCanvas() {
    W = bg.clientWidth; H = bg.clientHeight;
    canvas.width = Math.max(2, Math.round(W * DPR));
    canvas.height = Math.max(2, Math.round(H * DPR));
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  /* Sample the current letter's ink pixels → N home positions. */
  function sample(letter) {
    const off = document.createElement('canvas');
    off.width = Math.max(2, W); off.height = Math.max(2, H);
    const octx = off.getContext('2d', { willReadFrequently: true });
    const fontPx = Math.round(H * 0.78);
    octx.font = '900 ' + fontPx + 'px Fraunces, serif';
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    const cx = small ? W * 0.5 : W * 0.66;
    const cy = H * 0.52;
    octx.fillStyle = '#000';
    octx.fillText(letter, cx, cy);

    const data = octx.getImageData(0, 0, off.width, off.height).data;
    const pts = [];
    const step = 3;
    for (let py = 0; py < H; py += step) {
      for (let px = 0; px < W; px += step) {
        if (data[(py * off.width + px) * 4 + 3] > 128) pts.push(px, py);
      }
    }
    const count = pts.length / 2;
    if (!count) return false;
    for (let i = 0; i < N; i++) {
      const j = (Math.random() * count) | 0;
      hx[i] = pts[j * 2] + (Math.random() - 0.5) * 2.4;
      hy[i] = pts[j * 2 + 1] + (Math.random() - 0.5) * 2.4;
    }
    return true;
  }

  function scatter() {
    for (let i = 0; i < N; i++) {
      x[i] = Math.random() * W;
      y[i] = Math.random() * H;
      vx[i] = 0; vy[i] = 0;
    }
  }

  function snapHome() {
    for (let i = 0; i < N; i++) { x[i] = hx[i]; y[i] = hy[i]; vx[i] = 0; vy[i] = 0; }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = inkColor;
    for (let i = 0; i < N; i++) {
      if (!accent[i]) ctx.fillRect(x[i], y[i], sz[i], sz[i]);
    }
    ctx.fillStyle = accColor;
    for (let i = 0; i < N; i++) {
      if (accent[i]) ctx.fillRect(x[i], y[i], sz[i], sz[i]);
    }
  }

  /* Pointer carving */
  let mx = -9999, my = -9999;
  const R = small ? 64 : 92;

  function physics() {
    const k = 0.02, damp = 0.87, R2 = R * R;
    for (let i = 0; i < N; i++) {
      let ax = (hx[i] - x[i]) * k;
      let ay = (hy[i] - y[i]) * k;
      const dx = x[i] - mx, dy = y[i] - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < R2 && d2 > 0.01) {
        const d = Math.sqrt(d2);
        const f = (1 - d / R);
        const push = f * f * 7;
        ax += (dx / d) * push;
        ay += (dy / d) * push;
      }
      vx[i] = (vx[i] + ax) * damp;
      vy[i] = (vy[i] + ay) * damp;
      x[i] += vx[i];
      y[i] += vy[i];
    }
  }

  let raf = 0, running = false, onScreen = true, visible = true;
  function frame() {
    raf = 0;
    if (!running) return;
    physics();
    draw();
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (running || !onScreen || !visible || reduced) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
  }

  function recast(advance) {
    if (advance) letterIdx = (letterIdx + 1) % LETTERS.length;
    const L = LETTERS[letterIdx];
    if (sample(L)) {
      if (capLetter) capLetter.textContent = L;
      if (reduced) { snapHome(); draw(); }
    }
  }

  /* ---------------- boot ---------------- */
  function boot() {
    sizeCanvas();
    readColors();
    if (!sample(LETTERS[letterIdx])) return;
    if (reduced) { snapHome(); draw(); return; }
    scatter();          // grains fly in from loose ink on first cast
    start();
  }

  // Make sure Fraunces 900 is actually available before sampling; race a
  // timeout so a font hiccup never leaves an empty hero.
  const fontsReady = (document.fonts && document.fonts.load)
    ? Promise.race([
        document.fonts.load('900 200px Fraunces').then(() => document.fonts.ready),
        new Promise((res) => setTimeout(res, 1500)),
      ])
    : Promise.resolve();
  fontsReady.then(boot).catch(boot);

  /* ---------------- events ---------------- */
  if (!reduced) {
    window.addEventListener('pointermove', (e) => {
      const r = bg.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    }, { passive: true });
    window.addEventListener('pointerleave', () => { mx = -9999; my = -9999; }, { passive: true });

    // Click / tap anywhere non-interactive inside the hero → recast.
    const INTERACTIVE = 'a, button, input, textarea, select, .nav-bar, .theme-picker-overlay';
    window.addEventListener('click', (e) => {
      if (e.target && e.target.closest && e.target.closest(INTERACTIVE)) return;
      const r = bg.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      recast(true);
    });

    // Slow auto-cycle.
    setInterval(() => { if (running) recast(true); }, 8000);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        onScreen = entries[0].isIntersecting;
        if (onScreen) start(); else stop();
      }, { threshold: 0.01 }).observe(bg);
    }
    document.addEventListener('visibilitychange', () => {
      visible = !document.hidden;
      if (visible) start(); else stop();
    });
  }

  window.addEventListener('modechange', () => {
    setTimeout(() => { readColors(); if (reduced) draw(); }, 60);
  });

  let rt = 0;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      sizeCanvas();
      recast(false);   // resample current letter at the new size
      if (reduced) { snapHome(); draw(); }
    }, 250);
  }, { passive: true });
})();
