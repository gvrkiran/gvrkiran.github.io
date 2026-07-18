#!/usr/bin/env node
/* merge_meta_into_data.js — one-shot maintenance script.
   Fixes known typos in data.js, then merges slug + topics from papers-meta.json
   into every PUBLICATIONS entry, regenerating only that array block.
   Run from repo root:  node assets/pub-art/merge_meta_into_data.js
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA = path.join(ROOT, 'data.js');
const META = path.join(__dirname, 'papers-meta.json');

let text = fs.readFileSync(DATA, 'utf8');

/* ---- typo fixes ---- */
const fixes = [
  ['venue: "IWCSM 2026"', 'venue: "ICWSM 2026"'],
  ['Political Manipulation of the Israel-Hamas Conflict on WhatsAppp in India',
   'Political Manipulation of the Israel-Hamas Conflict on WhatsApp in India'],
];
for (const [from, to] of fixes) {
  if (text.includes(from)) { text = text.split(from).join(to); console.log('fixed:', from.slice(0, 60)); }
}
/* 2027 paper listing a 2026 venue — scoped replace inside that entry only */
const entryStart = text.indexOf('Examining LLM Assisted Rule Creation in WhatsApp Groups');
if (entryStart !== -1) {
  const windowEnd = text.indexOf('}', entryStart);
  const before = text.slice(entryStart, windowEnd);
  if (before.includes('venue: "ICWSM 2026"')) {
    text = text.slice(0, entryStart) + before.replace('venue: "ICWSM 2026"', 'venue: "ICWSM 2027"') + text.slice(windowEnd);
    console.log('fixed: 2027 entry venue ICWSM 2026 -> ICWSM 2027 (please verify)');
  }
}

/* ---- evaluate PUBLICATIONS from the fixed text ---- */
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(text, sandbox);
const pubs = sandbox.window.PUBLICATIONS;
if (!Array.isArray(pubs)) throw new Error('could not evaluate PUBLICATIONS');

/* ---- match master entries ---- */
const meta = JSON.parse(fs.readFileSync(META, 'utf8')).papers;
const used = new Set();
const unmatched = [];
pubs.forEach(p => {
  const hits = meta.filter(m => m.match === p.title &&
    (m.year === undefined || String(m.year) === String(p.year)));
  if (hits.length !== 1) { unmatched.push(`${p.year} · ${p.title} (hits: ${hits.length})`); return; }
  const m = hits[0];
  used.add(m.slug + '|' + (m.year ?? ''));
  p.slug = m.slug;
  p.topics = m.topics;
});
if (unmatched.length) {
  console.error('UNMATCHED PUBLICATIONS:\n  ' + unmatched.join('\n  '));
  process.exit(1);
}
const unusedMeta = meta.filter(m => !used.has(m.slug + '|' + (m.year ?? '')));
if (unusedMeta.length) {
  console.error('UNUSED META ENTRIES:\n  ' + unusedMeta.map(m => m.slug).join('\n  '));
  process.exit(1);
}

/* ---- re-serialize the PUBLICATIONS block ---- */
const S = JSON.stringify;
function serializeEntry(p) {
  const lines = ['  {'];
  lines.push(`    year: ${typeof p.year === 'number' ? p.year : S(p.year)},`);
  if (p.status) lines.push(`    status: ${S(p.status)},`);
  lines.push(`    title: ${S(p.title)},`);
  lines.push(`    venue: ${S(p.venue ?? '')},`);
  lines.push(`    authors: [${(p.authors || []).map(S).join(', ')}],`);
  lines.push(`    slug: ${S(p.slug)},`);
  lines.push(`    topics: [${(p.topics || []).map(S).join(', ')}],`);
  const links = (p.links || []).map(l => `{ label: ${S(l.label)}, href: ${S(l.href)} }`);
  lines.push(`    links: [${links.join(', ')}]`);
  lines.push('  }');
  return lines.join('\n');
}
let out = [];
let lastYear = null;
pubs.forEach(p => {
  const y = String(p.year);
  if (y !== lastYear) { out.push(`\n  // ${y}`); lastYear = y; }
  out.push(serializeEntry(p) + ',');
});
let block = out.join('\n');
block = block.replace(/,\s*$/, '');   // drop trailing comma on final entry

const startMarker = 'const PUBLICATIONS = [';
const start = text.indexOf(startMarker);
const end = text.indexOf('\n];', start);
if (start === -1 || end === -1) throw new Error('could not locate PUBLICATIONS block');
const newText = text.slice(0, start + startMarker.length) + '\n' + block + text.slice(end);

fs.writeFileSync(DATA, newText);
console.log(`merged slug+topics into ${pubs.length} publications; data.js written.`);

/* sanity: re-evaluate the new file */
const check = { window: {} };
vm.createContext(check);
vm.runInContext(newText, check);
const n = check.window.PUBLICATIONS.length;
const withMeta = check.window.PUBLICATIONS.filter(p => p.slug && p.topics && p.topics.length).length;
console.log(`re-eval OK: ${n} pubs, ${withMeta} with slug+topics.`);
