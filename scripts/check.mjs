// Content and safety checks on the built site (run after `npm run build`, or just `npm run check`).
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages, rates, links, contact } from '../src/config.js';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
let failed = 0;
const ok = (c, m) => { console.log(`${c ? 'PASS' : 'FAIL'} ${m}`); if (!c) failed++; };

async function walk(d) { const out = []; for (const e of await readdir(d, { withFileTypes: true })) { const p = join(d, e.name); e.isDirectory() ? out.push(...await walk(p)) : out.push(p); } return out; }
const files = await walk(dist);
const text = files.filter((f) => ['.html', '.css', '.js', '.svg'].includes(extname(f)));
const all = (await Promise.all(text.map(async (f) => [f, await readFile(f, 'utf8')])));

const titles = new Set();
for (const p of pages) {
  const f = p.path === '/' ? join(dist, 'index.html') : join(dist, p.path, 'index.html');
  const html = await readFile(f, 'utf8').catch(() => null);
  ok(html !== null, `page file exists: ${p.path}`);
  if (!html) continue;
  const t = html.match(/<title>(.*?)<\/title>/)?.[1];
  ok(t && !titles.has(t), `unique title: ${t}`); titles.add(t);
  ok(/<meta name="description" content="[^"]{20,}"/.test(html), `description: ${p.path}`);
  ok((html.match(/<h1[ >]/g) || []).length === 1, `exactly one h1: ${p.path}`);
  ok(html.includes(contact.smsHref), `sms link: ${p.path}`);
  // every external link opens safely
  const ext = [...html.matchAll(/<a [^>]*href="https?:[^"]*"[^>]*>/g)].map((m) => m[0]);
  ok(ext.every((a) => /target="_blank"/.test(a) && /rel="noopener noreferrer"/.test(a)), `external links safe: ${p.path}`);
  // every img has alt
  ok([...html.matchAll(/<img [^>]*>/g)].every((m) => /\salt="/.test(m[0])), `img alt present: ${p.path}`);
  // internal hrefs resolve
  for (const m of html.matchAll(/href="(\/[^"#]*)"/g)) {
    const target = join(dist, m[1].endsWith('/') ? m[1] + 'index.html' : m[1]);
    const exists = await stat(target).then(() => true, () => false);
    if (!exists) ok(false, `broken internal link ${m[1]} on ${p.path}`);
  }
}
const joined = all.map(([, c]) => c).join('\n');
ok(!/uber|lyft|rideshare|ride share/i.test(joined), 'no Uber / transportation requirement anywhere');
ok(!/harley|quinn|\bDC\b comics|batman/i.test(joined + files.join(' ')), 'no third-party character or publisher names in copy or filenames');
ok(!/—/.test(joined.replace(/<script[\s\S]*?<\/script>/g, '')), 'no em dashes in page copy');
ok(joined.includes(links.profile.url) && joined.includes(links.reviews.url), 'exact profile and review URLs present');
ok(joined.includes(rates.depositNotice), 'exact 20% deposit sentence present');
ok(joined.includes(rates.videoVerificationNotice), 'exact $50 video verification sentence present');
ok(!/\b\d{2,3}\s?(hr|hour|min)/i.test(joined.replace(/725-877-6368/g, '')), 'no numeric durations or rates published');
ok(!/type="file"/.test(joined), 'no file upload / ID upload field');
ok(!/ratings?|stars?|aggregateRating|ld\+json/i.test(all.filter(([f]) => f.endsWith('.html')).map(([, c]) => c).join('\n').replace(/Read My Reviews|reviews/gi, '')), 'no ratings, star counts or structured data');

// Images: no EXIF / GPS / XMP in served copies
for (const f of files.filter((f) => /\.(webp|png|jpg|jpeg)$/i.test(f))) {
  const b = await readFile(f);
  const s = b.toString('latin1');
  ok(!/Exif\0\0|GPS|<x:xmpmeta|XML:com\.adobe\.xmp|AirBrush/.test(s), `no embedded metadata: ${f.replace(dist, 'dist')}`);
}
console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
