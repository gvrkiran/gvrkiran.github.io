/* js/theme-09-glitch.js
 * - Builds a marquee strip in the hero
 * - Adds magnetic parallax to the face frame on cursor proximity
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '9') return;

  const heroText = document.querySelector('.hero-text');
  if (heroText) {
    const kws = (window.KEYWORDS || []).slice();
    const repeated = kws.concat(kws).concat(kws).concat(kws);
    const m = document.createElement('div');
    m.className = 'glitch-marquee';
    m.innerHTML = `<div class="glitch-marquee-track">${repeated.map(k => `<span>${k}</span><span class="dot">·</span>`).join('')}</div>`;
    heroText.appendChild(m);
  }

  const frame = document.getElementById('faceFrame');
  if (!frame) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let raf = 0, mx = 0, my = 0;
  window.addEventListener('mousemove', (e) => {
    const r = frame.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top  + r.height / 2);
    const dist = Math.hypot(dx, dy);
    const max = 280;
    if (dist > max) { mx = my = 0; }
    else {
      const k = (1 - dist / max) * 14;
      mx = (dx / Math.max(dist, 1)) * k;
      my = (dy / Math.max(dist, 1)) * k;
    }
    if (!raf) raf = requestAnimationFrame(() => {
      raf = 0;
      frame.style.transform = `translate(${mx.toFixed(1)}px, ${my.toFixed(1)}px)`;
    });
  }, { passive: true });
})();
