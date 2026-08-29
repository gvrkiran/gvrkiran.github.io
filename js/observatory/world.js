(function () {
  'use strict';

  window.mountScrollWorld(document.getElementById('world'), {
    brand: { name: 'Kiran Garimella', href: '#top' },
    hint: 'scroll to enter',
    nav: true,
    atmosphere: true,
    diveScroll: 1.72,
    crossfade: 0.16,
    sections: [
      {
        id: 'about',
        label: 'About',
        still: 'assets/observatory/stills/01-orrery-atrium.webp',
        clip: 'assets/observatory/video/encoded/01-orrery-atrium.mp4',
        accent: '#d3ae68',
        scroll: 1.9,
        linger: 0.18,
        eyebrow: '01 · About',
        title: 'About',
        body: 'Assistant Professor at Rutgers. I study computational social science, misinformation, AI, and information ecosystems, with a focus on the Global South.',
        tags: ['Computational social science', 'Global South', 'AI'],
        cta: {
          primary: { label: 'Open About', href: '#door-about' }
        }
      },
      {
        id: 'projects',
        label: 'Projects',
        still: 'assets/observatory/stills/02-signal-lab.webp',
        clip: 'assets/observatory/video/encoded/02-signal-lab-iris.mp4',
        accent: '#38c7c9',
        linger: 0.26,
        eyebrow: '02 · Projects',
        title: 'Projects',
        body: 'Current projects study how people use AI, its social and economic impacts, encrypted platforms such as WhatsApp, data donation, polarization, and multimodal media.',
        tags: ['AI use', 'WhatsApp', 'Data donation', 'Multimodal media'],
        cta: {
          primary: { label: 'Open Projects', href: '#door-projects' }
        }
      },
      {
        id: 'publications',
        label: 'Publications',
        still: 'assets/observatory/stills/03-evidence-archive.webp',
        clip: 'assets/observatory/video/encoded/03-evidence-archive.mp4',
        accent: '#d5b26c',
        linger: 0.28,
        eyebrow: '03 · Publications',
        title: 'Publications',
        body: 'Publications on data donation, encrypted platforms, misinformation, political polarization, AI use and impact, and multimodal methods.',
        tags: ['Data donation', 'Encrypted platforms', 'Misinformation', 'AI'],
        cta: {
          primary: { label: 'Open Publications', href: '#door-publications' }
        }
      },
      {
        id: 'teaching',
        label: 'Teaching',
        still: 'assets/observatory/stills/04-question-foundry.webp',
        clip: 'assets/observatory/video/encoded/04-question-foundry.mp4',
        accent: '#df514f',
        linger: 0.26,
        eyebrow: '04 · Teaching',
        title: 'Teaching',
        body: 'Courses and mentoring in computational social science, data analysis, platform research, and responsible AI.',
        tags: ['Courses', 'Mentoring', 'Methods', 'Responsible AI'],
        cta: {
          primary: { label: 'Open Teaching', href: '#door-teaching' }
        }
      },
      {
        id: 'other',
        label: 'Other',
        still: 'assets/observatory/stills/05-public-commons.webp',
        clip: 'assets/observatory/video/encoded/05-public-commons.mp4',
        accent: '#e1bd72',
        scroll: 2.05,
        linger: 0.15,
        eyebrow: '05 · Other',
        title: 'Other',
        body: 'Tools, comics, research and career advice, media coverage, and writing.',
        tags: ['Tools', 'Comics', 'Writing', 'Collaboration'],
        cta: {
          primary: { label: 'Open Other', href: '#door-other' }
        }
      }
    ],
    connectors: [null, null, null, 'assets/observatory/video/encoded/04-05-connector.mp4']
  });

  const pages = {
    about: { title: 'About', href: 'about.html' },
    projects: { title: 'Projects', href: 'projects.html' },
    publications: { title: 'Publications', href: 'publications.html' },
    teaching: { title: 'Teaching', href: 'teaching.html' },
    other: { title: 'Other', href: 'other.html' }
  };

  const door = document.createElement('aside');
  door.className = 'world-door';
  door.hidden = true;
  door.innerHTML = [
    '<button class="world-door__backdrop" type="button" aria-label="Close page and return to the path"></button>',
    '<section class="world-door__panel" role="dialog" aria-modal="true" aria-label="Page">',
    '  <div class="world-door__actions">',
    '    <a class="world-door__external" href="index.html">Open full page ↗</a>',
    '    <button class="world-door__close" type="button">← Return to path</button>',
    '  </div>',
    '  <iframe class="world-door__frame" title="" loading="lazy"></iframe>',
    '  <div class="world-door__leaves" aria-hidden="true">',
    '    <div class="world-door__leaf world-door__leaf--left"><i></i></div>',
    '    <div class="world-door__leaf world-door__leaf--right"><i></i></div>',
    '  </div>',
    '</section>'
  ].join('');
  document.body.appendChild(door);

  const doorPanel = door.querySelector('.world-door__panel');
  const doorFrame = door.querySelector('.world-door__frame');
  const doorExternal = door.querySelector('.world-door__external');
  const doorClose = door.querySelector('.world-door__close');
  let doorTrigger = null;
  let closeTimer = null;

  function prepareEmbeddedPage() {
    try {
      const embeddedDocument = doorFrame.contentDocument;
      if (!embeddedDocument || !embeddedDocument.head) return;

      let embedStyle = embeddedDocument.querySelector('#observatory-embed-style');
      if (!embedStyle) {
        embedStyle = embeddedDocument.createElement('style');
        embedStyle.id = 'observatory-embed-style';
        embeddedDocument.head.appendChild(embedStyle);
      }

      embedStyle.textContent = [
        'html { scroll-padding-top: 0 !important; }',
        'body { margin-top: 0 !important; padding-top: 0 !important; }',
        'body > header, body > footer,',
        'body > .topbar, body > .nav-bar, body > .site-footer,',
        '.pubs-topline, .rail-top .home { display: none !important; }',
        'body > main.container { padding-top: clamp(22px, 3vw, 38px) !important; }',
        'body.pubs-page > main { padding-top: 0 !important; }',
        'body.pubs-page > main > .section { padding-top: clamp(22px, 3vw, 38px) !important; }'
      ].join('\n');
      embeddedDocument.documentElement.classList.add('observatory-embedded');
    } catch (error) {
      // The observatory ships these pages on the same origin. If that changes,
      // the full-page link remains available and the iframe still works normally.
    }
  }

  doorFrame.addEventListener('load', prepareEmbeddedPage);

  function openDoor(key, trigger) {
    const page = pages[key];
    if (!page) return;
    if (closeTimer) window.clearTimeout(closeTimer);
    doorTrigger = trigger || null;
    doorPanel.setAttribute('aria-label', page.title + ' page');
    doorFrame.title = page.title;
    if (doorFrame.getAttribute('src') !== page.href) doorFrame.src = page.href;
    doorExternal.href = page.href;
    door.hidden = false;
    door.classList.remove('is-open');
    document.documentElement.classList.add('world-door-open');
    // Commit the closed architectural portal before asking the leaves to swing.
    // Without this layout boundary a browser may coalesce hidden→open into one
    // paint and skip the door motion entirely.
    void door.offsetWidth;
    door.classList.add('is-open');
    doorClose.focus();
  }

  function closeDoor() {
    door.classList.remove('is-open');
    document.documentElement.classList.remove('world-door-open');
    closeTimer = window.setTimeout(function () {
      door.hidden = true;
      if (doorTrigger) doorTrigger.focus();
    }, 1120);
  }

  document.querySelectorAll('.sw-copy__cta a[href^="#door-"]').forEach(function (trigger) {
    const key = trigger.getAttribute('href').slice('#door-'.length);
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      openDoor(key, trigger);
    });
  });
  doorClose.addEventListener('click', closeDoor);
  door.querySelector('.world-door__backdrop').addEventListener('click', closeDoor);
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !door.hidden) closeDoor();
  });
})();
