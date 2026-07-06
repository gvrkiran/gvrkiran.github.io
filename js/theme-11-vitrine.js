/* js/theme-11-vitrine.js
 * Theme 11 — Liquid Glass. Layout L4.
 * v3 — real refraction:
 *   1. For each glass pane, generate a rounded-rect "edge lens" displacement
 *      map on a canvas (R = dx, G = dy, neutral 128 inside) and register a
 *      per-pane SVG filter. `backdrop-filter: blur() saturate() url(#lens-i)`
 *      then bends the backdrop at the pane edges exactly like thick glass.
 *      Chromium honours url() in backdrop-filter; elsewhere the CSS frosted
 *      fallback stays (Safari parses-and-drops the JS-set value → CSS wins).
 *   2. Cursor light: --lx/--ly (viewport %) drive a fixed-attachment sheen.
 *   3. A floating glass dock with section links (homepage only).
 * No canvases, no sparkles — the material is the show.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '11') return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 760px)').matches;
  const root = document.documentElement;

  root.classList.add('t11-js');

  /* ---------------- 1. Cursor light (sheen position) ---------------- */
  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    let mx = innerWidth * 0.5, my = innerHeight * 0.3, queued = false;
    const flush = () => {
      queued = false;
      root.style.setProperty('--lx', mx + 'px');
      root.style.setProperty('--ly', my + 'px');
    };
    flush();
    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (!queued) { queued = true; requestAnimationFrame(flush); }
    }, { passive: true });
  }

  /* ---------------- 2. Glass dock (homepage only) ---------------- */
  const isHome = !!document.querySelector('.hero-section');
  if (isHome) {
    const dock = document.createElement('nav');
    dock.className = 't11-dock';
    dock.setAttribute('aria-label', 'Sections');
    dock.innerHTML = [
      ['#about', 'About'],
      ['#projects', 'Projects'],
      ['#publications', 'Papers'],
      ['#teaching', 'Teaching'],
      ['#other', 'More'],
    ].map(([href, label]) => '<a href="' + href + '">' + label + '</a>').join('');
    document.body.appendChild(dock);
  }

  /* ---------------- 3. Edge-lens refraction filters ---------------- */
  // Chromium-only: url() inside backdrop-filter. Everyone else keeps the CSS
  // frosted look. Skipped on mobile (perf) and when unsupported.
  const lensCapable = !small &&
    typeof CSS !== 'undefined' && CSS.supports &&
    CSS.supports('backdrop-filter', 'url(#x)');

  if (!lensCapable) return;

  const SVGNS = 'http://www.w3.org/2000/svg';
  const XLINK = 'http://www.w3.org/1999/xlink';
  let defsSvg = null;
  const panes = [];   // { el, filterId, feImage, w, h, blur, sat }

  function ensureDefs() {
    if (defsSvg) return defsSvg;
    defsSvg = document.createElementNS(SVGNS, 'svg');
    defsSvg.setAttribute('aria-hidden', 'true');
    defsSvg.setAttribute('width', '0');
    defsSvg.setAttribute('height', '0');
    defsSvg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
    defsSvg.appendChild(document.createElementNS(SVGNS, 'defs'));
    document.body.appendChild(defsSvg);
    return defsSvg;
  }

  /* Rounded-rect signed distance (negative inside). */
  function sdRoundRect(px, py, w, h, r) {
    const qx = Math.abs(px - w / 2) - (w / 2 - r);
    const qy = Math.abs(py - h / 2) - (h / 2 - r);
    const ax = Math.max(qx, 0), ay = Math.max(qy, 0);
    return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r;
  }

  /* Build (or rebuild) the displacement map for one pane. */
  function buildMap(p) {
    const el = p.el;
    const w = el.offsetWidth, h = el.offsetHeight;
    if (!w || !h) return false;
    p.w = w; p.h = h;

    const radius = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 24, w / 2, h / 2);
    // Edge band: how far the lens bends inward from the border.
    const band = Math.max(10, Math.min(34, Math.min(w, h) * 0.22));

    const scale = Math.min(1, 240 / Math.max(w, h));
    const mw = Math.max(2, Math.round(w * scale));
    const mh = Math.max(2, Math.round(h * scale));

    const cv = p.canvas || (p.canvas = document.createElement('canvas'));
    cv.width = mw; cv.height = mh;
    const ctx = cv.getContext('2d');
    const img = ctx.createImageData(mw, mh);
    const d = img.data;

    for (let y = 0; y < mh; y++) {
      for (let x = 0; x < mw; x++) {
        const ex = (x + 0.5) / scale, ey = (y + 0.5) / scale;   // element px
        const sd = sdRoundRect(ex, ey, w, h, radius);
        let dx = 0, dy = 0;
        if (sd > -band && sd < 2) {
          // Inside the edge band: displacement along the outward normal,
          // strongest at the border, easing to zero at the band's inner edge.
          const t = 1 - Math.min(Math.max(-sd / band, 0), 1);   // 0 inner → 1 edge
          const s = Math.pow(t, 1.7);
          // Numerical gradient of the SDF = outward normal.
          const e = 1.5;
          const gx = sdRoundRect(ex + e, ey, w, h, radius) - sdRoundRect(ex - e, ey, w, h, radius);
          const gy = sdRoundRect(ex, ey + e, w, h, radius) - sdRoundRect(ex, ey - e, w, h, radius);
          const gl = Math.hypot(gx, gy) || 1;
          dx = (gx / gl) * s;
          dy = (gy / gl) * s;
        }
        const i = (y * mw + x) * 4;
        d[i] = 128 + dx * 127;
        d[i + 1] = 128 + dy * 127;
        d[i + 2] = 128;
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);

    p.feImage.setAttribute('width', w);
    p.feImage.setAttribute('height', h);
    p.feImage.setAttributeNS(XLINK, 'href', cv.toDataURL());
    p.feImage.setAttribute('href', cv.toDataURL());
    return true;
  }

  function registerPane(el, i, opts) {
    const filterId = 't11L-' + i;
    const filter = document.createElementNS(SVGNS, 'filter');
    filter.setAttribute('id', filterId);
    filter.setAttribute('x', '-5%');
    filter.setAttribute('y', '-5%');
    filter.setAttribute('width', '110%');
    filter.setAttribute('height', '110%');
    filter.setAttribute('filterUnits', 'objectBoundingBox');
    filter.setAttribute('primitiveUnits', 'userSpaceOnUse');
    filter.setAttribute('color-interpolation-filters', 'sRGB');

    const feImage = document.createElementNS(SVGNS, 'feImage');
    feImage.setAttribute('x', '0');
    feImage.setAttribute('y', '0');
    feImage.setAttribute('preserveAspectRatio', 'none');
    feImage.setAttribute('result', 'map');

    const feDisp = document.createElementNS(SVGNS, 'feDisplacementMap');
    feDisp.setAttribute('in', 'SourceGraphic');
    feDisp.setAttribute('in2', 'map');
    feDisp.setAttribute('scale', String(opts.scale));
    feDisp.setAttribute('xChannelSelector', 'R');
    feDisp.setAttribute('yChannelSelector', 'G');

    filter.appendChild(feImage);
    filter.appendChild(feDisp);
    ensureDefs().firstChild.appendChild(filter);

    const p = { el, filterId, feImage, canvas: null, w: 0, h: 0, opts };
    if (buildMap(p)) {
      el.style.backdropFilter = 'blur(' + opts.blur + 'px) saturate(' + opts.sat + '%) url(#' + filterId + ')';
      panes.push(p);
    } else {
      filter.remove();
    }
    return p;
  }

  function collect() {
    try {
      let i = 0;
      // Content panes: readable blur; edges do the glass work.
      document.querySelectorAll('.card, .other-card').forEach((el) => {
        registerPane(el, i++, { blur: 5, sat: 160, scale: 68 });
      });
      const face = document.querySelector('.face-frame');
      if (face) registerPane(face, i++, { blur: 3, sat: 165, scale: 74 });
      const dock = document.querySelector('.t11-dock');
      if (dock) registerPane(dock, i++, { blur: 6, sat: 170, scale: 56 });
    } catch (err) {
      // Any failure: remove our defs; CSS frosted fallback remains everywhere.
      if (defsSvg && defsSvg.parentNode) defsSvg.parentNode.removeChild(defsSvg);
      panes.length = 0;
    }
  }

  // Rebuild maps when pane sizes change (debounced).
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      panes.forEach((p) => {
        if (p.el.offsetWidth !== p.w || p.el.offsetHeight !== p.h) buildMap(p);
      });
    }, 220);
  }, { passive: true });

  if (document.readyState === 'complete') collect();
  else window.addEventListener('load', collect);
})();
