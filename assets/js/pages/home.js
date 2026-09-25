/* ==========================================================================
   MM MOTORS — HOMEPAGE
   Section order is the customer journey, not a content inventory.
   ========================================================================== */

import { VEHICLES, BRANDS, byId, byBrand, priceLabel, COUNTS, inWords } from '../data/vehicles.js';
import { mediaHTML } from '../art.js';
import { esc, ICON, fuelTag } from '../ui.js';
import { mountFinder } from '../finder-widget.js';
import { renderCompare, HOME_ROWS } from '../compare-view.js';
import { mountMachine } from '../machine.js';
import { whenVisible } from '../motion.js';
import * as garage from '../garage.js';

const HERO = 'tvs-ntorq-125';

/* -------------------------------------------------------------------------- */
function hero() {
  const el = document.getElementById('hero-art');
  if (!el) return;
  const v = byId(HERO);
  const cap = el.querySelector('.hero__artcap');
  el.insertAdjacentHTML(
    'afterbegin',
    mediaHTML(v, { eager: true, sizes: '(max-width: 899px) 92vw, 52vw' })
  );
  if (cap) {
    const pp = v.quick.find((q) => /engine|battery/i.test(q.label));
    cap.textContent = `${v.name} · ${v.fuel === 'electric' ? 'Electric' : 'Petrol'} · ${pp.value} ${pp.unit}`;
  }
}

/* -------------------------------------------------------------------------- */
function ticker() {
  const el = document.getElementById('ticker');
  if (!el) return;

  const items = [
    ...Object.values(BRANDS).map((b) => b.name),
    `${COUNTS.models} models on the floor`,
    'Petrol & electric',
    'Test rides 7 days a week',
    'Finance · Insurance · Exchange',
    'Service bay on site',
  ];
  // Doubled so the -50% marquee loop is seamless
  el.innerHTML = [...items, ...items]
    .map((t) => `<span class="ticker__item">${esc(t)}</span>`)
    .join('');
}

/* -------------------------------------------------------------------------- */
/* The homepage's primary experience: the manufacturers, and nothing else at    */
/* product level. Brand Bible §27 — "the homepage is not a product catalogue,   */
/* it is the entrance to the showroom." Each row links into that brand's own    */
/* section, where its products are listed.                                      */
function brandIndex() {
  const el = document.getElementById('brand-index');
  if (!el) return;

  /* The model each brand leads with on the floor */
  const LEAD = {
    tvs: 'tvs-ntorq-125',
    honda: 'honda-activa',
    bajaj: 'bajaj-pulsar-ns200',
    royalenfield: 're-classic-350',
    river: 'river-indie',
  };

  el.innerHTML = Object.values(BRANDS)
    .map((brand, i) => {
      const models = byBrand(brand.id);
      const lead = byId(LEAD[brand.id]) || models[0];
      const electric = models.filter((v) => v.fuel === 'electric').length;
      const cheapest = Math.min(...models.map((v) => v.price.from));

      return `<a class="brand-row" href="brand.html?b=${brand.id}"
        aria-label="${esc(brand.name)} — ${models.length} models at MM Motors">
      <div class="brand-row__inner">
        <span class="brand-row__idx">${String(i + 1).padStart(2, '0')}</span>

        <div>
          <h3 class="brand-row__name">
            ${esc(brand.name)}
            <span class="brand-row__go">${ICON.arrow}</span>
          </h3>
          <p class="brand-row__statement">${esc(brand.statement)}</p>
          <p class="brand-row__meta">
            <span>${models.length} model${models.length === 1 ? '' : 's'}</span>
            <span>${electric ? `<span class="accent">${electric} electric</span>` : 'Petrol only'}</span>
            <span>From ₹${priceLabel(cheapest)}</span>
          </p>
          <span class="brand-row__models">
            ${models
              .map(
                (v) => `<span class="model-chip">
              <span class="model-chip__dot" data-fuel="${v.fuel}"></span>${esc(v.model)}
            </span>`
              )
              .join('')}
          </span>
        </div>

        <div class="brand-row__art" aria-hidden="true">
          ${mediaHTML(lead, { sizes: '(max-width: 899px) 84vw, 28vw' })}
        </div>
      </div>
    </a>`;
    })
    .join('');
}

