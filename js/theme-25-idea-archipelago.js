/* js/theme-25-idea-archipelago.js
 * Theme 25 — Archipelago.
 *
 * This is one world and one road. Scroll moves a single camera through one
 * master kingdom image; the explorer's feet stay mathematically locked to the
 * same road coordinate throughout the journey.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '25') return;

  const root = document.documentElement;
  const body = document.body;
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  root.classList.add('t25-js', 't25-one-kingdom');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Chapter positions refer to progress along one continuous physical road. */
  const CHAPTERS = [
    { id: 'hero',         short: 'Home',         t: 0.00, anchorX: .486, anchorY: .905, zoom: 1.00, avatarScale: .72 },
    { id: 'about',        short: 'About',        t: 0.17, anchorX: .34, anchorY: .76, zoom: 1.55, avatarScale: .90 },
    { id: 'projects',     short: 'Projects',     t: 0.34, anchorX: .70, anchorY: .74, zoom: 1.85, avatarScale: .94 },
    { id: 'publications', short: 'Publications', t: 0.53, anchorX: .33, anchorY: .70, zoom: 1.88, avatarScale: .91 },
    { id: 'teaching',     short: 'Teaching',     t: 0.69, anchorX: .70, anchorY: .49, zoom: 1.82, avatarScale: .86 },
    { id: 'other',        short: 'Other',        t: 0.77, anchorX: .35, anchorY: .39, zoom: 1.72, avatarScale: .78 }
  ];
  const END = { t: .83, anchorX: .52, anchorY: .30, zoom: 1.58, avatarScale: .66 };

  /* Dense samples follow the exact visible S-road from the gate to citadel. */
  const ROAD = [
    [.486, .905], [.492, .838], [.525, .770],
    [.552, .708], [.565, .650], [.568, .592], [.548, .548],
    [.522, .505], [.505, .458], [.496, .410], [.487, .360],
    [.486, .310], [.505, .267], [.535, .230], [.558, .198],
    [.558, .166], [.545, .137], [.538, .108]
  ];

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = value => {
    const t = clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
  };

  function sampleRoad(progress) {
    const scaled = clamp(progress, 0, 1) * (ROAD.length - 1);
    const index = Math.min(ROAD.length - 2, Math.floor(scaled));
    const mix = scaled - index;
    return {
      x: lerp(ROAD[index][0], ROAD[index + 1][0], mix),
      y: lerp(ROAD[index][1], ROAD[index + 1][1], mix)
    };
  }

  /* One master kingdom. There are deliberately no scene layers or fades. */
  const machine = el('div', 't25-world-machine');
  machine.setAttribute('aria-hidden', 'true');
  const kingdom = document.createElement('img');
  kingdom.className = 't25-kingdom';
  kingdom.src = 'assets/ai/25-world-kingdom-v3-2x.webp';
  kingdom.alt = '';
  kingdom.decoding = 'sync';
  kingdom.loading = 'eager';
  kingdom.draggable = false;
  machine.appendChild(kingdom);

  const atmosphere = el('div', 't25-atmosphere');
  for (let i = 0; i < 42; i += 1) {
    const mote = el('i');
    mote.style.setProperty('--x', ((i * 37) % 101) + '%');
    mote.style.setProperty('--y', ((i * 61) % 97) + '%');
    mote.style.setProperty('--d', (5 + (i % 8) * 1.25) + 's');
    mote.style.setProperty('--s', (1 + (i % 3)) + 'px');
    atmosphere.appendChild(mote);
  }
  machine.appendChild(atmosphere);
  body.insertBefore(machine, body.firstChild);

  const sections = CHAPTERS.map(chapter => chapter.id === 'hero' ? hero : document.getElementById(chapter.id)).filter(Boolean);
  sections.slice(1).forEach(section => {
    const panel = el('div', 't25-chapter-panel');
    Array.from(section.children).forEach(child => panel.appendChild(child));
    section.appendChild(panel);
  });

  const enter = el('button', 't25-enter-world');
  enter.type = 'button';
  enter.innerHTML = '<span>Go to About</span><b aria-hidden="true">↓</b>';
  enter.addEventListener('click', () => {
    document.getElementById('about')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  });
  hero.querySelector('.hero-text')?.appendChild(enter);
  const originalPortrait = hero.querySelector('.hero-portrait');
  if (originalPortrait) originalPortrait.hidden = true;

  /* Explorer shell: generated body plus Kiran's real local gaze photography. */
  const avatar = el('div', 't25-avatar');
  avatar.setAttribute('aria-hidden', 'true');
  const bodyImage = document.createElement('img');
  bodyImage.className = 't25-avatar-body';
  bodyImage.src = 'assets/ai/25-explorer-body-v2.webp';
  bodyImage.alt = '';
  bodyImage.draggable = false;
  const realFace = document.createElement('img');
  realFace.className = 't25-avatar-face';
  realFace.alt = '';
  realFace.draggable = false;
  avatar.append(bodyImage, realFace, el('i', 't25-avatar-glint'), el('i', 't25-foot-glow'));
  body.appendChild(avatar);

  const GAZE_VALUES = [-15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15];
  const gazeMissing = new Set();
  let gazeLastGood = '';
  let gazeX = innerWidth / 2;
  let gazeY = innerHeight / 2;
  let gazeFrame = 0;

  function gazeToken(value) {
    return value < 0 ? 'm' + Math.abs(value) + 'p0' : value + 'p0';
  }
  function gazeNearest(value) {
    return GAZE_VALUES.reduce((best, item) => Math.abs(item - value) < Math.abs(best - value) ? item : best, 0);
  }
  function gazeFolder() {
    return root.getAttribute('data-mode') === 'dark' ? 'faces_with_sunglasses' : 'faces';
  }
  function setGaze(px, py) {
    const src = gazeFolder() + '/gaze_px' + gazeToken(px) + '_py' + gazeToken(py) + '_256.webp';
    if (gazeMissing.has(src) || realFace.getAttribute('src') === src) return;
    realFace.src = src;
  }
  function renderGaze() {
    gazeFrame = 0;
    const rect = realFace.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const px = gazeNearest(clamp((gazeX - cx) / Math.max(260, innerWidth * .36) * 18, -15, 15));
    const py = gazeNearest(clamp((cy - gazeY) / Math.max(220, innerHeight * .42) * 18, -15, 15));
    setGaze(px, py);
  }
  realFace.addEventListener('load', () => { gazeLastGood = realFace.src; });
  realFace.addEventListener('error', () => {
    gazeMissing.add(realFace.getAttribute('src') || '');
    if (gazeLastGood) realFace.src = gazeLastGood;
    else setGaze(0, 0);
  });
  setGaze(0, 0);

  if (finePointer && !reduced) {
    window.addEventListener('pointermove', event => {
      gazeX = event.clientX;
      gazeY = event.clientY;
      if (!gazeFrame) gazeFrame = requestAnimationFrame(renderGaze);
    }, { passive: true });
  }
  window.addEventListener('modechange', () => {
    gazeLastGood = '';
    realFace.removeAttribute('src');
    requestAnimationFrame(renderGaze);
  });

  /* Direct section navigation remains fully clickable above the world. */
  const route = el('nav', 't25-route-map');
  route.setAttribute('aria-label', 'Sections');
  const routeButtons = CHAPTERS.map((chapter, index) => {
    const button = el('button');
    button.type = 'button';
    button.setAttribute('aria-label', 'Go to ' + chapter.short);
    button.innerHTML = '<span>' + String(index).padStart(2, '0') + '</span><b>' + chapter.short + '</b>';
    button.addEventListener('click', () => {
      const target = chapter.id === 'hero' ? hero : document.getElementById(chapter.id);
      target?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
    route.appendChild(button);
    return button;
  });
  const routeProgress = el('i', 't25-route-progress');
  route.appendChild(routeProgress);
  body.appendChild(route);

  let sectionTops = [];
  let activeChapter = -1;
  let baseWidth = innerWidth;
  let baseHeight = innerHeight;
  let frame = 0;
  let walkTimer = 0;

  function measureWorld() {
    const naturalWidth = kingdom.naturalWidth || 3344;
    const naturalHeight = kingdom.naturalHeight || 1882;
    const cover = Math.max(innerWidth / naturalWidth, innerHeight / naturalHeight);
    baseWidth = naturalWidth * cover;
    baseHeight = naturalHeight * cover;
    kingdom.style.width = baseWidth + 'px';
    kingdom.style.height = baseHeight + 'px';
  }

  function measure() {
    sectionTops = sections.map(section => section.getBoundingClientRect().top + scrollY);
    measureWorld();
    render();
  }

  function render() {
    frame = 0;
    const viewportH = Math.max(1, innerHeight);
    const probe = scrollY + viewportH * .50;
    let active = 0;
    sectionTops.forEach((top, index) => { if (top <= probe) active = index; });
    active = clamp(active, 0, CHAPTERS.length - 1);

    const start = sectionTops[active] || 0;
    const end = sectionTops[active + 1] || Math.max(document.documentElement.scrollHeight - viewportH * .25, start + viewportH);
    const local = smooth(clamp((probe - start) / Math.max(viewportH, end - start), 0, 1));
    const from = CHAPTERS[active];
    const to = CHAPTERS[active + 1] || END;
    const roadProgress = lerp(from.t, to.t, local);
    const roadPoint = sampleRoad(roadProgress);

    const isMobile = innerWidth <= 720;
    const isTablet = !isMobile && innerWidth <= 1000;
    const anchorX = isMobile ? .67 : lerp(from.anchorX, to.anchorX, local);
    const anchorY = isMobile
      ? lerp(.905, .22, clamp(roadProgress / END.t, 0, 1))
      : lerp(from.anchorY, to.anchorY, local);
    const zoomFactor = isMobile ? .30 : (isTablet ? .68 : 1);
    const desiredZoom = lerp(from.zoom, to.zoom, local);
    const zoom = 1 + (desiredZoom - 1) * zoomFactor;

    /* The road coordinate is projected to the explorer's foot coordinate. */
    const roadScreenX = anchorX * innerWidth;
    const roadScreenY = anchorY * viewportH;
    const translateX = roadScreenX - roadPoint.x * baseWidth * zoom;
    const translateY = roadScreenY - roadPoint.y * baseHeight * zoom;
    kingdom.style.transform = 'translate3d(' + translateX.toFixed(2) + 'px,' + translateY.toFixed(2) + 'px,0) scale(' + zoom.toFixed(4) + ')';

    const avatarWidth = avatar.offsetWidth || 230;
    const avatarHeight = avatarWidth * 1.5;
    avatar.style.setProperty('--t25-avatar-x', (roadScreenX - avatarWidth * .52).toFixed(1) + 'px');
    avatar.style.setProperty('--t25-avatar-y', (roadScreenY - avatarHeight * .955).toFixed(1) + 'px');
    avatar.style.setProperty('--t25-avatar-scale', lerp(from.avatarScale, to.avatarScale, local).toFixed(3));
    avatar.style.setProperty('--t25-stride', reduced ? '0deg' : (Math.sin(scrollY * .058) * 2).toFixed(2) + 'deg');

    if (active !== activeChapter) {
      activeChapter = active;
      root.dataset.t25District = CHAPTERS[active].id;
      routeButtons.forEach((button, index) => {
        if (index === active) button.setAttribute('aria-current', 'location');
        else button.removeAttribute('aria-current');
      });
      document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
        if (link.getAttribute('href') === '#' + CHAPTERS[active].id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }

    const questProgress = clamp(roadProgress / END.t, 0, 1);
    routeProgress.style.setProperty('--t25-progress', questProgress.toFixed(4));
    root.style.setProperty('--t25-road-progress', questProgress.toFixed(4));
    root.classList.toggle('t25-past-hero', scrollY > viewportH * .62);
  }

  window.addEventListener('scroll', () => {
    if (!reduced) {
      avatar.classList.add('is-walking');
      clearTimeout(walkTimer);
      walkTimer = setTimeout(() => avatar.classList.remove('is-walking'), 130);
    }
    if (!frame) frame = requestAnimationFrame(render);
  }, { passive: true });
  window.addEventListener('resize', () => {
    if (!frame) frame = requestAnimationFrame(measure);
  }, { passive: true });
  kingdom.addEventListener('load', () => {
    root.classList.add('t25-world-ready');
    measure();
  }, { once: true });
  window.addEventListener('load', measure, { once: true });

  const modeButton = document.getElementById('modeToggle');
  function updateModeButton() {
    if (!modeButton) return;
    const dark = root.getAttribute('data-mode') === 'dark';
    modeButton.setAttribute('aria-pressed', String(dark));
    modeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    modeButton.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
  }
  updateModeButton();
  window.addEventListener('modechange', updateModeButton);

  measure();
})();
