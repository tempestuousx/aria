// Progressive enhancement: every route is a real static page. This script upgrades
// internal link clicks into comic page turns and keeps URL, title, focus and history in sync.
import { turnPage } from './transitions.js';
import { initGallery } from './gallery.js';
import { initBooking } from './booking.js';

const cfg = JSON.parse(document.getElementById('aria-config').textContent);
const stage = document.getElementById('stage');
const announcer = document.getElementById('announcer');
const norm = (p) => p.replace(/index\.html$/, '').replace(/\/?$/, '/');
const indexOf = (path) => cfg.pages.findIndex((p) => norm(p.path) === norm(path));

let current = norm(location.pathname);
let busy = false;
let pending = null;
let cleanups = [];
const cache = new Map();

history.scrollRestoration = 'manual';

function mount() {
  cleanups.forEach((fn) => fn());
  cleanups = [initGallery(stage, cfg), initBooking(stage, cfg)];
}
mount();

async function fetchPage(url) {
  const key = norm(url.pathname);
  if (!cache.has(key)) {
    cache.set(key, fetch(url.pathname, { credentials: 'same-origin' }).then(async (r) => {
      if (!r.ok) throw new Error(r.status);
      const doc = new DOMParser().parseFromString(await r.text(), 'text/html');
      const main = doc.getElementById('main');
      if (!main) throw new Error('no main');
      return { main, title: doc.title, description: doc.querySelector('meta[name="description"]')?.content || '', id: doc.body.dataset.page };
    }).catch((e) => { cache.delete(key); throw e; }));
  }
  return cache.get(key);
}

function applyPage(page, url) {
  stage.replaceChildren(document.importNode(page.main, true));
  document.title = page.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', page.description);
  document.body.dataset.page = page.id;
  current = norm(url.pathname);
  window.scrollTo(0, 0);
  mount();
  announcer.textContent = '';
  requestAnimationFrame(() => { announcer.textContent = `${page.title}`; });
  (stage.querySelector('h1') || stage.querySelector('main'))?.focus({ preventScroll: true });
}

async function navigate(url, { push = true } = {}) {
  if (norm(url.pathname) === current) { stage.querySelector('h1')?.focus({ preventScroll: false }); return; }
  if (busy) { pending = { url, push }; return; } // no overlapping turns
  busy = true;
  try {
    const page = await fetchPage(url);
    const direction = indexOf(url.pathname) >= indexOf(current) ? 'forward' : 'back';
    if (push) history.pushState({}, '', url.pathname + url.search + url.hash);
    await turnPage({ direction, swap: () => applyPage(page, url) });
  } catch {
    busy = false; location.href = url.href; return; // always fall back to a normal page load
  }
  busy = false;
  if (pending) { const p = pending; pending = null; navigate(p.url, { push: p.push }); }
}

document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a[href]');
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || indexOf(url.pathname) < 0) return;
  e.preventDefault();
  navigate(url);
});

// Warm the cache so the turn starts instantly
const warm = (e) => {
  const a = e.target.closest && e.target.closest('a[href]');
  if (!a) return;
  const url = new URL(a.href, location.href);
  if (url.origin === location.origin && indexOf(url.pathname) >= 0) fetchPage(url).catch(() => {});
};
document.addEventListener('pointerover', warm, { passive: true });
document.addEventListener('focusin', warm);
document.addEventListener('touchstart', warm, { passive: true });

window.addEventListener('popstate', () => navigate(new URL(location.href), { push: false }));
