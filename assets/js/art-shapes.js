/* ==========================================================================
   MM MOTORS — PICTOGRAM GEOMETRY

   Side profiles on a shared 1200 × 760 stage with the wheel baseline at
   y ≈ 660, so a scooter, a motorcycle and a moped sit at the same scale and
   can be swapped in the same frame.

   Proportions are tuned to read at hero scale, not just as a thumbnail: the
   seat sits ON the body rather than floating above it, the apron is tall
   enough to carry the headlight, and the muffler disappears behind the rear
   wheel the way it does on the real thing.

   Every component is a `data-part` group. The same vocabulary is used by the
   exploded view, the component-focus sequence and the WebGL scene, so all
   three tell one story.
   ========================================================================== */

/* Spokes for a wheel, as one path */
function spokes(cx, cy, r, count = 5) {
  let d = '';
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    d += `M ${cx} ${cy} L ${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)} `;
  }
  return d.trim();
}

function wheel(cx, cy, r, label) {
  const tyre = r - 8;
  const rim = r * 0.58;
  return `
  <g data-part="wheel-${label}" class="vp">
    <circle cx="${cx}" cy="${cy}" r="${tyre}" fill="none" stroke="var(--rubber)" stroke-width="20"/>
    <circle cx="${cx}" cy="${cy}" r="${rim}" fill="none" stroke="var(--rim)" stroke-width="7"/>
    <path d="${spokes(cx, cy, rim - 4, 5)}" stroke="var(--rim)" stroke-width="5" fill="none" opacity="0.75"/>
    <circle cx="${cx}" cy="${cy}" r="12" fill="var(--rim)"/>
  </g>`;
}

/* -------------------------------------------------------------------------- */
export function scooter({ electric }) {
  return `
  <g data-part="storage" class="vp vp--hidden">
    <rect x="318" y="392" width="208" height="76" rx="12" fill="none"
          stroke="var(--rim)" stroke-width="4" stroke-dasharray="11 8"/>
  </g>

  ${electric ? `
  <g data-part="battery" class="vp vp--hidden">
    <rect x="548" y="458" width="216" height="46" rx="8" fill="#2A2D33" stroke="var(--accent)" stroke-width="3"/>
    ${[0, 1, 2, 3, 4, 5]
      .map((i) => `<rect x="${564 + i * 31}" y="470" width="19" height="22" rx="3" fill="var(--accent)" opacity="0.6"/>`)
      .join('')}
  </g>
  <g data-part="motor" class="vp vp--hidden">
    <circle cx="300" cy="555" r="42" fill="#2A2D33" stroke="var(--accent)" stroke-width="3"/>
    <circle cx="300" cy="555" r="17" fill="none" stroke="var(--accent)" stroke-width="3"/>
  </g>` : `
  <g data-part="engine" class="vp vp--hidden">
    <rect x="346" y="500" width="118" height="62" rx="12" fill="#2A2D33" stroke="var(--accent)" stroke-width="3"/>
    <path d="M 362 516 h 86 M 362 532 h 86 M 362 548 h 86" stroke="var(--accent)" stroke-width="3" opacity="0.6"/>
  </g>
  <g data-part="exhaust" class="vp">
    <path d="M 500 566 L 386 560" stroke="var(--rim)" stroke-width="26"
          stroke-linecap="round" fill="none"/>
  </g>`}

  ${wheel(300, 555, 105, 'rear')}
  ${wheel(895, 555, 105, 'front')}

  <g data-part="suspension" class="vp">
    <path d="M 358 506 L 316 550" stroke="var(--rim)" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M 888 486 L 893 548" stroke="var(--rim)" stroke-width="13" stroke-linecap="round" fill="none"/>
  </g>

  <g data-part="fender" class="vp">
    <path d="M 812 492 A 105 105 0 0 1 968 460" stroke="var(--paint-dark)" stroke-width="15"
          stroke-linecap="round" fill="none"/>
  </g>

  <!-- body: one continuous spine — rear mass, step-through floor, rising apron -->
  <g data-part="body" class="vp">
    <path d="M 300 428 C 296 476 342 500 410 500 L 756 500 C 828 500 862 452 874 352"
          stroke="var(--paint)" stroke-width="78" stroke-linecap="round" fill="none"/>
    <path d="M 908 344 C 902 410 896 452 890 492"
          stroke="var(--paint)" stroke-width="44" stroke-linecap="round" fill="none"/>
    <path d="M 330 470 C 352 490 404 498 448 498"
          stroke="var(--paint-dark)" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.45"/>
    <path d="M 852 392 C 858 418 862 442 862 462"
          stroke="var(--paint-dark)" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.4"/>
  </g>

  <g data-part="seat" class="vp">
    <path d="M 302 372 L 536 364" stroke="var(--rubber)" stroke-width="46"
          stroke-linecap="round" fill="none"/>
    <path d="M 262 352 C 226 350 214 372 218 396" stroke="var(--rim)" stroke-width="13"
          stroke-linecap="round" fill="none"/>
  </g>

  <g data-part="handlebar" class="vp">
    <path d="M 874 336 L 870 288" stroke="var(--rim)" stroke-width="18" stroke-linecap="round" fill="none"/>
    <path d="M 806 280 L 944 270" stroke="var(--rim)" stroke-width="14" stroke-linecap="round" fill="none"/>
    <path d="M 806 280 L 836 278" stroke="var(--rubber)" stroke-width="21" stroke-linecap="round" fill="none"/>
    <path d="M 916 272 L 944 270" stroke="var(--rubber)" stroke-width="21" stroke-linecap="round" fill="none"/>
    <path d="M 934 271 L 954 216" stroke="var(--rim)" stroke-width="8" stroke-linecap="round" fill="none"/>
    <ellipse cx="958" cy="206" rx="17" ry="11" fill="var(--rim)"/>
  </g>

  <g data-part="headlight" class="vp" transform="rotate(-8 914 328)">
    <rect x="890" y="306" width="48" height="44" rx="12" fill="#F6F2E9"/>
    <rect x="890" y="306" width="48" height="44" rx="12" fill="none" stroke="var(--paint-dark)" stroke-width="3"/>
  </g>

  ${electric ? `
  <g data-part="charge-port" class="vp">
    <rect x="832" y="382" width="28" height="22" rx="4" fill="none" stroke="var(--accent)" stroke-width="3"/>
    <path d="M 841 389 v 8 M 851 389 v 8" stroke="var(--accent)" stroke-width="3"/>
  </g>` : ''}
  `;
}