/* -------------------------------------------------------------------------- */
function split() {
  const el = document.getElementById('split');
  if (!el) return;

  const worlds = [
    {
      id: 'petrol',
      label: 'Petrol',
      lead: 'honda-activa',
      statement: 'Built for the everyday.',
      copy: `Refuel in two minutes, service anywhere, resell easily. ${inWords(COUNTS.petrol)[0].toUpperCase() + inWords(COUNTS.petrol).slice(1)} of our ${inWords(COUNTS.models)} models run on petrol.`,
      concerns: [
        ['CC', 'Engine size, which sets how it pulls with a pillion'],
        ['KM/L', 'Claimed mileage — your real figure depends on your right hand'],
        ['KG', 'Kerb weight, which decides how it feels at walking pace'],
        ['L', 'Tank size, which sets your range between fills'],
      ],
      count: VEHICLES.filter((v) => v.fuel === 'petrol').length,
    },
    {
      id: 'electric',
      label: 'Electric',
      lead: 'tvs-iqube',
      statement: 'Charge. Ride. Repeat.',
      copy: 'Costs more to buy and much less to run. Worth it if you ride a predictable distance and can charge where you park.',
      concerns: [
        ['KWH', 'Battery capacity, the number that actually sets range'],
        ['KM', 'Claimed range — always confirm how it was measured'],
        ['HRS', 'Charging time, which matters more than range if you ride twice a day'],
        ['KW', 'Motor power, which sets how briskly it gets off a signal'],
      ],
      count: VEHICLES.filter((v) => v.fuel === 'electric').length,
    },
  ];

  el.innerHTML = worlds
    .map(
      (w) => `<section class="split__half" data-world="${w.id}" aria-labelledby="world-${w.id}">
    <div>
      <div class="cluster" style="margin-bottom:var(--s-4)">
        ${fuelTag(w.id)}
        <span class="micro">${w.count} model${w.count === 1 ? '' : 's'}</span>
      </div>
      <h3 class="split__label" id="world-${w.id}">
        ${w.id === 'electric' ? `<span class="accent">${esc(w.label)}</span>` : esc(w.label)}
      </h3>
      <p class="lede" style="margin-top:var(--s-3);font-size:1.0625rem">${esc(w.statement)}</p>
      <p style="color:var(--mist);font-size:var(--fs-small);max-width:40ch;margin-top:var(--s-3)">
        ${esc(w.copy)}
      </p>
      <ul class="split__concerns">
        ${w.concerns
          .map(
            ([unit, note]) => `<li><span class="micro">${esc(unit)}</span><span>${esc(note)}</span></li>`
          )
          .join('')}
      </ul>
    </div>

    <div>
      <div class="split__art" aria-hidden="true">
        ${mediaHTML(byId(w.lead), { sizes: '(max-width: 900px) 84vw, 42vw' })}
      </div>
      <a class="btn btn--outline btn--block" href="models.html?fuel=${w.id}"
         style="margin-top:var(--s-4)">
        See all ${esc(w.label.toLowerCase())} ${ICON.arrow}
      </a>
    </div>
  </section>`
    )
    .join('');
}

/* -------------------------------------------------------------------------- */
function finder() {
  const el = document.getElementById('finder');
  if (el) mountFinder(el, { limit: 3 });
}

/* -------------------------------------------------------------------------- */
function compareStrip() {
  const el = document.getElementById('compare-strip');
  if (!el) return;

  const render = (ids) => {
    // Show the customer's own garage if they have one; otherwise the comparison
    // people actually come in asking for: the two default scooters.
    const chosen = ids.length ? ids.map(byId).filter(Boolean) : [byId('tvs-jupiter'), byId('honda-activa')];

    el.innerHTML = `
      ${renderCompare(chosen, { slots: ids.length ? Math.max(2, ids.length) : 2, rows: HOME_ROWS })}
      <div class="cluster" style="margin-top:var(--s-5)">
        <a class="btn btn--primary btn--sm" href="compare.html">
          ${ids.length ? 'Open your comparison' : 'Build your own comparison'} ${ICON.arrow}
        </a>
        ${
          ids.length
            ? ''
            : `<span class="micro">Tap “Compare” on any model to build your own</span>`
        }
      </div>`;
    window.__mmRescan?.(el);
  };

  garage.subscribe(render);
}

/* -------------------------------------------------------------------------- */
function machine() {
  const section = document.getElementById('machine');
  const viewport = document.getElementById('machine-viewport');
  if (!section || !viewport) return;

  mountMachine({
    section,
    viewport,
    callout: document.getElementById('machine-callout'),
    progress: document.getElementById('machine-progress'),
    modeButtons: [...document.querySelectorAll('[data-machine]')],
  });
}

/* -------------------------------------------------------------------------- */
function testRideArt() {
  const el = document.getElementById('testride-art');
  if (!el) return;
  whenVisible(el, () => {
    el.innerHTML = mediaHTML(byId('tvs-apache-rtx-300'), {
      sizes: '(max-width: 1000px) 88vw, 40vw',
    });
    window.__mmRescan?.(el);
  });
}

/* -------------------------------------------------------------------------- */
export function init() {
  hero();
  ticker();
  brandIndex();
  split();
  finder();
  compareStrip();
  machine();
  testRideArt();
}
