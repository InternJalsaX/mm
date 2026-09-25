/* ==========================================================================
   MM MOTORS — PRODUCT PAGE
   One template, driven entirely by assets/js/data/vehicles.js.

   Section order is the Brand Bible's six-level hierarchy (§12, §32):
   quick decision data → performance → practicality → features → safety →
   colours → variants → ownership → test ride.
   ========================================================================== */

import { VEHICLES, BRANDS, byId, byBrand, priceLabel, COUNTS } from '../data/vehicles.js';
import { mediaHTML, vehicleSVG } from '../art.js';
import {
  metric, metricRow, price, specTable, featureList, disclosure, fuelTag,
  swatches, rail, vCard, esc, ICON, SPEC_DISCLOSURE, PRICE_DISCLOSURE,
} from '../ui.js';
import { reduceMotion, whenVisible } from '../motion.js';
import * as garage from '../garage.js';

let vehicle = null;
let colourIndex = 0;
let scene = null;

/* -------------------------------------------------------------------------- */
function resolve() {
  const id = new URLSearchParams(location.search).get('m');
  return byId(id) || null;
}

function notFound(id) {
  document.getElementById('model-hero').innerHTML = `
    <div class="empty" style="max-width:56ch">
      <p class="eyebrow" data-index="!">Not found</p>
      <h1 class="h2">We don't have that model.</h1>
      <p class="body-dim">
        ${id ? `Nothing on the MM Motors floor matches <code>${esc(id)}</code>.` : 'No model was specified.'}
        It may have been renamed, or the link may be out of date.
      </p>
      <div class="cluster">
        <a class="btn btn--primary" href="models.html">See all ${COUNTS.models} models ${ICON.arrow}</a>
        <a class="btn btn--outline" href="finder.html">Find your ride</a>
      </div>
    </div>`;
  document.querySelector('.p-nav')?.remove();
}

/* -------------------------------------------------------------------------- */
function hero() {
  const el = document.getElementById('model-hero');
  const brand = BRANDS[vehicle.brand];

  el.innerHTML = `
    <div class="p-hero__grid">
      <div class="p-hero__stage">
        <div class="p-hero__viewport" id="p-stage">
          ${mediaHTML(vehicle, {
            eager: true,
            sizes: '(max-width: 1000px) 92vw, 54vw',
            colour: vehicle.colours[0],
          })}
        </div>
        <div class="p-hero__tools">
          <button class="chip" type="button" id="p-explode" aria-pressed="false">
            Exploded view
          </button>
          <span class="p-hero__hint" id="p-hint"></span>
        </div>
      </div>

      <div class="p-hero__info">
        <div class="p-hero__name">
          <span class="p-hero__brand">${esc(brand.name)}</span>
          <h1 class="h1" style="font-size:clamp(2rem,4.4vw,3.5rem)">${esc(vehicle.model)}</h1>
          <div class="cluster">
            ${fuelTag(vehicle.fuel)}
            <span class="micro">${esc(vehicle.type)}</span>
          </div>
          <p class="lede" style="font-size:1.0625rem">${esc(vehicle.headline)}</p>
        </div>

        ${price(vehicle.price)}

        <div class="p-hero__cta">
          <a class="btn btn--primary" href="test-ride.html?m=${vehicle.id}">
            Book a test ride ${ICON.arrow}
          </a>
          <button class="cmp-toggle btn btn--outline" type="button" data-cmp="${vehicle.id}"
                  aria-pressed="false" style="gap:9px">
            <span class="cmp-toggle__box">${ICON.check}</span>
            <span class="cmp-toggle__text">Compare</span>
          </button>
        </div>

        <div class="p-hero__colour">
          ${swatches(vehicle, { active: 0 })}
          <span class="p-hero__colourname" id="p-colourname">${esc(vehicle.colours[0].name)}</span>
        </div>

        <p class="body-dim" style="font-size:var(--fs-small)">${esc(vehicle.blurb)}</p>
      </div>
    </div>

    <div style="margin-top:var(--s-6)">
      <p class="eyebrow" data-index="01">Quick decision data</p>
      ${metricRow(vehicle, { count: true })}
      ${disclosure(SPEC_DISCLOSURE)}
    </div>`;
}

