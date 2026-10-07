// Accessible lightbox. Uses <dialog> (focus trap + Escape), adds arrows, focus return, and next/previous.
const NS = 'http://www.w3.org/2000/svg';
const icon = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${d}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"/></svg>`;

export function initGallery(root) {
  const grid = root.querySelector('[data-gallery]');
  if (!grid) return () => {};
  const items = [...grid.querySelectorAll('[data-gallery-index]')];
  if (!items.length) return () => {};

  const dlg = document.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.setAttribute('aria-label', 'Photo viewer');
  dlg.innerHTML = `<div class="lightbox__wrap">
    <div class="lightbox__bar"><span class="lightbox__count" aria-live="polite"></span>
      <button type="button" class="lb-btn lb-close" aria-label="Close photo viewer">${icon('M5 5l14 14M19 5L5 19')}<span>Close</span></button></div>
    <div class="lightbox__stage">
      <button type="button" class="lb-btn lb-prev" aria-label="Previous photo">${icon('M20 12H6M12 5l-7 7 7 7')}<span>Prev</span></button>
      <figure class="lightbox__figure"><img class="lightbox__img" alt=""></figure>
      <button type="button" class="lb-btn lb-next" aria-label="Next photo"><span>Next</span>${icon('M4 12h14M12 5l7 7-7 7')}</button>
    </div>
    <p class="lightbox__cap"></p></div>`;
  document.body.appendChild(dlg);

  const img = dlg.querySelector('.lightbox__img');
  const cap = dlg.querySelector('.lightbox__cap');
  const count = dlg.querySelector('.lightbox__count');
  const prev = dlg.querySelector('.lb-prev');
  const next = dlg.querySelector('.lb-next');
  const close = dlg.querySelector('.lb-close');
  let index = 0, opener = null;
  const multi = items.length > 1;
  prev.hidden = next.hidden = !multi;

  function show(i) {
    index = (i + items.length) % items.length;
    const d = items[index].dataset;
    img.src = d.full; img.alt = d.alt; img.width = d.w; img.height = d.h;
    cap.textContent = d.caption;
    count.textContent = `Photo ${index + 1} of ${items.length}`;
  }
  function open(i, from) {
    opener = from; show(i);
    if (!dlg.open) dlg.showModal();
    document.documentElement.style.overflow = 'hidden';
    close.focus();
  }
  function closeIt() { if (dlg.open) dlg.close(); }

  const onGridClick = (e) => { const b = e.target.closest('[data-gallery-index]'); if (b) open(Number(b.dataset.galleryIndex), b); };
  grid.addEventListener('click', onGridClick);
  close.addEventListener('click', closeIt);
  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  dlg.addEventListener('keydown', (e) => {
    if (!multi) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
  });
  // Click on the dark backdrop closes
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.classList.contains('lightbox__wrap')) closeIt(); });
  dlg.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    if (opener && opener.isConnected) opener.focus();
  });

  return () => { // cleanup when the page is turned away
    grid.removeEventListener('click', onGridClick);
    if (dlg.open) dlg.close();
    dlg.remove();
    document.documentElement.style.overflow = '';
  };
}
