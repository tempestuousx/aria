// ============================================================
// PAGE COPY  (first draft, Aria's voice). Edit freely.
// Facts live in src/config.js. Do not add unconfirmed facts here.
// ============================================================

export const content = {
  cover: {
    masthead: 'ARIA',
    ribbon: 'Las Vegas, Nevada',
    byline: 'An independent adult companion',
    links: {
      about: { label: 'About', kicker: 'Meet the girl on the cover' },
      gallery: { label: 'Gallery', kicker: 'The real me' },
      rates: { label: 'Rates', kicker: 'The details' },
      etiquette: { label: 'Etiquette', kicker: 'House rules, politely' },
      booking: { label: 'Booking', kicker: 'Request a date' },
    },
    textBubble: 'Text Aria',
  },

  about: {
    kicker: 'Page one',
    title: 'About Aria',
    opening: 'Hi, I\'m Aria. Come closer, the good part is in person.',
    intro: [
      'I\'m an independent companion based in Las Vegas, Nevada. This page is the first hello: a little attitude, a lot of warmth, and a good idea of what it\'s like to meet me.',
      'I like a confident message and a clear plan. Tell me who you are and when you\'d like to see me, and I\'ll take it from there, with a smile and a slightly bossy streak.',
      'Meeting me should feel easy. Be polite, be on time, be yourself, and leave the charm to me.',
    ],
    captions: [
      'Independent. Based in Las Vegas.',
      'The artwork and photographs on this site represent me.',
    ],
    pullQuote: 'Text me. Don\'t be shy.',
    photoCaption: 'Real photographs, no stand-ins.',
    ctaTitle: 'Ready to say hello?',
    ctaText: 'A text is the fastest way to reach me.',
  },

  gallery: {
    kicker: 'Page two',
    title: 'Gallery',
    intro: 'A few frames from the real me. Select a photo to see it larger.',
    // Photos live in GALLERY_PHOTOS below. Add an object to add a photo.
  },

  rates: {
    kicker: 'Page three',
    title: 'Rates',
    intro: 'Clear numbers, no guesswork. Final rates are being set, so the figures below are placeholders for now.',
    statusStamp: 'Rates coming soon',
    tableCaption: 'Duration and donation',
    tableNote: 'XXX and YYY are placeholders until rates are finalized.',
    depositHeading: 'New clients',
    videoHeading: 'Video verification',
    ctaText: 'Questions about rates? Text me.',
  },

  etiquette: {
    kicker: 'Page four',
    title: 'Etiquette',
    intro: 'A few friendly ground rules so we both have a good time.',
    sections: [
      { title: 'Be respectful', body: 'Write like you\'d speak to someone you want to impress. Polite, clear and kind gets the best reply.' },
      { title: 'Be accurate', body: 'Give me real, accurate details when you request a booking. It keeps everything smooth for both of us.' },
      { title: 'Be on time', body: 'Please arrive when we agree. If something changes, tell me as early as you can.' },
      { title: 'Be discreet', body: 'Your privacy matters, and so does mine. What we arrange stays between us.' },
      { title: 'Respect boundaries', body: 'Boundaries are personal. Respect mine, and I\'ll respect yours.' },
    ],
    depositHeading: 'Deposits and verification',
    depositIntro: 'I offer several ways to verify. Pick the one that suits you on the booking form and I\'ll follow up with the next steps.',
    verificationHeading: 'Verification options',
  },

  booking: {
    kicker: 'Page five',
    title: 'Booking',
    intro: 'Send a request and I\'ll get back to you. Prefer to skip the form? A text is the quickest way to reach me.',
    requestNotice:
      'Submitting a request does not confirm a booking. I\'ll follow up about verification, availability and the applicable deposit.',
    schedulingNote: 'Dates and times you enter are preferences only. Nothing is reserved or confirmed until I reply.',
    unconfiguredTitle: 'Online submission is not available yet',
    unconfiguredBody:
      'Nothing you enter here is sent anywhere. To request a booking right now, text Aria.',
    idVerificationNote:
      'For ID verification, Aria will provide instructions directly. Please do not send ID documents through this form.',
    videoNotice: 'Video verification costs $50 and is credited toward your final donation.',
    textFallbackIntro: 'Prefer to start with a message?',
  },

  footer: {
    line: 'Aria. Independent adult companion. Las Vegas, Nevada.',
  },
};

// ---------- Gallery photos ----------
// To add a photo: put the optimized files in public/img/ and add an entry.
//   src      full size (opens in the lightbox)
//   thumb    smaller file for the grid
//   tile     'wide' (spans two columns) or 'portrait' (cropped tile in the grid)
//   focus    CSS object-position for the grid crop only (the lightbox is never cropped)
export const GALLERY_PHOTOS = [
  {
    id: 'photo-01',
    src: '/img/aria-photo-01.webp',
    thumb: '/img/aria-photo-01-860.webp',
    width: 1760, height: 782,
    tile: 'wide',
    focus: '30% 50%',
    alt: 'Aria with bright pink hair and red lace lingerie, reclining on a grey sofa and looking toward the camera.',
    caption: 'Red lace, grey sofa.',
  },
  {
    id: 'photo-02',
    src: '/img/aria-photo-02.webp',
    thumb: '/img/aria-photo-02-860.webp',
    width: 1715, height: 3820,
    tile: 'portrait',
    focus: '50% 22%',
    alt: 'Aria with long bright pink hair, standing in front of white curtains in red lace lingerie with her hands on her hips.',
    caption: 'Hands on hips, eyes on you.',
  },
];
