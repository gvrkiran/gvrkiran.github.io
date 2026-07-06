/* js/theme-15-holofoil.js
 * Holofoil — the hero becomes an oversized holographic trading card that
 * tilts toward the pointer with a rainbow foil sweep + glitter underlayer.
 * Sections read as binder pages; mini-cards get a cheap foil sweep on hover,
 * and "rare" items (status set, or the most recent year in the dataset)
 * get a standing glitter wash + a ★ rarity glyph.
 *
 * Wrap, don't rebuild: .hero-inner is MOVED (not cloned/rewritten) into a
 * card-face wrapper, so all of content.js's rendered nodes stay intact.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '15') return;

  const html = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  // Signal that JS is active — CSS may use this hook, but nothing on this
  // theme is hidden behind it (no-JS already renders a full flat card).
  html.classList.add('t15-js');

  /* ============================ rarity tagging ============================ */
  /* Runs everywhere, including subpages that lack the hero — cheap, safe,
     purely additive (sets an attribute + appends small decoration nodes). */

  function tagRarity(el, isRare, isMiniCard) {
    if (!el) return;
    if (isRare) {
      el.setAttribute('data-rarity', 'rare');
      if (isMiniCard && !reduced) {
        const glitter = document.createElement('span');
        glitter.className = 't15-mini-glitter';
        glitter.setAttribute('aria-hidden', 'true');
        el.appendChild(glitter);
      }
    }
    if (isMiniCard) {
      const sweep = document.createElement('span');
      sweep.className = 't15-mini-sweep';
      sweep.setAttribute('aria-hidden', 'true');
      el.appendChild(sweep);
    }
  }

  // Publications: rare = explicit status (e.g. "Under review") or most-recent year.
  (function tagPublications() {
    const PUBS = Array.isArray(window.PUBLICATIONS) ? window.PUBLICATIONS : [];
    let maxYear = 0;
    PUBS.forEach((p) => {
      const y = parseInt(p && p.year, 10);
      if (!isNaN(y) && y > maxYear) maxYear = y;
    });

    // Homepage mini pub cards (.card.pub-card) — matched to PUBLICATIONS by title.
    const pubCards = document.querySelectorAll('.card.pub-card');
    pubCards.forEach((card) => {
      const h3 = card.querySelector('h3');
      const title = h3 ? h3.textContent.trim() : '';
      const match = PUBS.find((p) => p.title === title);
      const rare = !!match && (!!match.status || parseInt(match.year, 10) === maxYear);
      tagRarity(card, rare, true);
    });

    // publications.html binder list (<li> items, not .card — see spec).
    document.querySelectorAll('.pub-list li').forEach((li) => {
      const h3 = li.querySelector('h3');
      const title = h3 ? h3.textContent.trim() : '';
      const match = PUBS.find((p) => p.title === title);
      const rare = !!match && (!!match.status || parseInt(match.year, 10) === maxYear);
      tagRarity(li, rare, true);
    });
  })();

  // Projects: rare = has real (non-empty) links array — the one project with
  // active deliverables in the data, a genuine signal rather than a guess.
  (function tagProjects() {
    const PROJ = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];
    document.querySelectorAll('.card.project-card').forEach((card) => {
      const h3 = card.querySelector('h3');
      const title = h3 ? h3.textContent.trim() : '';
      const match = PROJ.find((p) => p.title === title);
      const rare = !!match && Array.isArray(match.links) && match.links.length > 0;
      tagRarity(card, rare, true);
    });
  })();

  // Teaching + generic subpage cards (tools/advice/comic): common tier, sweep only.
  document.querySelectorAll('.card.teach-card, .comic-card').forEach((card) => {
    tagRarity(card, false, true);
  });
  // Plain .card on tools.html / advice.html that aren't already tagged above.
  document.querySelectorAll('.card').forEach((card) => {
    if (!card.querySelector('.t15-mini-sweep')) tagRarity(card, false, true);
  });

  /* ============================ the big card =============================== */
  /* Homepage-only. Guard on the hero DOM per the subpage-safety invariant. */

  const heroInner = document.querySelector('.hero-inner');
  const heroSection = document.querySelector('.hero-section');
  if (!heroInner || !heroSection) return; // subpage: rarity tagging above is all we do here

  // Build wrapper chain and MOVE .hero-inner inside it (append-only relocation,
  // not a rebuild — every original child node/id stays exactly as content.js left it).
  const outer = document.createElement('div');
  outer.className = 't15-card-outer';

  const card = document.createElement('div');
  card.className = 't15-card';
  card.style.setProperty('--t15-px', '0.5');
  card.style.setProperty('--t15-py', '0.5');

  const rainbow = document.createElement('div');
  rainbow.className = 't15-foil-rainbow';
  rainbow.setAttribute('aria-hidden', 'true');

  const glitter = document.createElement('div');
  glitter.className = 't15-foil-glitter';
  glitter.setAttribute('aria-hidden', 'true');

  const glare = document.createElement('div');
  glare.className = 't15-foil-glare';
  glare.setAttribute('aria-hidden', 'true');

  const meta = document.createElement('div');
  meta.className = 't15-card-meta';
  meta.innerHTML = '<span class="t15-set-symbol" aria-hidden="true"></span><span>№ 001/020</span>';

  const face = document.createElement('div');
  face.className = 't15-card-face';

  // Relocate the real hero-inner node (with all its live children/ids) into face.
  heroSection.insertBefore(outer, heroInner);
  outer.appendChild(card);
  card.appendChild(rainbow);
  card.appendChild(glitter);
  card.appendChild(glare);
  card.appendChild(meta);
  card.appendChild(face);
  face.appendChild(heroInner); // moves the node, does not clone/rewrite it

  // Stats row — HIGHLIGHTS as card "stats". Appended after hero-inner, inside face.
  // NatGeo Marketing and NSF CAREER (in prep) are filtered out per site owner's request.
  const HIGHLIGHTS = (Array.isArray(window.HIGHLIGHTS) ? window.HIGHLIGHTS : [])
    .filter((h) => !/natgeo|nsf\s*career/i.test((h && h.label) || ''));
  if (HIGHLIGHTS.length) {
    const stats = document.createElement('div');
    stats.className = 't15-card-stats';
    stats.innerHTML = HIGHLIGHTS.slice(0, 4).map((h) => {
      const label = (h && h.label) || '';
      const year = (h && h.year) || '';
      return `<span><b>${year}</b> ${label}</span>`;
    }).join('');
    face.appendChild(stats);
  }

  /* ------------------------------- tilt logic ------------------------------ */

  let px = 0.5, py = 0.5;       // target (0..1)
  let cpx = 0.5, cpy = 0.5;     // current, eased
  let rafId = null;
  let active = false;           // whether the animation loop should be running
  let visible = true;

  function applyTransform(rx, ry) {
    card.style.setProperty('--t15-px', cpx.toFixed(3));
    card.style.setProperty('--t15-py', cpy.toFixed(3));
    card.style.transform = `perspective(900px) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`;
  }

  function loop() {
    cpx += (px - cpx) * 0.14;
    cpy += (py - cpy) * 0.14;
    // Map 0..1 to a ±10° tilt; invert Y so moving up tilts the top back.
    const ry = (cpx - 0.5) * 20;   // rotateY range: -10..10
    const rx = -(cpy - 0.5) * 20;  // rotateX range: -10..10
    applyTransform(rx, ry);
    if (active && visible) {
      rafId = requestAnimationFrame(loop);
    } else {
      rafId = null;
    }
  }

  function startLoop() {
    if (!rafId && visible) { active = true; rafId = requestAnimationFrame(loop); }
  }
  function stopLoop() {
    active = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function setTargetFromEvent(clientX, clientY) {
    const r = card.getBoundingClientRect();
    px = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    py = Math.max(0, Math.min(1, (clientY - r.top) / r.height));
    startLoop();
  }

  function springBack() {
    px = 0.5; py = 0.5;
    startLoop();
    // Let the CSS transition ease the final resting rotation smoothly, then
    // stop the rAF loop once we're settled to avoid an idle animation.
    window.setTimeout(() => {
      if (Math.abs(cpx - 0.5) < 0.01 && Math.abs(cpy - 0.5) < 0.01) stopLoop();
    }, 700);
  }

  /* --------------------------- interaction sources -------------------------- */

  if (reduced) {
    // Final static state only — freeze at a pleasing diagonal, no listeners.
    card.style.setProperty('--t15-px', '0.62');
    card.style.setProperty('--t15-py', '0.38');
    card.style.transform = 'perspective(900px) rotateX(2deg) rotateY(-4deg)';
  } else if (!isTouch) {
    // Desktop: pointer tilt over the card.
    card.addEventListener('pointermove', (e) => setTargetFromEvent(e.clientX, e.clientY));
    card.addEventListener('pointerleave', springBack);
    card.addEventListener('pointercancel', springBack);
  } else {
    // Touch device: try permission-free deviceorientation (Android and older
    // iOS); otherwise fall back to a gentle automatic foil sweep so the card
    // still shimmers without requiring a permission prompt.
    let orientationWorked = false;

    function onOrientation(e) {
      if (e.beta === null || e.gamma === null) return;
      orientationWorked = true;
      // beta: front-back tilt (-180..180), gamma: left-right tilt (-90..90).
      const gamma = Math.max(-30, Math.min(30, e.gamma || 0));
      const beta = Math.max(-30, Math.min(30, (e.beta || 0) - 45)); // 45° = natural hold angle
      px = 0.5 + gamma / 60;
      py = 0.5 + beta / 60;
      startLoop();
    }

    const DOE = window.DeviceOrientationEvent;
    const needsPermission = DOE && typeof DOE.requestPermission === 'function';
    if (DOE && !needsPermission) {
      window.addEventListener('deviceorientation', onOrientation, { passive: true });
    }

    // Automatic gentle 8s sweep — runs unless real orientation data arrives.
    const sweepT0 = performance.now();
    function autoSweep(now) {
      if (orientationWorked) {
        // Real tilt data took over — hand off cleanly to the eased loop()
        // instead of leaving nothing scheduled.
        rafId = null;
        startLoop();
        return;
      }
      const t = ((now - sweepT0) % 8000) / 8000; // 0..1 over 8s
      const angle = t * Math.PI * 2;
      px = 0.5 + Math.cos(angle) * 0.28;
      py = 0.5 + Math.sin(angle) * 0.28;
      applyTransform(-(py - 0.5) * 16, (px - 0.5) * 16);
      if (visible) rafId = requestAnimationFrame(autoSweep);
      else rafId = null;
    }
    active = true;
    rafId = requestAnimationFrame(autoSweep);
  }

  /* --------------------------------- pausing -------------------------------- */
  /* Pause the loop when offscreen or the tab is hidden — mix-blend-mode foil
     layers are not cheap, and there is no point animating an unseen card. */

  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    if (visible) { if (px !== 0.5 || py !== 0.5 || isTouch) startLoop(); }
    else stopLoop();
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visible = entry.isIntersecting && !document.hidden;
        if (visible) {
          if (isTouch && !reduced) startLoop();
        } else {
          stopLoop();
        }
      });
    }, { threshold: 0.05 });
    io.observe(card);
  }
})();
