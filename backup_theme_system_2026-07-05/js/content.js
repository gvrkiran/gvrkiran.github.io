/* js/content.js — populate hero + sections from data.js */
(function () {
  'use strict';
  const P = window.PROFILE || {};
  const KEYWORDS    = window.KEYWORDS    || [];
  const PROJECTS    = window.PROJECTS    || [];
  const PUBS        = window.PUBLICATIONS || [];
  const TEACH       = window.TEACHING    || [];
  const TALKS       = window.TALKS       || [];
  const PRESS       = window.PRESS       || [];

  const $ = (id) => document.getElementById(id);

  if ($('heroName')) $('heroName').textContent = P.name || 'Kiran Garimella';
  if ($('heroRole')) $('heroRole').textContent = P.role || '';
  if ($('heroTagline')) $('heroTagline').textContent = P.tagline || '';

  const ql = $('quickLinks');
  if (ql) {
    const s = P.socials || {};
    const items = [
      { label: 'Email',    href: P.email ? `mailto:${P.email}` : null },
      { label: 'CV',       href: P.cvUrl || s.cv || null },
      { label: 'LinkedIn', href: s.linkedin || null },
      { label: 'Twitter',  href: s.twitter  || null },
      { label: 'Scholar',  href: s.scholar  || null },
    ].filter(it => it.href);
    ql.innerHTML = items.map(it => `<a href="${it.href}" target="_blank" rel="noopener">${it.label}</a>`).join('');
  }

  const aboutBody = $('aboutBody');
  if (aboutBody) {
    const tags = KEYWORDS.map(k => `<span class="kw">${k}</span>`).join('');
    aboutBody.innerHTML = `
      <p class="about-para">${P.tagline || ''}</p>
      <p class="about-meta">${P.role || ''}${P.location ? ' · ' + P.location : ''}</p>
      <div class="kw-list">${tags}</div>
    `;
  }

  const projBody = $('projectsBody');
  if (projBody) {
    projBody.innerHTML = PROJECTS.slice(0, 5).map(p => {
      const tags = (p.tags || []).map(t => `<span class="kw">${t}</span>`).join('');
      return `
        <article class="card project-card">
          <h3>${p.title}</h3>
          <p>${p.summary}</p>
          <div class="kw-list">${tags}</div>
        </article>`;
    }).join('');
  }

  const pubsBody = $('pubsBody');
  if (pubsBody) {
    pubsBody.innerHTML = PUBS.slice(0, 5).map(p => {
      const authors = Array.isArray(p.authors) ? p.authors.join(', ') : (p.authors || '');
      const links = (p.links || []).map(l => `<a href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join(' · ');
      return `
        <article class="card pub-card">
          <h3>${p.title}</h3>
          <p class="pub-meta">${authors} · <em>${p.venue || ''}</em>${p.year ? ' · ' + p.year : ''}</p>
          ${links ? `<p class="pub-links">${links}</p>` : ''}
        </article>`;
    }).join('');
  }

  const teachBody = $('teachingBody');
  if (teachBody) {
    if (!TEACH.length) {
      teachBody.innerHTML = `<p>Course materials coming online.</p>`;
    } else {
      // TEACHING items use { course, term, info }. info may contain inline anchor HTML — render as-is.
      teachBody.innerHTML = TEACH.map(t => `
        <article class="card teach-card">
          <h3>${t.course || t.title || ''}</h3>
          ${t.term ? `<p class="teach-term">${t.term}</p>` : ''}
          <p class="teach-info">${t.info || t.summary || ''}</p>
        </article>`).join('');
    }
  }

  const otherBody = $('otherBody');
  if (otherBody) {
    const s = P.socials || {};
    const blogHref = P.blog || s.substack || null;
    // 4-card grid mirroring other.html (Advice, Comics, Tools, Blog).
    const cards = [
      {
        eyebrow: 'Notes & mentoring',
        title:   'Advice',
        meta:    'Collected notes for prospective PhD students and early-career researchers.',
        href:    'advice.html',
      },
      {
        eyebrow: 'Sketches',
        title:   'Comics',
        meta:    'Lightweight comics about academic life, parenting, and AI.',
        href:    'comic.html',
      },
      {
        eyebrow: 'Apps & demos',
        title:   'Tools',
        meta:    'Public-facing prototypes and utilities from the research.',
        href:    'tools.html',
      },
      blogHref ? {
        eyebrow: 'Writing',
        title:   'Blog (Substack)',
        meta:    'Longer-form thoughts, work-in-progress ideas, and commentary.',
        href:    blogHref,
        external: true,
      } : null,
    ].filter(Boolean);

    otherBody.innerHTML = `
      <p class="other-lead">Bookmarks for everything beyond the main pages — advice and mentoring notes, comics, tools I build, and writing on Substack.</p>
      <div class="other-grid">
        ${cards.map(c => `
          <a class="other-card" href="${c.href}"${c.external ? ' target="_blank" rel="noopener"' : ''}>
            <span class="other-feature-eyebrow">${c.eyebrow}</span>
            <span class="other-feature-title">${c.title} →</span>
            <span class="other-feature-meta">${c.meta}</span>
          </a>`).join('')}
      </div>
    `;
  }

  const cr = $('copyright');
  if (cr) cr.textContent = `© ${new Date().getFullYear()} Kiran Garimella`;

  // Theme 5 (Editorial) and 6 (Specimen) folio numbers on section headings
  const themeNum = document.documentElement.getAttribute('data-theme');
  if (themeNum === '5' || themeNum === '6') {
    document.querySelectorAll('section.section[data-section] .section-heading').forEach((h, i) => {
      h.setAttribute('data-folio', String(i + 1).padStart(2, '0'));
    });
  }
})();
