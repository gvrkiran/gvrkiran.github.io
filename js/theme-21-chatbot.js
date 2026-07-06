/* js/theme-21-chatbot.js
 * Theme 21 — Chatbot ("the site as a conversation"). Layout: L1.
 *
 * The homepage boots into a full-screen messenger: a header ("Kiran Garimella
 * · online"), a scrollable thread, always-visible suggestion chips, and a
 * working input. A scripted "bot" (NO network, NOT a real LLM) answers with
 * real content pulled from the data.js globals — projects, publications,
 * teaching, contact — rendered as chat bubbles with timestamps and ✓✓ ticks.
 *
 * This theme MAY hide the normal flow while the chat UI is active (like theme
 * 16), but it NEVER moves or deletes existing DOM nodes. The chat UI is built
 * entirely from appended t21- nodes; a body[data-t21="on"] flag drives CSS that
 * hides <main>/<footer>/<nav>. teardown() removes every t21- node and clears
 * the flag, restoring a pixel-normal page. The whole build is wrapped in
 * try/catch so any mid-build exception triggers the same teardown.
 *
 * Tiers:
 *   Desktop  — full messenger, centered column.
 *   Mobile   — full-viewport chat app; input fixed above keyboard; chips scroll.
 *   Reduced  — no typing delay, no bubble animation; messages render instantly.
 *   No-JS    — this file never runs; CSS alone styles the normal page with
 *              bubble-styled cards (full legibility). We also bail on subpages
 *              (guard on .hero-section) so only the homepage builds the app.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '21') return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var doc = document;
  var body = doc.body;

  /* Homepage detection: the chat app needs the hero. Subpages lack it → the
     CSS-only bubble dressing stands and this script does nothing. */
  var hero = doc.querySelector('.hero-section, [data-section="hero"]');
  if (!hero) return;

  /* ---- Bookkeeping for an exact teardown (theme-16 discipline). ---- */
  var built = [];      // every t21- root node we append, for cleanup
  var listeners = [];  // { target, type, fn, opts } global listeners to remove
  var timers = [];     // pending timeouts to clear
  var tornDown = false;

  function addL(target, type, fn, opts) {
    target.addEventListener(type, fn, opts);
    listeners.push({ target: target, type: type, fn: fn, opts: opts });
  }
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }

  function el(tag, cls, txt) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }

  /* ---- Data (read-only; may be short/absent, so guard everything). ---- */
  var P = window.PROFILE || {};
  var S = P.socials || {};
  var PROJECTS = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];
  var PUBS = Array.isArray(window.PUBLICATIONS) ? window.PUBLICATIONS : [];
  var TEACH = Array.isArray(window.TEACHING) ? window.TEACHING : [];

  /* ============================================================
     TEARDOWN — restore the normal page. Idempotent; reused by the
     catch block and by Escape / "classic site".
     ============================================================ */
  function teardown() {
    if (tornDown) return;
    tornDown = true;
    for (var t = 0; t < timers.length; t++) { try { clearTimeout(timers[t]); } catch (_) {} }
    timers.length = 0;
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i].target.removeEventListener(listeners[i].type, listeners[i].fn, listeners[i].opts); } catch (_) {}
    }
    listeners.length = 0;
    for (var b = 0; b < built.length; b++) {
      var node = built[b];
      if (node && node.parentNode) { try { node.parentNode.removeChild(node); } catch (_) {} }
    }
    built.length = 0;
    delete body.dataset.t21; // CSS reveals main/footer/nav again
  }

  /* ============================================================
     RENDERING HELPERS
     ============================================================ */
  var thread; // set in build()

  function nowTime() {
    var d = new Date();
    var h = d.getHours(), m = d.getMinutes();
    var ap = h >= 12 ? 'PM' : 'AM';
    var hh = h % 12; if (hh === 0) hh = 12;
    return hh + ':' + (m < 10 ? '0' + m : m) + ' ' + ap;
  }

  function scrollThread() {
    if (thread) thread.scrollTop = thread.scrollHeight;
  }

  // Build one bubble row. `html` is TRUSTED (local data / our own strings).
  function makeRow(side, html) {
    var row = el('div', 't21-row ' + (side === 'out' ? 't21-out' : 't21-in'));
    var bubble = el('div', 't21-bubble');
    bubble.innerHTML = html;
    var time = el('span', 't21-time');
    time.appendChild(doc.createTextNode(nowTime()));
    if (side === 'out') {
      var ticks = el('span', 't21-ticks', '✓✓');
      time.appendChild(ticks);
    }
    bubble.appendChild(time);
    row.appendChild(bubble);
    return row;
  }

  function appendUser(text) {
    if (!thread) return;
    thread.appendChild(makeRow('out', escapeHtml(text)));
    scrollThread();
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* Typing indicator → then a real bot bubble. Under reduced motion the bubble
     appears instantly (no dots, no delay). Sequenced sends chain via `after`. */
  var typingRow = null;
  function showTyping() {
    if (reduced || !thread) return;
    typingRow = el('div', 't21-row t21-in t21-typing');
    var b = el('div', 't21-bubble');
    b.appendChild(el('i')); b.appendChild(el('i')); b.appendChild(el('i'));
    typingRow.appendChild(b);
    thread.appendChild(typingRow);
    scrollThread();
  }
  function clearTyping() {
    if (typingRow && typingRow.parentNode) typingRow.parentNode.removeChild(typingRow);
    typingRow = null;
  }

  // Emit a single bot bubble after a length-proportional typing pause.
  function botSay(html, after) {
    if (!thread) return;
    if (reduced) {
      thread.appendChild(makeRow('in', html));
      scrollThread();
      if (after) after();
      return;
    }
    showTyping();
    var plain = html.replace(/<[^>]+>/g, '');
    var delay = Math.min(900, Math.max(500, 320 + plain.length * 9));
    later(function () {
      clearTyping();
      thread.appendChild(makeRow('in', html));
      scrollThread();
      if (after) after();
    }, delay);
  }

  // Emit a sequence of bot bubbles one after another (each waits for the prior).
  function botSequence(items, done) {
    var i = 0;
    (function step() {
      if (i >= items.length) { if (done) done(); return; }
      var html = items[i++];
      botSay(html, step);
    })();
  }

  /* ============================================================
     CONTENT BUILDERS — turn real data into bubble HTML strings.
     ============================================================ */
  function link(href, label, external) {
    if (!href) return escapeHtml(label);
    var ext = external === false ? '' : ' target="_blank" rel="noopener"';
    return '<a href="' + escapeHtml(href) + '"' + ext + '>' + escapeHtml(label) + '</a>';
  }

  function projectBubbles() {
    var out = [];
    var list = PROJECTS.slice(0, 4);
    if (!list.length) { return ["I study information ecosystems, misinformation, and AI for the public good — but my project list didn't load. Try the " + link('back_research.html', 'research page') + "."]; }
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      out.push('<strong>' + escapeHtml(p.title || 'Project') + '</strong><br>' + escapeHtml(p.summary || ''));
    }
    out.push('That’s the short version. ' + link('#projects', 'More on the projects page →', false));
    return out;
  }

  function paperBubbles() {
    var out = [];
    var list = PUBS.slice(0, 4);
    if (!list.length) { return ["My publication list didn't load here — the full list lives on the " + link('publications.html', 'publications page →') + "."]; }
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      var href = (p.links && p.links[0] && p.links[0].href) ? p.links[0].href : null;
      var yr = (p.year != null && p.year !== 'Unpublished') ? String(p.year) : (p.status || '');
      var meta = escapeHtml(p.venue || '') + (yr ? ' · ' + escapeHtml(yr) : '');
      out.push((href ? '<strong>' + link(href, p.title) + '</strong>' : '<strong>' + escapeHtml(p.title) + '</strong>') +
               '<span class="t21-meta">' + meta + '</span>');
    }
    out.push('There are 100+ more where those came from. ' + link('publications.html', 'See the full list →'));
    return out;
  }

  function teachingBubbles() {
    var out = [];
    if (!TEACH.length) { return ["Course materials are coming online soon."]; }
    for (var i = 0; i < TEACH.length; i++) {
      var t = TEACH[i];
      // t.info is trusted local HTML (contains inline anchors) — render as-is.
      out.push('<strong>' + escapeHtml(t.course || t.title || '') + '</strong>' +
               (t.term ? '<span class="t21-meta">' + escapeHtml(t.term) + '</span>' : '') +
               '<p style="margin-top:.35rem">' + (t.info || t.summary || '') + '</p>');
    }
    return out;
  }

  function funBubbles() {
    var blog = P.blog || S.substack || null;
    var out = [
      'I draw comics about academic life, parenting, and AI — have a look: ' + link('comic.html', 'the comics page →'),
      'I also build public tools and demos from the research: ' + link('tools.html', 'tools →')
    ];
    if (blog) out.push('And I write longer-form thoughts on Substack: ' + link(blog, 'the blog →'));
    return out;
  }

  function contactBubbles() {
    var out = [];
    if (P.email) out.push('The best way to reach me is email: ' + link('mailto:' + P.email, P.email, false));
    var socials = [];
    if (S.scholar) socials.push(link(S.scholar, 'Google Scholar'));
    if (S.linkedin) socials.push(link(S.linkedin, 'LinkedIn'));
    if (S.twitter) socials.push(link(S.twitter, 'Twitter / X'));
    if (S.github) socials.push(link(S.github, 'GitHub'));
    if (socials.length) out.push('Elsewhere: ' + socials.join(' · '));
    var cv = P.cvUrl || S.cv;
    if (cv) out.push('My CV is ' + link(cv, 'right here →') + '.');
    if (!out.length) out.push("You can reach me through the links on the homepage.");
    return out;
  }

  function aboutBubbles() {
    var line = (P.tagline || 'I study information ecosystems, misinformation, and AI for the public good.');
    var meta = (P.role || '') + (P.location ? ' · ' + P.location : '');
    return [
      escapeHtml(line),
      escapeHtml(meta) + '. Ask me about my research, papers, teaching, or the fun stuff — or hit ' +
        link('publications.html', 'the full site', true) + '.'
    ];
  }

  /* ---- Fallbacks (rotated) — never pretend to be a real LLM. ---- */
  var fallbacks = [
    "I’m a static website doing my best AI impression 😅 — try one of the buttons below.",
    "That one’s beyond my script! I only know Kiran’s research, papers, teaching, and contact. Tap a chip below 👇",
    "Ha — I’m not a real chatbot, just a friendly menu in disguise. The buttons below actually work, though!"
  ];
  var fbIdx = 0;

  /* ============================================================
     ROUTING
     ============================================================ */
  var HANDLERS = {
    research: function () { botSequence(projectBubbles()); },
    papers: function () { botSequence(paperBubbles()); },
    teaching: function () { botSequence(teachingBubbles()); },
    fun: function () { botSequence(funBubbles()); },
    contact: function () { botSequence(contactBubbles()); },
    about: function () { botSequence(aboutBubbles()); },
    greeting: function () { botSay('Hey! 👋 Good to see you. What would you like to know — research, papers, teaching, or how to reach me?'); },
    fullsite: function () { botSay('Sure — switching you back to the classic site…', function () { later(teardown, 250); }); }
  };

  // Route free text (case-insensitive) to a handler; else a rotated fallback.
  function route(text) {
    var q = text.toLowerCase();
    if (/\b(hi|hello|hey|yo|namaste)\b/.test(q)) { HANDLERS.greeting(); return; }
    if (/(who|about|yourself|bio|kiran)/.test(q)) { HANDLERS.about(); return; }
    if (/(paper|publi|research|work|study|studies)/.test(q)) {
      // "research" leans to projects; "paper/publication" leans to the paper list.
      if (/(paper|publi)/.test(q)) HANDLERS.papers(); else HANDLERS.research();
      return;
    }
    if (/(teach|class|course|syllab|student)/.test(q)) { HANDLERS.teaching(); return; }
    if (/(comic|fun|tool|blog|substack|draw)/.test(q)) { HANDLERS.fun(); return; }
    if (/(contact|email|reach|cv|resume|hire|connect)/.test(q)) { HANDLERS.contact(); return; }
    botSay(escapeHtml(fallbacks[fbIdx % fallbacks.length]));
    fbIdx++;
  }

  // Chips map a label → the user message it sends + the handler to run.
  var CHIPS = [
    { label: 'What do you research?', send: 'What do you research?', run: HANDLERS.research },
    { label: 'Recent papers', send: 'Show me recent papers', run: HANDLERS.papers },
    { label: 'Teaching', send: 'What do you teach?', run: HANDLERS.teaching },
    { label: 'Fun stuff', send: 'Show me the fun stuff', run: HANDLERS.fun },
    { label: 'Contact', send: 'How can I contact you?', run: HANDLERS.contact },
    { label: 'Full site', send: 'Take me to the full site', run: HANDLERS.fullsite }
  ];

  /* ============================================================
     BUILD
     ============================================================ */
  function build() {
    var app = el('div', 't21-app');
    app.setAttribute('role', 'application');
    app.setAttribute('aria-label', 'Chat with Kiran');
    built.push(app);

    /* ---- Header ---- */
    var header = el('div', 't21-header');
    var avatar = doc.createElement('img');
    avatar.className = 't21-avatar';
    avatar.src = (P.photo || 'kiran_img.png');
    avatar.alt = 'Kiran Garimella';
    avatar.setAttribute('decoding', 'async');
    header.appendChild(avatar);

    var idBox = el('div', 't21-id');
    idBox.appendChild(el('span', 't21-id-name', P.name || 'Kiran Garimella'));
    var status = el('span', 't21-id-status');
    status.appendChild(el('span', 't21-dot'));
    status.appendChild(doc.createTextNode('online'));
    idBox.appendChild(status);
    header.appendChild(idBox);

    header.appendChild(el('span', 't21-spacer'));

    var exitBtn = el('button', 't21-exit');
    exitBtn.setAttribute('type', 'button');
    exitBtn.setAttribute('title', 'Return to the classic site');
    exitBtn.appendChild(doc.createTextNode('↺ '));
    exitBtn.appendChild(el('span', 't21-exit-label', 'classic site'));
    exitBtn.addEventListener('click', teardown);
    header.appendChild(exitBtn);
    app.appendChild(header);

    /* ---- Thread ---- */
    thread = el('div', 't21-thread');
    thread.setAttribute('role', 'log');
    thread.setAttribute('aria-live', 'polite');
    thread.setAttribute('aria-label', 'Conversation');
    thread.setAttribute('tabindex', '0');
    // day stamp
    var stamp = el('div', 't21-daystamp');
    try {
      stamp.textContent = new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
    } catch (_) { stamp.textContent = 'Today'; }
    thread.appendChild(stamp);
    app.appendChild(thread);

    /* ---- Composer: chips + input row ---- */
    var composer = el('div', 't21-composer');

    var chips = el('div', 't21-chips');
    chips.setAttribute('role', 'group');
    chips.setAttribute('aria-label', 'Suggested questions');
    CHIPS.forEach(function (c) {
      var b = el('button', 't21-chip', c.label);
      b.setAttribute('type', 'button');
      b.addEventListener('click', function () {
        appendUser(c.send);
        c.run();
      });
      chips.appendChild(b);
    });
    composer.appendChild(chips);

    var inputRow = el('div', 't21-inputrow');
    var label = el('label', 'visually-hidden', 'Type a message');
    label.setAttribute('for', 't21-input');
    inputRow.appendChild(label);

    var input = doc.createElement('input');
    input.className = 't21-input';
    input.id = 't21-input';
    input.type = 'text';
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('placeholder', 'Type a message…');
    input.setAttribute('aria-label', 'Type a message');
    inputRow.appendChild(input);

    var send = el('button', 't21-send');
    send.setAttribute('type', 'button');
    send.setAttribute('aria-label', 'Send message');
    send.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    inputRow.appendChild(send);
    composer.appendChild(inputRow);
    app.appendChild(composer);

    function submit() {
      var v = input.value.trim();
      if (!v) return;
      input.value = '';
      appendUser(v);
      route(v);
    }
    send.addEventListener('click', submit);
    // Enter submits. This is a real <input>, so the engine's document-level
    // `?`/Escape handler already ignores keystrokes here — typed `?` goes into
    // the field natively, and we don't stop propagation for other keys.
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submit(); }
    });

    /* ---- Insert app + flip the flag (CSS hides the normal flow). ---- */
    body.appendChild(app);
    body.dataset.t21 = 'on';

    /* ---- Keep the thread pinned to newest when the mobile keyboard resizes
            the visual viewport. ---- */
    if (window.visualViewport) {
      addL(window.visualViewport, 'resize', scrollThread);
    }
    addL(window, 'resize', scrollThread);

    /* ---- Opening sequence (auto-plays once). ---- */
    var openers = [
      'Hey! 👋 I’m Kiran — or at least, my website is.',
      escapeHtml(P.tagline || 'I study information ecosystems, misinformation, and AI for the public good.') +
        (P.role ? '<span class="t21-meta">' + escapeHtml(P.role) + '</span>' : '') +
        '<p style="margin-top:.35rem">Ask me anything, or tap a suggestion below 👇</p>'
    ];
    botSequence(openers);
  }

  /* ============================================================
     ENTRY — build inside try/catch; any failure restores the page.
     ============================================================ */
  function start() {
    try {
      build();

      // Escape restores the page — but ONLY when the input is NOT focused
      // (so users can type normally) and when the ? picker is NOT open (that
      // Escape belongs to the picker). We listen in the capture phase to read
      // the picker's true open state before the engine flips it, mirroring
      // theme 16; we never preventDefault, so the picker keeps working.
      addL(doc, 'keydown', function (e) {
        if (e.key !== 'Escape') return;
        var overlay = doc.getElementById('themePicker');
        if (overlay && overlay.getAttribute('data-open') === 'true') return;
        var ae = doc.activeElement;
        if (ae && ae.classList && ae.classList.contains('t21-input')) return;
        teardown();
      }, true);

      // Perf hygiene: nothing loops here (typing dots are pure CSS and finite),
      // but keep parity with the brief — pause any pending typing timers while
      // the tab is hidden so bubbles don't pile up unseen, and flush on return.
      addL(doc, 'visibilitychange', function () {
        if (tornDown) return;
        if (doc.hidden) { clearTyping(); }
        else { scrollThread(); }
      });
    } catch (e) {
      try { if (window.console && console.warn) console.warn('Chatbot build failed, restoring page:', e); } catch (_) {}
      teardown();
    }
  }

  // content.js has already populated the page by the time this deferred script
  // runs. Build immediately.
  start();
})();
