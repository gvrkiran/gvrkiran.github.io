/* js/theme-14-ink.js
 * Theme 14 — Ink (sumi-e). Layout L4.
 * A GPU "stable fluids" (Stam) ink-in-water simulation fills the hero; the cursor
 * stirs real swirling ink. On load a scripted brush performs one S-curve stroke.
 * Also: injects the cinnabar seal (inline SVG) after the hero tagline and next to
 * the footer copyright, and brush-reveals section headings on first intersection.
 *
 * Four tiers:
 *   Desktop full  — live WebGL fluid sim (~60fps), pointer stirring, autonomous stroke.
 *   Mobile ≤760px — sim NOT initialized; CSS static ink-wash (theme CSS) is the hero.
 *   Reduced motion — sim NOT initialized; static wash; headings visible immediately.
 *   No-JS         — this file never runs; theme CSS renders the static wash + full page.
 *
 * CRITICAL: every WebGL step is wrapped in try/catch. If getContext returns null,
 * shaders fail to compile/link, or required float extensions are missing, we bail
 * WITHOUT touching the hero (the CSS wash remains) — never throw, never blank it.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '14') return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const root = document.documentElement;

  /* ---------------------------------------------------------------------------
   * 1) SEAL — inline SVG "KG" monogram in a rounded square, with a grainy
   *    feTurbulence opacity mask so it looks hand-stamped. Drawn as SVG paths,
   *    NOT a font. Injected after the hero tagline and beside footer copyright.
   *    Runs on every tier + every page (guarded per node).
   * ------------------------------------------------------------------------- */
  let sealSeq = 0;
  function sealSVG() {
    // Unique mask id per instance so multiple seals don't collide.
    const id = 't14grain' + (sealSeq++);
    // Rounded-square outline + geometric seal-script-ish K and G as stroked paths.
    // viewBox 100x100. Everything currentColor (set to seal red via CSS).
    return (
      '<svg viewBox="0 0 100 100" role="img" aria-label="KG seal" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
          '<filter id="' + id + '" x="-20%" y="-20%" width="140%" height="140%">' +
            '<feTurbulence type="fractalNoise" baseFrequency="0.9 0.9" numOctaves="2" seed="5" result="n"/>' +
            '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.05" result="m"/>' +
            '<feComposite in="SourceGraphic" in2="m" operator="in"/>' +
          '</filter>' +
        '</defs>' +
        '<g filter="url(#' + id + ')" fill="none" stroke="currentColor">' +
          // outer rounded-square seal border, double keyline
          '<rect x="8" y="8" width="84" height="84" rx="13" stroke-width="4"/>' +
          '<rect x="15" y="15" width="70" height="70" rx="9" stroke-width="1.6" opacity="0.85"/>' +
          // K (left) — vertical stem + two diagonals, geometric
          '<path d="M30 28 L30 72" stroke-width="5.5" stroke-linecap="square"/>' +
          '<path d="M30 51 L46 28" stroke-width="5.5" stroke-linecap="square"/>' +
          '<path d="M30 51 L47 72" stroke-width="5.5" stroke-linecap="square"/>' +
          // G (right) — arc opening right with an inward bar
          '<path d="M74 34 A18 22 0 1 0 74 66" stroke-width="5.5" stroke-linecap="square"/>' +
          '<path d="M74 52 L64 52" stroke-width="5.5" stroke-linecap="square"/>' +
          '<path d="M64 52 L64 62" stroke-width="5.5" stroke-linecap="square"/>' +
        '</g>' +
      '</svg>'
    );
  }

  // Hero seal — after the tagline.
  const tagline = document.getElementById('heroTagline');
  if (tagline && tagline.parentNode && !tagline.parentNode.querySelector('.t14-seal-hero')) {
    const s = document.createElement('span');
    s.className = 't14-seal t14-seal-hero';
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = sealSVG();
    // Insert right after the tagline so it visually "signs" the intro.
    tagline.insertAdjacentElement('afterend', s);
  }

  // Footer seal — beside the copyright.
  const copy = document.getElementById('copyright');
  if (copy && copy.parentNode && !copy.parentNode.querySelector('.t14-seal-footer')) {
    // Wrap copyright + seal so they align on one baseline.
    const wrap = document.createElement('span');
    wrap.className = 't14-copy-wrap';
    const seal = document.createElement('span');
    seal.className = 't14-seal t14-seal-footer';
    seal.setAttribute('aria-hidden', 'true');
    seal.innerHTML = sealSVG();
    copy.parentNode.insertBefore(wrap, copy);
    wrap.appendChild(seal);
    wrap.appendChild(copy);
  }

  /* ---------------------------------------------------------------------------
   * 2) BRUSH-REVEAL HEADINGS — mask sweep on first intersection (CSS handles the
   *    transition; JS toggles classes). Under reduced motion, reveal immediately
   *    and CSS drops the mask entirely.
   * ------------------------------------------------------------------------- */
  root.classList.add('t14-js');
  (function brushReveal() {
    const headings = document.querySelectorAll('.section-heading');
    if (!headings.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      headings.forEach(h => { h.classList.add('t14-mask', 't14-revealed'); });
      return;
    }
    headings.forEach(h => h.classList.add('t14-mask'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          // rAF so the initial masked state paints before the transition.
          requestAnimationFrame(() => e.target.classList.add('t14-revealed'));
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
    headings.forEach(h => io.observe(h));
  })();

  /* ---------------------------------------------------------------------------
   * 3) FLUID SIM — desktop only. Bail on mobile / reduced-motion / no hero.
   * ------------------------------------------------------------------------- */
  const bg = document.querySelector('.hero-bg');           // absent on subpages
  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  if (!bg || reduced || isMobile) return;                  // CSS static wash stays

  try {
    initFluid(bg);
  } catch (err) {
    // Any failure: leave the CSS wash untouched. Never throw, never blank.
    try { root.classList.remove('t14-live'); } catch (_) {}
    // eslint-disable-next-line no-console
    if (window.console && console.warn) console.warn('[theme-14 ink] fluid sim unavailable, using static wash:', err && err.message);
    return;
  }

  /* ======================= STABLE FLUIDS (GPU) ============================= */
  function initFluid(container) {
    // ---- WebGL context ------------------------------------------------------
    const canvas = document.createElement('canvas');
    canvas.className = 't14-fluid';
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    canvas.setAttribute('aria-hidden', 'true');

    const params = { alpha: false, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
    let gl = canvas.getContext('webgl2', params);
    const isWebGL2 = !!gl;
    if (!gl) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
    if (!gl) throw new Error('WebGL not available');

    // ---- extensions / texture formats --------------------------------------
    let halfFloat, supportLinearFloat;
    let internalRGBA, internalRG, internalR, formatRGBA, formatRG, formatR, texType;

    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      supportLinearFloat = gl.getExtension('OES_texture_float_linear');
      const halfExt = gl.getExtension('OES_texture_half_float_linear'); // linear filtering for half-float
      texType = gl.HALF_FLOAT;
      internalRGBA = gl.RGBA16F; formatRGBA = gl.RGBA;
      internalRG   = gl.RG16F;   formatRG   = gl.RG;
      internalR    = gl.R16F;    formatR    = gl.RED;
      halfFloat = { supported: true, linear: !!halfExt };
    } else {
      halfFloat = gl.getExtension('OES_texture_half_float');
      supportLinearFloat = gl.getExtension('OES_texture_half_float_linear');
      texType = halfFloat ? halfFloat.HALF_FLOAT_OES : gl.UNSIGNED_BYTE;
      internalRGBA = gl.RGBA; formatRGBA = gl.RGBA;
      internalRG   = gl.RGBA; formatRG   = gl.RGBA;   // WebGL1: no RG — pack into RGBA
      internalR    = gl.RGBA; formatR    = gl.RGBA;
    }

    // Verify we can actually create + render to the chosen float format.
    // If not, downgrade to UNSIGNED_BYTE (still fine for dye/velocity at small res).
    if (!supportsRenderTexture(gl, internalRGBA, formatRGBA, texType)) {
      texType = gl.UNSIGNED_BYTE;
      internalRGBA = gl.RGBA; formatRGBA = gl.RGBA;
      internalRG   = gl.RGBA; formatRG   = gl.RGBA;
      internalR    = gl.RGBA; formatR    = gl.RGBA;
      if (!supportsRenderTexture(gl, internalRGBA, formatRGBA, texType)) {
        throw new Error('no renderable texture format');
      }
    }

    const filtering = (texType === gl.UNSIGNED_BYTE || supportLinearFloat) ? gl.LINEAR : gl.NEAREST;

    // ---- shaders ------------------------------------------------------------
    const baseVert = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }`;

    const clearFrag = `
      precision mediump float; varying vec2 vUv; uniform sampler2D uTexture; uniform float value;
      void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`;

    const splatFrag = `
      precision highp float; varying vec2 vUv; uniform sampler2D uTarget;
      uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
      void main () {
        vec2 p = vUv - point.xy; p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }`;

    const advectionFrag = `
      precision highp float; varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource;
      uniform vec2 texelSize; uniform float dt; uniform float dissipation;
      void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
      }`;

    const divergenceFrag = `
      precision mediump float;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }`;

    const curlFrag = `
      precision mediump float;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }`;

    const vorticityFrag = `
      precision highp float;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel += force * dt;
        vel = clamp(vel, -1000.0, 1000.0);
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }`;

    const pressureFrag = `
      precision mediump float;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }`;

    const gradientFrag = `
      precision mediump float;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }`;

    // Display: map dye density through a paper->ink ramp read from CSS vars.
    const displayFrag = `
      precision highp float; varying vec2 vUv; uniform sampler2D uTexture;
      uniform vec3 paper; uniform vec3 ink;
      void main () {
        vec3 d = texture2D(uTexture, vUv).rgb;
        float amt = clamp((d.r + d.g + d.b) / 3.0, 0.0, 1.0);
        // gentle gamma so thin ink stays translucent, dense ink saturates
        amt = pow(amt, 0.72);
        vec3 col = mix(paper, ink, amt);
        gl_FragColor = vec4(col, 1.0);
      }`;

    function compile(type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(sh);
        gl.deleteShader(sh);
        throw new Error('shader compile failed: ' + log);
      }
      return sh;
    }
    function program(vsrc, fsrc) {
      const p = gl.createProgram();
      gl.attachShader(p, compile(gl.VERTEX_SHADER, vsrc));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fsrc));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        const log = gl.getProgramInfoLog(p);
        throw new Error('program link failed: ' + log);
      }
      const uniforms = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        const name = gl.getActiveUniform(p, i).name;
        uniforms[name] = gl.getUniformLocation(p, name);
      }
      return { program: p, uniforms: uniforms };
    }

    const progClear      = program(baseVert, clearFrag);
    const progSplat      = program(baseVert, splatFrag);
    const progAdvect     = program(baseVert, advectionFrag);
    const progDiverge    = program(baseVert, divergenceFrag);
    const progCurl       = program(baseVert, curlFrag);
    const progVorticity  = program(baseVert, vorticityFrag);
    const progPressure   = program(baseVert, pressureFrag);
    const progGradient   = program(baseVert, gradientFrag);
    const progDisplay    = program(baseVert, displayFrag);

    // ---- fullscreen quad ----------------------------------------------------
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    function draw(target) {
      if (target == null) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        gl.viewport(0, 0, target.width, target.height);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // ---- framebuffers -------------------------------------------------------
    function createFBO(w, h, internal, format, type, filter) {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return {
        texture: texture, fbo: fbo, width: w, height: h,
        texelX: 1 / w, texelY: 1 / h,
        attach(id) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, texture); return id; }
      };
    }
    function createDoubleFBO(w, h, internal, format, type, filter) {
      let fbo1 = createFBO(w, h, internal, format, type, filter);
      let fbo2 = createFBO(w, h, internal, format, type, filter);
      return {
        width: w, height: h, texelX: 1 / w, texelY: 1 / h,
        get read() { return fbo1; },
        set read(v) { fbo1 = v; },
        get write() { return fbo2; },
        set write(v) { fbo2 = v; },
        swap() { const t = fbo1; fbo1 = fbo2; fbo2 = t; }
      };
    }

    // ---- resolutions --------------------------------------------------------
    // Sim grid fixed (128–256) regardless of canvas; dye ≤512.
    const SIM_RES = 192;   // velocity/pressure grid
    const DYE_RES = 512;   // dye texture cap

    let simW, simH, dyeW, dyeH;
    let velocity, dye, divergence, curl, pressure;
    let aspect = 1;

    function getRes(res) {
      let w = container.clientWidth || 1, h = container.clientHeight || 1;
      aspect = w / h;
      let ar = w / h;
      let min = Math.round(res), max = Math.round(res * ar);
      if (ar < 1) { max = Math.round(res); min = Math.round(res / ar); }
      return ar > 1 ? { w: max, h: min } : { w: min, h: max };
    }

    function initFramebuffers() {
      const s = getRes(SIM_RES);
      const d = getRes(DYE_RES);
      simW = s.w; simH = s.h; dyeW = d.w; dyeH = d.h;

      velocity   = createDoubleFBO(simW, simH, internalRG, formatRG, texType, filtering);
      dye        = createDoubleFBO(dyeW, dyeH, internalRGBA, formatRGBA, texType, filtering);
      divergence = createFBO(simW, simH, internalR, formatR, texType, gl.NEAREST);
      curl       = createFBO(simW, simH, internalR, formatR, texType, gl.NEAREST);
      pressure   = createDoubleFBO(simW, simH, internalR, formatR, texType, gl.NEAREST);
    }

    // ---- canvas sizing (devicePixelRatio-aware) -----------------------------
    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor((container.clientWidth || 1) * dpr));
      const h = Math.max(1, Math.floor((container.clientHeight || 1) * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        return true;
      }
      return false;
    }

    // ---- colors from CSS (flip with light/dark) -----------------------------
    let paperRGB = [0.97, 0.955, 0.925];
    let inkRGB = [0.086, 0.086, 0.102];
    function parseColor(str, fallback) {
      if (!str) return fallback;
      str = str.trim();
      // hex
      let m = str.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
      if (m) {
        let hex = m[1];
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        return [parseInt(hex.slice(0,2),16)/255, parseInt(hex.slice(2,4),16)/255, parseInt(hex.slice(4,6),16)/255];
      }
      m = str.match(/rgba?\(([^)]+)\)/i);
      if (m) {
        const p = m[1].split(',').map(x => parseFloat(x));
        return [p[0]/255, p[1]/255, p[2]/255];
      }
      return fallback;
    }
    function readColors() {
      const cs = getComputedStyle(root);
      paperRGB = parseColor(cs.getPropertyValue('--t14-paper'), paperRGB);
      inkRGB = parseColor(cs.getPropertyValue('--t14-ink'), inkRGB);
    }

    // ---- simulation params --------------------------------------------------
    const DT = 0.016;
    const PRESSURE_ITER = 20;
    const CURL_STRENGTH = 12;      // small vorticity confinement
    const VEL_DISSIPATION = 0.2;   // per-second-ish decay applied as multiplier below
    const DYE_DISSIPATION = 0.98;  // dye advection dissipation ~0.98
    const SPLAT_RADIUS = 0.0022;
    const PRESSURE_DECAY = 0.8;

    function velDissipationFactor() { return 1.0 - VEL_DISSIPATION * DT; } // ≈0.9968

    // ---- render passes ------------------------------------------------------
    function blit(prog) { gl.useProgram(prog.program); }

    function step() {
      gl.disable(gl.BLEND);

      // Curl
      blit(progCurl);
      gl.uniform2f(progCurl.uniforms.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(progCurl.uniforms.uVelocity, velocity.read.attach(0));
      draw(curl);

      // Vorticity confinement
      blit(progVorticity);
      gl.uniform2f(progVorticity.uniforms.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(progVorticity.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(progVorticity.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(progVorticity.uniforms.curl, CURL_STRENGTH);
      gl.uniform1f(progVorticity.uniforms.dt, DT);
      draw(velocity.write); velocity.swap();

      // Divergence
      blit(progDiverge);
      gl.uniform2f(progDiverge.uniforms.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(progDiverge.uniforms.uVelocity, velocity.read.attach(0));
      draw(divergence);

      // Clear pressure (decay)
      blit(progClear);
      gl.uniform1i(progClear.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(progClear.uniforms.value, PRESSURE_DECAY);
      draw(pressure.write); pressure.swap();

      // Jacobi pressure iterations
      blit(progPressure);
      gl.uniform2f(progPressure.uniforms.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(progPressure.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < PRESSURE_ITER; i++) {
        gl.uniform1i(progPressure.uniforms.uPressure, pressure.read.attach(1));
        draw(pressure.write); pressure.swap();
      }

      // Gradient subtract
      blit(progGradient);
      gl.uniform2f(progGradient.uniforms.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(progGradient.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(progGradient.uniforms.uVelocity, velocity.read.attach(1));
      draw(velocity.write); velocity.swap();

      // Advect velocity
      blit(progAdvect);
      gl.uniform2f(progAdvect.uniforms.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(progAdvect.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(progAdvect.uniforms.uSource, velocity.read.attach(0));
      gl.uniform1f(progAdvect.uniforms.dt, DT);
      gl.uniform1f(progAdvect.uniforms.dissipation, velDissipationFactor());
      draw(velocity.write); velocity.swap();

      // Advect dye (dye grid uses its own texel size)
      blit(progAdvect);
      gl.uniform2f(progAdvect.uniforms.texelSize, dye.texelX, dye.texelY);
      gl.uniform1i(progAdvect.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(progAdvect.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(progAdvect.uniforms.dt, DT);
      gl.uniform1f(progAdvect.uniforms.dissipation, DYE_DISSIPATION);
      draw(dye.write); dye.swap();
    }

    function render() {
      blit(progDisplay);
      gl.uniform1i(progDisplay.uniforms.uTexture, dye.read.attach(0));
      gl.uniform3f(progDisplay.uniforms.paper, paperRGB[0], paperRGB[1], paperRGB[2]);
      gl.uniform3f(progDisplay.uniforms.ink, inkRGB[0], inkRGB[1], inkRGB[2]);
      draw(null);
    }

    // ---- splats -------------------------------------------------------------
    function splat(x, y, dx, dy, amount) {
      // x,y in [0,1] with y already flipped to GL space by caller.
      // velocity splat
      blit(progSplat);
      gl.uniform1i(progSplat.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(progSplat.uniforms.aspectRatio, aspect);
      gl.uniform2f(progSplat.uniforms.point, x, y);
      gl.uniform3f(progSplat.uniforms.color, dx, dy, 0.0);
      gl.uniform1f(progSplat.uniforms.radius, SPLAT_RADIUS);
      draw(velocity.write); velocity.swap();

      // dye splat — ink amount (grayscale so paper->ink ramp handles color)
      blit(progSplat);
      gl.uniform1i(progSplat.uniforms.uTarget, dye.read.attach(0));
      gl.uniform1f(progSplat.uniforms.aspectRatio, aspect);
      gl.uniform2f(progSplat.uniforms.point, x, y);
      const a = amount;
      gl.uniform3f(progSplat.uniforms.color, a, a, a);
      gl.uniform1f(progSplat.uniforms.radius, SPLAT_RADIUS * 1.3);
      draw(dye.write); dye.swap();
    }

    // ---- init GL state ------------------------------------------------------
    resizeCanvas();
    initFramebuffers();
    readColors();
    container.appendChild(canvas);
    root.classList.add('t14-live');           // tells CSS the live sim is on
    // Paint one static display frame immediately so there's never a blank flash.
    render();

    // ---- pointer stirring ---------------------------------------------------
    // .hero-bg is pointer-events:none (base.css L4), so listen on window and map
    // coordinates into the hero rect. Works for mouse + touch drag.
    let lastX = null, lastY = null, lastInside = false;
    function toSim(clientX, clientY) {
      const r = container.getBoundingClientRect();
      const nx = (clientX - r.left) / r.width;
      const ny = (clientY - r.top) / r.height;
      return { nx: nx, ny: ny, inside: nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1 };
    }
    function onMove(clientX, clientY) {
      const p = toSim(clientX, clientY);
      if (!p.inside) { lastInside = false; lastX = lastY = null; return; }
      if (lastX == null || !lastInside) { lastX = p.nx; lastY = p.ny; lastInside = true; return; }
      const dx = (p.nx - lastX) * 6.0;    // velocity scale
      const dy = -(p.ny - lastY) * 6.0;   // flip Y for GL
      const glx = p.nx, gly = 1.0 - p.ny;
      const speed = Math.hypot(dx, dy);
      const amount = Math.min(0.35, 0.06 + speed * 0.9);
      pendingSplats.push({ x: glx, y: gly, dx: dx, dy: dy, amount: amount });
      lastX = p.nx; lastY = p.ny; lastInside = true;
    }
    const pendingSplats = [];
    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY), { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('mouseleave', () => { lastInside = false; lastX = lastY = null; });

    // ---- autonomous opening stroke: ONE S-curve over ~2.5s ------------------
    let autoStart = null;
    const AUTO_MS = 2500;
    let autoDone = false;
    let prevAuto = null;
    function autoStroke(now) {
      if (autoDone) return;
      if (autoStart == null) autoStart = now;
      const tt = (now - autoStart) / AUTO_MS;
      if (tt >= 1) { autoDone = true; prevAuto = null; return; }
      // Parametric S-curve across the hero (GL coords, y up).
      const x = 0.18 + tt * 0.64;
      const y = 0.5 + 0.26 * Math.sin(tt * Math.PI * 2.0);
      if (prevAuto) {
        const dx = (x - prevAuto.x) * 620.0 * DT;   // scale to visible velocity
        const dy = (y - prevAuto.y) * 620.0 * DT;
        pendingSplats.push({ x: x, y: y, dx: dx, dy: dy, amount: 0.22 });
      }
      prevAuto = { x: x, y: y };
    }

    // ---- pause when offscreen / tab hidden ----------------------------------
    let running = true;
    let heroVisible = true;
    let pageVisible = !document.hidden;
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        heroVisible = entries[0].isIntersecting;
        pump();
      }, { threshold: 0 });
      io.observe(container.closest('.hero-section') || container);
    }
    document.addEventListener('visibilitychange', () => { pageVisible = !document.hidden; pump(); });

    // ---- resize (debounced) -------------------------------------------------
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (resizeCanvas()) initFramebuffers();
      }, 180);
    });

    // ---- mode flip: re-read colors ------------------------------------------
    window.addEventListener('modechange', () => setTimeout(readColors, 40));

    // ---- main loop ----------------------------------------------------------
    // NaN-blowup protection is structural, not probe-based: the vorticity shader
    // clamps velocity to +/-1000, dissipation multipliers are <1 (fields decay,
    // never diverge), textures are CLAMP_TO_EDGE, and every splat is finite-checked
    // below. After minutes of aggressive scribbling the fields stay bounded.
    let rafId = null;

    function pump() {
      const shouldRun = heroVisible && pageVisible;
      if (shouldRun && rafId == null) { rafId = requestAnimationFrame(loop); }
      else if (!shouldRun && rafId != null) { cancelAnimationFrame(rafId); rafId = null; }
    }

    function loop(now) {
      rafId = requestAnimationFrame(loop);

      // Autonomous opening stroke (fires once over ~2.5s).
      autoStroke(now);

      // Apply queued splats (pointer + auto), capped to avoid spikes.
      if (pendingSplats.length) {
        const n = Math.min(pendingSplats.length, 12);
        for (let i = 0; i < n; i++) {
          const s = pendingSplats[i];
          if (isFinite(s.x) && isFinite(s.y) && isFinite(s.dx) && isFinite(s.dy)) {
            splat(s.x, s.y, s.dx, s.dy, s.amount);
          }
        }
        pendingSplats.length = 0;
      }

      step();
      render();
    }

    // Seed a faint initial dab so the opening stroke has something to bloom from.
    splat(0.2, 0.5, 0, 0, 0.12);

    pump();  // start (heroVisible & pageVisible default true)
  }

  // Utility: test whether a texture format is renderable (framebuffer complete).
  function supportsRenderTexture(gl, internalFormat, format, type) {
    try {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fbo);
      gl.deleteTexture(tex);
      return status === gl.FRAMEBUFFER_COMPLETE;
    } catch (_) {
      return false;
    }
  }
})();