/* -------------------------------------------------------------------------- */
export function motorcycle() {
  return `
  <g data-part="engine" class="vp vp--hidden">
    <rect x="502" y="462" width="168" height="114" rx="14" fill="#2A2D33" stroke="var(--accent)" stroke-width="3"/>
    <path d="M 522 482 h 128 M 522 504 h 128 M 522 526 h 128 M 522 548 h 128"
          stroke="var(--accent)" stroke-width="3" opacity="0.55"/>
  </g>

  <g data-part="exhaust" class="vp">
    <path d="M 624 548 C 544 566 434 572 358 564" stroke="var(--rim)" stroke-width="28"
          stroke-linecap="round" fill="none"/>
  </g>

  ${wheel(300, 548, 112, 'rear')}
  ${wheel(900, 548, 112, 'front')}

  <g data-part="suspension" class="vp">
    <path d="M 430 444 L 352 536" stroke="var(--rim)" stroke-width="14" stroke-linecap="round" fill="none"/>
    <path d="M 752 388 L 890 520" stroke="var(--rim)" stroke-width="15" stroke-linecap="round" fill="none"/>
    <path d="M 782 376 L 916 504" stroke="var(--rim)" stroke-width="11" stroke-linecap="round" fill="none" opacity="0.55"/>
  </g>

  <g data-part="fender" class="vp">
    <path d="M 818 470 A 112 112 0 0 1 976 438" stroke="var(--paint-dark)" stroke-width="15"
          stroke-linecap="round" fill="none"/>
    <path d="M 214 488 A 112 112 0 0 1 298 434" stroke="var(--paint-dark)" stroke-width="14"
          stroke-linecap="round" fill="none"/>
  </g>

  <g data-part="frame" class="vp">
    <path d="M 700 408 L 744 470" stroke="var(--rim)" stroke-width="14" stroke-linecap="round" fill="none"/>
    <path d="M 516 424 L 494 500 L 616 522" stroke="var(--rim)" stroke-width="12"
          stroke-linecap="round" fill="none"/>
    <path d="M 332 546 L 566 534" stroke="var(--rim)" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.65"/>
  </g>

  <g data-part="tank" class="vp">
    <path d="M 520 392 C 584 370 648 374 700 396" stroke="var(--paint)" stroke-width="84"
          stroke-linecap="round" fill="none"/>
    <path d="M 550 360 C 596 346 642 348 676 362" stroke="var(--paint-dark)" stroke-width="9"
          stroke-linecap="round" fill="none" opacity="0.4"/>
  </g>

  <g data-part="body" class="vp">
    <path d="M 300 394 C 264 390 248 404 242 424" stroke="var(--paint)" stroke-width="38"
          stroke-linecap="round" fill="none"/>
    <path d="M 706 400 C 738 384 756 374 768 366" stroke="var(--paint)" stroke-width="36"
          stroke-linecap="round" fill="none"/>
  </g>

  <g data-part="seat" class="vp">
    <path d="M 330 412 L 524 400" stroke="var(--rubber)" stroke-width="44"
          stroke-linecap="round" fill="none"/>
  </g>

  <g data-part="handlebar" class="vp">
    <path d="M 766 368 L 772 320" stroke="var(--rim)" stroke-width="16" stroke-linecap="round" fill="none"/>
    <path d="M 686 322 L 816 312" stroke="var(--rim)" stroke-width="14" stroke-linecap="round" fill="none"/>
    <path d="M 686 322 L 716 320" stroke="var(--rubber)" stroke-width="21" stroke-linecap="round" fill="none"/>
    <path d="M 788 314 L 816 312" stroke="var(--rubber)" stroke-width="21" stroke-linecap="round" fill="none"/>
    <path d="M 806 313 L 828 256" stroke="var(--rim)" stroke-width="8" stroke-linecap="round" fill="none"/>
    <ellipse cx="832" cy="246" rx="17" ry="11" fill="var(--rim)"/>
  </g>

  <g data-part="headlight" class="vp" transform="rotate(-12 764 350)">
    <rect x="740" y="328" width="50" height="46" rx="12" fill="#F6F2E9"/>
    <rect x="740" y="328" width="50" height="46" rx="12" fill="none" stroke="var(--paint-dark)" stroke-width="3"/>
  </g>
  `;
}

