/* js/theme-engine.js
 * Runs in <head> before body paint.
 * - Picks a random theme [1..10] excluding last_theme (localStorage).
 * - Honors ?theme=N URL override and localStorage.forced_theme override.
 * - Sets <html data-theme>, data-layout, data-mode.
 * - Injects css/themes/NN-name.css synchronously.
 * - Wires the mode toggle and ? overlay after DOMContentLoaded.
 */
(function () {
  'use strict';

  const THEMES = [
    { n: 1,  slug: 'reading-room',     name: 'Reading Room',    layout: 'L1' },
    { n: 2,  slug: 'whitebox',         name: 'Whitebox',        layout: 'L1' },
    { n: 3,  slug: 'notebook',         name: 'Notebook',        layout: 'L2' },
    { n: 4,  slug: 'risograph',        name: 'Risograph',       layout: 'L2' },
    { n: 5,  slug: 'editorial',        name: 'Editorial',       layout: 'L3' },
    { n: 6,  slug: 'specimen',         name: 'Specimen',        layout: 'L2' },
    { n: 7,  slug: 'brutalist-print',  name: 'Brutalist Print', layout: 'L3' },
    { n: 8,  slug: 'dither',           name: 'Dither',          layout: 'L1' },
    { n: 9,  slug: 'glitch',           name: 'Glitch',          layout: 'L4' },
    { n: 10, slug: 'particle-field',   name: 'Particle Field',  layout: 'L4' },
  ];

  const url = new URL(location.href);
  const urlTheme = parseInt(url.searchParams.get('theme'), 10);
  const forcedTheme = parseInt(localStorage.getItem('forced_theme') || '', 10);
  const last = parseInt(localStorage.getItem('last_theme') || '', 10);
  // Theme persists across in-session navigations (sessionStorage) but rerolls on reload / new tab.
  const sessionTheme = parseInt(sessionStorage.getItem('current_theme') || '', 10);
  const navType = (() => {
    try {
      const e = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      return e ? e.type : 'navigate';
    } catch (_) { return 'navigate'; }
  })();

  let pick;
  if (urlTheme >= 1 && urlTheme <= 10) {
    pick = urlTheme;
  } else if (forcedTheme >= 1 && forcedTheme <= 10) {
    pick = forcedTheme;
  } else if (navType !== 'reload' && sessionTheme >= 1 && sessionTheme <= 10) {
    // In-session navigation (link click or back/forward) — keep the same theme.
    pick = sessionTheme;
  } else {
    // Fresh reload, fresh tab, or no session — pick a new random theme (≠ last).
    const candidates = THEMES.filter(t => t.n !== last).map(t => t.n);
    pick = candidates[Math.floor(Math.random() * candidates.length)];
  }
  localStorage.setItem('last_theme', String(pick));
  sessionStorage.setItem('current_theme', String(pick));

  const theme = THEMES.find(t => t.n === pick);
  const padded = String(theme.n).padStart(2, '0');
  const cssHref = `css/themes/${padded}-${theme.slug}.css`;

  document.documentElement.setAttribute('data-theme', String(theme.n));
  document.documentElement.setAttribute('data-layout', theme.layout);

  let mode = localStorage.getItem('mode');
  if (!mode) mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-mode', mode);

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssHref;
  document.head.appendChild(link);

  const lazyScript = (theme.n === 8) ? 'js/theme-08-dither.js'
                  : (theme.n === 9) ? 'js/theme-09-glitch.js'
                  : (theme.n === 10) ? 'js/theme-10-particles.js'
                  : null;

  window.__theme = {
    THEMES,
    current: theme,
    setMode(newMode) {
      mode = newMode;
      document.documentElement.setAttribute('data-mode', newMode);
      localStorage.setItem('mode', newMode);
      window.dispatchEvent(new CustomEvent('modechange', { detail: { mode: newMode } }));
    },
    getMode() { return mode; },
    forceTheme(n) {
      if (n >= 1 && n <= 10) {
        localStorage.setItem('forced_theme', String(n));
        location.reload();
      }
    },
    clearForce() {
      localStorage.removeItem('forced_theme');
      location.reload();
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    const themeName = document.getElementById('themeName');
    if (themeName) themeName.textContent = `Designed with Claude. Reload for a different template (${theme.name} · #${theme.n}/10)`;

    const btn = document.getElementById('modeToggle');
    if (btn) {
      // Show the icon for the mode you'd switch TO (moon while in light, sun while in dark).
      const update = () => { btn.textContent = (window.__theme.getMode() === 'dark') ? '☀' : '☾'; };
      update();
      btn.addEventListener('click', () => {
        window.__theme.setMode(window.__theme.getMode() === 'dark' ? 'light' : 'dark');
        update();
      });
      window.addEventListener('modechange', update);
    }

    const overlay = document.getElementById('themePicker');
    const list = document.getElementById('themePickerList');
    if (overlay && list) {
      list.innerHTML = THEMES.map(t =>
        `<li><button data-theme="${t.n}" ${t.n === theme.n ? 'aria-current="true"' : ''}>${t.n}. ${t.name}</button></li>`
      ).join('');
      list.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-theme]');
        if (!b) return;
        window.__theme.forceTheme(parseInt(b.dataset.theme, 10));
      });
      document.addEventListener('keydown', (e) => {
        const tag = (e.target && e.target.tagName) || '';
        if (e.key === '?' && !/^(INPUT|TEXTAREA)$/.test(tag)) {
          e.preventDefault();
          overlay.setAttribute('data-open', overlay.getAttribute('data-open') === 'true' ? 'false' : 'true');
        } else if (e.key === 'Escape') {
          overlay.setAttribute('data-open', 'false');
        }
      });
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.setAttribute('data-open', 'false');
      });
    }

    if (lazyScript) {
      const s = document.createElement('script');
      s.src = lazyScript;
      s.defer = true;
      document.body.appendChild(s);
    }
  });
})();
