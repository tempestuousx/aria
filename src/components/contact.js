import { contact, links } from '../config.js';
import { esc } from '../lib.js';

const label = `Text Aria at ${contact.phoneDisplay}`;

/** Primary direct-contact action. variant: bubble | pill | block */
export function textAria({ variant = 'pill', text = 'Text Aria', showNumber = true, extraClass = '' } = {}) {
  return `<a class="text-aria text-aria--${variant} ${extraClass}" href="${contact.smsHref}" aria-label="${esc(label)}" data-cta="text">
    <span class="text-aria__label">${esc(text)}</span>${showNumber ? `<span class="text-aria__num">${esc(contact.phoneDisplay)}</span>` : ''}
  </a>`;
}

export const callLink = () =>
  `<a class="inline-link" href="${contact.telHref}">Call ${esc(contact.phoneDisplay)}</a>`;

/** External links always open safely in a new tab. */
export const externalLink = (url, text, cls = '') =>
  `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(text)}<span class="sr-only"> (opens in a new tab)</span></a>`;

/** Editorial-stamp style review link. Neutral: no ratings, counts or quotes. */
export function reviewsStamp(extraClass = '') {
  return `<a class="stamp ${extraClass}" href="${esc(links.reviews.url)}" target="_blank" rel="noopener noreferrer">
    <span class="stamp__top">Read</span><span class="stamp__main">My Reviews</span>
    <span class="sr-only">(opens in a new tab)</span></a>`;
}

/** Footer-style contact + profile block used at the foot of interior pages. */
export function contactBlock() {
  return `<div class="contact-block">
    ${textAria({ variant: 'block' })}
    <p class="contact-block__alt">${callLink()} <span aria-hidden="true">/</span>
      ${externalLink(links.profile.url, links.profile.label, 'inline-link')} <span aria-hidden="true">/</span>
      ${externalLink(links.reviews.url, links.reviews.label, 'inline-link')}</p>
  </div>`;
}
