/* js/theme-08-dither.js — applies 4x4 Bayer dither to the face image (canvas) */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '8') return;

  const img = document.getElementById('faceImg');
  const frame = document.getElementById('faceFrame');
  if (!img || !frame) return;

  // Insert canvas in front of img; hide img.
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  canvas.className = 'face-canvas';
  canvas.style.cssText = 'width:100%;height:100%;image-rendering:pixelated;display:block;';
  frame.insertBefore(canvas, img);
  img.style.display = 'none';
  img.crossOrigin = 'anonymous';

  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  // 4x4 Bayer matrix
  const BAYER = [
    [ 0,  8,  2, 10],
    [12,  4, 14,  6],
    [ 3, 11,  1,  9],
    [15,  7, 13,  5],
  ];

  function ditherFromImg() {
    if (!img.complete || !img.naturalWidth) return;
    try {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = data.data;
      const dark = document.documentElement.getAttribute('data-mode') === 'dark';
      const onColor = dark ? 232 : 255;
      const offColor = dark ? 0 : 29;
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          const r = d[i], g = d[i+1], b = d[i+2];
          const lum = 0.299*r + 0.587*g + 0.114*b;
          const t = (BAYER[y & 3][x & 3] + 0.5) * (255 / 16);
          const v = lum > t ? onColor : offColor;
          d[i] = d[i+1] = d[i+2] = v;
        }
      }
      ctx.putImageData(data, 0, 0);
    } catch (e) {
      // CORS or load issue — silently keep canvas blank
    }
  }

  // Re-dither whenever the underlying img.src changes (face tracker mutates it)
  const obs = new MutationObserver(() => {
    if (img.complete && img.naturalWidth) ditherFromImg();
    else img.addEventListener('load', ditherFromImg, { once: true });
  });
  obs.observe(img, { attributes: true, attributeFilter: ['src'] });
  if (img.complete && img.naturalWidth) ditherFromImg();
  else img.addEventListener('load', ditherFromImg, { once: true });

  // Re-dither on mode change (palette differs)
  window.addEventListener('modechange', () => {
    setTimeout(ditherFromImg, 280);
  });
})();
