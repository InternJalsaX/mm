/* ==========================================================================
   MM MOTORS — VEHICLE MEDIA

   Product photography is the primary presentation. This module handles:

   1. Emitting the photo + its fallback, and swapping between them at runtime,
      so a missing or broken image never shows a grey box.
   2. The technical pictogram (geometry lives in art-shapes.js), used as that
      fallback, as tray/comparison thumbnails, and as the exploded view on
      devices where WebGL is not worth spending.

   Paint comes from `--paint` / `--paint-dark`, so a colour swatch recolours the
   pictogram by setting one custom property.
   ========================================================================== */

import { KINDS } from './art-shapes.js';

/* --------------------------------------------------------------------------
   Pictogram
   -------------------------------------------------------------------------- */
export function vehicleSVG(vehicle, opts = {}) {
  const kind = KINDS[vehicle.art] || KINDS.scooter;
  const electric = vehicle.fuel === 'electric';

  /* Default to a neutral technical palette rather than the vehicle's own paint.
     A Stealth Black scooter drawn in Stealth Black is invisible, and the
     pictogram's job here is legibility, not paint accuracy. The product page's
     colour configurator passes an explicit colour. */
  const colour = opts.colour || { paint: '#3A3F46', paintDark: '#20242A' };
  const style = `--paint:${colour.paint};--paint-dark:${colour.paintDark};--rubber:#14161A;--rim:#8B9199`;
  const cls = ['v-art', opts.className].filter(Boolean).join(' ');

  return `<svg class="${cls}" style="${style}" viewBox="0 0 1200 760"
    role="img" aria-label="${vehicle.name} — technical side illustration"
    preserveAspectRatio="xMidYMid meet" data-kind="${vehicle.art}">
    <g data-part="ground" class="vp">
      <ellipse cx="600" cy="678" rx="420" ry="17" fill="var(--paint-dark)" opacity="0.18"/>
    </g>
    ${kind({ electric })}
  </svg>`;
}

/* --------------------------------------------------------------------------
   Media block — photograph over the pictogram
   -------------------------------------------------------------------------- */
export function mediaHTML(vehicle, opts = {}) {
  const { colour, sizes = '(max-width: 720px) 90vw, 33vw', eager = false } = opts;
  const src = `assets/img/vehicles/${vehicle.id}.png`;

  return `<div class="v-media${opts.mediaClass ? ' ' + opts.mediaClass : ''}">
    <div class="v-media__fb" aria-hidden="true">${vehicleSVG(vehicle, { colour })}</div>
    <img class="v-media__photo" src="${src}" alt="${vehicle.name}"
         sizes="${sizes}" width="400" height="250"
         loading="${eager ? 'eager' : 'lazy'}" decoding="async"
         ${eager ? 'fetchpriority="high"' : ''}>
  </div>`;
}

/* --------------------------------------------------------------------------
   Resolve photo vs fallback. Call once per page after render.
   -------------------------------------------------------------------------- */
export function initMedia(root = document) {
  root.querySelectorAll('.v-media__photo:not([data-resolved])').forEach((img) => {
    const media = img.closest('.v-media');
    if (!media) return;
    img.dataset.resolved = '1';

    const fail = () => {
      media.dataset.photo = 'missing';
      img.remove();
    };
    const ok = () => {
      // Guard against a served error page or a 0-byte file
      if (!img.naturalWidth) return fail();
      media.dataset.photo = 'ok';
    };

    if (img.complete) {
      img.naturalWidth ? ok() : fail();
    } else {
      img.addEventListener('load', ok, { once: true });
      img.addEventListener('error', fail, { once: true });
    }
  });
}

/* --------------------------------------------------------------------------
   Component callouts, shared by the exploded view and the 3D scene so both
   tell the same story in the same order. Each answers one of the three
   questions from Brand Bible §24.
   -------------------------------------------------------------------------- */
export const CALLOUTS = {
  petrol: [
    {
      part: 'body',
      title: 'Chassis & body',
      q: 'What is it?',
      copy: 'An underbone frame with a step-through floor. This is what makes a scooter easy to get on and off in traffic, and what a motorcycle gives up for a fuel tank.',
    },
    {
      part: 'engine',
      title: 'Engine',
      q: 'How does it work?',
      copy: 'An air-cooled single cylinder driving a CVT. No gears to change — which is the entire point in stop-start city riding.',
    },
    {
      part: 'storage',
      title: 'Storage',
      q: 'Why does it matter?',
      copy: 'Underseat volume decides whether a helmet, a laptop bag and the day’s shopping all fit. Check the litres against what you actually carry.',
    },
    {
      part: 'wheel-front',
      title: 'Wheels & brakes',
      q: 'Why does it matter?',
      copy: 'A larger front wheel tracks better over broken tarmac. Synchronised braking splits force across both wheels from one lever.',
    },
    {
      part: 'seat',
      title: 'Seat & ergonomics',
      q: 'Why does it matter?',
      copy: 'Seat height decides whether you can flat-foot at a signal — the most underrated specification on any of these pages.',
    },
  ],
  electric: [
    {
      part: 'body',
      title: 'Chassis & body',
      q: 'What is it?',
      copy: 'The same step-through layout, with the battery carried low in the floor so the weight stays under you rather than above you.',
    },
    {
      part: 'battery',
      title: 'Battery pack',
      q: 'How does it work?',
      copy: 'Lithium-ion cells with a management system watching temperature and charge. Capacity in kWh is the number that sets your range — not the marketing figure.',
    },
    {
      part: 'motor',
      title: 'Hub motor',
      q: 'How does it work?',
      copy: 'The motor sits inside the rear wheel. No clutch, no gears, no chain — and far fewer parts that wear out and need servicing.',
    },
    {
      part: 'charge-port',
      title: 'Charging',
      q: 'Why does it matter?',
      copy: 'Charges from an ordinary domestic socket. If you ride twice a day, charging time matters more to you than headline range does.',
    },
    {
      part: 'wheel-front',
      title: 'Wheels & braking',
      q: 'Why does it matter?',
      copy: 'Regenerative braking recovers energy on the way down to a stop. That is why an EV’s city range often beats its highway range — the opposite of petrol.',
    },
  ],
};