/* -------------------------------------------------------------------------- */
const SECTIONS = [
  { id: 'performance', idx: '02', title: 'Performance', note: 'What it does.' },
  { id: 'practicality', idx: '03', title: 'Practicality', note: 'Whether it fits your life.' },
  { id: 'features', idx: '04', title: 'Technology', note: 'What it tells you.' },
  { id: 'safety', idx: '05', title: 'Safety', note: 'What stops it.' },
  { id: 'colours', idx: '06', title: 'Colours', note: 'Available finishes.' },
  { id: 'variants', idx: '07', title: 'Variants', note: 'What changes, and what it costs.' },
  { id: 'ownership', idx: '08', title: 'Ownership', note: 'The next five years.' },
];

function nav() {
  const el = document.getElementById('model-nav');
  el.innerHTML = SECTIONS.map(
    (s) => `<a href="#${s.id}">${esc(s.title)}</a>`
  ).join('');

  // Mark the section currently in view
  const links = [...el.querySelectorAll('a')];
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) =>
          a.classList.toggle('is-active', a.getAttribute('href') === `#${e.target.id}`)
        );
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  SECTIONS.forEach((s) => {
    const t = document.getElementById(s.id);
    if (t) io.observe(t);
  });
}

function section(spec, inner) {
  return `<section class="p-sec" id="${spec.id}">
    <div class="p-sec__label">
      <span class="p-sec__idx">${spec.idx}</span>
      <h2 class="p-sec__title">${esc(spec.title)}</h2>
      <p class="p-sec__note">${esc(spec.note)}</p>
    </div>
    <div class="p-sec__body" data-reveal="fade">${inner}</div>
  </section>`;
}

/* -------------------------------------------------------------------------- */
function emi() {
  const p = vehicle.price.from;
  return `<div class="emi" id="emi">
    <div>
      <p class="eyebrow" data-index="→" style="margin-bottom:var(--s-3)">EMI estimate</p>
      <p class="body-dim" style="font-size:var(--fs-small)">
        A rough monthly figure on the indicative ex-showroom price. Move the
        controls to match what you are actually expecting.
      </p>
    </div>

    <div class="emi__controls">
      <div class="field">
        <label class="field__label" for="emi-dp">
          Down payment · <span class="emi__ctrl-value" id="emi-dp-out">20%</span>
        </label>
        <input class="range" type="range" id="emi-dp" min="10" max="60" step="5" value="20">
      </div>
      <div class="field">
        <label class="field__label" for="emi-tenure">
          Tenure · <span class="emi__ctrl-value" id="emi-tenure-out">24 months</span>
        </label>
        <input class="range" type="range" id="emi-tenure" min="12" max="48" step="6" value="24">
      </div>
      <div class="field">
        <label class="field__label" for="emi-rate">
          Interest · <span class="emi__ctrl-value" id="emi-rate-out">11.0%</span>
        </label>
        <input class="range" type="range" id="emi-rate" min="8" max="18" step="0.5" value="11">
      </div>
    </div>

    <div class="emi__out">
      <div>
        <p class="metric__label">Estimated monthly</p>
        <p class="emi__figure"><span style="font-size:0.55em">₹</span><span id="emi-figure">0</span></p>
      </div>
      <div>
        <p class="metric__label">Loan amount</p>
        <p class="emi__ctrl-value" id="emi-principal">₹0</p>
      </div>
      <div>
        <p class="metric__label">On ex-showroom</p>
        <p class="emi__ctrl-value">₹${priceLabel(p)}</p>
      </div>
    </div>

    ${disclosure(
      'Indicative estimate on a reducing-balance calculation. Not an offer of credit, not a quotation, and calculated on the ex-showroom price — the real loan is on the on-road price. Confirm with MM Motors.'
    )}
  </div>`;
}

