const TOPICS = [
  { key: 'whatsapp',  name: 'WhatsApp',                color: '#263e68' },
  { key: 'misinfo',   name: 'Misinformation & Harm',   color: '#a94d32' },
  { key: 'polar',     name: 'Politics & Polarization', color: '#a9762c' },
  { key: 'ai',        name: 'AI & Society',            color: '#435f49' },
  { key: 'health',    name: 'Health',                  color: '#34746a' },
  { key: 'media',     name: 'Media & Attention',       color: '#76445b' },
  { key: 'methods',   name: 'Data & Methods',          color: '#426779' },
  { key: 'platforms', name: 'Platforms & Behavior',    color: '#9b6439' },
];

const TOPIC_BY_KEY = Object.fromEntries(TOPICS.map(topic => [topic.key, topic]));
const classify = publication => TOPIC_BY_KEY[(publication.topics || [])[0]] || TOPICS.at(-1);
const ART = slug => `assets/pub-art/papers/${slug}.webp`;

function hash(value) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function authorList(publication) {
  return Array.isArray(publication.authors) ? publication.authors : [publication.authors].filter(Boolean);
}

function shortAuthor(publication) {
  const authors = authorList(publication);
  if (!authors.length) return 'K. Garimella';
  const surname = authors[0].trim().split(/\s+/).at(-1);
  return authors.length > 1 ? `${surname} et al.` : surname;
}

const publications = (window.PUBLICATIONS || []).map((publication, index) => ({
  ...publication,
  index,
  topic: classify(publication),
  hash: hash(publication.title),
}));
const byYear = {};
publications.forEach(publication => {
  const year = String(publication.year);
  (byYear[year] = byYear[year] || []).push(publication);
});
const shelfYears = Object.keys(byYear)
  .filter(year => year !== 'Unpublished')
  .sort((a, b) => Number(b) - Number(a));

document.getElementById('totalStat').textContent = publications.length;
document.getElementById('shelfStat').textContent = shelfYears.length;

function createArtwork(publication, eager = false) {
  const art = document.createElement('span');
  art.className = 'cover-art';
  const image = document.createElement('img');
  image.src = ART(publication.slug);
  image.alt = '';
  image.loading = eager ? 'eager' : 'lazy';
  image.decoding = 'async';
  const fallback = document.createElement('span');
  fallback.className = 'cover-fallback';
  fallback.hidden = true;
  fallback.textContent = publication.title.replace(/^(a|an|the)\s+/i, '').charAt(0).toUpperCase() || 'K';
  image.addEventListener('error', () => {
    image.hidden = true;
    fallback.hidden = false;
  }, { once: true });
  art.append(image, fallback);
  return art;
}

function createFrontCover(publication, eager = false) {
  const design = document.createElement('span');
  design.className = 'book-front-design';
  design.style.setProperty('--bc', publication.topic.color);
  design.appendChild(createArtwork(publication, eager));

  const copy = document.createElement('span');
  copy.className = 'cover-copy';
  const topic = document.createElement('span');
  topic.className = 'cover-topic';
  topic.textContent = publication.topic.name;
  const title = document.createElement('strong');
  title.className = `cover-title${publication.title.length > 62 ? ' long' : ''}`;
  title.textContent = publication.title;
  const author = document.createElement('span');
  author.className = 'cover-author';
  author.textContent = `${shortAuthor(publication)} · ${publication.year === 'Unpublished' ? 'under review' : publication.year}`;
  copy.append(topic, title, author);
  design.appendChild(copy);
  return design;
}

const cartRow = document.getElementById('cartRow');
const cartList = document.getElementById('cartList');
(byYear.Unpublished || []).forEach((publication, index) => {
  const item = document.createElement('li');
  item.dataset.index = publication.index;
  const button = document.createElement('button');
  button.className = 'cart-item';
  button.type = 'button';
  button.innerHTML = `<span class="cart-index">${String(index + 1).padStart(2, '0')}</span><span class="cart-title"></span><span class="cart-arrow" aria-hidden="true">↗</span>`;
  button.querySelector('.cart-title').textContent = publication.title;
  button.setAttribute('aria-label', `Open ${publication.title}`);
  button.addEventListener('click', () => openCard(publication, button));
  item.appendChild(button);
  cartList.appendChild(item);
});
if (!(byYear.Unpublished || []).length) cartRow.remove();

