/* ==========================================================================
   MM MOTORS — MANUFACTURER PAGE
   Level 2 of the hierarchy: MM Motors → Manufacturer → Model → Variant.
   The manufacturer keeps its own identity; MM Motors stays the frame.
   ========================================================================== */

import { BRANDS, byBrand, VEHICLES, priceLabel } from '../data/vehicles.js';
import { mediaHTML } from '../art.js';
import { vCard, rail, metric, esc, ICON, fuelTag } from '../ui.js';

function resolve() {
  const id = new URLSearchParams(location.search).get('b');
  return BRANDS[id] || null;
}

/* -------------------------------------------------------------------------- */
function hero(brand, models) {
  const el = document.getElementById('brand-hero');
  const electric = models.filter((v) => v.fuel === 'electric');
  const cheapest = Math.min(...models.map((v) => v.price.from));
  const lead = models.find((v) => v.featured) || models[0];

  el.innerHTML = `
    ${rail([{ label: 'MM Motors', href: 'index.html' }, { label: brand.name }])}

    <p class="eyebrow" data-index="→">Manufacturer</p>
    <h1 class="brand-hero__wordmark">${esc(brand.name)}</h1>
    <p class="lede" style="margin-top:var(--s-4);max-width:52ch">${esc(brand.statement)}</p>

    <div class="brand-hero__meta">
      ${metric({ label: 'Models at MM Motors', value: String(models.length), unit: '' })}
      ${
        /* A metric reading "Electric — 0 models" is noise. Show the split only
           where there is actually a split to show. */
        electric.length
          ? metric({
              label: 'Petrol',
              value: String(models.length - electric.length),
              unit: models.length - electric.length === 1 ? 'model' : 'models',
            }) +
            metric({
              label: 'Electric',
              value: String(electric.length),
              unit: electric.length === 1 ? 'model' : 'models',
            })
          : metric({ label: 'Powertrain', value: 'Petrol', unit: 'only' })
      }
      ${metric({ label: 'From', value: `₹${priceLabel(cheapest)}`, unit: 'ex-showroom' })}
    </div>

    <div class="p-hero__grid" style="align-items:center">
      <div>
        ${mediaHTML(lead, { eager: true, sizes: '(max-width:1000px) 92vw, 54vw' })}
        <p class="micro" style="margin-top:var(--s-3)">
          ${esc(lead.name)} · ${lead.fuel === 'electric' ? 'Electric' : 'Petrol'}
        </p>
      </div>
      <div class="stack-lg">
        <p class="body-dim">${esc(brand.blurb)}</p>
        <div class="cluster">
          <a class="btn btn--primary" href="#brand-models">
            See all ${models.length} models ${ICON.arrow}
          </a>
          <a class="btn btn--outline" href="test-ride.html">Book a test ride</a>
        </div>
        <div class="brand-switch">
          ${Object.values(BRANDS)
            .filter((b) => b.id !== brand.id)
            .map(
              (b) => `<a class="chip" href="brand.html?b=${b.id}">
                Switch to ${esc(b.name)} · ${byBrand(b.id).length} models
              </a>`
            )
            .join('')}
        </div>
      </div>
    </div>`;
}

