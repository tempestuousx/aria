import { GALLERY_PHOTOS, content } from '../content.js';
import { asset, esc } from '../lib.js';

/** Grid of photo buttons. The lightbox (public/js/gallery.js) reads data attributes. */
export function gallery() {
  return `<ul class="gallery" data-gallery>
    ${GALLERY_PHOTOS.map((p, i) => `<li class="gallery__item gallery__item--${p.tile}">
      <button type="button" class="gallery__btn" data-gallery-index="${i}"
        data-full="${asset(p.src)}" data-w="${p.width}" data-h="${p.height}"
        data-alt="${esc(p.alt)}" data-caption="${esc(p.caption)}"
        aria-label="Open photo ${i + 1} of ${GALLERY_PHOTOS.length} larger: ${esc(p.caption)}">
        <img src="${asset(p.thumb)}" alt="${esc(p.alt)}" width="${p.width}" height="${p.height}"
             style="object-position:${esc(p.focus)}" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async">
        <span class="gallery__cap">${esc(p.caption)}</span>
      </button>
    </li>`).join('')}
  </ul>`;
}
