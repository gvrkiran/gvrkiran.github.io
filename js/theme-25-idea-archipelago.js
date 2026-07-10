/* js/theme-25-idea-archipelago.js
 * Theme 25 — Idea Archipelago.
 *
 * Turns one identity-preserving generated illustration into an explorable
 * academic world. Portals align with landmarks in the source image and route
 * to real sections. A magnifying lens, subtle parallax, chapter crops, mobile
 * dock, and persistent rail make the image useful instead of ornamental.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '25') return;

  const root = document.documentElement;
  const body = document.body;
  const hero = document.querySelector('.hero-section, [data-section="hero"]');
  const heroBg = hero && hero.querySelector('.hero-bg');
  if (!hero || !heroBg) return; // Subpages use the CSS-only generated banner.

  root.classList.add('t25-js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const ASSET = 'assets/ai/25-idea-archipelago.png';

  const PORTALS = [
    { key: 'projects', label: 'Projects', note: 'Network observatory', target: '#projects', x: 0.43, y: 0.225 },
    { key: 'publications', label: 'Publications', note: 'Paper mountain', target: '#publications', x: 0.635, y: 0.205 },
    { key: 'teaching', label: 'Teaching', note: 'Learning amphitheater', target: '#teaching', x: 0.87, y: 0.24 },
    { key: 'about', label: 'About Kiran', note: 'Meet the explorer', target: '#about', x: 0.655, y: 0.62 },
    { key: 'tools', label: 'Tools', note: 'Invention garden', target: 'tools.html', x: 0.885, y: 0.69 },
    { key: 'other', label: 'Other', note: 'Side-quest moon', target: '#other', x: 0.32, y: 0.76 }
  ];

  const VISTAS = {
    about:        { position: '72% 62%', caption: 'The explorer · identity & questions' },
    projects:     { position: '43% 22%', caption: 'Network observatory · active projects' },
    publications: { position: '64% 16%', caption: 'Paper mountain · selected publications' },
    teaching:     { position: '89% 20%', caption: 'Learning amphitheater · teaching' },
    other:        { position: '30% 78%', caption: 'Side-quest moon · comics, tools & advice' }
  };

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };

  /* Generated world stage. */
  const stage = el('div', 't25-world-stage');
  const world = document.createElement('img');
  world.className = 't25-world-img';
  world.src = ASSET;
  world.alt = '';
  world.setAttribute('aria-hidden', 'true');
  world.draggable = false;
  world.addEventListener('error', () => { world.style.display = 'none'; }, { once: true });
  stage.appendChild(world);
  heroBg.appendChild(stage);

  const portalNodes = [];
  PORTALS.forEach((portal, index) => {
    const tag = portal.target.charAt(0) === '#' ? 'button' : 'a';
    const node = el(tag, 't25-hotspot');
    if (tag === 'button') node.type = 'button';
    else node.href = portal.target;
    node.dataset.portal = portal.key;
    node.setAttribute('aria-label', portal.label + ': ' + portal.note);
    const number = el('span', 't25-hotspot-index', String(index + 1).padStart(2, '0'));
    const label = el('span', 't25-hotspot-label', portal.label);
    label.appendChild(el('small', '', portal.note));
    node.append(number, label);
    if (tag === 'button') node.addEventListener('click', () => navigate(portal.target));
    node.addEventListener('mouseenter', () => focusPortal(portal));
    node.addEventListener('focus', () => focusPortal(portal));
    node.addEventListener('mouseleave', resetKey);
    node.addEventListener('blur', resetKey);
    stage.appendChild(node);
    portalNodes.push({ node, portal });
  });

  const key = el('div', 't25-map-key');
  key.setAttribute('aria-live', 'polite');
  key.innerHTML = '<strong>Explore the generated universe.</strong><br>Move to inspect · select a glowing portal to navigate.';
  hero.appendChild(key);

  function focusPortal(portal) {
    key.innerHTML = '<strong>' + portal.label + '</strong><br>' + portal.note + ' · select to travel there.';
    stage.dataset.focus = portal.key;
  }

  function resetKey() {
    key.innerHTML = '<strong>Explore the generated universe.</strong><br>Move to inspect · select a glowing portal to navigate.';
    delete stage.dataset.focus;
  }

  function navigate(target) {
    const section = document.querySelector(target);
    if (section) section.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  /* Mobile dock: same destinations, always aligned regardless of image crop. */
  const dock = el('nav', 't25-world-dock');
  dock.setAttribute('aria-label', 'Explore the academic universe');
  PORTALS.forEach(portal => {
    if (portal.target.charAt(0) === '#') {
      const button = el('button', '', portal.label);
      button.type = 'button';
      button.addEventListener('click', () => navigate(portal.target));
      dock.appendChild(button);
    } else {
      const link = el('a', '', portal.label);
      link.href = portal.target;
      dock.appendChild(link);
    }
  });
  hero.appendChild(dock);

  /* Object-cover math keeps hotspots on exact image landmarks. */
  let imageMetrics = null;
  function measureImage() {
    const w = heroBg.clientWidth;
    const h = heroBg.clientHeight;
    const nw = world.naturalWidth || 1672;
    const nh = world.naturalHeight || 941;
    const scale = Math.max(w / nw, h / nh);
    const rw = nw * scale;
    const rh = nh * scale;
    const ox = (w - rw) / 2;
    const oy = (h - rh) / 2;
    imageMetrics = { w, h, nw, nh, scale, rw, rh, ox, oy };
    portalNodes.forEach(({ node, portal }) => {
      const x = ox + portal.x * rw;
      const y = oy + portal.y * rh;
      node.style.left = x + 'px';
      node.style.top = y + 'px';
      node.hidden = x < -35 || x > w + 35 || y < -35 || y > h + 35;
    });
  }
  world.addEventListener('load', measureImage, { once: true });
  if (world.complete) measureImage();

  /* Live detail lens and subtle depth response. */
  const lens = el('div', 't25-lens');
  lens.setAttribute('aria-hidden', 'true');
  hero.appendChild(lens);
  let pointerFrame = 0;
  let pointer = { x: 0, y: 0 };

  function renderPointer() {
    pointerFrame = 0;
    if (!imageMetrics) measureImage();
    const m = imageMetrics;
    const x = pointer.x, y = pointer.y;
    const nx = x / Math.max(1, m.w) - 0.5;
    const ny = y / Math.max(1, m.h) - 0.5;
    stage.style.setProperty('--t25-pan-x', (-nx * 12).toFixed(1) + 'px');
    stage.style.setProperty('--t25-pan-y', (-ny * 8).toFixed(1) + 'px');
    hero.style.setProperty('--t25-mx', x + 'px');
    hero.style.setProperty('--t25-my', y + 'px');

    const size = 186;
    const zoom = 1.72;
    lens.style.left = x + 'px';
    lens.style.top = y + 'px';
    lens.style.backgroundSize = (m.rw * zoom) + 'px ' + (m.rh * zoom) + 'px';
    lens.style.backgroundPosition = (size / 2 - (x - m.ox) * zoom) + 'px ' + (size / 2 - (y - m.oy) * zoom) + 'px';
    lens.dataset.on = 'true';
  }

  if (finePointer && !reduced) {
    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(renderPointer);
    }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      lens.dataset.on = 'false';
      stage.style.setProperty('--t25-pan-x', '0px');
      stage.style.setProperty('--t25-pan-y', '0px');
    }, { passive: true });
  }

  /* Section crops reuse the generated world as coherent visual chapters. */
  const vistas = [];
  Object.keys(VISTAS).forEach(id => {
    const section = document.getElementById(id);
    if (!section) return;
    const config = VISTAS[id];
    const vista = el('div', 't25-section-vista');
    vista.setAttribute('aria-hidden', 'true');
    vista.dataset.caption = config.caption;
    vista.style.backgroundPosition = config.position;
    section.appendChild(vista);
    vistas.push(vista);

    if (finePointer && !reduced) {
      vista.addEventListener('pointermove', event => {
        const rect = vista.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        vista.style.setProperty('--t25-ry', ((x - 0.5) * 6).toFixed(2) + 'deg');
        vista.style.setProperty('--t25-rx', ((0.5 - y) * 5).toFixed(2) + 'deg');
        vista.style.setProperty('--t25-vx', (x * 100).toFixed(1) + '%');
        vista.style.setProperty('--t25-vy', (y * 100).toFixed(1) + '%');
      }, { passive: true });
      vista.addEventListener('pointerleave', () => {
        vista.style.setProperty('--t25-ry', '0deg');
        vista.style.setProperty('--t25-rx', '0deg');
      }, { passive: true });
    }
  });

  if (reduced || !('IntersectionObserver' in window)) {
    vistas.forEach(vista => vista.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.16 });
    vistas.forEach(vista => observer.observe(vista));
  }

  /* Chapter rail + current-section state. */
  const sections = [hero].concat(Array.from(document.querySelectorAll('section.section[data-section]:not(.hero-section)')));
  const rail = el('nav', 't25-chapter-rail');
  rail.setAttribute('aria-label', 'Chapter navigation');
  const railButtons = sections.map((section, index) => {
    const label = index === 0 ? 'World map' : (section.querySelector('.section-heading')?.textContent || 'Chapter ' + index);
    const button = el('button');
    button.type = 'button';
    button.setAttribute('aria-label', label.trim());
    button.addEventListener('click', () => section.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }));
    rail.appendChild(button);
    return button;
  });
  body.appendChild(rail);

  let scrollFrame = 0;
  function updateScroll() {
    scrollFrame = 0;
    const heroH = Math.max(1, hero.offsetHeight);
    const progress = Math.max(0, Math.min(1, scrollY / heroH));
    if (!reduced) stage.style.setProperty('--t25-scroll-y', (progress * 26).toFixed(1) + 'px');
    root.classList.toggle('t25-past-hero', scrollY > heroH * 0.68);

    const probe = scrollY + innerHeight * 0.36;
    let active = 0;
    sections.forEach((section, index) => {
      const top = section.getBoundingClientRect().top + scrollY;
      if (top <= probe) active = index;
    });
    railButtons.forEach((button, index) => {
      if (index === active) button.setAttribute('aria-current', 'location');
      else button.removeAttribute('aria-current');
    });
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
      const currentSection = sections[active];
      const current = currentSection && currentSection.id && link.getAttribute('href') === '#' + currentSection.id;
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }, { passive: true });

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { measureImage(); updateScroll(); }, 220);
  }, { passive: true });

  const themeName = document.getElementById('themeName');
  if (themeName) themeName.textContent = 'Idea Archipelago · generated with ChatGPT · theme 25/25';
  updateScroll();
})();