/* -------------------------------------------------------------------------- */
function models(brand, list) {
  const el = document.getElementById('brand-models');

  /* Group by body type so a moped never sits next to an adventure tourer as
     though they were alternatives to one another. */
  const groups = [
    { id: 'scooter', label: 'Scooters', note: 'Step-through, automatic, city-first.' },
    { id: 'motorcycle', label: 'Motorcycles', note: 'Geared, longer legs, more reach.' },
    { id: 'moped', label: 'Mopeds', note: 'Load-carrying, lowest running cost.' },
  ].filter((g) => list.some((v) => v.type === g.id));

  el.innerHTML = groups
    .map(
      (g, i) => `<section style="margin-bottom:var(--s-8)">
      <header class="sec-head">
        <div>
          <p class="eyebrow" data-index="${String(i + 1).padStart(2, '0')}" data-reveal="fade">
            ${esc(brand.name)} · ${esc(g.label)}
          </p>
          <h2 class="h2" data-reveal>${esc(g.label)}</h2>
          <p class="body-dim" data-reveal="fade" style="font-size:var(--fs-small);margin-top:var(--s-3)">
            ${esc(g.note)}
          </p>
        </div>
      </header>
      <div class="v-grid" data-reveal-group>
        ${list
          .filter((v) => v.type === g.id)
          .sort((a, b) => a.price.from - b.price.from)
          .map((v) => vCard(v, { sizes: '(max-width:720px) 88vw, 26vw' }))
          .join('')}
      </div>
    </section>`
    )
    .join('') +
    `<p class="disclosure">
      Manufacturer-claimed figures. Prices are indicative ex-showroom and exclude
      registration, insurance and accessories. Confirm current pricing and
      availability with MM Motors.
    </p>`;
}

/* -------------------------------------------------------------------------- */
function close(brand, list) {
  const el = document.getElementById('brand-close');
  const others = Object.values(BRANDS).filter((b) => b.id !== brand.id);

  /* The nearest thing from another manufacturer, on price — a more useful
     "instead of this" than whichever brand happens to be next in the list. */
  const anchor = list.reduce((a, b) => (a.price.from < b.price.from ? a : b));
  const rival = VEHICLES.filter((v) => v.brand !== brand.id).sort(
    (a, b) =>
      Math.abs(a.price.from - anchor.price.from) - Math.abs(b.price.from - anchor.price.from)
  )[0];

  el.innerHTML = `<div class="wrap">
    <div class="band">
      <h2 class="h2" data-reveal>Not sure ${esc(brand.name)}<br>is the right answer?</h2>
      <div class="stack-lg" data-reveal="fade">
        <p class="body-dim">
          MM Motors represents ${others.length + 1} manufacturers, so we have no reason to
          push one over another. ${
            rival
              ? `At about the same money as the ${esc(anchor.model)} you could have a
                 ${esc(rival.name)} — compare them on the figures rather than on the badge.`
              : 'Compare them on the figures rather than on the badge.'
          }
        </p>
        <div class="cluster">
          <a class="btn btn--primary" href="compare.html">Compare models ${ICON.arrow}</a>
          <a class="btn btn--outline" href="finder.html">Find your ride</a>
          ${
            rival
              ? `<a class="btn btn--ghost" href="model.html?m=${rival.id}">See the ${esc(rival.model)}</a>`
              : ''
          }
        </div>
        <div class="brand-switch">
          ${others
            .map(
              (b) => `<a class="chip" href="brand.html?b=${b.id}">${esc(b.name)}</a>`
            )
            .join('')}
        </div>
      </div>
    </div>
  </div>`;
}

/* -------------------------------------------------------------------------- */
export function init() {
  const brand = resolve();

  if (!brand) {
    document.getElementById('brand-hero').innerHTML = `
      <div class="empty" style="max-width:56ch">
        <p class="eyebrow" data-index="!">Not found</p>
        <h1 class="h2">MM Motors doesn't represent that brand.</h1>
        <p class="body-dim">
          We represent ${Object.values(BRANDS).map((b) => esc(b.name)).join(', ')}.
          If you are looking for something else, ask us — we will tell you
          honestly whether we can help.
        </p>
        <div class="cluster">
          ${Object.values(BRANDS)
            .map((b) => `<a class="btn btn--primary" href="brand.html?b=${b.id}">${esc(b.name)}</a>`)
            .join('')}
          <a class="btn btn--outline" href="models.html">All models</a>
        </div>
      </div>`;
    return;
  }

  const list = byBrand(brand.id);

  document.title = `${brand.name} at MM Motors — all ${list.length} models`;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      `Every ${brand.name} two-wheeler at MM Motors: ${list.map((v) => v.model).join(', ')}. Manufacturer-claimed specifications and indicative ex-showroom prices.`
    );

  hero(brand, list);
  models(brand, list);
  close(brand, list);
  void VEHICLES;
  void fuelTag;
}
