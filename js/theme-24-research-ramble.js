/* js/theme-24-research-ramble.js
 * Theme 24 — Research Ramble.
 *
 * Draws a full-document trail through the existing sections, then places a
 * goofy but useful Kiran field guide on that same trail. Scroll makes him walk;
 * the existing gaze-tracked portrait is mirrored into his head; his speech
 * bubble identifies each stop; and previous/next controls navigate the real
 * content. All additions are t24-prefixed and the original DOM is untouched.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '24') return;

  const root = document.documentElement;
  const body = document.body;
  const hero = document.querySelector('.hero-section, [data-section="hero"]');
  if (!hero) return; // Subpages keep the CSS field-notes treatment.

  root.classList.add('t24-js');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = Array.from(document.querySelectorAll('section.section[data-section]'));
  if (!sections.length) return;

  const COPY = {
    hero: {
      label: 'Trailhead',
      title: 'Hello from tiny Kiran',
      copy: 'I am your extremely qualified field guide. Click me—or use the arrows—to tour the research.'
    },
    about: {
      label: 'Stop 01 · Base camp',
      title: 'About the expedition',
      copy: 'The short version: people, platforms, misinformation, and AI for the public good.'
    },
    projects: {
      label: 'Stop 02 · Field work',
      title: 'Projects in the wild',
      copy: 'Here are the questions currently causing too many browser tabs.'
    },
    publications: {
      label: 'Stop 03 · Paper mountain',
      title: 'Mind the citations',
      copy: 'A few recent papers live here. The full bibliography is one click away.'
    },
    teaching: {
      label: 'Stop 04 · Classroom',
      title: 'No surprise quiz',
      copy: 'Courses, materials, and the part where research gets explained to actual humans.'
    },
    other: {
      label: 'Stop 05 · Side quests',
      title: 'The fun drawer',
      copy: 'Comics, tools, advice, and writing. Academic productivity has many disguises.'
    }
  };

  const stopFor = (section, index) => {
    const key = section.dataset.section || section.id || (index === 0 ? 'hero' : 'stop-' + index);
    const info = COPY[key] || {
      label: 'Stop ' + String(index).padStart(2, '0'),
      title: section.querySelector('.section-heading')?.textContent || 'Field note',
      copy: 'A useful stop on the research ramble.'
    };
    return { section, key, ...info };
  };
  const stops = sections.map(stopFor);

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };

  /* ----------------------------------------------------------------------
     Route canvas. Its y-axis is document space; the fixed character samples
     the exact same curve at the line crossing 72% of the viewport.
     ---------------------------------------------------------------------- */
  const canvas = el('canvas', 't24-route');
  canvas.setAttribute('aria-hidden', 'true');
  body.insertBefore(canvas, body.firstChild);
  const ctx = canvas.getContext('2d');
  let points = [];
  let docW = 0;
  let docH = 0;
  let resizeTimer = 0;

  function css(name, fallback) {
    const value = getComputedStyle(root).getPropertyValue(name).trim();
    return value || fallback;
  }

  function routeX(index) {
    const compact = innerWidth < 760;
    if (index === 0 && !compact) return innerWidth * 0.88;
    const fractions = compact ? [0.76, 0.22] : [0.79, 0.18];
    return innerWidth * fractions[index % 2];
  }

  function measure() {
    docW = Math.max(document.documentElement.clientWidth, innerWidth);
    docH = Math.max(body.scrollHeight, document.documentElement.scrollHeight);
    canvas.width = Math.max(2, Math.round(docW));
    canvas.height = Math.max(2, Math.round(docH));
    canvas.style.height = docH + 'px';
    points = stops.map((stop, index) => {
      const rect = stop.section.getBoundingClientRect();
      const top = rect.top + scrollY;
      const local = index === 0 ? Math.min(rect.height * 0.74, innerHeight * 0.76) : rect.height * 0.5;
      return { x: routeX(index), y: top + local };
    });
    drawRoute();
    update(true);
  }

  function curveX(a, b, t, index) {
    const linear = a.x + (b.x - a.x) * t;
    const bend = Math.sin(Math.PI * t) * docW * (index % 2 ? 0.045 : -0.045);
    return linear + bend;
  }

  function xAtY(y) {
    if (!points.length) return docW * 0.78;
    if (y <= points[0].y) return points[0].x;
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i], b = points[i + 1];
      if (y <= b.y) {
        const t = Math.max(0, Math.min(1, (y - a.y) / Math.max(1, b.y - a.y)));
        return curveX(a, b, t, i);
      }
    }
    return points[points.length - 1].x;
  }

  function pathRoute() {
    if (!points.length) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i], b = points[i + 1];
      const slices = 38;
      for (let s = 1; s <= slices; s++) {
        const t = s / slices;
        ctx.lineTo(curveX(a, b, t, i), a.y + (b.y - a.y) * t);
      }
    }
  }

  function drawCompass(x, y, r, ink, accent) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.16);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.moveTo(0, -r + 4); ctx.lineTo(6, 5); ctx.lineTo(0, 1); ctx.lineTo(-6, 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = ink;
    ctx.font = '700 10px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('N', 0, -r - 7);
    ctx.restore();
  }

  function drawNetwork(x, y, ink, accent) {
    const nodes = [[0, 0], [42, -25], [76, 12], [32, 35], [-22, 28]];
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.52;
    [[0,1],[1,2],[2,3],[3,4],[4,0],[0,3],[1,3]].forEach(pair => {
      ctx.beginPath(); ctx.moveTo(nodes[pair[0]][0], nodes[pair[0]][1]); ctx.lineTo(nodes[pair[1]][0], nodes[pair[1]][1]); ctx.stroke();
    });
    nodes.forEach((n, i) => {
      ctx.beginPath(); ctx.arc(n[0], n[1], i === 0 ? 7 : 4, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? accent : ink; ctx.fill();
    });
    ctx.restore();
  }

  function drawPaperStack(x, y, ink, paper, accent) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(0.08);
    for (let i = 2; i >= 0; i--) {
      ctx.fillStyle = paper;
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2;
      ctx.fillRect(i * 6, i * 7, 66, 46);
      ctx.strokeRect(i * 6, i * 7, 66, 46);
    }
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(12, 16); ctx.lineTo(53, 16); ctx.moveTo(12, 26); ctx.lineTo(44, 26); ctx.stroke();
    ctx.restore();
  }

  function drawRoute() {
    if (!ctx || !points.length) return;
    const ink = css('--t24-ink', '#17213d');
    const paper = css('--t24-paper', '#fffaf0');
    const accent = css('--t24-coral', '#f05244');
    const yellow = css('--t24-yellow', '#f4be3e');
    ctx.clearRect(0, 0, docW, docH);

    ctx.save();
    pathRoute();
    ctx.setLineDash([]);
    ctx.strokeStyle = paper;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.9;
    ctx.stroke();

    pathRoute();
    ctx.setLineDash([8, 15]);
    ctx.lineDashOffset = 4;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.84;
    ctx.stroke();
    ctx.restore();

    points.forEach((p, index) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(index % 2 ? 0.06 : -0.07);
      ctx.fillStyle = paper;
      ctx.strokeStyle = ink;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = index % 2 ? yellow : accent;
      ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#17213d';
      ctx.font = '700 11px Space Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(index).padStart(2, '0'), 0, 1);
      ctx.restore();
    });

    if (points[0]) drawCompass(docW * 0.1, points[0].y - innerHeight * 0.32, 27, ink, accent);
    if (points[1] && points[2]) drawNetwork(docW * 0.76, (points[1].y + points[2].y) / 2, ink, accent);
    if (points[2] && points[3]) drawPaperStack(docW * 0.13, (points[2].y + points[3].y) / 2, ink, paper, accent);
    if (points[4] && points[5]) drawCompass(docW * 0.73, (points[4].y + points[5].y) / 2, 22, ink, yellow);
  }

  /* ----------------------------------------------------------------------
     Guide DOM. The body is pure CSS; only the face is an existing image.
     ---------------------------------------------------------------------- */
  const guide = el('aside', 't24-guide');
  guide.dataset.dir = 'right';
  guide.dataset.bubbleSide = 'right';

  const person = el('button', 't24-person');
  person.type = 'button';
  person.setAttribute('aria-label', 'Continue the guided tour');

  const shadow = el('span', 't24-shadow');
  const pack = el('span', 't24-pack');
  const head = el('span', 't24-head');
  const face = document.createElement('img');
  face.alt = '';
  face.setAttribute('aria-hidden', 'true');
  const faceCrop = el('span', 't24-face-crop');
  faceCrop.appendChild(face);
  head.appendChild(faceCrop);
  const torso = el('span', 't24-torso');
  const armL = el('span', 't24-arm t24-arm-left');
  const armR = el('span', 't24-arm t24-arm-right');
  const legL = el('span', 't24-leg t24-leg-left');
  const legR = el('span', 't24-leg t24-leg-right');
  [shadow, pack, legL, legR, torso, armL, armR, head].forEach(node => person.appendChild(node));

  const bubble = el('div', 't24-bubble');
  bubble.setAttribute('role', 'status');
  bubble.setAttribute('aria-live', 'polite');
  bubble.setAttribute('aria-atomic', 'true');
  const kicker = el('span', 't24-bubble-kicker');
  const copy = el('p', 't24-bubble-copy');
  const actions = el('div', 't24-bubble-actions');
  const prev = el('button', 't24-prev', '← Back');
  prev.type = 'button';
  const next = el('button', 't24-next', 'Next →');
  next.type = 'button';
  actions.append(prev, next);
  bubble.append(kicker, copy, actions);
  guide.append(bubble, person);
  body.appendChild(guide);

  const passport = el('div', 't24-passport');
  passport.setAttribute('aria-hidden', 'true');
  const passSmall = el('small', '', 'Research passport');
  const passStrong = el('strong');
  const track = el('span', 't24-progress-track');
  const fill = el('span', 't24-progress-fill');
  track.appendChild(fill);
  passport.append(passSmall, passStrong, track);
  body.appendChild(passport);

  /* The guide needs its own gaze origin. Mirroring #faceImg made the fixed
     character look relative to the off-screen hero portrait after scrolling. */
  const GAZE_VALUES = [-15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15];
  const missingFaces = new Set();
  let gazeX = 0;
  let gazeY = 0;
  let faceRaf = 0;
  let pendingFaceX = 0;
  let pendingFaceY = 0;
  let lastFaceSrc = '';
  let lastGoodFace = '';

  function gazePart(value) {
    return value < 0 ? 'm' + Math.abs(value) + 'p0' : value + 'p0';
  }

  function gazeFolder() {
    return root.getAttribute('data-mode') === 'dark' ? 'faces' : 'faces_with_sunglasses';
  }

  function nearestGaze(value) {
    return GAZE_VALUES.reduce((best, candidate) =>
      Math.abs(candidate - value) < Math.abs(best - value) ? candidate : best, GAZE_VALUES[0]);
  }

  function guideFaceSrc(px, py) {
    return gazeFolder() + '/gaze_px' + gazePart(px) + '_py' + gazePart(py) + '_256.webp';
  }

  function setGuideFace(px, py) {
    gazeX = nearestGaze(px);
    gazeY = nearestGaze(py);
    const src = guideFaceSrc(gazeX, gazeY);
    if (missingFaces.has(src) || src === lastFaceSrc) return;
    lastFaceSrc = src;
    face.src = src;
  }

  face.addEventListener('load', () => { lastGoodFace = face.getAttribute('src') || face.src; });
  face.addEventListener('error', () => {
    missingFaces.add(lastFaceSrc);
    if (lastGoodFace && lastGoodFace !== lastFaceSrc) {
      lastFaceSrc = lastGoodFace;
      face.src = lastGoodFace;
    } else {
      face.src = 'assets/kiran_img.png';
    }
  });

  function trackGuideFace(clientX, clientY) {
    pendingFaceX = clientX;
    pendingFaceY = clientY;
    if (reduced || faceRaf) return;
    faceRaf = requestAnimationFrame(() => {
      faceRaf = 0;
      const rect = head.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rangeX = Math.max(260, innerWidth * 0.3);
      const rangeY = Math.max(210, innerHeight * 0.32);
      const px = Math.max(-15, Math.min(15, ((pendingFaceX - cx) / rangeX) * 15));
      const py = Math.max(-15, Math.min(15, (-(pendingFaceY - cy) / rangeY) * 15));
      setGuideFace(px, py);
    });
  }

  window.addEventListener('pointermove', event => trackGuideFace(event.clientX, event.clientY), { passive: true });
  setGuideFace(0, 0);

  /* ----------------------------------------------------------------------
     Navigation, narration, and walking state.
     ---------------------------------------------------------------------- */
  let active = -1;
  let lastX = 0;
  let raf = 0;
  let walkTimer = 0;
  let speakingOverride = false;
  let overrideTimer = 0;

  function sectionIndexAt(y) {
    let found = 0;
    for (let i = 0; i < stops.length; i++) {
      const top = stops[i].section.getBoundingClientRect().top + scrollY;
      if (top <= y) found = i;
      else break;
    }
    return found;
  }

  function narrate(index) {
    const stop = stops[index];
    if (!stop) return;
    kicker.textContent = stop.label;
    copy.textContent = stop.copy;
    passStrong.textContent = stop.title;
    fill.style.width = ((index / Math.max(1, stops.length - 1)) * 100).toFixed(1) + '%';
    prev.disabled = index === 0;
    prev.setAttribute('aria-label', index === 0 ? 'Already at the trailhead' : 'Go to ' + stops[index - 1].title);
    const nextIndex = index === stops.length - 1 ? 0 : index + 1;
    next.textContent = index === stops.length - 1 ? 'Home ↟' : 'Next →';
    next.setAttribute('aria-label', 'Go to ' + stops[nextIndex].title);
    person.setAttribute('aria-label', 'Continue to ' + stops[nextIndex].title);

    document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
      const href = link.getAttribute('href');
      const current = (index === 0 && href === '#top') || (stops[index].section.id && href === '#' + stops[index].section.id);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });

    if (!reduced && active >= 0) burst();
  }

  function speakTemporarily(label, message) {
    speakingOverride = true;
    clearTimeout(overrideTimer);
    kicker.textContent = label;
    copy.textContent = message;
    overrideTimer = setTimeout(() => {
      speakingOverride = false;
      narrate(active);
    }, 1900);
  }

  function goTo(index) {
    if (index < 0 || index >= stops.length) return;
    guide.classList.add('t24-running', 't24-walking');
    speakTemporarily('En route · please hold', 'Tiny legs, enormous intellectual journey. On my way to ' + stops[index].title + '.');
    stops[index].section.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  function goNext() { goTo(active === stops.length - 1 ? 0 : active + 1); }
  function goPrev() { if (active > 0) goTo(active - 1); }
  person.addEventListener('click', goNext);
  next.addEventListener('click', goNext);
  prev.addEventListener('click', goPrev);

  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const id = link.getAttribute('href').slice(1);
      const index = stops.findIndex(stop => (id === 'top' && stop.key === 'hero') || stop.section.id === id);
      if (index >= 0) {
        guide.classList.add('t24-running', 't24-walking');
        speakTemporarily('Shortcut spotted', 'Good choice. Taking the scenic route to ' + stops[index].title + '.');
      }
    });
  });

  document.querySelectorAll('.card, .other-card').forEach(card => {
    const title = card.querySelector('h3, .other-feature-title');
    if (!title) return;
    const inspect = () => speakTemporarily('Field specimen', 'Now inspecting: “' + title.textContent.trim() + '”. Excellent clicking material.');
    card.addEventListener('pointerenter', inspect, { passive: true });
    card.addEventListener('focusin', inspect);
  });

  function burst() {
    if (reduced) return;
    const rect = person.getBoundingClientRect();
    const colors = ['var(--t24-yellow)', 'var(--t24-coral)', 'var(--t24-blue)', 'var(--t24-mint)'];
    for (let i = 0; i < 7; i++) {
      const spark = el('i', 't24-spark');
      spark.style.left = (rect.left + rect.width * 0.55) + 'px';
      spark.style.top = (rect.top + rect.height * 0.35) + 'px';
      spark.style.setProperty('--dx', (-55 + Math.random() * 110) + 'px');
      spark.style.setProperty('--dy', (-70 + Math.random() * 50) + 'px');
      spark.style.setProperty('--spark-color', colors[i % colors.length]);
      body.appendChild(spark);
      setTimeout(() => spark.remove(), 700);
    }
  }

  function update(force) {
    raf = 0;
    const guideLine = innerWidth < 640 ? innerHeight - 10 : innerHeight * 0.78;
    const worldY = scrollY + guideLine;
    const width = innerWidth < 640 ? 96 : 136;
    const rawX = reduced ? 12 : xAtY(worldY) - width * 0.5;
    const x = Math.max(8, Math.min(innerWidth - width - 8, rawX));
    const delta = x - lastX;
    if (force || Math.abs(delta) > 0.35) {
      guide.style.setProperty('--t24-guide-x', x.toFixed(1) + 'px');
      if (!reduced && Math.abs(delta) > 0.7) {
        guide.dataset.dir = delta < 0 ? 'left' : 'right';
        guide.classList.add('t24-walking');
        clearTimeout(walkTimer);
        walkTimer = setTimeout(() => guide.classList.remove('t24-walking', 't24-running'), 170);
      }
      lastX = x;
    }
    guide.dataset.bubbleSide = x > innerWidth * 0.58 ? 'left' : 'right';

    const index = sectionIndexAt(scrollY + innerHeight * 0.34);
    if (index !== active) {
      active = index;
      if (!speakingOverride) narrate(active);
    }
  }

  function requestUpdate() {
    if (!raf) raf = requestAnimationFrame(() => update(false));
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 240);
  }, { passive: true });
  const modeButton = document.getElementById('modeToggle');
  function updateModeState() {
    const dark = root.getAttribute('data-mode') === 'dark';
    if (modeButton) {
      modeButton.setAttribute('aria-pressed', String(dark));
      modeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      modeButton.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }
  updateModeState();
  window.addEventListener('modechange', () => {
    updateModeState();
    face.style.opacity = '0.25';
    lastFaceSrc = '';
    lastGoodFace = '';
    setTimeout(() => {
      setGuideFace(gazeX, gazeY);
      face.style.opacity = '1';
      drawRoute();
    }, 120);
  });
  window.addEventListener('load', measure, { once: true });

  const themeName = document.getElementById('themeName');
  if (themeName) themeName.textContent = 'Research Ramble · theme 24/24 · click tiny Kiran for the next stop';

  measure();
  narrate(0);
  setTimeout(() => speakTemporarily('Tiny guide, big itinerary', 'I follow the trail as you scroll. Click me whenever you want the next stop.'), 650);
})();
