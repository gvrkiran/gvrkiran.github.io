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
  let bgColor = '#fafbfd';
  let strokeColor = 'rgba(37,99,235,0.4)';

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    bgColor = cs.getPropertyValue('--color-bg').trim() || '#fafbfd';
    strokeColor = cs.getPropertyValue('--color-particle').trim() || 'rgba(37,99,235,0.4)';
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = bg.clientWidth; h = bg.clientHeight;
    if (w === 0 || h === 0) return;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function noiseAngle(x, y, t) {
    return (
      Math.sin(x * 0.0035 + t * 0.0006) +
      Math.cos(y * 0.0030 - t * 0.0005) +
      Math.sin((x + y) * 0.0020 + t * 0.0004)
    ) * Math.PI;
  }

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * Math.max(w, 1),
      y: Math.random() * Math.max(h, 1),
      vx: 0, vy: 0,
      life: Math.random() * 200,
    });
  }

  bg.addEventListener('mousemove', (e) => {
    const r = bg.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
  });
  bg.addEventListener('mouseleave', () => { mx = my = -9999; });

  function getFaceRect() {
    const f = document.getElementById('faceFrame');
    if (!f) return null;
    const r = f.getBoundingClientRect();
    const br = bg.getBoundingClientRect();
    return {
      cx: r.left - br.left + r.width / 2,
      cy: r.top  - br.top  + r.height / 2,
      r: Math.max(r.width, r.height) / 2 + 28,
    };
  }

  let t0 = performance.now();
  readColors();
  window.addEventListener('modechange', () => setTimeout(readColors, 50));

  function frame() {
    const t = performance.now() - t0;
    if (w === 0 || h === 0) { resize(); }
    if (w === 0 || h === 0) { requestAnimationFrame(frame); return; }

    // Soft trail — fade the background
    ctx.fillStyle = bgColor;
    ctx.globalAlpha = 0.08;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 0.7;

    const face = getFaceRect();
    for (let p of particles) {
      let a = noiseAngle(p.x, p.y, t);
      if (mx > -1) {
        const dx = mx - p.x, dy = my - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 220) {
          const targ = Math.atan2(dy, dx) + Math.PI;
          a = a * 0.4 + targ * 0.6;
        }
      }
      let nvx = Math.cos(a) * 1.2;
      let nvy = Math.sin(a) * 1.2;
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
        p.x = Math.random() * w;
        p.y = Math.random() * h;
        p.vx = p.vy = 0;
        p.life = 200 + Math.random() * 200;
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
