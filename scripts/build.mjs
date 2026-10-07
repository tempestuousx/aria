// Static build: renders every page to dist/<route>/index.html, bundles CSS, copies assets.
import { rm, mkdir, writeFile, readFile, cp } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages, site } from '../src/config.js';
import { render } from '../src/pages/pages.js';
import { document } from '../src/layout.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

// 1. Static assets (images, fonts, js, favicon)
for (const dir of ['img', 'fonts', 'js']) await cp(join(root, 'public', dir), join(dist, dir), { recursive: true });
await cp(join(root, 'public', 'favicon.svg'), join(dist, 'favicon.svg'));

// 2. CSS: concatenate in order
const cssFiles = ['base', 'cover', 'interior', 'gallery', 'form', 'transitions'];
let css = '';
for (const f of cssFiles) css += `/* ${f}.css */\n` + (await readFile(join(root, 'public', 'css', `${f}.css`), 'utf8')) + '\n';
await mkdir(join(dist, 'css'), { recursive: true });
await writeFile(join(dist, 'css', 'styles.css'), css.replace(/url\(\.\.\/fonts\//g, `url(${site.basePath}/fonts/`));

// 3. Pages
for (const p of pages) {
  const html = document(p.id, render[p.id]());
  const out = p.path === '/' ? join(dist, 'index.html') : join(dist, p.path, 'index.html');
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
}
// 4. 404 (static hosts usually pick this up)
await writeFile(join(dist, '404.html'), document('home', render.home()));

console.log(`Built ${pages.length} pages to dist/`);
