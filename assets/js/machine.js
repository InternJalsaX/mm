/* ==========================================================================
   MM MOTORS — INSIDE THE MACHINE
   The one scroll story on the site: Approach → Reveal → Inspect → Understand
   → Compare, with the vehicle returning to rest at the end (Brand Bible §26).

   The SVG exploded view is the baseline and always renders. WebGL is layered
   on top only when the device can clearly afford it, and is torn down the
   moment the section leaves the viewport — never a second live context.
   ========================================================================== */

import { byId } from './data/vehicles.js';
import { vehicleSVG, CALLOUTS } from './art.js';
import { onScrollProgress, reduceMotion, whenVisible } from './motion.js';

const HEROES = { petrol: 'tvs-jupiter', electric: 'tvs-iqube' };

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function capable() {
  return (
    hasWebGL() &&
    !reduceMotion() &&
    window.innerWidth >= 900 &&
    (navigator.hardwareConcurrency || 4) > 4 &&
    !navigator.connection?.saveData
  );
}

export function mountMachine({ section, viewport, callout, progress, modeButtons }) {
  if (!section || !viewport) return;

  let mode = 'petrol';
  let scene = null;        // the WebGL scene, if any
  let stopScroll = null;
  let lastStep = -1;
  let p = 0;

  const dots = CALLOUTS.petrol.map(() => '<span class="machine__dot"></span>').join('');
  if (progress) progress.innerHTML = dots;

  /* ---- render the SVG stage for the current mode ---- */
  function renderSVG() {
    const v = byId(HEROES[mode]);
    viewport.innerHTML = `<div class="machine__svg">${vehicleSVG(v, {
      className: 'v-art machine__art',
    })}</div>`;
    return viewport.querySelector('.v-art');
  }

  let art = renderSVG();

  /* ---- the scroll story ---- */
  function apply(progressValue) {
    p = progressValue;
    const list = CALLOUTS[mode];

    /* Explode: reveal 0.15→0.50, hold, re-assemble 0.86→1.0 */
    const exploded = p > 0.15 && p < 0.9;
    if (art) art.dataset.exploded = String(exploded);

    /* Which component are we inspecting */
    const step = Math.min(Math.floor(p * list.length), list.length - 1);

    if (step !== lastStep) {
      lastStep = step;
      const c = list[step];

      if (callout) {
        callout.dataset.live = 'false';
        // Re-enter so the transition replays for the new content
        requestAnimationFrame(() => {
          callout.querySelector('.callout__q').textContent = c.q;
          callout.querySelector('.callout__title').textContent = c.title;
          callout.querySelector('.callout__copy').textContent = c.copy;
          callout.dataset.live = 'true';
        });
      }

      if (progress) {
        [...progress.children].forEach((d, i) => (d.dataset.on = String(i <= step)));
      }

      if (art) {
        art.querySelectorAll('[data-focused]').forEach((g) => g.removeAttribute('data-focused'));
        if (exploded) {
          art.dataset.focus = 'true';
          art.querySelector(`[data-part="${c.part}"]`)?.setAttribute('data-focused', '');
        } else {
          delete art.dataset.focus;
        }
      }

      scene?.focus(c.part);
    }

    scene?.update(p, exploded);
  }

  /* ---- mode switch ---- */
  function setMode(next) {
    if (next === mode) return;
    mode = next;
    lastStep = -1;

    modeButtons?.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.machine === mode)));

    if (scene) {
      scene.setVehicle(byId(HEROES[mode]));
    } else {
      art = renderSVG();
    }
    apply(p);
  }

  modeButtons?.forEach((b) =>
    b.addEventListener('click', () => setMode(b.dataset.machine))
  );

  /* ---- scroll binding ---- */
  onScrollProgress(section, apply, {
    start: 'top top',
    end: 'bottom bottom',
  }).then((stop) => (stopScroll = stop));

  /* ---- optional WebGL upgrade ---- */
  if (capable()) {
    whenVisible(
      section,
      async () => {
        try {
          const mod = await import('./showroom3d.js');
          scene = await mod.createScene({
            container: viewport,
            vehicle: byId(HEROES[mode]),
            mode: 'story',
          });
          // The SVG stays in the DOM as the print/fallback layer but stops painting
          viewport.querySelector('.machine__svg')?.style.setProperty('display', 'none');
          lastStep = -1;
          apply(p);

          // Stop rendering whenever the section is off-screen
          const io = new IntersectionObserver(
            (entries) => scene?.setActive(entries.some((e) => e.isIntersecting)),
            { rootMargin: '10%' }
          );
          io.observe(section);
        } catch (err) {
          console.info('[MM Motors] 3D stage unavailable — using the vector exploded view.', err);
        }
      },
      '300px'
    );
  }

  apply(0);

  return {
    destroy() {
      stopScroll?.();
      scene?.destroy();
    },
  };
}
