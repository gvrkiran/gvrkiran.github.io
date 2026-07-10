/* js/theme-25-idea-archipelago.js
 * Theme 25 — Living Research City.
 *
 * Six generated miniature districts form one scroll-driven world. A persistent
 * explorer crosses the screen between chapters; the helmet contains Kiran's
 * real gaze-tracked photography, never a generated likeness.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '25') return;

  const root = document.documentElement;
  const body = document.body;
  const hero = document.querySelector('.hero-section');
  if (!hero) return; // Subpages use the CSS-only district banner.

  root.classList.add('t25-js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const SCENES = [
    { id: 'hero',         name: 'Arrival Observatory', short: 'Arrival',      src: 'assets/ai/25-world-hub-v2.webp',          side: 'left',  x: .79, y: .58, scale: 1.00 },
    { id: 'about',        name: 'Map Room & Origins',  short: 'About',        src: 'assets/ai/25-world-about-v2.webp',        side: 'right', x: .18, y: .58, scale: .94 },
    { id: 'projects',     name: 'Signal Jungle',       short: 'Projects',     src: 'assets/ai/25-world-projects-v2.webp',     side: 'left',  x: .82, y: .58, scale: .94 },
    { id: 'publications', name: 'Paper Peaks',         short: 'Publications', src: 'assets/ai/25-world-publications-v2.webp', side: 'right', x: .18, y: .58, scale: .91 },
    { id: 'teaching',     name: 'Question Foundry',    short: 'Teaching',     src: 'assets/ai/25-world-teaching-v2.webp',     side: 'left',  x: .82, y: .58, scale: .93 },
    { id: 'other',        name: 'Side-Quest Moon',     short: 'Other',        src: 'assets/ai/25-world-other-v2.webp',        side: 'right', x: .19, y: .58, scale: .96 }
  ];

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = t => {
    t = clamp(t, 0, 1);
    return t * t * (3 - 2 * t);
  };

  /* The fixed camera: every chapter is a separately generated district. */
  const machine = el('div', 't25-world-machine');
  machine.setAttribute('aria-hidden', 'true');
  const sceneNodes = SCENES.map((scene, index) => {
    const layer = el('div', 't25-scene');
    layer.dataset.scene = scene.id;
    layer.dataset.side = scene.side;
    layer.style.setProperty('--t25-scene-index', index);
    const image = document.createElement('img');
    image.src = scene.src;
    image.alt = '';
    image.decoding = index === 0 ? 'sync' : 'async';
    image.loading = index < 2 ? 'eager' : 'lazy';
    image.draggable = false;
    image.addEventListener('load', () => {
      layer.classList.add('is-loaded');
      if (index === 0) root.classList.add('t25-world-ready');
    }, { once: true });
    layer.appendChild(image);
    machine.appendChild(layer);
    return layer;
  });

  const atmosphere = el('div', 't25-atmosphere');
  for (let i = 0; i < 38; i += 1) {
    const mote = el('i');
    mote.style.setProperty('--x', ((i * 37) % 101) + '%');
    mote.style.setProperty('--y', ((i * 61) % 97) + '%');
    mote.style.setProperty('--d', (5 + (i % 8) * 1.3) + 's');
    mote.style.setProperty('--s', (1 + (i % 3)) + 'px');
    atmosphere.appendChild(mote);
  }
  machine.appendChild(atmosphere);
  body.insertBefore(machine, body.firstChild);

  /* Turn the semantic page sections into readable stops in the world. */
  const sections = SCENES.map(scene => scene.id === 'hero' ? hero : document.getElementById(scene.id)).filter(Boolean);
  const kickers = {
    about: 'District 01 · coordinates & questions',
    projects: 'District 02 · experiments in motion',
    publications: 'District 03 · the paper trail',
    teaching: 'District 04 · ideas are social objects',
    other: 'District 05 · curiosity refuses a syllabus'
  };

  sections.slice(1).forEach(section => {
    const panel = el('div', 't25-chapter-panel');
    const kicker = el('p', 't25-chapter-kicker', kickers[section.id] || 'Research district');
    panel.appendChild(kicker);
    Array.from(section.children).forEach(child => panel.appendChild(child));
    section.appendChild(panel);
  });

  const enter = el('button', 't25-enter-world');
  enter.type = 'button';
  enter.innerHTML = '<span>Begin the expedition</span><b aria-hidden="true">↓</b>';
  enter.addEventListener('click', () => {
    document.getElementById('about')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  });
  hero.querySelector('.hero-text')?.appendChild(enter);

  /* Persistent explorer shell + a real, local gaze portrait in its bezel. */
  const originalPortrait = hero.querySelector('.hero-portrait');
  if (originalPortrait) originalPortrait.hidden = true;

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
  avatar.append(bodyImage, realFace, el('i', 't25-avatar-glint'));
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
    const radiusX = Math.max(260, innerWidth * .36);
    const radiusY = Math.max(220, innerHeight * .42);
    const px = gazeNearest(clamp((gazeX - cx) / radiusX * 18, -15, 15));
    const py = gazeNearest(clamp((cy - gazeY) / radiusY * 18, -15, 15));
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

  /* A usable route map: direct chapter navigation never sits below the world. */
  const route = el('nav', 't25-route-map');
  route.setAttribute('aria-label', 'Research city districts');
  const routeButtons = SCENES.map((scene, index) => {
    const button = el('button');
    button.type = 'button';
    button.dataset.target = scene.id;
    button.setAttribute('aria-label', 'Go to ' + scene.name);
    button.innerHTML = '<span>' + String(index).padStart(2, '0') + '</span><b>' + scene.short + '</b>';
    button.addEventListener('click', () => {
      const target = scene.id === 'hero' ? hero : document.getElementById(scene.id);
      target?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
    route.appendChild(button);
    return button;
  });
  const routeProgress = el('i', 't25-route-progress');
  route.appendChild(routeProgress);
  body.appendChild(route);

  const readout = el('div', 't25-scene-readout');
  readout.innerHTML = '<span>Now entering</span><strong></strong><small>Scroll to travel · use the route map to jump</small>';
  const readoutName = readout.querySelector('strong');
  body.appendChild(readout);

  let sectionTops = [];
  let currentScene = -1;
  let raf = 0;

  function measure() {
    sectionTops = sections.map(section => section.getBoundingClientRect().top + scrollY);
    render();
  }

  function render() {
    raf = 0;
    const viewportH = Math.max(1, innerHeight);
    const probe = scrollY + viewportH * .52;
    let active = 0;
    sectionTops.forEach((top, index) => { if (top <= probe) active = index; });
    active = clamp(active, 0, SCENES.length - 1);

    const start = sectionTops[active] || 0;
    const end = sectionTops[active + 1] || Math.max(document.documentElement.scrollHeight, start + viewportH);
    const local = clamp((probe - start) / Math.max(viewportH, end - start), 0, 1);
    const blend = active < SCENES.length - 1 ? smooth((local - .66) / .34) : 0;
    const destination = Math.min(active + 1, SCENES.length - 1);

    sceneNodes.forEach((node, index) => {
      let opacity = 0;
      if (index === active) opacity = 1 - blend;
      if (index === destination && destination !== active) opacity = blend;
      node.style.setProperty('--t25-opacity', opacity.toFixed(4));
      const entrance = index === destination ? blend : local;
      node.style.setProperty('--t25-zoom', (1.065 - entrance * .035).toFixed(4));
      node.style.setProperty('--t25-drift', ((entrance - .5) * -18).toFixed(1) + 'px');
      node.classList.toggle('is-active', opacity > .02);
    });

    const travel = reduced ? 0 : smooth(local);
    const from = SCENES[active];
    const to = SCENES[destination];
    const avatarX = lerp(from.x, to.x, travel);
    const avatarY = lerp(from.y, to.y, travel) + (reduced ? 0 : Math.sin(scrollY * .028) * .008);
    const avatarScale = lerp(from.scale, to.scale, travel);
    const avatarWidth = avatar.offsetWidth || 230;
    const avatarHeight = avatarWidth * 1.5;
    avatar.style.setProperty('--t25-avatar-x', (avatarX * innerWidth - avatarWidth / 2).toFixed(1) + 'px');
    avatar.style.setProperty('--t25-avatar-y', (avatarY * viewportH - avatarHeight / 2).toFixed(1) + 'px');
    avatar.style.setProperty('--t25-avatar-scale', avatarScale.toFixed(3));
    avatar.style.setProperty('--t25-stride', reduced ? '0deg' : (Math.sin(scrollY * .055) * 1.8).toFixed(2) + 'deg');
    avatar.classList.toggle('is-travelling', !reduced && local > .08 && local < .92);

    const shown = blend > .55 ? destination : active;
    if (shown !== currentScene) {
      currentScene = shown;
      root.dataset.t25District = SCENES[shown].id;
      readoutName.textContent = SCENES[shown].name;
      routeButtons.forEach((button, index) => {
        if (index === shown) button.setAttribute('aria-current', 'location');
        else button.removeAttribute('aria-current');
      });
      document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
        const isCurrent = link.getAttribute('href') === '#' + SCENES[shown].id;
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }

    const maxScroll = Math.max(1, document.documentElement.scrollHeight - viewportH);
    routeProgress.style.setProperty('--t25-progress', clamp(scrollY / maxScroll, 0, 1).toFixed(4));
    root.classList.toggle('t25-past-hero', scrollY > viewportH * .62);
  }

  window.addEventListener('scroll', () => {
    if (!raf) raf = requestAnimationFrame(render);
  }, { passive: true });
  window.addEventListener('resize', () => {
    if (!raf) raf = requestAnimationFrame(measure);
  }, { passive: true });
  window.addEventListener('load', measure, { once: true });

  const modeButton = document.getElementById('modeToggle');
  function updateModeButton() {
    if (!modeButton) return;
    const dark = root.getAttribute('data-mode') === 'dark';
    modeButton.setAttribute('aria-pressed', String(dark));
    modeButton.setAttribute('aria-label', dark ? 'Switch the research city to daylight' : 'Switch the research city to night');
    modeButton.title = dark ? 'Daylight mode' : 'Night mode';
  }
  updateModeButton();
  window.addEventListener('modechange', updateModeButton);

  const themeName = document.getElementById('themeName');
  if (themeName) themeName.textContent = 'Living Research City · six generated districts · theme 25/25';
  measure();
})();
