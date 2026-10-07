import { rates, verificationMethods } from '../config.js';
import { content } from '../content.js';
import { esc, asset } from '../lib.js';
import { interiorNav, pager } from '../components/nav.js';
import { sheetTitle, caption, panel, speech, placeholder } from '../components/panels.js';
import { contactBlock, textAria } from '../components/contact.js';
import { cover } from '../components/cover.js';
import { gallery } from '../components/gallery.js';
import { bookingForm } from '../components/bookingForm.js';

const sheet = (id, inner) => `<main id="main" class="page page--interior page--${id}" data-page="${id}">
  <div class="sheet">
    ${interiorNav(id)}
    ${inner}
    ${pager(id)}
    <footer class="sheet__foot">
      ${contactBlock()}
      <p class="sheet__foot-line">${esc(content.footer.line)}</p>
    </footer>
  </div>
  <div class="float-cta">${textAria({ variant: 'pill', showNumber: false })}</div>
</main>`;

export const render = {
  home: () => `<main id="main" class="page page--cover" data-page="home">${cover()}</main>`,

  about: () => {
    const a = content.about;
    return sheet('about', `
      ${sheetTitle(a.kicker, a.title)}
      <div class="comic-grid comic-grid--about">
        ${panel(`${speech(esc(a.opening), 'speech--lg')}`, 'panel--opening')}
        ${panel(`<picture><img src="${asset('/img/aria-photo-02-860.webp')}" width="860" height="1916" style="object-position:50% 18%" alt="Aria with long bright pink hair, standing in front of white curtains in red lace lingerie with her hands on her hips." loading="eager" decoding="async"></picture>
                 ${caption(esc(a.photoCaption), 'angled')}`, 'panel--photo panel--photo-tall')}
        ${panel(`<h2 class="panel__h">Hello, Las Vegas</h2>${a.intro.map((t) => `<p>${esc(t)}</p>`).join('')}${placeholder('aboutDetails')}`, 'panel--text')}
        ${panel(`<picture><img src="${asset('/img/aria-photo-01-860.webp')}" width="860" height="382" alt="Aria with bright pink hair and red lace lingerie, reclining on a grey sofa and looking toward the camera." loading="lazy" decoding="async"></picture>`, 'panel--photo panel--photo-wide')}
        ${panel(`${a.captions.map((t) => caption(esc(t), 'plain')).join('')}`, 'panel--captions')}
        ${panel(`<p class="quote">${esc(a.pullQuote)}</p>${textAria({ variant: 'bubble', text: 'Text Aria', extraClass: 'text-aria--inline' })}`, 'panel--cta')}
      </div>`);
  },

  gallery: () => {
    const g = content.gallery;
    return sheet('gallery', `
      ${sheetTitle(g.kicker, g.title)}
      <p class="lede">${esc(g.intro)}</p>
      ${gallery()}`);
  },

  rates: () => {
    const r = content.rates;
    return sheet('rates', `
      ${sheetTitle(r.kicker, r.title)}
      <p class="lede">${esc(r.intro)}</p>
      <div class="comic-grid comic-grid--rates">
        ${panel(`${rates.finalized ? '' : `<p class="stamp-note"><span>${esc(r.statusStamp)}</span></p>`}
          <table class="rates-table">
            <caption>${esc(r.tableCaption)}</caption>
            <thead><tr><th scope="col">${esc(rates.columns.duration)}</th><th scope="col">${esc(rates.columns.donation)}</th></tr></thead>
            <tbody>${rates.rows.map((row) => `<tr><td data-label="${esc(rates.columns.duration)}">${esc(row.duration)}</td><td data-label="${esc(rates.columns.donation)}">${esc(row.donation)}</td></tr>`).join('')}</tbody>
          </table>
          ${rates.finalized ? '' : `<p class="table-note">${esc(r.tableNote)}</p>`}`, 'panel--table')}
        ${panel(`<h2 class="panel__h">${esc(r.depositHeading)}</h2><p>${esc(rates.depositNotice)}</p>`, 'panel--notice panel--pink')}
        ${panel(`<h2 class="panel__h">${esc(r.videoHeading)}</h2><p>${esc(rates.videoVerificationNotice)}</p>`, 'panel--notice')}
      </div>
      <p class="lede lede--center">${esc(r.ctaText)}</p>`);
  },

  etiquette: () => {
    const e = content.etiquette;
    return sheet('etiquette', `
      ${sheetTitle(e.kicker, e.title)}
      <p class="lede">${esc(e.intro)}</p>
      <ol class="rule-grid">
        ${e.sections.map((s, i) => `<li class="rule">
          <span class="rule__no" aria-hidden="true">${i + 1}</span>
          <h2 class="panel__h">${esc(s.title)}</h2><p>${esc(s.body)}</p></li>`).join('')}
      </ol>
      <section class="panel panel--wide" aria-labelledby="dep-h">
        <h2 class="panel__h" id="dep-h">${esc(e.depositHeading)}</h2>
        <p>${esc(e.depositIntro)}</p>
        <div class="split">
          <div>
            <h3 class="mini-h">New-client deposit</h3>
            <p>${esc(rates.depositNotice)}</p>
          </div>
          <div>
            <h3 class="mini-h">Video verification</h3>
            <p>${esc(rates.videoVerificationNotice)}</p>
          </div>
        </div>
        <h3 class="mini-h">${esc(e.verificationHeading)}</h3>
        <ul class="chips">${verificationMethods.map((v) => `<li>${esc(v.label)}</li>`).join('')}</ul>
      </section>`);
  },

  booking: () => {
    const b = content.booking;
    return sheet('booking', `
      ${sheetTitle(b.kicker, b.title)}
      <p class="lede">${esc(b.intro)}</p>
      ${placeholder('availability')}
      ${bookingForm()}`);
  },
};