const shelves = document.getElementById('shelves');
shelfYears.forEach(year => {
  const shelf = document.createElement('section');
  shelf.className = 'shelf';
  shelf.dataset.year = year;
  shelf.setAttribute('aria-labelledby', `shelf-${year}`);

  const label = document.createElement('header');
  label.className = 'shelf-label';
  label.innerHTML = `<strong id="shelf-${year}">${year}</strong><span class="shelf-count"></span>`;
  label.querySelector('.shelf-count').textContent = `${byYear[year].length} ${byYear[year].length === 1 ? 'publication' : 'publications'}`;

  const shelfCase = document.createElement('div');
  shelfCase.className = 'shelf-case';
  const cavity = document.createElement('div');
  cavity.className = 'shelf-cavity';
  const row = document.createElement('div');
  row.className = 'row';
  row.classList.toggle('single-book', byYear[year].length === 1);

  byYear[year].forEach((publication, position) => {
    const book = document.createElement('button');
    book.className = 'book';
    book.type = 'button';
    book.dataset.index = publication.index;
    book.dataset.topic = publication.topic.key;
    book.setAttribute('aria-label', `${publication.title}. Hover to preview; click for details.`);
    const bookHeight = 151 + (publication.hash % 34);
    const slotWidth = 27 + ((publication.hash >> 4) % 8);
    book.style.setProperty('--bh', `${bookHeight}px`);
    book.style.setProperty('--slot', `${slotWidth}px`);
    book.style.setProperty('--bc', publication.topic.color);
    book.style.setProperty('--lean', ((publication.hash >> 7) % 9 === 0 && position > 0) ? '-3deg' : '0deg');
    if ((publication.hash >> 5) % 7 === 0 && position > 0) book.classList.add('gap');
    if (position < 2) book.classList.add('edge-left');
    if (position > byYear[year].length - 3) book.classList.add('edge-right');

    const volume = document.createElement('span');
    volume.className = 'book-volume';
    volume.setAttribute('aria-hidden', 'true');
    const front = document.createElement('span');
    front.className = 'book-face';
    front.appendChild(createFrontCover(publication));
    const back = document.createElement('span');
    back.className = 'book-back';
    const spine = document.createElement('span');
    spine.className = 'book-spine';
    spine.innerHTML = '<span class="spine-mark">KG</span><span class="spine-title"></span><span class="spine-year"></span>';
    spine.querySelector('.spine-title').textContent = publication.title;
    spine.querySelector('.spine-year').textContent = year.slice(-2);
    const pages = document.createElement('span');
    pages.className = 'book-pages';
    volume.append(front, back, spine, pages);
    book.appendChild(volume);
    book.addEventListener('click', () => openCard(publication, book));
    row.appendChild(book);
  });

  const board = document.createElement('div');
  board.className = 'shelf-board';
  cavity.appendChild(row);
  shelfCase.append(cavity, board);
  shelf.append(label, shelfCase);
  shelves.appendChild(shelf);
});

let activeTopic = null;
let query = '';
const chips = document.getElementById('chips');

function addFilterButton(label, key, color, count) {
  const button = document.createElement('button');
  button.type = 'button';
  button.style.setProperty('--sw', color);
  button.textContent = `${label} · ${count}`;
  button.dataset.topic = key || '';
  if (key === null) button.classList.add('active');
  button.addEventListener('click', () => {
    activeTopic = key;
    chips.querySelectorAll('button').forEach(chip => chip.classList.toggle('active', chip === button));
    applyFilters();
  });
  chips.appendChild(button);
}

addFilterButton('Everything', null, 'var(--ink)', publications.length);
TOPICS.forEach(topic => {
  const count = publications.filter(publication => publication.topic.key === topic.key).length;
  if (count) addFilterButton(topic.name, topic.key, topic.color, count);
});

function matchesFilters(publication) {
  const topicMatch = activeTopic === null || publication.topic.key === activeTopic;
  if (!topicMatch) return false;
  if (!query) return true;
  const haystack = [publication.title, publication.venue, publication.year, ...authorList(publication)]
    .join(' ')
    .toLocaleLowerCase();
  return haystack.includes(query);
}

function matchingPublications() {
  return publications.filter(matchesFilters);
}

function applyFilters() {
  publications.forEach(publication => {
    const visible = matchesFilters(publication);
    document.querySelectorAll(`[data-index="${publication.index}"]`).forEach(element => {
      element.classList.toggle('filtered-out', !visible);
    });
  });
  shelfYears.forEach(year => {
    const visibleCount = byYear[year].filter(matchesFilters).length;
    const shelf = document.querySelector(`.shelf[data-year="${year}"]`);
    shelf.classList.toggle('filtered-out', visibleCount === 0);
    shelf.querySelector('.shelf-count').textContent = `${visibleCount} ${visibleCount === 1 ? 'publication' : 'publications'}`;
    shelf.querySelector('.row').classList.toggle('single-book', visibleCount === 1);
  });
  if (cartRow.isConnected) {
    const arrivalsVisible = (byYear.Unpublished || []).some(matchesFilters);
    cartRow.classList.toggle('filtered-out', !arrivalsVisible);
  }
  const matches = matchingPublications();
  const shelved = matches.filter(publication => publication.year !== 'Unpublished').length;
  const pending = matches.length - shelved;
  document.getElementById('resultCount').textContent = `${shelved} ${shelved === 1 ? 'publication' : 'publications'}${pending ? ` · ${pending} under review` : ''}`;
}

