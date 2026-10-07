// ============================================================
// SITE CONFIGURATION  (edit this file for facts, links, rates, form delivery)
// Page copy lives in src/content.js
// ============================================================

export const site = {
  name: 'Aria',
  tagline: 'Independent adult companion',
  location: 'Las Vegas, Nevada',
  issue: '01',
  // Full public URL once known, e.g. 'https://example.com'. Leave '' until then.
  url: '',
  // '' when hosted at a domain root. Use '/subfolder' if hosted in a subfolder.
  basePath: '',
  // true = show clearly marked "TO CONFIRM" placeholders on the pages.
  // Set to false to hide them once the facts are filled in.
  showPlaceholders: true,
};

export const contact = {
  phoneDisplay: '725-877-6368',
  phoneE164: '+17258776368',
  get smsHref() { return `sms:${this.phoneE164}`; },
  get telHref() { return `tel:${this.phoneE164}`; },
};

export const links = {
  profile: { label: 'View My Profile', url: 'https://privatedelights.ch/profile/AmazingAria777' },
  // Neutral label until real review excerpts are supplied.
  reviews: { label: 'Read My Reviews', url: 'https://escortbabylon.net/review_list/7258776368' },
};

// Page order matters: it decides the page-turn direction.
export const pages = [
  {
    id: 'home', path: '/', navLabel: 'Cover',
    title: 'Aria | Independent Adult Companion in Las Vegas, Nevada',
    description: 'Aria is an independent adult companion based in Las Vegas, Nevada. Text 725-877-6368 or request a booking.',
  },
  {
    id: 'about', path: '/about/', navLabel: 'About',
    title: 'About Aria | Independent Adult Companion, Las Vegas',
    description: 'Meet Aria, an independent adult companion based in Las Vegas, Nevada.',
  },
  {
    id: 'gallery', path: '/gallery/', navLabel: 'Gallery',
    title: 'Gallery | Aria, Las Vegas, Nevada',
    description: 'Photographs of Aria, an independent adult companion based in Las Vegas, Nevada.',
  },
  {
    id: 'rates', path: '/rates/', navLabel: 'Rates',
    title: 'Rates | Aria, Las Vegas, Nevada',
    description: 'Rates for Aria, an independent adult companion in Las Vegas. New client deposit and video verification details.',
  },
  {
    id: 'etiquette', path: '/etiquette/', navLabel: 'Etiquette',
    title: 'Etiquette | Aria, Las Vegas, Nevada',
    description: 'How to book with Aria: respectful correspondence, accurate details, punctuality, discretion, boundaries, deposits and verification.',
  },
  {
    id: 'booking', path: '/booking/', navLabel: 'Booking',
    title: 'Booking Request | Aria, Las Vegas, Nevada',
    description: 'Send Aria a booking request with basic screening details. Submitting a request does not confirm a booking.',
  },
];

// ---------- Rates ----------
// XXX / YYY are placeholders. Replace with real values and set finalized: true.
export const rates = {
  finalized: false,
  columns: { duration: 'Duration', donation: 'Donation' },
  rows: [
    { duration: 'XXX', donation: 'YYY' },
    { duration: 'XXX', donation: 'YYY' },
    { duration: 'XXX', donation: 'YYY' },
  ],
  depositNotice:
    'New clients: a 20% deposit is required to confirm your booking and is credited toward your final donation.',
  videoVerificationNotice:
    'Video verification is $50 and is credited toward your final donation.',
};

// ---------- Verification ----------
export const verificationMethods = [
  { value: 'provider-references', label: 'Provider references' },
  { value: 'id-verification', label: 'ID verification' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'voice-call', label: 'Voice call' },
  { value: 'text', label: 'Text' },
  { value: 'video-call', label: 'Video call' },
];

// ---------- Booking form delivery ----------
// No delivery service has been supplied yet, so the form is honest about it.
// To enable online submission, set `endpoint` to a form service URL
// (for example a Formspree, Basin or Getform endpoint) or your own API.
// The form posts JSON and treats any non-2xx reply as a failure.
export const submission = {
  endpoint: '',
  method: 'POST',
};

// ---------- Marked placeholders for unconfirmed facts ----------
export const placeholders = {
  aboutDetails: 'Add anything Aria wants shared about herself here.',
  availability: 'Add days and hours here once confirmed.',
};
