/* js/nav.js — render the 5-item nav, smooth-scroll anchors */
(function () {
  'use strict';
  const links = [
    { label: 'About',        href: '#about' },
    { label: 'Publications', href: '#publications' },
    { label: 'Projects',     href: '#projects' },
    { label: 'Teaching',     href: '#teaching' },
    { label: 'Other',        href: '#other' },
  ];
  const nav = document.getElementById('navLinks');
  if (!nav) return;
  nav.innerHTML = links.map(l => `<a href="${l.href}">${l.label}</a>`).join('');
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
