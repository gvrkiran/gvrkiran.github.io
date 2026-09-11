/* When a design was opened by publications.html, refreshing it deals another
   design from the six-page rotation. Direct prototype URLs remain stable. */
(function () {
  const params = new URLSearchParams(location.search);
  if (!params.has('rotation')) return;
  const entry = performance.getEntriesByType('navigation')[0];
  const reloaded = entry ? entry.type === 'reload' : performance.navigation?.type === 1;
  if (reloaded) location.replace('publications.html?reroll=1');
})();
