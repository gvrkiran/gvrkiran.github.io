// Main site JS — updated nav (clickable), year-only publications filter, and fallbacks for Projects/Teaching
(function(){
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  document.addEventListener('DOMContentLoaded', () => {
    applyCommon();
    const page = document.body.dataset.page;
    if (page === 'home') initHome();
    if (page === 'publications') initPublications();
    if (page === 'projects') initProjects();
    if (page === 'teaching') initTeaching();
    if (page === 'talks') initTalks();
    if (page === 'press') initPress();
    if (page === 'comics') {/* page-local modal lives on comics.html */}
    if (page === 'contact') initContact();
    if (page === 'other') initOther();
  });

  function applyCommon() {
    if ($('#brand')) {
      $('#brand').textContent = PROFILE.name;
      $('#brand').setAttribute('href', 'index.html');
    }
    if ($('#copyright')) $('#copyright').textContent = `© ${new Date().getFullYear()} ${PROFILE.name}`;

    // theme toggle
    const btn = $('#themeBtn');
    if (btn) {
      function setTheme(dark){
        document.body.classList.toggle('dark', dark);
        try { localStorage.setItem('dark', dark ? '1' : '0'); } catch {}
        btn.textContent = dark ? '🌙' : '☀️';
      }
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedDark = (typeof localStorage !== 'undefined' && localStorage.getItem('dark')) === '1';
      setTheme(savedDark || prefersDark);
      btn.addEventListener('click', () => setTheme(!document.body.classList.contains('dark')));
    }

    // Build a compact nav across the site
    const nav = $('.navlinks');
    if (nav) {
      nav.innerHTML = [
    	'<a href="about.html">About</a>',      // ← added
        '<a href="publications.html">Publications</a>',
        '<a href="projects.html">Projects</a>',
        '<a href="teaching.html">Teaching</a>',
        '<a href="other.html">Other</a>'
      ].join('');
      const current = location.pathname.split('/').pop() || 'index.html';
      $$('.navlinks a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === current));
    }

    ensureNavClickableStyle();
    ensureGlobalStackGap();
    ensureFooterGap();
  }

// space above the footer line, not a bigger card
function ensureFooterGap(){
  const css = `main.container{padding-bottom:48px} .footer{margin-top:0}`;
  const existing = document.getElementById('footerGapStyle');
  if (existing) { existing.textContent = css; return; }
  const s = document.createElement('style');
  s.id = 'footerGapStyle';
  s.textContent = css;
  document.head.appendChild(s);
}

  function ensureGlobalStackGap(){
    if (document.getElementById('stackGapStyle')) return;
    const s = document.createElement('style');
    s.id = 'stackGapStyle';
    s.textContent = `.stack{display:grid;gap:18px}.stack>.card{margin:0}`;
    document.head.appendChild(s);
  }

  function ensureNavClickableStyle(){
    if (document.getElementById('navClickableStyle')) return;
    const s = document.createElement('style');
    s.id = 'navClickableStyle';
    s.textContent = `
      .navlinks a{position:relative;display:inline-block;padding-bottom:10px;cursor:pointer;text-decoration:none}
      .navlinks a:hover{opacity:.9}
      .nav      .navlinks a:hover{opacity:.9}
      .navlinks a::after{content:'';position:absolute;left:0;right:0;bottom:4px;height:2px;background:currentColor;opacity:0;transform:translateY(2px);transition:opacity .16s ease,transform .16s ease}
      .navlinks a:hover::after{opacity:.4;transform:translateY(0)}
      .navlinks a.active::after{opacity:1;transform:translateY(0)}
    `;
    document.head.appendChild(s);
  }

  // Home
  function initHome(){
    const kws = $('#keywords');
    if ($('#location')) $('#location').textContent = PROFILE.location || '';
    if ($('#hero-role')) $('#hero-role').textContent = PROFILE.role || '';
    if ($('#hero-tagline')) $('#hero-tagline').textContent = PROFILE.tagline || '';
    if (kws) kws.innerHTML = (window.KEYWORDS||[]).map(t => `<span class="badge">${t}</span>`).join('');

    const img = $('#portrait');
    const ph  = $('#portraitPlaceholder');
    if (img) {
      const src = (PROFILE.photo || '').trim();
      if (src) {
        img.src = src; img.alt = `Portrait of ${PROFILE.name}`; img.classList.remove('hidden');
        if (ph) ph.classList.add('hidden');
      } else {
        img.classList.add('hidden');
        if (ph) ph.classList.remove('hidden');
      }
    }
  }

  // Publications — YEAR ONLY FILTER + Unpublished section
  function initPublications(){
    const root = $('#pub-list');
    if (!root) return;

    const search = $('#pubSearch');
    const yearSel = $('#pubYear') || $('#pubTopic'); // support either id

    const raw = (typeof PUBLICATIONS !== 'undefined' && Array.isArray(PUBLICATIONS))
      ? PUBLICATIONS.slice()
      : (Array.isArray(window.PUBLICATIONS) ? window.PUBLICATIONS.slice() : []);
    const pubs = raw.map(p => ({...p, year: (p.year===null||p.year===undefined||p.year==='')?null:Number(p.year)}));

    const years = Array.from(new Set(pubs.filter(p => Number.isFinite(p.year)).map(p => p.year))).sort((a,b)=> b-a);
    const hasUnpublished = pubs.some(p => !Number.isFinite(p.year));

    function opt(v,t,sel){ return `<option value="${v}" ${sel?'selected':''}>${t}</option>`; }
    const params = new URLSearchParams(location.search);
    const selected = params.get('y') || 'all';

    if (yearSel) {
      const opts = [ opt('all','all', selected==='all') ];
      if (hasUnpublished) opts.push(opt('unpublished','unpublished', selected==='unpublished'));
      years.forEach(y => opts.push(opt(String(y), String(y), selected===String(y))));
      yearSel.innerHTML = opts.join('');
    }

    const matchesQ = (p,q) => !q || [p.title, p.venue, (p.authors||[]).join(' ')].some(x => (x||'').toLowerCase().includes(q));

    const card = (p) => {
      const kicker = Number.isFinite(p.year) ? [p.year, p.venue].filter(Boolean).join(' • ') : (p.status || 'Unpublished');
      const links = (p.links||[]).map(l => `<a class="link" href="${l.href}" target="_blank" rel="noreferrer">${l.label} ↗</a>`).join('');
      return `<div class="card"><div class="content">
        <div class="kicker">${kicker}</div>
        <h3>${p.title}</h3>
        <div class="muted" style="font-size:14px">${(p.authors||[]).join(', ')}</div>
        <div class="controls" style="margin-top:10px">${links}</div>
      </div></div>`;
    };

    function renderAll(q){
      const unpub = pubs.filter(p => !Number.isFinite(p.year)).filter(p => matchesQ(p,q));
      const published = pubs.filter(p => Number.isFinite(p.year)).sort((a,b)=> b.year-a.year);
      let html = '';
      if (unpub.length) html += `<h2 class="section-title">Unpublished</h2>` + unpub.map(card).join('') + '<div class="spacer"></div>';
      const byYear = {}; for (const p of published) (byYear[p.year] ||= []).push(p);
      for (const y of years) { const arr = (byYear[y]||[]).filter(p => matchesQ(p,q)); if (arr.length) html += `<h2 class="section-title">${y}</h2>` + arr.map(card).join(''); }
      root.innerHTML = html || `<div class="muted">No results.</div>`;
    }

    function renderFiltered(q, y){
      let list = (y === 'unpublished') ? pubs.filter(p => !Number.isFinite(p.year)) : pubs.filter(p => p.year === parseInt(y,10));
      list = list.filter(p => matchesQ(p,q)).sort((a,b)=> (b.year||0)-(a.year||0));
      root.innerHTML = list.map(card).join('') || `<div class="muted">No results.</div>`;
    }

    function render(){
      const q = (search?.value || '').trim().toLowerCase();
      const y = (yearSel?.value || 'all');
      const qs = new URLSearchParams(); if (y !== 'all') qs.set('y', y); if (q) qs.set('q', q);
      history.replaceState(null, '', qs.toString() ? `?${qs}` : location.pathname);
      if (y === 'all') renderAll(q); else renderFiltered(q, y);
    }

    yearSel?.addEventListener('change', render);
    if (search){ let t; search.addEventListener('input', ()=>{ clearTimeout(t); t=setTimeout(render,150); }); }
    render();
  }

  function renderPub(p){ /* legacy helper retained for safety */ return ''; }

  // Projects
  function initProjects(){
    const root = $('#proj-list');
    if (!root) return;
    const list = (typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS))
      ? PROJECTS
      : (Array.isArray(window.PROJECTS) ? window.PROJECTS : []);
    const html = list.map(prj => {
      const tags = (prj.tags||[]).map(t => `<span class="badge">${t}</span>`).join('');
      const links = (prj.links||[]).map(l => `<a class="link" href="${l.href}" target="_blank" rel="noreferrer">${l.label} ↗</a>`).join('');
      return `<div class="card"><div class="content">
        <h3>${prj.title}</h3>
        <div class="muted" style="font-size:14px">${prj.summary||''}</div>
        <div class="badges" style="margin-top:6px">${tags}</div>
        <div class="controls" style="margin-top:10px">${links}</div>
      </div></div>`;
    }).join('');
    root.innerHTML = html || `<div class="muted">Coming soon.</div>`;
  }

  // Teaching
  function initTeaching(){
    const root = $('#teach-list');
    if (!root) return;
    const list = (typeof TEACHING !== 'undefined' && Array.isArray(TEACHING))
      ? TEACHING
      : (Array.isArray(window.TEACHING) ? window.TEACHING : []);
    const html = list.map(t => `<div class="card"><div class="content">
      <h3>${t.course}</h3>
      <div class="muted">${t.term||''}</div>
      <div>${t.info||''}</div>
    </div></div>`).join('');
    root.innerHTML = html || `<div class="muted">Coming soon.</div>`;
  }

  // Talks
  function initTalks(){
    const root = $('#talks-list');
    if (!root) return;
    root.innerHTML = (window.TALKS||[]).map(t => `<div class="card"><div class="content row">
      <div>
        <h3>${t.title}</h3>
        <div class="muted">${t.where||''}</div>
      </div>
      <div class="muted">${t.date||''}</div>
    </div></div>`).join('') || `<div class="muted">Coming soon.</div>`;
  }

  // Press
  function initPress(){
    const root = $('#press-list');
    if (!root) return;
    root.innerHTML = (window.PRESS||[]).map(p => `<div class="card"><div class="content row">
      <div><h3>${p.outlet}</h3><div class="muted">${p.title}</div></div>
      <a class="link" href="${p.link}" target="_blank" rel="noreferrer">Read ↗</a>
    </div></div>`).join('') || `<div class="muted">Coming soon.</div>`;
  }

  // Contact
  function initContact(){
    const a = $('#contact-email');
    if (a) { a.textContent = PROFILE.email; a.setAttribute('href', `mailto:${PROFILE.email}`); }
    const lk = $('#contact-linkedin');
    if (lk && PROFILE.socials && PROFILE.socials.linkedin) {
      lk.classList.remove('hidden');
      lk.setAttribute('href', PROFILE.socials.linkedin);
    }
  }

  // Other page: wire Substack link from data.js if present
  function initOther(){
    const a = $('#substackLink');
    const note = document.getElementById('substackNote');
    if (!a) return;
    const url = (PROFILE.socials && (PROFILE.socials.substack || PROFILE.blog)) || PROFILE.blog;
    if (url) {
      a.href = url; a.target = '_blank'; a.rel = 'noreferrer';
      if (note) note.classList.add('hidden');
    }
  }

})();

