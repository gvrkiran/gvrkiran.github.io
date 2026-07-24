/* js/theme-26-terracotta.js
 * Theme 26 — Terracotta. Layout L4.
 * Injects a muted, looping, controls-free background video into the hero and a
 * scroll-down cue centered at the bottom. Homepage only (needs .hero-bg).
 * Respects prefers-reduced-motion: the video is still inserted for its poster
 * frame, but never auto-plays or animates.
 */
(function () {
  'use strict';
  if (document.documentElement.getAttribute('data-theme') !== '26') return;

  const heroBg = document.querySelector('.hero-section .hero-bg');
  if (!heroBg) return; // subpages have no hero — CSS still styles them

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const POSTER = 'assets/terracotta/hero-poster.jpg';

  /* ---------------- Background video ---------------- */
  const video = document.createElement('video');
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('disablepictureinpicture', '');
  video.setAttribute('poster', POSTER);
  video.loop = true;
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute('muted', '');
  video.controls = false;
  video.tabIndex = -1;
  video.preload = reduced ? 'none' : 'auto';
  if (!reduced) video.autoplay = true;

  [
    ['assets/terracotta/hero.webm', 'video/webm'],
    ['assets/terracotta/hero.mp4', 'video/mp4'],
  ].forEach(function (s) {
    const source = document.createElement('source');
    source.src = s[0];
    source.type = s[1];
    video.appendChild(source);
  });

  // Insert as the first child so the CSS ::after scrim paints on top of it.
  heroBg.insertBefore(video, heroBg.firstChild);

  if (!reduced) {
    const tryPlay = function () {
      if (!video.paused) return;
      const p = video.play();
      if (p && typeof p.catch === 'function') {
        // Autoplay blocked (e.g. loaded in a hidden tab) — poster stays until visible.
        p.catch(function () {});
      }
    };
    if (video.readyState >= 2) tryPlay();
    else video.addEventListener('loadeddata', tryPlay, { once: true });
    // Browsers defer autoplay while the tab is hidden; resume when it's shown.
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') tryPlay();
    });
  }

  /* ---------------- Scroll-down cue ---------------- */
  const heroInner = document.querySelector('.hero-section .hero-inner');
  if (heroInner) {
    const target =
      document.getElementById('about') ||
      document.querySelector('main section.section:not(.hero-section)');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 't26-scroll';
    btn.setAttribute('aria-label', 'Scroll to content');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M6 9l6 6 6-6"/></svg>';
    btn.addEventListener('click', function () {
      if (!target) return;
      const behavior = reduced ? 'auto' : 'smooth';
      target.scrollIntoView({ behavior: behavior, block: 'start' });
    });
    heroInner.appendChild(btn);
  }
})();