/* -------------------------------------------------------------------------- */
export function moped() {
  return `
  <g data-part="engine" class="vp vp--hidden">
    <rect x="404" y="498" width="96" height="54" rx="10" fill="#2A2D33" stroke="var(--accent)" stroke-width="3"/>
  </g>

  <g data-part="exhaust" class="vp">
    <path d="M 512 562 L 414 556" stroke="var(--rim)" stroke-width="18" stroke-linecap="round" fill="none"/>
  </g>

  ${wheel(320, 562, 100, 'rear')}
  ${wheel(880, 562, 100, 'front')}

  <g data-part="suspension" class="vp">
    <path d="M 874 492 L 878 556" stroke="var(--rim)" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M 374 516 L 336 554" stroke="var(--rim)" stroke-width="10" stroke-linecap="round" fill="none"/>
  </g>

  <g data-part="fender" class="vp">
    <path d="M 800 500 A 100 100 0 0 1 952 470" stroke="var(--paint-dark)" stroke-width="13"
          stroke-linecap="round" fill="none"/>
  </g>

  <g data-part="body" class="vp">
    <path d="M 322 448 C 318 486 358 506 424 506 L 752 506 C 810 506 840 470 852 400"
          stroke="var(--paint)" stroke-width="48" stroke-linecap="round" fill="none"/>
    <path d="M 884 392 C 880 434 876 468 872 492"
          stroke="var(--paint)" stroke-width="30" stroke-linecap="round" fill="none"/>
  </g>

  <g data-part="tank" class="vp">
    <path d="M 556 456 C 604 444 652 446 692 458" stroke="var(--paint-dark)" stroke-width="50"
          stroke-linecap="round" fill="none"/>
  </g>

  <g data-part="seat" class="vp">
    <path d="M 336 416 L 532 410" stroke="var(--rubber)" stroke-width="40"
          stroke-linecap="round" fill="none"/>
  </g>

  <g data-part="carrier" class="vp">
    <path d="M 212 400 L 312 398" stroke="var(--rim)" stroke-width="11" stroke-linecap="round" fill="none"/>
    <path d="M 214 400 L 222 442" stroke="var(--rim)" stroke-width="9" stroke-linecap="round" fill="none"/>
    <path d="M 296 398 L 302 436" stroke="var(--rim)" stroke-width="9" stroke-linecap="round" fill="none"/>
    <path d="M 916 386 L 1004 384" stroke="var(--rim)" stroke-width="11" stroke-linecap="round" fill="none"/>
    <path d="M 998 384 L 1002 416" stroke="var(--rim)" stroke-width="9" stroke-linecap="round" fill="none"/>
  </g>

  <g data-part="handlebar" class="vp">
    <path d="M 852 386 L 850 322" stroke="var(--rim)" stroke-width="15" stroke-linecap="round" fill="none"/>
    <path d="M 784 314 L 924 304" stroke="var(--rim)" stroke-width="13" stroke-linecap="round" fill="none"/>
    <path d="M 784 314 L 812 312" stroke="var(--rubber)" stroke-width="20" stroke-linecap="round" fill="none"/>
    <path d="M 896 306 L 924 304" stroke="var(--rubber)" stroke-width="20" stroke-linecap="round" fill="none"/>
    <path d="M 914 305 L 934 252" stroke="var(--rim)" stroke-width="7" stroke-linecap="round" fill="none"/>
    <ellipse cx="938" cy="243" rx="15" ry="10" fill="var(--rim)"/>
  </g>

  <g data-part="headlight" class="vp">
    <circle cx="890" cy="356" r="24" fill="#F6F2E9" stroke="var(--paint-dark)" stroke-width="3"/>
  </g>
  `;
}

export const KINDS = { scooter, motorcycle, moped };
