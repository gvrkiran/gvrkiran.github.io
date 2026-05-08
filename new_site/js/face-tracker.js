/* js/face-tracker.js
 * Cursor-driven gaze tracking. Maps cursor position to nearest available
 * gaze bin (3-step grid from -15 to +15 on each axis) and swaps <img> src.
 * On data-mode=dark, uses faces_with_sunglasses/ folder.
 *
 * Filenames use the convention:
 *   gaze_pxN_pyN_256.webp        for non-negative N (e.g. gaze_px3p0_py0p0_256.webp)
 *   gaze_pxmN_pymN_256.webp      for negative N (e.g. gaze_pxm6p0_pym3p0_256.webp)
 */
(function () {
  'use strict';

  const img = document.getElementById('faceImg');
  const frame = document.getElementById('faceFrame');
  if (!img || !frame) return;

  const VALUES = [-15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15];

  function fmt(v) {
    if (v < 0) return `m${Math.abs(v)}p0`;
    return `${v}p0`;
  }
  function fname(px, py) {
    return `gaze_px${fmt(px)}_py${fmt(py)}_256.webp`;
  }
  function nearest(values, v) {
    let best = values[0];
    let bestDist = Math.abs(values[0] - v);
    for (const x of values) {
      const d = Math.abs(x - v);
      if (d < bestDist) { best = x; bestDist = d; }
    }
    return best;
  }

  function folder() {
    return document.documentElement.getAttribute('data-mode') === 'dark'
      ? 'faces' : 'faces_with_sunglasses';
  }

  let lastSrc = '';
  let lastGoodSrc = '';            // most recent src that successfully loaded
  const missing = new Set();       // combos known to 404 (keyed by folder|px|py)

  function comboKey(px, py) {
    return `${folder()}|${px}|${py}`;
  }

  function setSrc(px, py) {
    // Skip combos we already know are missing — keep showing whatever's currently visible.
    if (missing.has(comboKey(px, py))) return;
    const f = `${folder()}/${fname(px, py)}`;
    if (f !== lastSrc) { img.src = f; lastSrc = f; }
  }

  // Track successful loads so we have something to revert to on 404.
  img.addEventListener('load', () => {
    lastGoodSrc = img.src;
  });

  // On a 404: mark the combo missing so we stop requesting it,
  // and revert to the last successfully-loaded face (NOT the default 0,0).
  img.addEventListener('error', () => {
    const m = img.src.match(/px(m?)(\d+)p\d+_py(m?)(\d+)p\d+/);
    if (m) {
      const px = (m[1] === 'm' ? -1 : 1) * parseInt(m[2], 10);
      const py = (m[3] === 'm' ? -1 : 1) * parseInt(m[4], 10);
      missing.add(comboKey(px, py));
    }
    if (lastGoodSrc && img.src !== lastGoodSrc) {
      img.src = lastGoodSrc;
      lastSrc = lastGoodSrc;
    }
  });

  setSrc(0, 0);

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
      const dx = pendingX - cx;
      const dy = pendingY - cy;
      const maxDist = Math.max(window.innerWidth, window.innerHeight) / 2;
      // Map cursor offset to gaze axis. Range clamped at ±15.
      // Negate dy because the gaze convention has py>0 = looking up (cursor BELOW face means py negative).
      const px = Math.max(-15, Math.min(15, (dx / maxDist) * 18));
      const py = Math.max(-15, Math.min(15, (-dy / maxDist) * 18));
      setSrc(nearest(VALUES, Math.round(px / 3) * 3), nearest(VALUES, Math.round(py / 3) * 3));
    });
  }
  window.addEventListener('mousemove', onMove, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!e.touches || !e.touches.length) return;
    onMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
  }, { passive: true });

  window.addEventListener('modechange', () => {
    img.style.opacity = '0';
    setTimeout(() => {
      lastSrc = '';
      lastGoodSrc = '';
      setSrc(0, 0);
      img.style.opacity = '1';
    }, 220);
  });
  img.style.transition = 'opacity 220ms ease';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.removeEventListener('mousemove', onMove);
    setSrc(0, 0);
  }
})();
