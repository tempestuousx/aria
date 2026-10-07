// Shared SVG symbols (suits, arrows) plus small generated SVG shapes.
export const symbols = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <defs>
    <symbol id="i-heart" viewBox="0 0 100 100"><path d="M50 90C20 66 6 48 6 30 6 16 17 8 29 8c9 0 17 5 21 13C54 13 62 8 71 8c12 0 23 8 23 22 0 18-14 36-44 60z"/></symbol>
    <symbol id="i-diamond" viewBox="0 0 100 100"><path d="M50 4 88 50 50 96 12 50z"/></symbol>
    <symbol id="i-spade" viewBox="0 0 100 100"><path d="M50 4C34 26 6 42 6 62c0 14 10 22 22 22 8 0 14-3 18-9-1 8-4 14-10 20h28c-6-6-9-12-10-20 4 6 10 9 18 9 12 0 22-8 22-22C94 42 66 26 50 4z"/></symbol>
    <symbol id="i-club" viewBox="0 0 100 100"><path d="M50 4a21 21 0 0 0-14 36 21 21 0 1 0 9 38c-1 8-4 14-9 20h28c-5-6-8-12-9-20a21 21 0 1 0 9-38A21 21 0 0 0 50 4z"/></symbol>
  </defs>
</svg>`;

export const suit = (name, cls = '') =>
  `<svg class="suit ${cls}" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;

/** Restrained starburst: many points, shallow depth. Returns an SVG polygon. */
export function starburst(points = 18, inner = 0.86) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? 48 : 48 * inner;
    const a = (Math.PI * i) / points - Math.PI / 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return `<svg class="burst__shape" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><polygon points="${pts.join(' ')}"/></svg>`;
}

/** Decorative barcode (deterministic bars, not a real code). */
export function barcode() {
  const widths = [2,1,3,1,1,2,3,1,2,1,1,3,2,1,2,2,1,3,1,2,1,1,2,3,1,2,1,3,1,1,2];
  let x = 0, bars = '';
  widths.forEach((w, i) => { if (i % 2 === 0) bars += `<rect x="${x}" y="0" width="${w}" height="40"/>`; x += w; });
  return `<svg class="barcode__svg" viewBox="0 0 ${x} 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">${bars}</svg>`;
}

export const arrow = `<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"/></svg>`;
export const arrowBack = `<svg class="arrow arrow--back" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 12H6M12 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"/></svg>`;
