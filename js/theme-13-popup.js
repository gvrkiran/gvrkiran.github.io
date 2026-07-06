/* js/theme-13-popup.js
 * Pop-Up (paper theater). Homepage: each content section "folds open" like
 * a pop-up book spread as it scrolls into view (CSS does the transform;
 * this script only toggles a class via IntersectionObserver). Adds three
 * slow drifting paper-bird silhouettes as ambient decoration.
 *
 * No-JS safety: the folded starting state in CSS lives entirely behind
 * `html.t13-js`, which is the very first thing this script does. If this
 * file never loads, or reduced-motion bails before that line runs, the
 * class is never added and the page renders fully open and static.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '13') return;

  const html = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reduced motion: bail BEFORE adding the js-gate class, so CSS never
  // folds anything and the page stays fully open/static (birds included).
  if (reduced) return;

  // From here on the CSS folded/hidden states become active — do this
  // first, before any observers are wired up.
  html.classList.add('t13-js');

  /* ---------------- Section fold-open (homepage only) ---------------- */
  const sections = document.querySelectorAll('main section.section[data-section]');
  if (sections.length) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('t13-open');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25, rootMargin: '0px 0px -8% 0px' }
      );
      sections.forEach((s) => {
        // The hero is already "open" (it's the book cover) — CSS exempts
        // it from the folded state, so observing it is harmless but
        // unnecessary. Skip it to keep the observer list tight.
        if (s.classList.contains('hero-section')) return;
        io.observe(s);
      });
    } else {
      // No IntersectionObserver support: open everything immediately
      // rather than leaving content permanently folded/invisible.
      sections.forEach((s) => s.classList.add('t13-open'));
    }
  }

  /* ---------------- Drifting paper birds (ambient decoration) ---------------- */
  // Only worth adding on the homepage hero; subpages have no tall hero
  // canvas for them to cross and no .hero-bg to anchor near.
  const isHomepage = !!document.querySelector('.hero-bg');
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (isHomepage) {
    addBirds();
  }

  function birdSVG(fill) {
    // Simple origami-style bird: a folded diamond body + wing crease.
    return (
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 40'>" +
      "<path d='M32 4 L58 20 L32 36 L28 20 Z' fill='" + fill + "'/>" +
      "<path d='M32 4 L28 20 L6 14 Z' fill='" + fill + "' opacity='0.75'/>" +
      "</svg>"
    );
  }

  function addBirds() {
    const layer = document.createElement('div');
    layer.className = 't-fixed-layer t13-birds';
    layer.setAttribute('aria-hidden', 'true');

    // Colors read once from CSS custom properties so light/dark both work;
    // birds are decorative silhouettes, not brand-accurate assets, so a
    // static read at creation time (rather than a live subscription) is
    // sufficient — a mode flip mid-flight just means the next bird spawn
    // (on reload) picks up the new palette, which is an acceptable trade
    // given how subtle and slow these are.
    const cs = getComputedStyle(html);
    const dark = html.getAttribute('data-mode') === 'dark';
    const fill = dark
      ? (cs.getPropertyValue('--color-accent-2').trim() || '#c9452c')
      : (cs.getPropertyValue('--color-fg').trim() || '#2b2117');

    const specs = [
      { top: '14%', dur: 92, delay: 0,   size: 46, dir: 'normal',  op: dark ? 0.16 : 0.10 },
      { top: '38%', dur: 118, delay: -30, size: 34, dir: 'reverse', op: dark ? 0.12 : 0.07 },
      { top: '62%', dur: 105, delay: -70, size: 40, dir: 'normal',  op: dark ? 0.14 : 0.09 },
    ];

    specs.forEach((s, i) => {
      const bird = document.createElement('div');
      bird.className = 't13-bird';
      bird.style.top = s.top;
      bird.style.width = s.size + 'px';
      bird.style.height = (s.size * 0.625) + 'px';
      bird.style.opacity = String(s.op);
      bird.style.backgroundImage = "url(\"" + birdSVG(fill) + "\")";
      bird.style.animationDuration = s.dur + 's';
      bird.style.animationDelay = s.delay + 's';
      bird.style.animationDirection = s.dir;
      layer.appendChild(bird);
    });

    document.body.appendChild(layer);

    // Inject the keyframe + per-bird styling once, scoped under the
    // theme's data-theme attribute so it can't leak into other themes.
    const style = document.createElement('style');
    style.textContent =
      'html[data-theme="13"] .t13-birds{overflow:hidden;}' +
      'html[data-theme="13"] .t13-bird{position:absolute;left:-10%;background-repeat:no-repeat;background-size:contain;will-change:transform;animation-name:t13-drift;animation-timing-function:linear;animation-iteration-count:infinite;}' +
      '@keyframes t13-drift{from{transform:translateX(0) translateY(0);}25%{transform:translateX(30vw) translateY(-14px);}50%{transform:translateX(60vw) translateY(6px);}75%{transform:translateX(90vw) translateY(-8px);}to{transform:translateX(120vw) translateY(0);}}';
    document.head.appendChild(style);

    // Pause the (cheap, CSS-only) drift when the tab is hidden — costs
    // nothing to check, keeps the invariant that nothing animates
    // needlessly off-screen/backgrounded.
    document.addEventListener('visibilitychange', () => {
      layer.style.animationPlayState = document.hidden ? 'paused' : 'running';
      layer.querySelectorAll('.t13-bird').forEach((b) => {
        b.style.animationPlayState = document.hidden ? 'paused' : 'running';
      });
    });

    // Touch/coarse-pointer devices: keep birds (they're cheap CSS
    // transforms, not canvas/WebGL) but slow slightly isn't necessary —
    // the durations above are already mobile-safe. Nothing to branch on
    // here beyond what reduced-motion already handles.
    void isTouch;
  }
})();
