/* js/theme-11-vitrine.js
 * Theme 11 — Vitrine (liquid glass). Layout L4.
 *   0. Inject an SVG displacement filter (#t11-glass) so `backdrop-filter:url(#t11-glass)`
 *      bends the backdrop like real glass (Chromium honours it; others get the blur).
 *   1. Cursor light: a fixed spotlight div follows the pointer (--mx/--my px), and
 *      --lx/--ly (viewport %) drive per-pane sheen — so every glass surface catches light.
 *   2. WebGL caustics shader painted into .hero-bg (try/catch → CSS gradient fallback).
 *   3. ~26 seeded 4-point-star sparkles scattered across the hero.
 * Subpage-safe: hero-only features guard on .hero-bg; glass + spotlight run everywhere.
 * Reduced-motion / mobile / no-WebGL all degrade gracefully.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '11') return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const small = window.matchMedia('(max-width: 760px)').matches;

  root.classList.add('t11-js');

  /* ------------------------------------------------------------------ *
   * 0. SVG glass-refraction filter. Static noise → feDisplacementMap    *
   *    distorts the backdrop behind any pane that uses url(#t11-glass). *
   *    Cheap + static, so it's injected in every mode. Skip on mobile   *
   *    (perf) where the CSS also drops the url() layer.                 *
   * ------------------------------------------------------------------ */
  if (!small) {
    (function injectGlassFilter() {
      if (document.getElementById('t11-glass-svg')) return;
      const NS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(NS, 'svg');
      svg.id = 't11-glass-svg';
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('width', '0');
      svg.setAttribute('height', '0');
      svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';
      svg.innerHTML =
        '<defs>' +
        '<filter id="t11-glass" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.010 0.014" numOctaves="2" seed="14" result="noise"/>' +
        '<feGaussianBlur in="noise" stdDeviation="1.4" result="soft"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="soft" scale="36" xChannelSelector="R" yChannelSelector="G"/>' +
        '</filter>' +
        '</defs>';
      document.body.appendChild(svg);
    })();
  }

  /* ------------------------------------------------------------------ *
   * 1. Cursor light — a fixed spotlight that follows the pointer, plus  *
   *    --lx/--ly (viewport %) for per-pane sheen. rAF-throttled.        *
   * ------------------------------------------------------------------ */
  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    const spot = document.createElement('div');
    spot.className = 't11-spotlight';
    spot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(spot);

    let mx = window.innerWidth * 0.5, my = window.innerHeight * 0.35, queued = false;
    const flush = () => {
      queued = false;
      root.style.setProperty('--mx', mx.toFixed(1) + 'px');
      root.style.setProperty('--my', my.toFixed(1) + 'px');
      root.style.setProperty('--lx', ((mx / window.innerWidth) * 100).toFixed(2) + '%');
      root.style.setProperty('--ly', ((my / window.innerHeight) * 100).toFixed(2) + '%');
    };
    flush();
    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (!queued) { queued = true; requestAnimationFrame(flush); }
    }, { passive: true });
  }

  const bg = document.querySelector('.hero-bg');
  if (!bg) return; // subpages: glass + spotlight only, no hero canvas/sparkles.

  /* ------------------------------------------------------------------ *
   * 3. Sparkles — seeded mulberry32 PRNG scatters 4-point stars.        *
   * ------------------------------------------------------------------ */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  (function sparkles() {
    const layer = document.createElement('div');
    layer.className = 't11-glints';
    layer.setAttribute('aria-hidden', 'true');
    const rand = mulberry32(0x5EED11);
    const N = small ? 14 : 26;
    const star = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c.9 5.4 2.7 7.2 8 8-5.3.8-7.1 2.6-8 8-.9-5.4-2.7-7.2-8-8 5.3-.8 7.1-2.6 8-8z"/></svg>';
    let html = '';
    for (let i = 0; i < N; i++) {
      const x = rand() * 100;
      const y = rand() * 100;
      const size = 6 + rand() * 13;
      const delay = (rand() * 6).toFixed(2);
      const dur = (3 + rand() * 4).toFixed(2);
      const tint = rand() > 0.5 ? 'var(--t11-glint-a)' : 'var(--t11-glint-b)';
      html += '<span class="t11-glint" style="left:' + x.toFixed(2) + '%;top:' + y.toFixed(2) +
        '%;width:' + size.toFixed(1) + 'px;height:' + size.toFixed(1) + 'px;color:' + tint +
        ';animation-delay:' + delay + 's;animation-duration:' + dur + 's;">' + star + '</span>';
    }
    layer.innerHTML = html;
    bg.appendChild(layer);
  })();

  /* ------------------------------------------------------------------ *
   * 2. WebGL caustics — sum of moving noise octaves, tinted, faint.     *
   *    Skipped on mobile & reduced-motion. try/catch → CSS gradient.    *
   * ------------------------------------------------------------------ */
  if (small || reduced) return;

  let gl = null, canvas = null, program = null, raf = 0, running = false;
  let uTime = null, uRes = null, uTint = null;
  let visible = true, onScreen = true;
  const t0 = performance.now();

  function readTint() {
    const cs = getComputedStyle(root);
    const raw = (cs.getPropertyValue('--t11-caustic') || '150,190,255').trim();
    const parts = raw.split(',').map((n) => parseFloat(n) / 255);
    return parts.length === 3 && parts.every((n) => !isNaN(n)) ? parts : [0.59, 0.75, 1.0];
  }

  try {
    canvas = document.createElement('canvas');
    canvas.className = 't11-caustics';
    canvas.setAttribute('aria-hidden', 'true');
    gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false })
      || canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) throw new Error('no webgl');

    const vsSrc = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
    const fsSrc = [
      'precision highp float;',
      'uniform float uTime;',
      'uniform vec2 uRes;',
      'uniform vec3 uTint;',
      'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }',
      'float noise(vec2 p){',
      '  vec2 i = floor(p); vec2 f = fract(p);',
      '  vec2 u = f * f * (3.0 - 2.0 * f);',
      '  return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),',
      '             mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);',
      '}',
      'float caustic(vec2 uv, float t, float sc){',
      '  float a = noise(uv * sc + vec2(t * 0.10, t * 0.13));',
      '  float b = noise(uv * sc * 1.7 - vec2(t * 0.12, t * 0.08));',
      '  float v = abs(a - b) + abs(noise(uv * sc * 2.3 + t * 0.07) - 0.5);',
      '  v = 1.0 - clamp(v * 1.8, 0.0, 1.0);',
      '  return pow(v, 4.0);',
      '}',
      'void main(){',
      '  vec2 uv = gl_FragCoord.xy / uRes.xy;',
      '  uv.x *= uRes.x / uRes.y;',
      '  float t = uTime;',
      '  float c = 0.0;',
      '  c += caustic(uv, t,        4.0)  * 0.60;',
      '  c += caustic(uv, t * 1.3,  7.0)  * 0.30;',
      '  c += caustic(uv, t * 0.7, 11.0)  * 0.20;',
      '  c = clamp(c, 0.0, 1.0);',
      '  vec3 col = mix(uTint, vec3(1.0), c * 0.7);',
      '  float alpha = c * 0.22;',
      '  gl_FragColor = vec4(col * alpha, alpha);',
      '}'
    ].join('\n');

    function compile(type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        throw new Error('shader: ' + gl.getShaderInfoLog(sh));
      }
      return sh;
    }
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fsSrc));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error('link: ' + gl.getProgramInfoLog(program));
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    uTime = gl.getUniformLocation(program, 'uTime');
    uRes = gl.getUniformLocation(program, 'uRes');
    uTint = gl.getUniformLocation(program, 'uTint');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    function resize() {
      const w = Math.max(1, Math.round(bg.clientWidth * 0.5));
      const h = Math.max(1, Math.round(bg.clientHeight * 0.5));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    let tint = readTint();
    window.addEventListener('modechange', () => { setTimeout(() => { tint = readTint(); }, 60); });

    function render() {
      raf = 0;
      if (!running) return;
      resize();
      const t = (performance.now() - t0) / 1000;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform3f(uTint, tint[0], tint[1], tint[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    }
    function start() {
      if (running || !visible || !onScreen) return;
      running = true;
      raf = requestAnimationFrame(render);
    }
    function stop() {
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }

    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    bg.appendChild(canvas);
    resize();

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
    window.addEventListener('resize', () => { if (running) resize(); }, { passive: true });

    start();
  } catch (err) {
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    if (gl && program) { try { gl.deleteProgram(program); } catch (_) {} }
  }
})();
