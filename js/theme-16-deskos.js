/* js/theme-16-deskos.js
 * Theme 16 — Desk OS ("KiranOS"). Layout: L1.
 *
 * The homepage boots into a tiny operating system: menu bar, wallpaper,
 * desktop icons, dock, draggable windows, and a working toy terminal.
 * Each homepage <section> is MOVED (appendChild preserves node + listeners)
 * into a window shell. "Reader Mode" / Escape calls teardown(), which moves
 * every relocated section back into <main> IN ORIGINAL ORDER and removes all
 * t16- nodes — leaving a pixel-normal page. The whole build is wrapped in
 * try/catch so ANY mid-build exception triggers the same teardown/restore.
 *
 * This is the ONLY theme permitted to move DOM nodes (per the shared brief).
 *
 * Tiers:
 *  - Desktop: full windowed environment.
 *  - Mobile (<=760px): phone home screen; sections open as full-screen sheets.
 *  - Reduced motion: no boot, no minimize animation, instant open/close.
 *  - No-JS: this file never runs; CSS applies window-chrome cosmetics only.
 *
 * Subpages (no hero / no [data-section] sections): NO relocation. The page is
 * dressed as one maximized window via CSS only; JS detects this and bails after
 * doing nothing but leaving the flag unset.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '16') return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var doc = document;
  var body = doc.body;

  /* ---- Homepage detection: need the hero + real sections to build the desktop.
     On subpages these are absent, so we skip the desktop build entirely and let
     the CSS-only window-chrome cosmetics stand. ---- */
  var main = doc.querySelector('main');
  var hero = doc.querySelector('.hero-section, [data-section="hero"]');
  var sectionNodes = main ? Array.prototype.slice.call(main.querySelectorAll('section.section[data-section]')) : [];
  if (!main || !hero || sectionNodes.length === 0) return; // subpage → CSS-only

  /* ---- Records captured BEFORE moving anything, so teardown is exact. ----
     For each section we store the node, its original parent, and its original
     nextElementSibling snapshot. Teardown appends them back to their parent in
     the recorded (original) order, which reproduces the exact original DOM
     order because all sections share one parent (<main>) and are contiguous. */
  var relocated = []; // { node, parent }
  var built = [];     // every t16- root node we add, for cleanup
  var listeners = []; // { target, type, fn } for global listeners to remove
  var timers = [];    // any timeouts to clear
  var clockTimer = null;
  var tornDown = false;

  function addL(target, type, fn, opts) {
    target.addEventListener(type, fn, opts);
    listeners.push({ target: target, type: type, fn: fn, opts: opts });
  }

  var SVGNS = 'http://www.w3.org/2000/svg';
  function el(tag, cls, txt) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  /* Inline single-color line icons (~24x24 viewBox). */
  function icon(name) {
    var svg = doc.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.6');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    var p = ICONS[name] || ICONS.about;
    for (var i = 0; i < p.length; i++) {
      var node = doc.createElementNS(SVGNS, p[i][0]);
      var attrs = p[i][1];
      for (var k in attrs) node.setAttribute(k, attrs[k]);
      svg.appendChild(node);
    }
    return svg;
  }
  var ICONS = {
    about:   [['circle', { cx: 12, cy: 8, r: 3.4 }], ['path', { d: 'M5.5 19c.6-3.4 3.2-5 6.5-5s5.9 1.6 6.5 5' }]],
    projects:[['path', { d: 'M4 7h5l2 2h9v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z' }], ['path', { d: 'M4 7V6a1 1 0 0 1 1-1h4l2 2' }]],
    publications: [['path', { d: 'M4 5h9a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2z' }], ['path', { d: 'M15 7a2 2 0 0 1 2-2h3v12a2 2 0 0 0-2 2h-3' }], ['path', { d: 'M7 9h5M7 12h5' }]],
    teaching:[['path', { d: 'M12 4 3 8l9 4 9-4z' }], ['path', { d: 'M7 10.5V15c0 1.3 2.2 2.5 5 2.5s5-1.2 5-2.5v-4.5' }], ['path', { d: 'M21 8v5' }]],
    other:   [['circle', { cx: 5, cy: 12, r: 1.6 }], ['circle', { cx: 12, cy: 12, r: 1.6 }], ['circle', { cx: 19, cy: 12, r: 1.6 }]],
    comics:  [['rect', { x: 4, y: 4, width: 16, height: 16, rx: 2 }], ['path', { d: 'M8 8h4v4H8zM14 13h2M14 16h2M8 15a2 2 0 0 0 4 0' }]],
    advice:  [['path', { d: 'M12 3a6 6 0 0 0-3 11.2V17h6v-2.8A6 6 0 0 0 12 3z' }], ['path', { d: 'M10 20h4M10.5 22h3' }]],
    terminal:[['rect', { x: 3.5, y: 5, width: 17, height: 14, rx: 2 }], ['path', { d: 'M7 9l3 2.5L7 14M12.5 14.5H16' }]]
  };

  /* ---- The section registry: label + which section id/subpage each maps to. */
  var PROFILE = window.PROFILE || {};
  var sectionTitles = {
    hero: 'Home', about: 'About', projects: 'Projects',
    publications: 'Publications', teaching: 'Teaching', other: 'Other'
  };

  /* window shells keyed by an id (section data-section OR a synthetic id) */
  var windows = {}; // id -> { win, body, iconName, title, isSheet }
  var zTop = 21;
  var cascade = 0;

  /* ============================================================
     TEARDOWN — restore normal page. Reused by the catch block and by
     Reader Mode / Escape. Idempotent.
     ============================================================ */
  function teardown() {
    if (tornDown) return;
    tornDown = true;
    // Stop timers.
    if (clockTimer) { clearInterval(clockTimer); clockTimer = null; }
    for (var t = 0; t < timers.length; t++) clearTimeout(timers[t]);
    timers.length = 0;
    // Remove global listeners we attached.
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i].target.removeEventListener(listeners[i].type, listeners[i].fn, listeners[i].opts); } catch (_) {}
    }
    listeners.length = 0;
    // Move every relocated section back to its original parent IN ORIGINAL ORDER.
    // relocated[] was built in document order; appending to the (single, shared)
    // parent in that same order reproduces the exact original sequence.
    for (var r = 0; r < relocated.length; r++) {
      var rec = relocated[r];
      try { rec.parent.appendChild(rec.node); } catch (_) {}
    }
    // Remove all t16- nodes we created (desktop, boot, dropdowns, etc.).
    for (var b = 0; b < built.length; b++) {
      var node = built[b];
      if (node && node.parentNode) { try { node.parentNode.removeChild(node); } catch (_) {} }
    }
    built.length = 0;
    // Clear the flag → CSS reveals the normal flow again.
    delete body.dataset.t16;
  }

  /* ============================================================
     BUILD — everything inside try/catch.
     ============================================================ */
  function build() {
    var isMobile = window.matchMedia('(max-width: 760px)').matches;

    /* ---- Desktop root ---- */
    var desktop = el('div', 't16-desktop');
    desktop.setAttribute('role', 'application');
    desktop.setAttribute('aria-label', 'KiranOS desktop');
    built.push(desktop);

    var wall = el('div', 't16-wall');
    desktop.appendChild(wall);
    var seal = el('div', 't16-seal', 'KG');
    seal.setAttribute('aria-hidden', 'true');
    desktop.appendChild(seal);

    /* ---- Menu bar ---- */
    var bar = el('div', 't16-menubar');
    var apple = el('span', 't16-apple', '⌘'); // place-of-interest / command glyph
    apple.setAttribute('aria-hidden', 'true');
    bar.appendChild(apple);
    bar.appendChild(el('span', 't16-menu-title', 'KiranOS'));

    // Fake File / View / Help menus.
    var menuDefs = [
      { name: 'File', items: [
        { label: 'New Terminal', act: function () { openWindow('terminal'); } },
        { label: 'Close Window', act: function () { var f = frontWindow(); if (f) closeWindow(f); } }
      ]},
      { name: 'View', items: [
        { label: 'Reader Mode', act: teardown },
        { label: 'Toggle Dark/Light', act: toggleMode }
      ]},
      { name: 'Help', items: [
        { label: 'About KiranOS', act: function () { openWindow('about'); } },
        { label: 'Open Terminal', act: function () { openWindow('terminal'); } }
      ]}
    ];
    var openDropdown = null;
    function closeDropdown() {
      if (openDropdown) {
        openDropdown.dd.setAttribute('hidden', '');
        openDropdown.title.setAttribute('aria-expanded', 'false');
        openDropdown = null;
      }
    }
    menuDefs.forEach(function (md) {
      var title = el('span', 't16-menu-item', md.name);
      title.setAttribute('role', 'button');
      title.setAttribute('tabindex', '0');
      title.setAttribute('aria-haspopup', 'true');
      title.setAttribute('aria-expanded', 'false');
      var dd = el('div', 't16-dropdown');
      dd.setAttribute('hidden', '');
      md.items.forEach(function (it) {
        var b = el('button', null, it.label);
        b.addEventListener('click', function () { closeDropdown(); it.act(); });
        dd.appendChild(b);
      });
      function toggle(e) {
        e.stopPropagation();
        var wasOpen = openDropdown && openDropdown.dd === dd;
        closeDropdown();
        if (!wasOpen) {
          var rect = title.getBoundingClientRect();
          dd.style.left = Math.round(rect.left) + 'px';
          dd.removeAttribute('hidden');
          title.setAttribute('aria-expanded', 'true');
          openDropdown = { dd: dd, title: title };
        }
      }
      title.addEventListener('click', toggle);
      title.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e); }
      });
      bar.appendChild(title);
      desktop.appendChild(dd); // dropdowns positioned fixed under the bar
    });
    // clicking anywhere else closes any open dropdown
    addL(doc, 'click', closeDropdown);

    bar.appendChild(el('span', 't16-spacer'));

    // Tray: theme name, battery glyph, clock.
    var tray = el('div', 't16-tray');
    var themeName = (window.__theme && window.__theme.current && window.__theme.current.name) || 'Desk OS';
    tray.appendChild(el('span', 't16-tray-theme', themeName + ' · #16'));
    var batt = el('span', 't16-batt');
    batt.setAttribute('aria-label', 'Battery');
    var bsvg = doc.createElementNS(SVGNS, 'svg');
    bsvg.setAttribute('viewBox', '0 0 26 14'); bsvg.setAttribute('fill', 'none');
    bsvg.setAttribute('stroke', 'currentColor'); bsvg.setAttribute('stroke-width', '1.3');
    var shell = doc.createElementNS(SVGNS, 'rect');
    shell.setAttribute('x', '1'); shell.setAttribute('y', '2'); shell.setAttribute('width', '21');
    shell.setAttribute('height', '10'); shell.setAttribute('rx', '2');
    var cap = doc.createElementNS(SVGNS, 'rect');
    cap.setAttribute('x', '23'); cap.setAttribute('y', '5'); cap.setAttribute('width', '2');
    cap.setAttribute('height', '4'); cap.setAttribute('rx', '1'); cap.setAttribute('fill', 'currentColor');
    var fill = doc.createElementNS(SVGNS, 'rect');
    fill.setAttribute('x', '2.5'); fill.setAttribute('y', '3.5'); fill.setAttribute('width', '14');
    fill.setAttribute('height', '7'); fill.setAttribute('rx', '1'); fill.setAttribute('fill', 'currentColor');
    fill.setAttribute('stroke', 'none');
    bsvg.appendChild(shell); bsvg.appendChild(cap); bsvg.appendChild(fill);
    batt.appendChild(bsvg);
    tray.appendChild(batt);
    var clock = el('span', 't16-clock', '');
    tray.appendChild(clock);
    bar.appendChild(tray);
    desktop.appendChild(bar);

    function tick() {
      var d = new Date();
      var opts = { weekday: 'short', hour: 'numeric', minute: '2-digit' };
      try { clock.textContent = d.toLocaleTimeString([], opts); }
      catch (_) { clock.textContent = d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2); }
    }
    tick();
    clockTimer = setInterval(tick, 15000);

    /* ---- Move each section into a window shell (records first!). ----
       We iterate in document order; record BEFORE moving so teardown restores
       the exact original order via appendChild-in-order. */
    sectionNodes.forEach(function (sec) {
      relocated.push({ node: sec, parent: sec.parentNode });
    });
    // Now that all records exist, actually move + wrap them.
    sectionNodes.forEach(function (sec) {
      var id = sec.getAttribute('data-section');
      var title = sectionTitles[id] || (id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Window');
      var iconName = ICONS[id] ? id : 'other';
      var w = makeWindow(id, title, iconName);
      // appendChild preserves the node and all its (content.js-attached) state.
      w.body.appendChild(sec);
      windows[id] = w;
      desktop.appendChild(w.win);
    });

    /* ---- Extra windows / launchers that are NOT relocated sections ---- */
    // Terminal (built from scratch, created lazily on first open).
    // Comics + Advice launch subpages (open <page>).
    var launchers = [
      { id: 'about', label: 'About', type: 'section' },
      { id: 'publications', label: 'Publications', type: 'section' },
      { id: 'projects', label: 'Projects', type: 'section' },
      { id: 'teaching', label: 'Teaching', type: 'section' },
      { id: 'other', label: 'Other', type: 'section' },
      { id: 'comics', label: 'Comics', type: 'link', href: 'comic.html', iconName: 'comics' },
      { id: 'advice', label: 'Advice', type: 'link', href: 'advice.html', iconName: 'advice' },
      { id: 'terminal', label: 'Terminal', type: 'terminal', iconName: 'terminal' }
    ];

    /* ---- Icon grid ---- */
    var iconWrap = el('div', 't16-icons');
    iconWrap.setAttribute('role', 'list');
    var selectedIcon = null;
    launchers.forEach(function (lc) {
      var iconName = lc.iconName || (ICONS[lc.id] ? lc.id : 'other');
      var it = el('div', 't16-icon');
      it.setAttribute('role', 'listitem');
      it.setAttribute('tabindex', '0');
      it.setAttribute('aria-label', 'Open ' + lc.label);
      var glyph = el('span', 't16-glyph');
      glyph.appendChild(icon(iconName));
      it.appendChild(glyph);
      it.appendChild(el('span', 't16-label', lc.label));
      function activate() { launch(lc); }
      it.addEventListener('click', function () {
        if (selectedIcon) selectedIcon.classList.remove('t16-selected');
        it.classList.add('t16-selected'); selectedIcon = it;
        activate();
      });
      it.addEventListener('dblclick', activate);
      it.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
      });
      iconWrap.appendChild(it);
    });
    desktop.appendChild(iconWrap);

    /* ---- Dock ---- */
    var dock = el('div', 't16-dock');
    dock.setAttribute('role', 'toolbar');
    dock.setAttribute('aria-label', 'Dock');
    var dockButtons = {}; // id -> button
    var dockDefs = [
      { id: 'about', label: 'About' },
      { id: 'projects', label: 'Projects' },
      { id: 'publications', label: 'Publications' },
      { id: 'teaching', label: 'Teaching' },
      { id: 'other', label: 'Other' },
      { sep: true },
      { id: 'terminal', label: 'Terminal', iconName: 'terminal' }
    ];
    dockDefs.forEach(function (d) {
      if (d.sep) { dock.appendChild(el('span', 't16-dock-sep')); return; }
      var b = el('button');
      b.setAttribute('aria-label', d.label);
      b.title = d.label;
      b.appendChild(icon(d.iconName || (ICONS[d.id] ? d.id : 'other')));
      b.addEventListener('click', function () {
        var lc = launchers.filter(function (x) { return x.id === d.id; })[0] || { id: d.id, type: 'section' };
        launch(lc);
      });
      dock.appendChild(b);
      dockButtons[d.id] = b;
    });
    desktop.appendChild(dock);

    /* keep dock indicator dots in sync with open windows */
    function refreshDock() {
      for (var id in dockButtons) {
        var w = windows[id];
        dockButtons[id].setAttribute('data-open', (w && !w.win.hasAttribute('hidden')) ? 'true' : 'false');
      }
    }

    /* ---- launch dispatcher ---- */
    function launch(lc) {
      if (lc.type === 'link') {
        // open <page> semantics: navigate to a subpage.
        window.location.href = lc.href;
        return;
      }
      openWindow(lc.id);
    }

    // Expose a couple of helpers up to outer scope via closure refs.
    _openWindow = openWindow;
    _refreshDock = refreshDock;

    /* Insert the whole desktop, then flip the flag so CSS hides normal flow. */
    body.appendChild(desktop);
    body.dataset.t16 = 'on';

    // Open a friendly default window (About) unless mobile (mobile stays on home screen).
    if (!isMobile) {
      openWindow('about');
      refreshDock();
    }
  }

  /* ---- window factory (shared by sections + terminal + sheets) ---- */
  function makeWindow(id, title, iconName) {
    var win = el('div', 't16-window t16-win-' + id);
    win.setAttribute('hidden', '');
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', title + ' window');
    win.dataset.winId = id;

    var tb = el('div', 't16-titlebar');
    var lights = el('div', 't16-lights');
    var closeB = el('button', 't16-close'); closeB.setAttribute('aria-label', 'Close ' + title);
    var minB = el('button', 't16-min'); minB.setAttribute('aria-label', 'Minimize ' + title);
    var zoomB = el('button', 't16-zoom'); zoomB.setAttribute('aria-label', 'Zoom ' + title);
    lights.appendChild(closeB); lights.appendChild(minB); lights.appendChild(zoomB);
    tb.appendChild(lights);
    tb.appendChild(el('span', 't16-title', title));
    win.appendChild(tb);

    var bodyEl = el('div', 't16-winbody');
    win.appendChild(bodyEl);

    var resize = el('div', 't16-resize');
    resize.setAttribute('aria-hidden', 'true');
    win.appendChild(resize);

    var rec = { win: win, body: bodyEl, iconName: iconName, title: title };

    closeB.addEventListener('click', function () { closeWindow(id); });
    minB.addEventListener('click', function () { minimizeWindow(id); });
    zoomB.addEventListener('click', function () { zoomWindow(id); });
    // double-click title bar zooms (classic behavior)
    tb.addEventListener('dblclick', function (e) {
      if (e.target.closest('.t16-lights')) return;
      zoomWindow(id);
    });

    bringToFrontOnPointer(win);
    enableDrag(win, tb, id);
    enableResize(win, resize);

    return rec;
  }

  /* ---- open / close / minimize / zoom ---- */
  var _openWindow, _refreshDock; // assigned inside build()
  function openWindow(id) {
    var w = windows[id];
    if (!w) {
      if (id === 'terminal') { w = createTerminal(); windows.terminal = w; document.querySelector('.t16-desktop').appendChild(w.win); }
      else return;
    }
    var first = w.win.hasAttribute('hidden');
    w.win.removeAttribute('hidden');
    if (first) positionCascade(w.win);
    bringToFront(w.win);
    if (id === 'terminal' && w.focusInput) w.focusInput();
    if (_refreshDock) _refreshDock();
  }
  function closeWindow(id) {
    var w = windows[id];
    if (!w) return;
    w.win.setAttribute('hidden', '');
    w.win.classList.remove('t16-max');
    if (_refreshDock) _refreshDock();
  }
  function minimizeWindow(id) {
    var w = windows[id];
    if (!w) return;
    if (reduced) { closeWindow(id); return; }
    // Animate toward the dock, then hide.
    var win = w.win;
    var dock = document.querySelector('.t16-dock');
    var wr = win.getBoundingClientRect();
    var target = dock ? dock.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight };
    var dx = (target.left + target.width / 2) - (wr.left + wr.width / 2);
    var dy = (target.top + 10) - (wr.top);
    win.classList.add('t16-minimizing');
    win.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0.08)';
    var to = setTimeout(function () {
      win.classList.remove('t16-minimizing');
      win.style.transform = '';
      closeWindow(id);
    }, 300);
    timers.push(to);
  }
  function zoomWindow(id) {
    var w = windows[id];
    if (!w) return;
    w.win.classList.toggle('t16-max');
    bringToFront(w.win);
  }
  function frontWindow() {
    // return id of the topmost visible window
    var best = null, bestZ = -1;
    for (var id in windows) {
      var win = windows[id].win;
      if (win.hasAttribute('hidden')) continue;
      var z = parseInt(win.style.zIndex || '0', 10);
      if (z >= bestZ) { bestZ = z; best = id; }
    }
    return best;
  }

  function positionCascade(win) {
    if (window.matchMedia('(max-width: 760px)').matches) return; // sheets are full-screen
    var offset = 40 + (cascade % 6) * 24;
    win.style.left = offset + 'px';
    win.style.top = (44 + (cascade % 6) * 24) + 'px';
    cascade++;
  }
  function bringToFront(win) {
    zTop++;
    win.style.zIndex = zTop;
    var all = document.querySelectorAll('.t16-window');
    for (var i = 0; i < all.length; i++) all[i].classList.remove('t16-front');
    win.classList.add('t16-front');
  }
  function bringToFrontOnPointer(win) {
    win.addEventListener('pointerdown', function () { bringToFront(win); }, true);
  }

  /* ---- dragging via pointer events + pointer capture ---- */
  function enableDrag(win, handle, id) {
    var startX = 0, startY = 0, origL = 0, origT = 0, dragging = false;
    handle.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.t16-lights')) return; // don't drag from buttons
      if (window.matchMedia('(max-width: 760px)').matches) return; // no dragging on mobile sheets
      if (win.classList.contains('t16-max')) return; // don't drag a maximized window
      dragging = true;
      handle.classList.add('t16-dragging');
      var r = win.getBoundingClientRect();
      origL = r.left; origT = r.top;
      startX = e.clientX; startY = e.clientY;
      try { handle.setPointerCapture(e.pointerId); } catch (_) {}
      e.preventDefault();
    });
    handle.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var nx = origL + (e.clientX - startX);
      var ny = origT + (e.clientY - startY);
      // keep the title bar reachable
      ny = Math.max(28, Math.min(ny, window.innerHeight - 40));
      nx = Math.max(-(win.offsetWidth - 80), Math.min(nx, window.innerWidth - 80));
      win.style.left = nx + 'px';
      win.style.top = ny + 'px';
    });
    function end(e) {
      if (!dragging) return;
      dragging = false;
      handle.classList.remove('t16-dragging');
      try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
    }
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  }

  /* ---- resizing ---- */
  function enableResize(win, handle) {
    var startX = 0, startY = 0, origW = 0, origH = 0, resizing = false;
    handle.addEventListener('pointerdown', function (e) {
      if (window.matchMedia('(max-width: 760px)').matches) return;
      resizing = true;
      var r = win.getBoundingClientRect();
      origW = r.width; origH = r.height;
      startX = e.clientX; startY = e.clientY;
      try { handle.setPointerCapture(e.pointerId); } catch (_) {}
      e.preventDefault(); e.stopPropagation();
    });
    handle.addEventListener('pointermove', function (e) {
      if (!resizing) return;
      win.style.width = Math.max(260, origW + (e.clientX - startX)) + 'px';
      win.style.height = Math.max(160, origH + (e.clientY - startY)) + 'px';
    });
    function end(e) {
      if (!resizing) return;
      resizing = false;
      try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
    }
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  }

  /* ---- mode toggle helper (routes through the engine) ---- */
  function toggleMode() {
    if (!window.__theme || !window.__theme.setMode) return;
    var cur = window.__theme.getMode ? window.__theme.getMode() : (document.documentElement.getAttribute('data-mode') || 'light');
    window.__theme.setMode(cur === 'dark' ? 'light' : 'dark');
  }

  /* ============================================================
     TERMINAL — built from scratch. Prompt: kiran@rutgers ~ %
     Swallows keys ONLY while its <input> is focused (so ? picker works).
     ============================================================ */
  function createTerminal() {
    var win = el('div', 't16-window t16-terminal');
    win.setAttribute('hidden', '');
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Terminal');
    win.dataset.winId = 'terminal';

    var tb = el('div', 't16-titlebar');
    var lights = el('div', 't16-lights');
    var closeB = el('button', 't16-close'); closeB.setAttribute('aria-label', 'Close Terminal');
    var minB = el('button', 't16-min'); minB.setAttribute('aria-label', 'Minimize Terminal');
    var zoomB = el('button', 't16-zoom'); zoomB.setAttribute('aria-label', 'Zoom Terminal');
    lights.appendChild(closeB); lights.appendChild(minB); lights.appendChild(zoomB);
    tb.appendChild(lights);
    tb.appendChild(el('span', 't16-title', 'kiran@rutgers — terminal'));
    win.appendChild(tb);

    var scr = el('div', 't16-term-body');
    win.appendChild(scr);
    var resize = el('div', 't16-resize'); win.appendChild(resize);

    var PROMPT = 'kiran@rutgers ~ %';

    function print(text, cls) {
      var line = el('div', 't16-term-line' + (cls ? ' ' + cls : ''));
      line.textContent = text;
      scr.insertBefore(line, inputLine);
      scr.scrollTop = scr.scrollHeight;
      return line;
    }
    function echoCmd(cmd) {
      var line = el('div', 't16-term-line');
      var p = el('span', 't16-term-dim', PROMPT + ' ');
      line.appendChild(p);
      line.appendChild(doc.createTextNode(cmd));
      scr.insertBefore(line, inputLine);
    }

    var inputLine = el('div', 't16-term-inputline');
    inputLine.appendChild(el('span', 't16-prompt', PROMPT));
    var input = el('input', 't16-term-input');
    input.setAttribute('type', 'text');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('aria-label', 'Terminal input');
    inputLine.appendChild(input);
    scr.appendChild(inputLine);

    // Clicking anywhere in the terminal focuses the input.
    scr.addEventListener('mousedown', function (e) {
      if (window.getSelection && String(window.getSelection())) return; // allow text selection
      if (e.target !== input) setTimeout(function () { input.focus(); }, 0);
    });

    var history = [], hIdx = -1;

    function banner() {
      print('KiranOS 2.0 — toy terminal. Type `help`.', 't16-term-accent');
    }

    var sections = { about: 1, projects: 1, publications: 1, teaching: 1, other: 1 };
    var pages = { publications: 'publications.html', tools: 'tools.html', advice: 'advice.html', comics: 'comic.html', comic: 'comic.html', home: 'index.html' };

    var COMMANDS = {
      help: function () {
        print('Available commands:');
        print('  help                 show this help');
        print('  ls                   list desktop sections');
        print('  open <name>          open a window or subpage (about, projects,');
        print('                       publications, teaching, other, comics, advice, tools)');
        print('  theme <n>            switch to theme n (1–20)');
        print('  mode dark|light      set colour mode');
        print('  whoami               print the tagline');
        print('  clear                clear the screen');
        print('  exit                 close the terminal');
      },
      ls: function () {
        print('about  projects  publications  teaching  other', 't16-term-accent');
        print('comics  advice  terminal');
      },
      open: function (args) {
        var t = (args[0] || '').toLowerCase();
        if (!t) { print('usage: open <section|page>'); return; }
        if (sections[t]) { _openWindow && _openWindow(t); print('opening ' + t + '…', 't16-term-dim'); return; }
        if (t === 'terminal') { print('you are already here.'); return; }
        if (pages[t]) { print('navigating to ' + pages[t] + '…', 't16-term-dim'); var to = setTimeout(function () { window.location.href = pages[t]; }, 350); timers.push(to); return; }
        print('cannot open "' + t + '" (try `ls`)');
      },
      theme: function (args) {
        var n = parseInt(args[0], 10);
        if (!(n >= 1 && n <= 20)) { print('usage: theme <1-20>'); return; }
        if (!window.__theme || !window.__theme.forceTheme) { print('theme engine unavailable.'); return; }
        print('switching to theme ' + n + '… (reloading)', 't16-term-dim');
        var to = setTimeout(function () { window.__theme.forceTheme(n); }, 350);
        timers.push(to);
      },
      mode: function (args) {
        var m = (args[0] || '').toLowerCase();
        if (m !== 'dark' && m !== 'light') { print('usage: mode dark|light'); return; }
        if (!window.__theme || !window.__theme.setMode) { print('mode unavailable.'); return; }
        window.__theme.setMode(m);
        print('mode → ' + m, 't16-term-accent');
      },
      whoami: function () {
        var p = window.PROFILE || {};
        print(p.name || 'Kiran Garimella', 't16-term-accent');
        if (p.role) print(p.role, 't16-term-dim');
        print(p.tagline || 'Researcher.');
      },
      clear: function () {
        var kids = Array.prototype.slice.call(scr.childNodes);
        kids.forEach(function (k) { if (k !== inputLine) scr.removeChild(k); });
      },
      exit: function () { closeWindow('terminal'); },
      // easter eggs
      sudo: function (args) {
        if ((args[0] || '').toLowerCase() === 'tenure') {
          print('Permission granted. Congratulations.', 't16-term-accent');
        } else {
          print('usage: sudo tenure');
        }
      },
      whoareyou: function () { print("I'm KiranOS. Nice to meet you."); }
    };

    function runLine(raw) {
      var cmd = raw.trim();
      echoCmd(cmd);
      if (!cmd) return;
      history.push(cmd); hIdx = history.length;

      // special multi-token easter egg: rm -rf /
      var lc = cmd.toLowerCase().replace(/\s+/g, ' ');
      if (lc === 'rm -rf /' || lc === 'rm -rf /*' || lc === 'sudo rm -rf /') {
        rmRfCascade();
        return;
      }

      var parts = cmd.split(/\s+/);
      var name = parts[0].toLowerCase();
      var args = parts.slice(1);
      if (COMMANDS[name]) {
        try { COMMANDS[name](args); } catch (err) { print('error: ' + (err && err.message || err)); }
      } else {
        print('command not found (try `help`)');
      }
    }

    function rmRfCascade() {
      if (reduced) {
        print('deleting publications… just kidding.', 't16-term-accent');
        return;
      }
      var fakes = [
        'rm: removing publications/… ',
        'rm: removing projects/… ',
        'rm: removing teaching/… ',
        'rm: removing about/me.txt … ',
        'rm: removing tenure_case.pdf … '
      ];
      input.disabled = true;
      var i = 0;
      (function step() {
        if (i < fakes.length) {
          print(fakes[i]);
          i++;
          var to = setTimeout(step, 220);
          timers.push(to);
        } else {
          var to2 = setTimeout(function () {
            print('deleting publications… just kidding.', 't16-term-accent');
            print('nothing was harmed. ☺', 't16-term-dim');
            input.disabled = false;
            input.focus();
          }, 260);
          timers.push(to2);
        }
      })();
    }

    // The terminal input swallows keys ONLY while focused. Because this is a
    // real <input>, the engine's document-level `?`/Escape handler ignores it
    // (it skips INPUT/TEXTAREA), so the global picker still works elsewhere.
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var v = input.value;
        input.value = '';
        runLine(v);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length) { hIdx = Math.max(0, hIdx - 1); input.value = history[hIdx] || ''; }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (history.length) { hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ''; }
      } else if (e.key === 'Escape') {
        // Let the terminal give up focus so the global Escape (teardown) can act
        // on the next press; also stop the key from leaking to the page here.
        e.stopPropagation();
        input.blur();
      }
      // All other keys: do NOT stopPropagation — but since focus is in an input,
      // the engine's ? handler already ignores them. Typing stays local.
    });

    var rec = {
      win: win, body: scr, iconName: 'terminal', title: 'Terminal',
      focusInput: function () { setTimeout(function () { input.focus(); }, 0); }
    };
    closeB.addEventListener('click', function () { closeWindow('terminal'); });
    minB.addEventListener('click', function () { minimizeWindow('terminal'); });
    zoomB.addEventListener('click', function () { zoomWindow('terminal'); });
    tb.addEventListener('dblclick', function (e) { if (!e.target.closest('.t16-lights')) zoomWindow('terminal'); });
    bringToFrontOnPointer(win);
    enableDrag(win, tb, 'terminal');
    enableResize(win, resize);

    banner();
    return rec;
  }

  /* ============================================================
     BOOT SEQUENCE — ~1.6s. Skipped if already booted this session, on
     reduced motion, or on any key/click. Skippable is mandatory.
     ============================================================ */
  function runBootThen(next) {
    var alreadyBooted = false;
    try { alreadyBooted = !!sessionStorage.getItem('t16_booted'); } catch (_) {}
    if (alreadyBooted || reduced) { next(); return; }

    var boot = el('div', 't16-boot');
    var logo = el('div', 't16-boot-logo');
    logo.appendChild(doc.createTextNode('Kiran'));
    logo.appendChild(el('span', null, 'OS'));
    boot.appendChild(logo);
    boot.appendChild(el('div', 't16-boot-sub', 'KiranOS 2.0 — 20 themes installed'));
    var barWrap = el('div', 't16-boot-bar');
    barWrap.appendChild(el('i'));
    boot.appendChild(barWrap);
    boot.appendChild(el('div', 't16-boot-hint', 'press any key to skip'));
    built.push(boot);
    body.appendChild(boot);

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      try { sessionStorage.setItem('t16_booted', '1'); } catch (_) {}
      // remove skip listeners
      doc.removeEventListener('keydown', skip, true);
      doc.removeEventListener('pointerdown', skip, true);
      if (boot.parentNode) boot.parentNode.removeChild(boot);
      next();
    }
    function skip() { finish(); }
    // capture-phase so a click/keypress skips before anything else handles it
    doc.addEventListener('keydown', skip, true);
    doc.addEventListener('pointerdown', skip, true);
    var to = setTimeout(finish, 1600);
    timers.push(to);
  }

  /* ============================================================
     ENTRY — wrap the whole build in try/catch. Any exception → teardown()
     leaves a pixel-normal page.
     ============================================================ */
  function start() {
    try {
      build();
      // Escape and Reader-Mode both restore the page. We listen in the CAPTURE
      // phase so we read the picker's true open/closed state BEFORE the engine's
      // (bubble-phase) handler flips data-open. Without capture, the engine would
      // already have set data-open="false" by the time we read it, and an Escape
      // meant only to close the picker would also tear down the desktop.
      // We never preventDefault, so the engine's picker keeps working.
      addL(doc, 'keydown', function (e) {
        if (e.key !== 'Escape') return;
        // If the theme picker overlay is open, this Escape is closing it — let
        // the engine handle it; do NOT tear down the desktop underneath it.
        var overlay = doc.getElementById('themePicker');
        if (overlay && overlay.getAttribute('data-open') === 'true') return;
        // If focus is inside the terminal input, that handler manages Escape.
        var ae = doc.activeElement;
        if (ae && ae.classList && ae.classList.contains('t16-term-input')) return;
        teardown();
      }, true);
      // Pause the clock when the tab is hidden; resume on show (perf hygiene).
      addL(doc, 'visibilitychange', function () {
        if (tornDown) return;
        if (doc.hidden) { if (clockTimer) { clearInterval(clockTimer); clockTimer = null; } }
        else if (!clockTimer) {
          var c = doc.querySelector('.t16-clock');
          if (c) {
            var tickNow = function () {
              var d = new Date();
              try { c.textContent = d.toLocaleTimeString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' }); }
              catch (_) { c.textContent = d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2); }
            };
            tickNow();
            clockTimer = setInterval(tickNow, 15000);
          }
        }
      });
    } catch (e) {
      // Any mid-build failure: restore everything.
      try { if (window.console && console.warn) console.warn('KiranOS build failed, restoring page:', e); } catch (_) {}
      teardown();
    }
  }

  // content.js has already populated the sections by the time this deferred
  // script runs (it loads after DOMContentLoaded). Boot, then build.
  runBootThen(start);
})();
