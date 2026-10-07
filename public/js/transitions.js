// Comic page turn: a paper "leaf" (snapshot of the page you are leaving) swings away
// from the spine, casting a fold shadow and revealing the destination underneath.
// The destination is already live in the DOM, so nothing waits on the animation.
export const TURN_MS = 600;

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export async function turnPage({ direction, swap, duration = TURN_MS }) {
  const layer = document.getElementById('turn-layer');
  const stage = document.getElementById('stage');
  const current = stage.querySelector('.page');
  if (prefersReducedMotion() || !layer || !current || !current.animate) { swap(); return; }

  const forward = direction === 'forward';
  const sign = forward ? -1 : 1;

  // --- Build the leaf from a static clone of what the visitor is looking at
  const clone = current.cloneNode(true);
  clone.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  clone.querySelectorAll('[tabindex]').forEach((n) => n.removeAttribute('tabindex'));
  clone.setAttribute('inert', '');
  clone.setAttribute('aria-hidden', 'true');

  const cloneWrap = document.createElement('div');
  cloneWrap.className = 'leaf__clone';
  cloneWrap.style.transform = `translateY(${-window.scrollY}px)`;
  cloneWrap.appendChild(clone);

  const shade = Object.assign(document.createElement('div'), { className: 'leaf__shade' });
  const edge = Object.assign(document.createElement('div'), { className: 'leaf__edge' });
  const front = Object.assign(document.createElement('div'), { className: 'leaf__face leaf__front' });
  front.append(cloneWrap, shade, edge);
  const back = Object.assign(document.createElement('div'), { className: 'leaf__face leaf__back' });
  const leaf = Object.assign(document.createElement('div'), { className: `leaf leaf--${forward ? 'forward' : 'back'}` });
  leaf.append(front, back);
  const shadow = Object.assign(document.createElement('div'), { className: `turn-shadow${forward ? '' : ' turn-shadow--back'}` });

  layer.replaceChildren(shadow, leaf);
  layer.classList.add('is-active');

  // Swap the real page in underneath while the leaf covers it
  swap();

  const ease = 'cubic-bezier(.45,.05,.3,1)';
  const anims = [
    leaf.animate(
      [
        { transform: 'rotateY(0deg)' },
        { transform: `rotateY(${sign * 90}deg) skewY(${-sign * 1.6}deg)`, offset: 0.5 },
        { transform: `rotateY(${sign * 179}deg)` },
      ],
      { duration, easing: ease, fill: 'forwards' }
    ),
    shade.animate([{ opacity: 0 }, { opacity: 1 }], { duration: duration * 0.5, easing: 'ease-in', fill: 'forwards' }),
    shadow.animate(
      [
        { opacity: 0, transform: 'scaleX(.25)' },
        { opacity: 1, transform: 'scaleX(1)', offset: 0.45 },
        { opacity: 0, transform: 'scaleX(1)' },
      ],
      { duration, easing: 'ease-in-out', fill: 'forwards' }
    ),
  ];
  await Promise.all(anims.map((a) => a.finished.catch(() => {})));
  layer.classList.remove('is-active');
  layer.replaceChildren();
}
