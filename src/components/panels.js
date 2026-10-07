import { esc } from '../lib.js';
import { site, placeholders } from '../config.js';

export const sheetTitle = (kicker, title) =>
  `<div class="sheet__title"><p class="kicker">${esc(kicker)}</p><h1 class="page-title" tabindex="-1">${esc(title)}</h1></div>`;

/** Narration-style caption box. variant: plain | pink | ink | angled */
export const caption = (html, variant = 'plain') =>
  `<p class="caption caption--${variant}">${html}</p>`;

export const panel = (inner, cls = '') => `<section class="panel ${cls}">${inner}</section>`;

export const speech = (text, cls = '') =>
  `<p class="speech ${cls}"><span>${text}</span></p>`;

/** Clearly marked placeholder (hidden when site.showPlaceholders is false). */
export const placeholder = (key) =>
  site.showPlaceholders
    ? `<p class="todo"><strong>To confirm:</strong> ${esc(placeholders[key])}</p>`
    : '';

export const picture = ({ webp, alt, width, height, cls = '', loading = 'lazy', fallback }) =>
  `<picture>${fallback ? '' : ''}<img class="${cls}" src="${webp}" alt="${esc(alt)}" width="${width}" height="${height}" loading="${loading}" decoding="async"></picture>`;
