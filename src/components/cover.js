import { site, contact, links } from '../config.js';
import { content, GALLERY_PHOTOS } from '../content.js';
import { href, asset, esc } from '../lib.js';
import { suit, starburst, barcode } from './icons.js';
import { textAria, reviewsStamp } from './contact.js';

const c = content.cover;

/** Masthead: custom-styled letters, each its own span so CSS can vary them. */
function masthead() {
  const letters = c.masthead.split('').map((ch, i) => `<span class="mh__l mh__l--${i + 1}" aria-hidden="true">${esc(ch)}</span>`).join('');
  return `<h1 class="masthead" tabindex="-1" aria-label="${esc(site.name)}, ${esc(site.tagline.toLowerCase())}, ${esc(site.location)}">
    <span class="masthead__suits" aria-hidden="true">${suit('club', 'mh-s mh-s--1')}${suit('heart', 'mh-s mh-s--2')}${suit('spade', 'mh-s mh-s--3')}${suit('diamond', 'mh-s mh-s--4')}${suit('heart', 'mh-s mh-s--5')}</span>
    <span class="masthead__word">${letters}</span>
  </h1>`;
}

const thumb = GALLERY_PHOTOS[0];

export function cover() {
  return `<div class="cover">
    <div class="cover__spine" aria-hidden="true"></div>

    <div class="issue-box"><span class="issue-box__top">Issue</span><span class="issue-box__no">No. ${esc(site.issue)}</span></div>
    <div class="barcode" aria-hidden="true">${barcode()}<span>${esc(site.issue.padStart(5, '0'))}</span></div>

    ${masthead()}
    <p class="ribbon"><span>${esc(c.ribbon)}</span></p>

    <figure class="art">
      <picture>
        <source type="image/webp" srcset="${asset('/img/aria-character.webp')}">
        <img src="${asset('/img/aria-character.png')}" width="687" height="1024" fetchpriority="high"
             alt="Illustrated portrait of Aria: pink pigtails, a pink bubblegum bubble, a red and black cropped jacket and one hand on her hip.">
      </picture>
    </figure>

    ${textAria({ variant: 'bubble', text: c.textBubble, extraClass: 'cover__bubble' })}

    <nav class="cover-nav" aria-label="Comic pages">
      <a class="cn cn--about" href="${href('about')}">
        <span class="cn__label">${esc(c.links.about.label)}</span>
        <span class="cn__kicker">${esc(c.links.about.kicker)}</span>
      </a>
      <a class="cn cn--gallery" href="${href('gallery')}">
        <span class="cn__thumb"><img src="${asset(thumb.thumb)}" alt="" width="${thumb.width}" height="${thumb.height}" loading="eager" decoding="async"></span>
        <span class="cn__label">${esc(c.links.gallery.label)}</span>
        <span class="cn__kicker">${esc(c.links.gallery.kicker)}</span>
      </a>
      <a class="cn cn--rates burst" href="${href('rates')}">
        ${starburst()}
        <span class="burst__text"><span class="cn__label">${esc(c.links.rates.label)}</span><span class="cn__kicker">${esc(c.links.rates.kicker)}</span></span>
      </a>
      <a class="cn cn--etiquette" href="${href('etiquette')}">
        <span class="cn__label">${esc(c.links.etiquette.label)}</span>
        <span class="cn__kicker">${esc(c.links.etiquette.kicker)}</span>
      </a>
      <a class="cn cn--booking" href="${href('booking')}">
        <span class="cn__label">${esc(c.links.booking.label)}</span>
        <span class="cn__kicker">${esc(c.links.booking.kicker)}</span>
      </a>
    </nav>

    ${reviewsStamp('cover__stamp')}
  </div>`;
}
