/* js/theme-20-wayback.js
 * Wayback — 30 years of the web in one scroll.
 * Homepage: builds the per-era decorations (hero 1994 chrome, about 2001
 * badges, projects 2008 beta/digg chips, footer wink), a fixed year
 * scrubber that tracks scroll position across the six era-sections, and
 * a live visitor counter. Optional: a once-per-session Clippy cameo in
 * the 2001 section, and a cursor sparkle trail confined to the 1994 hero.
 * Subpages: no hero, so only the single-era class + light chrome apply.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '20') return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const html = document.documentElement;

  /* -----------------------------------------------------------------
   * Subpage era lock — set BEFORE anything else queries layout classes.
   * Maps a handful of known filenames to a single era; falls back to
   * the CSS default (2013 flat) for anything unrecognized, matching
   * the no-JS behavior exactly.
   * --------------------------------------------------------------- */
  (function setSubpageEra() {
    const path = (location.pathname || '').toLowerCase();
    const map = [
      [/publications(\d*)\.html?$/, 'pubs2013'],
      [/tools\.html?$/, 'tools2008'],
      [/advice\.html?$/, 'advice2001'],
      [/comic(_template)?\.html?$/, 'comic1994'],
    ];
    for (const [re, tag] of map) {
      if (re.test(path)) { html.dataset.t20page = tag; return; }
    }
    // Homepage or any other page: leave unset (base/flat rules apply harmlessly).
  })();

  const isHomepage = !!document.querySelector('.hero-bg');

  /* -----------------------------------------------------------------
   * Small helper: append a node once, guarding against double-inserts
   * if this script somehow runs twice.
   * --------------------------------------------------------------- */
  function appendOnce(parent, className, build) {
    if (!parent || parent.querySelector('.' + className)) return null;
    const node = build();
    parent.appendChild(node);
    return node;
  }

  /* ===================================================================
   * HERO (1994) decorations — homepage only.
   * ================================================================= */
  if (isHomepage) {
    const heroSection = document.querySelector('section[data-section="hero"]');
    const heroText = document.querySelector('.hero-text');
    const heroName = document.getElementById('heroName');

    // "NEW!" blinking badge next to the name.
    if (heroName && !heroName.querySelector('.t20-new-badge')) {
      const badge = document.createElement('span');
      badge.className = 't20-new-badge';
      badge.textContent = 'NEW!';
      badge.setAttribute('aria-hidden', 'true');
      heroName.appendChild(badge);
    }

    // Visitor counter — random 6-digit seed, ticks up while hero is visible.
    let counterEl = null;
    if (heroText) {
      appendOnce(heroText, 't20-counter-wrap', () => {
        const wrap = document.createElement('div');
        wrap.className = 't20-counter-wrap';
        const label = document.createElement('span');
        label.textContent = 'YOU ARE VISITOR NUMBER';
        const digits = document.createElement('div');
        digits.className = 't20-counter';
        digits.setAttribute('aria-live', 'off');
        counterEl = digits;
        wrap.appendChild(label);
        wrap.appendChild(digits);
        return wrap;
      });
      counterEl = heroText.querySelector('.t20-counter');
    }
    if (counterEl) {
      let count = 100000 + Math.floor(Math.random() * 800000);
      const render = () => { counterEl.textContent = String(count).padStart(6, '0'); };
      render();

      if (!reduced) {
        let visible = false;
        let timer = null;
        const startTicking = () => {
          if (timer) return;
          timer = setInterval(() => {
            count += 1 + Math.floor(Math.random() * 3);
            render();
          }, 2600);
        };
        const stopTicking = () => { if (timer) { clearInterval(timer); timer = null; } };

        if ('IntersectionObserver' in window && heroSection) {
          const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
              visible = e.isIntersecting;
              if (visible && !document.hidden) startTicking(); else stopTicking();
            });
          }, { threshold: 0.15 });
          io.observe(heroSection);
        } else {
          visible = true;
          if (!document.hidden) startTicking();
        }
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) stopTicking(); else if (visible) startTicking();
        });
      }
    }

    // Ridge divider + under-construction stripe bar beneath the hero content.
    if (heroText) {
      appendOnce(heroText, 't20-hr', () => {
        const hr = document.createElement('hr');
        hr.className = 't20-hr';
        return hr;
      });
      appendOnce(heroText, 't20-construction', () => {
        const bar = document.createElement('div');
        bar.className = 't20-construction';
        bar.setAttribute('role', 'img');
        bar.setAttribute('aria-label', 'Site under construction');
        return bar;
      });
    }
  }

  /* ===================================================================
   * ABOUT (2001) decorations — 88x31-style badge row. Present on the
   * homepage; skipped entirely if the section doesn't exist (subpages).
   * ================================================================= */
  (function aboutBadges() {
    const aboutBody = document.getElementById('aboutBody');
    if (!aboutBody) return;
    appendOnce(aboutBody, 't20-badgerow', () => {
      const row = document.createElement('div');
      row.className = 't20-badgerow';
      row.setAttribute('aria-hidden', 'true');
      const labels = ['W3C VALID', 'BEST VIEWED\n800×600', 'RSS 2.0'];
      labels.forEach((text, i) => {
        const b = document.createElement('div');
        b.className = 't20-badge88' + (i === 2 ? ' t20-badge-alt' : '');
        b.textContent = text;
        row.appendChild(b);
      });
      return row;
    });
  })();

  /* ===================================================================
   * PROJECTS (2008) decorations — BETA badge on the heading, faux
   * "Digg this" chip after the cards.
   * ================================================================= */
  (function projectsChrome() {
    const section = document.querySelector('section[data-section="projects"]');
    if (!section) return;
    const heading = section.querySelector('.section-heading');
    if (heading && !heading.querySelector('.t20-beta')) {
      const beta = document.createElement('span');
      beta.className = 't20-beta';
      beta.textContent = 'BETA';
      beta.setAttribute('aria-hidden', 'true');
      heading.appendChild(beta);
    }
    const body = section.querySelector('.section-body');
    if (body) {
      appendOnce(body, 't20-digg', () => {
        const chip = document.createElement('span');
        chip.className = 't20-digg';
        chip.textContent = 'Digg this';
        chip.setAttribute('aria-hidden', 'true');
        return chip;
      });
    }
  })();

  /* ===================================================================
   * FOOTER — tiny wink line, present everywhere the footer exists.
   * ================================================================= */
  (function footerWink() {
    const footer = document.querySelector('.site-footer');
    if (!footer || !footer.parentNode) return;
    if (document.querySelector('.t20-footer-wink')) return;
    const wink = document.createElement('p');
    wink.className = 't20-footer-wink';
    wink.textContent = "you've reached the present · reload for another timeline";
    footer.parentNode.insertBefore(wink, footer.nextSibling);
  })();

  /* ===================================================================
   * YEAR SCRUBBER — homepage only (it tracks era-sections that only
   * exist there). Fixed right edge, hidden <=760px via CSS. Marker
   * interpolates by scroll position between section anchors; clicking
   * a year smooth-scrolls to it. rAF-throttled passive scroll listener,
   * paused via IntersectionObserver-free cheap visibility check.
   * ================================================================= */
  if (isHomepage) {
    const ERAS = [
      { year: '1994', section: 'hero' },
      { year: '2001', section: 'about' },
      { year: '2008', section: 'projects' },
      { year: '2013', section: 'publications' },
      { year: '2019', section: 'teaching' },
      { year: '2026', section: 'other' },
    ];
    const sections = ERAS.map(e => document.querySelector(`section[data-section="${e.section}"]`));
    if (sections.every(Boolean)) {
      const scrubber = document.createElement('nav');
      scrubber.className = 't20-scrubber';
      scrubber.setAttribute('aria-label', 'Jump to era');
      const buttons = ERAS.map((e, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 't20-scrubber-year';
        btn.textContent = e.year;
        btn.dataset.active = i === 0 ? 'true' : 'false';
        btn.addEventListener('click', () => {
          sections[i].scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        });
        scrubber.appendChild(btn);
        return btn;
      });
      document.body.appendChild(scrubber);

      let active = 0;
      const setActive = (idx) => {
        if (idx === active) return;
        buttons[active].dataset.active = 'false';
        buttons[idx].dataset.active = 'true';
        active = idx;
      };

      if (reduced) {
        // Static but still functional: highlight nearest section once, no scroll loop.
        setActive(0);
      } else {
        let ticking = false;
        let paused = document.hidden;
        const updateActive = () => {
          ticking = false;
          if (paused) return;
          const mid = window.innerHeight / 2;
          let closestIdx = 0;
          let closestDist = Infinity;
          sections.forEach((s, i) => {
            const r = s.getBoundingClientRect();
            const center = r.top + r.height / 2;
            const dist = Math.abs(center - mid);
            if (r.top <= mid && r.bottom >= 0 && dist < closestDist) {
              closestDist = dist;
              closestIdx = i;
            }
          });
          // Fallback: if nothing straddles mid-viewport (e.g. very short viewport),
          // pick whichever section's top is closest above mid.
          if (closestDist === Infinity) {
            sections.forEach((s, i) => {
              const top = s.getBoundingClientRect().top;
              if (top <= mid) closestIdx = i;
            });
          }
          setActive(closestIdx);
        };
        const onScroll = () => {
          if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateActive);
          }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        document.addEventListener('visibilitychange', () => {
          paused = document.hidden;
          if (!paused) onScroll();
        });
        updateActive();
      }
    }
  }

  /* ===================================================================
   * CLIPPY CAMEO (optional) — About/2001 section, once per session,
   * dismissible, never blocks reading, skipped under reduced motion.
   * ================================================================= */
  (function clippy() {
    if (reduced) return;
    if (!isHomepage) return;
    const aboutSection = document.querySelector('section[data-section="about"]');
    if (!aboutSection) return;
    let shown = false;
    try {
      if (sessionStorage.getItem('t20_clippy_seen')) return;
    } catch (_) { /* storage unavailable — fall through and show once, best-effort */ }

    function markSeen() {
      try { sessionStorage.setItem('t20_clippy_seen', '1'); } catch (_) { /* ignore */ }
    }

    function showClippy() {
      if (shown) return;
      shown = true;
      markSeen();
      const box = document.createElement('div');
      box.className = 't20-clippy';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-label', 'Assistant');
      box.innerHTML =
        '<div class="t20-clippy-face" aria-hidden="true">📎</div>' +
        '<p>It looks like you’re reading about misinformation research. Need help?</p>';
      const actions = document.createElement('div');
      actions.className = 't20-clippy-actions';
      ['Yes', 'No'].forEach((label) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = label;
        btn.addEventListener('click', () => {
          if (box.parentNode) box.parentNode.removeChild(box);
        });
        actions.appendChild(btn);
      });
      box.appendChild(actions);
      document.body.appendChild(box);
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            showClippy();
            io.disconnect();
          }
        });
      }, { threshold: 0.4 });
      io.observe(aboutSection);
    }
    // No IO support: skip silently rather than force it in — this feature is optional.
  })();

  /* ===================================================================
   * SPARKLE CURSOR TRAIL (optional) — 1994 hero only, desktop only,
   * element-scoped pointermove, capped at 12 live nodes.
   * ================================================================= */
  (function sparkleTrail() {
    if (reduced) return;
    if (!isHomepage) return;
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouch) return;
    const heroSection = document.querySelector('section[data-section="hero"]');
    if (!heroSection) return;

    const MAX_NODES = 12;
    let live = [];
    let lastSpawn = 0;

    heroSection.addEventListener('pointermove', (e) => {
      const now = performance.now();
      if (now - lastSpawn < 60) return; // throttle spawn rate, not just node count
      lastSpawn = now;

      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const s = document.createElement('span');
      s.className = 't20-sparkle';
      s.textContent = '✦';
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      heroSection.appendChild(s);
      live.push(s);

      if (live.length > MAX_NODES) {
        const old = live.shift();
        if (old.parentNode) old.parentNode.removeChild(old);
      }
      s.addEventListener('animationend', () => {
        if (s.parentNode) s.parentNode.removeChild(s);
        live = live.filter((n) => n !== s);
      });
    }, { passive: true });
  })();
})();