const search = document.getElementById('search');
search.addEventListener('input', event => {
  query = event.target.value.trim().toLocaleLowerCase();
  applyFilters();
});

const veil = document.getElementById('veil');
addEventListener('keydown', event => {
  const tag = document.activeElement?.tagName;
  if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) && !veil.classList.contains('open')) {
    event.preventDefault();
    search.focus();
  }
});

const closeButton = document.getElementById('cardClose');
let openPublication = null;
let returnFocus = null;

function makeChip(label, className) {
  const chip = document.createElement('span');
  chip.className = className;
  chip.textContent = label;
  return chip;
}

function openCard(publication, source = null) {
  openPublication = publication;
  if (source) returnFocus = source;
  document.querySelectorAll('.book.is-open').forEach(book => book.classList.remove('is-open'));
  const selectedBook = document.querySelector(`.book[data-index="${publication.index}"]`);
  if (selectedBook) selectedBook.classList.add('is-open');

  const cardArt = document.getElementById('cardArt');
  cardArt.style.setProperty('--bc', publication.topic.color);
  cardArt.replaceChildren(createFrontCover(publication, true));
  document.getElementById('cardShelf').textContent = publication.year === 'Unpublished' ? 'Under review' : publication.year;

  const chipRow = document.getElementById('cardChips');
  chipRow.replaceChildren(makeChip(publication.venue || publication.status || 'Publication', 'venue-chip'));
  (publication.topics || [publication.topic.key]).forEach(key => {
    if (TOPIC_BY_KEY[key]) chipRow.appendChild(makeChip(TOPIC_BY_KEY[key].name, 'topic-chip'));
  });
  document.getElementById('cardTitle').textContent = publication.title;

  const authors = document.getElementById('cardAuthors');
  authors.replaceChildren();
  authorList(publication).forEach((author, index, list) => {
    const element = /garimella/i.test(author) ? document.createElement('b') : document.createTextNode(author);
    if (element.nodeType === Node.ELEMENT_NODE) element.textContent = author;
    authors.appendChild(element);
    if (index < list.length - 1) authors.appendChild(document.createTextNode(', '));
  });

  const meta = document.getElementById('cardMeta');
  meta.replaceChildren();
  [
    [publication.year === 'Unpublished' ? 'Status' : 'Published in', publication.venue || publication.status || '—'],
    ['Year', publication.year === 'Unpublished' ? 'Pending' : publication.year],
  ].forEach(([term, value]) => {
    const group = document.createElement('div');
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = term;
    dd.textContent = value;
    group.append(dt, dd);
    meta.appendChild(group);
  });

  const links = document.getElementById('cardLinks');
  links.replaceChildren();
  (publication.links || []).forEach(link => {
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    anchor.textContent = `${link.label} ↗`;
    links.appendChild(anchor);
  });
  const scholar = document.createElement('a');
  scholar.href = `https://scholar.google.com/scholar?q=${encodeURIComponent(publication.title)}`;
  scholar.target = '_blank';
  scholar.rel = 'noopener';
  scholar.textContent = 'Scholar ↗';
  links.appendChild(scholar);

  const matches = matchingPublications();
  const position = matches.indexOf(publication);
  document.getElementById('pageCount').textContent = `${position + 1} / ${matches.length}`;
  veil.classList.add('open');
  veil.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => closeButton.focus());
}

function closeCard() {
  veil.classList.remove('open');
  veil.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  document.querySelectorAll('.book.is-open').forEach(book => book.classList.remove('is-open'));
  const focusTarget = returnFocus;
  openPublication = null;
  setTimeout(() => focusTarget?.focus(), 200);
}

function moveBook(direction) {
  if (!openPublication) return;
  const matches = matchingPublications();
  const current = matches.indexOf(openPublication);
  const next = matches[(current + direction + matches.length) % matches.length];
  openCard(next);
}

closeButton.addEventListener('click', closeCard);
document.getElementById('previousBook').addEventListener('click', () => moveBook(-1));
document.getElementById('nextBook').addEventListener('click', () => moveBook(1));
veil.addEventListener('click', event => { if (event.target === veil) closeCard(); });
addEventListener('keydown', event => {
  if (!veil.classList.contains('open')) return;
  if (event.key === 'Escape') closeCard();
  if (event.key === 'ArrowLeft') moveBook(-1);
  if (event.key === 'ArrowRight') moveBook(1);
});

applyFilters();

(function handleRotationRefresh() {
  const params = new URLSearchParams(location.search);
  if (!params.has('rotation')) return;
  const entry = performance.getEntriesByType('navigation')[0];
  const reloaded = entry ? entry.type === 'reload' : performance.navigation?.type === 1;
  if (reloaded) location.replace('publications.html?reroll=1');
})();
