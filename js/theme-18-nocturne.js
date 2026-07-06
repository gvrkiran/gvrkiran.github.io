/* js/theme-18-nocturne.js
 * Nocturne — after-hours gallery. Warm flashlight beam follows the cursor,
 * dimming the room around a clear beam (homepage + dark mode only).
 * Every exhibit is pre-lit by CSS picture-lights; the beam only adds discovery.
 * Sections get a slow glow-up when they enter view. Escape toggles the lights.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '18') return;

  const html = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const isHomepage = !!document.querySelector('.hero-bg');

  /* ---------------- Section glow-up (works everywhere, incl. subpages) ---------------- */
  const sections = document.querySelectorAll('main .section');
  if (sections.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('t18-lit');
      });
    }, { threshold: 0.2 });
    sections.forEach((s) => io.observe(s));
  } else {
    // No IO support: keep sections at their pre-lit CSS default (still fully legible).
    sections.forEach((s) => s.classList.add('t18-lit'));
  }

  /* ---------------- Flashlight: homepage + dark mode only ---------------- */
  if (!isHomepage || isTouch || reduced) return;

  let layer = null;
  let raf = null;
  let fx = window.innerWidth / 2, fy = window.innerHeight / 2; // current (eased) beam pos
  let tx = fx, ty = fy; // target (pointer) pos
  let visible = true; // page visibility
  let lightsOn = true; // Escape toggle

  function createLayer() {
    if (layer) return;
    layer = document.createElement('div');
    layer.className = 't-fixed-layer t18-dim';
    layer.setAttribute('aria-hidden', 'true');
    layer.setAttribute('data-off', lightsOn ? 'false' : 'true');
    layer.style.setProperty('--fx', fx + 'px');
    layer.style.setProperty('--fy', fy + 'px');
    document.body.appendChild(layer);
    startLoop();
  }

  function destroyLayer() {
    stopLoop();
    if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
    layer = null;
  }

  function onPointerMove(e) {
    tx = e.clientX;
    ty = e.clientY;
  }

  function tick() {
    if (!layer) { raf = null; return; }
    // Heavy physical lerp — the beam trails the pointer.
    fx += (tx - fx) * 0.12;
    fy += (ty - fy) * 0.12;
    layer.style.setProperty('--fx', fx.toFixed(1) + 'px');
    layer.style.setProperty('--fy', fy.toFixed(1) + 'px');
    raf = requestAnimationFrame(tick);
  }

  function startLoop() {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    if (!raf && visible && lightsOn) raf = requestAnimationFrame(tick);
  }
  function stopLoop() {
    window.removeEventListener('pointermove', onPointerMove);
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }
  function pauseLoop() {
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }
  function resumeLoop() {
    if (layer && !raf && visible && lightsOn) raf = requestAnimationFrame(tick);
  }

  function evaluateMode() {
    const dark = html.getAttribute('data-mode') === 'dark';
    if (dark) {
      createLayer();
    } else {
      destroyLayer();
    }
  }

  window.addEventListener('modechange', evaluateMode);
  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    if (visible) resumeLoop(); else pauseLoop();
  });

  // Escape toggles the lights on/off. Do not preventDefault/stopPropagation —
  // the global theme-picker's own Escape handler must still run.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const tag = (e.target && e.target.tagName) || '';
    if (/^(INPUT|TEXTAREA)$/.test(tag)) return;
    lightsOn = !lightsOn;
    if (layer) layer.setAttribute('data-off', lightsOn ? 'false' : 'true');
    if (lightsOn) resumeLoop(); else pauseLoop();
  });

  // Small unobtrusive hint near the footer.
  const footer = document.querySelector('.site-footer');
  if (footer && footer.parentNode) {
    const hint = document.createElement('p');
    hint.className = 't18-hint';
    hint.textContent = '🔦 esc toggles the lights';
    footer.parentNode.insertBefore(hint, footer.nextSibling);
  }

  evaluateMode();
})();
