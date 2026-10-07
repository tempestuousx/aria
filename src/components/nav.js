import { pages, site } from '../config.js';
import { href, esc } from '../lib.js';
import { arrow, arrowBack } from './icons.js';
import { textAria } from './contact.js';

const interior = pages.filter((p) => p.id !== 'home');

/** Interior comic navigation: Back to Cover + every page + Text Aria. */
export function interiorNav(current) {
  return `<header class="sheet__top">
    <a class="back-cover" href="${href('home')}">${arrowBack}<span>Back to Cover</span></a>
    <nav class="page-nav" aria-label="Comic pages">
      <ul>${interior.map((p) => `<li><a href="${href(p.id)}"${p.id === current ? ' aria-current="page"' : ''}>${esc(p.navLabel)}</a></li>`).join('')}</ul>
    </nav>
    ${textAria({ variant: 'pill', showNumber: false })}
  </header>`;
}

/** "Turn the page" pager at the bottom of each interior page. */
export function pager(current) {
  const order = pages.map((p) => p.id);
  const i = order.indexOf(current);
  const prev = pages[i - 1];
  const next = pages[i + 1];
  const prevLabel = prev.id === 'home' ? 'Back to Cover' : prev.navLabel;
  return `<nav class="pager" aria-label="Turn the page">
    <a class="pager__link pager__link--prev" href="${href(prev.id)}">${arrowBack}<span><small>Previous page</small>${esc(prevLabel)}</span></a>
    ${next ? `<a class="pager__link pager__link--next" href="${href(next.id)}"><span><small>Next page</small>${esc(next.navLabel)}</span>${arrow}</a>` : '<span></span>'}
  </nav>`;
}
