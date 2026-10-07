import { site, contact, pages, submission } from './config.js';
import { asset, esc, pageById } from './lib.js';
import { symbols } from './components/icons.js';

/** Full HTML document for one page. Every route is a real, static HTML file. */
export function document(pageId, mainHtml) {
  const p = pageById(pageId);
  const canonical = site.url ? site.url.replace(/\/$/, '') + site.basePath + p.path : '';
  const clientConfig = {
    basePath: site.basePath,
    pages: pages.map(({ id, path, title, description }) => ({ id, path: site.basePath + path, title, description })),
    submission: { endpoint: submission.endpoint, method: submission.method },
    contact: { phoneDisplay: contact.phoneDisplay, smsHref: contact.smsHref },
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<meta name="theme-color" content="#fbf0dc">
${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ''}
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:type" content="website">
${canonical ? `<meta property="og:url" content="${esc(canonical)}">` : ''}
<link rel="icon" href="${asset('/favicon.svg')}" type="image/svg+xml">
<link rel="preload" href="${asset('/fonts/bowlby-one-latin-400-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${asset('/fonts/bangers-latin-400-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${asset('/css/styles.css')}">
</head>
<body data-page="${pageId}">
<a class="skip-link" href="#main">Skip to main content</a>
${symbols}
<div id="stage">
${mainHtml}
</div>
<div id="turn-layer" aria-hidden="true"></div>
<div id="announcer" class="sr-only" role="status" aria-live="polite"></div>
<script type="application/json" id="aria-config">${JSON.stringify(clientConfig).replace(/</g, '\\u003c')}</script>
<script type="module" src="${asset('/js/app.js')}"></script>
</body>
</html>
`;
}