function wireEmi() {
  const dp = document.getElementById('emi-dp');
  const tn = document.getElementById('emi-tenure');
  const rt = document.getElementById('emi-rate');
  if (!dp) return;

  const fmt = (n) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

  const update = () => {
    const pct = Number(dp.value);
    const months = Number(tn.value);
    const annual = Number(rt.value);

    const principal = Math.round(vehicle.price.from * (1 - pct / 100));
    const r = annual / 12 / 100;
    const emiValue = r
      ? (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
      : principal / months;

    document.getElementById('emi-dp-out').textContent = `${pct}%`;
    document.getElementById('emi-tenure-out').textContent = `${months} months`;
    document.getElementById('emi-rate-out').textContent = `${annual.toFixed(1)}%`;
    document.getElementById('emi-figure').textContent = fmt(Math.round(emiValue));
    document.getElementById('emi-principal').textContent = `₹${fmt(principal)}`;
  };

  [dp, tn, rt].forEach((el) => el.addEventListener('input', update));
  update();
}

/* -------------------------------------------------------------------------- */
function body() {
  const el = document.getElementById('model-body');
  const o = vehicle.ownership;

  el.innerHTML = [
    section(
      SECTIONS[0],
      `<div class="spec-cols">${specTable(vehicle.perf)}</div>${disclosure(SPEC_DISCLOSURE)}`
    ),
    section(
      SECTIONS[1],
      `<div class="spec-cols">${specTable(vehicle.practical)}</div>${disclosure(SPEC_DISCLOSURE)}`
    ),
    section(SECTIONS[2], featureList(vehicle.tech)),
    section(
      SECTIONS[3],
      featureList(vehicle.safety) +
        disclosure(
          'Safety equipment varies by variant. Check which system is fitted to the specific variant you are buying.'
        )
    ),
    section(
      SECTIONS[4],
      `<div class="colour-grid">
        ${vehicle.colours
          .map(
            (c) => `<div class="colour-card">
          <span class="colour-card__chip" style="background:${c.paint}"></span>
          <span class="micro" style="color:var(--fg)">${esc(c.name)}</span>
        </div>`
          )
          .join('')}
      </div>
      ${disclosure('Colour availability changes with stock and model year. Confirm what MM Motors can deliver.')}`
    ),
    section(
      SECTIONS[5],
      `<div class="variant-list">
        ${vehicle.variants
          .map(
            (v) => `<div class="variant">
          <div>
            <p class="variant__name">${esc(v.name)}</p>
            <p class="variant__note">${esc(v.note)}</p>
          </div>
          <div style="text-align:right">
            <p class="variant__name">₹${priceLabel(v.from)}</p>
            <p class="variant__note">from, ex-showroom</p>
          </div>
        </div>`
          )
          .join('')}
      </div>
      ${disclosure(PRICE_DISCLOSURE)}`
    ),
    section(
      SECTIONS[6],
      `<div class="own-grid">
        <div class="own-card"><h4>Warranty</h4><p>${esc(o.warranty)}</p></div>
        <div class="own-card"><h4>Service</h4><p>${esc(o.service)}</p></div>
        <div class="own-card"><h4>Finance</h4><p>${esc(o.finance)}</p></div>
        <div class="own-card"><h4>Exchange</h4><p>${esc(o.exchange)}</p></div>
      </div>
      ${emi()}`
    ),
  ].join('');

  wireEmi();
}

/* -------------------------------------------------------------------------- */
function testRide() {
  const brand = BRANDS[vehicle.brand];
  document.getElementById('model-tr-copy').textContent =
    `Ten minutes on the ${vehicle.model} tells you more than this entire page. Ride it against whatever else you are considering — that comparison is the only one that counts.`;
  document.getElementById('model-tr-cta').href = `test-ride.html?m=${vehicle.id}`;

  const art = document.getElementById('model-tr-art');
  whenVisible(art, () => {
    art.innerHTML = mediaHTML(vehicle, {
      sizes: '(max-width: 1000px) 88vw, 40vw',
      colour: vehicle.colours[colourIndex],
    });
    window.__mmRescan?.(art);
  });
  void brand;
}

/* -------------------------------------------------------------------------- */
function related() {
  const el = document.getElementById('model-related');

  /* Neighbours worth actually considering: same fuel and nearest in price,
     plus the closest thing from the other manufacturer. */
  const others = VEHICLES.filter((v) => v.id !== vehicle.id);
  const sameFuel = others
    .filter((v) => v.fuel === vehicle.fuel)
    .sort(
      (a, b) =>
        Math.abs(a.price.from - vehicle.price.from) - Math.abs(b.price.from - vehicle.price.from)
    );
  const otherBrand = others
    .filter((v) => v.brand !== vehicle.brand && v.type === vehicle.type)
    .sort(
      (a, b) =>
        Math.abs(a.price.from - vehicle.price.from) - Math.abs(b.price.from - vehicle.price.from)
    );

  /* Same body type at a similar price, regardless of fuel. For the only
     electric model on the floor there is no same-fuel neighbour at all, and the
     genuinely useful comparison there is against petrol scooters it competes
     with — not an empty row. */
  const sameType = others
    .filter((v) => v.type === vehicle.type)
    .sort(
      (a, b) =>
        Math.abs(a.price.from - vehicle.price.from) - Math.abs(b.price.from - vehicle.price.from)
    );

  const picks = [
    ...new Set([...otherBrand.slice(0, 1), ...sameFuel, ...sameType, ...others]),
  ].slice(0, 4);

  el.innerHTML = `<div class="wrap">
    <header class="sec-head">
      <div>
        <p class="eyebrow" data-index="→" data-reveal="fade">Also consider</p>
        <h2 class="h2" data-reveal>What else people<br>look at next to this.</h2>
      </div>
      <a class="link-rule" data-reveal="fade" href="compare.html">Compare them ${ICON.arrow}</a>
    </header>
    <div class="v-grid v-grid--swipe" data-reveal-group>
      ${picks.map((v) => vCard(v, { sizes: '(max-width:720px) 78vw, 24vw' })).join('')}
    </div>
  </div>`;
}

/* -------------------------------------------------------------------------- */
function stage() {
  const host = document.getElementById('p-stage');
  const explode = document.getElementById('p-explode');
  const hint = document.getElementById('p-hint');

  const svgArt = () => host.querySelector('.v-media__fb .v-art');

  /* --- colour configurator ------------------------------------------------ */
  document.querySelector('.p-hero__colour')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-swatch]');
    if (!btn) return;

    colourIndex = Number(btn.dataset.swatch);
    const colour = vehicle.colours[colourIndex];

    document
      .querySelectorAll('[data-swatch]')
      .forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    document.getElementById('p-colourname').textContent = colour.name;

    // Recolouring the pictogram is a single custom-property write
    const art = svgArt();
    if (art) {
      art.style.setProperty('--paint', colour.paint);
      art.style.setProperty('--paint-dark', colour.paintDark);
    }
    scene?.setColour(colour);
  });

  /* --- exploded view ------------------------------------------------------ */
  let exploded = false;
  explode?.addEventListener('click', () => {
    exploded = !exploded;
    explode.setAttribute('aria-pressed', String(exploded));
    const art = svgArt();
    if (art) art.dataset.exploded = String(exploded);
    scene?.setExploded(exploded);
  });

  /* --- optional WebGL viewer --------------------------------------------- */
  const capable =
    !reduceMotion() &&
    window.innerWidth >= 900 &&
    (navigator.hardwareConcurrency || 4) > 4 &&
    !navigator.connection?.saveData;

  if (!capable) {
    hint.textContent = 'Photograph and technical illustration';
    return;
  }

  whenVisible(
    host,
    async () => {
      try {
        const mod = await import('../showroom3d.js');
        scene = await mod.createScene({
          container: host,
          vehicle,
          mode: 'viewer',
        });
        // Hide the flat layer — one live representation at a time
        host.querySelector('.v-media').style.display = 'none';
        scene.setColour(vehicle.colours[colourIndex]);
        scene.setExploded(exploded);
        hint.textContent = 'Drag to rotate · 360°';

        const io = new IntersectionObserver(
          (entries) => scene?.setActive(entries.some((x) => x.isIntersecting)),
          { rootMargin: '10%' }
        );
        io.observe(host);
      } catch (err) {
        hint.textContent = 'Photograph and technical illustration';
        console.info('[MM Motors] 3D viewer unavailable — using the flat stage.', err);
      }
    },
    '200px'
  );
}

/* -------------------------------------------------------------------------- */
export function init() {
  vehicle = resolve();

  if (!vehicle) {
    notFound(new URLSearchParams(location.search).get('m'));
    return;
  }

  document.title = `${vehicle.name} — price, specifications & test ride · MM Motors`;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      `${vehicle.name}: ${vehicle.headline} Manufacturer-claimed specifications, colours, variants and indicative ex-showroom price at MM Motors.`
    );

  document.getElementById('model-rail').innerHTML = rail([
    { label: 'MM Motors', href: 'index.html' },
    { label: BRANDS[vehicle.brand].name, href: `brand.html?b=${vehicle.brand}` },
    { label: vehicle.model },
  ]);

  hero();
  nav();
  body();
  testRide();
  related();
  stage();

  garage.syncToggles();
}
