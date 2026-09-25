/* ==========================================================================
   MM MOTORS — UI COMPONENTS
   Every component that renders a specification renders its qualifier with it.
   ========================================================================== */

import { QUALIFIERS, BRANDS, priceLabel, powerplant, efficiency } from './data/vehicles.js';
import { mediaHTML } from './art.js';

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const ICON = {
  arrow: '<svg class="btn__arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 6.2l2.6 2.6L10 3.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  burger: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  bolt: '<svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M6.8 0L2 6.6h2.6L4.4 12 9.6 5h-2.6L6.8 0z"/></svg>',
  drop: '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 1.2C6 1.2 2.6 5 2.6 7.2a3.4 3.4 0 006.8 0C9.4 5 6 1.2 6 1.2z" stroke="currentColor" stroke-width="1.3"/></svg>',
  whatsapp:
    '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 .8a9 9 0 00-7.7 13.7L.8 19.2l4.9-1.4A9 9 0 1010 .8zm0 16.4a7.4 7.4 0 01-3.8-1l-.3-.2-2.8.8.8-2.7-.2-.3A7.4 7.4 0 1110 17.2zm4.2-5.4c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.6.8c-.1.1-.3.2-.5.1a6 6 0 01-2.9-2.6c-.1-.2 0-.3.1-.5l.5-.6c.1-.2.1-.3 0-.5L8 5.9c-.2-.4-.4-.4-.5-.4h-.4c-.2 0-.5.1-.7.3-.3.3-.8.8-.8 1.8 0 1 .7 2 .8 2.2a8.5 8.5 0 003.3 2.9c1.6.6 1.9.5 2.3.5.4 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1a.4.4 0 00-.3-.3z"/></svg>',
};

/* -------------------------------------------------------------------------- */
export function fuelTag(fuel) {
  const electric = fuel === 'electric';
  return `<span class="fuel-tag" data-fuel="${fuel}">
    ${electric ? ICON.bolt : ICON.drop}${electric ? 'Electric' : 'Petrol'}
  </span>`;
}

/* -------------------------------------------------------------------------- */
export function metric(m, opts = {}) {
  const { count = false, small = false } = opts;
  const num = /^[\d.,]+$/.test(String(m.value));
  const value = count && num
    ? `<span data-count="${esc(m.value)}">0</span>`
    : esc(m.value);

  return `<div class="metric${small ? ' metric--sm' : ''}">
    <span class="metric__label">${esc(m.label)}</span>
    <span class="metric__value">${value}${m.unit ? `<span class="metric__unit">${esc(m.unit)}</span>` : ''}</span>
    ${m.q ? `<span class="qualifier">${QUALIFIERS[m.q] || m.q}</span>` : ''}
  </div>`;
}

/* Level-1 quick decision strip — always five metrics */
export function metricRow(vehicle, opts = {}) {
  return `<div class="metric-row" data-reveal-group>
    ${vehicle.quick.map((m) => `<div data-reveal="fade">${metric(m, opts)}</div>`).join('')}
  </div>`;
}

/* -------------------------------------------------------------------------- */
export function price(p, opts = {}) {
  const range = p.to && p.to !== p.from;
  return `<div class="price">
    <span class="price__figure">
      <span class="price__cur">₹</span>${priceLabel(p.from)}${range ? `<span class="price__cur" style="font-size:0.5em">– ₹${priceLabel(p.to)}</span>` : ''}
    </span>
    <span class="price__note">${esc(p.note)}${opts.short ? '' : ' · Confirm with MM Motors'}</span>
  </div>`;
}

/* -------------------------------------------------------------------------- */
export function specTable(rows) {
  return `<table class="spec-table">
    <tbody>
      ${rows
        .map(
          (r) => `<tr>
        <th scope="row">${esc(r.label)}</th>
        <td>${esc(r.value)}${r.unit ? ` <span class="metric__unit">${esc(r.unit)}</span>` : ''}
        ${r.q ? ` <span class="qualifier">${QUALIFIERS[r.q] || r.q}</span>` : ''}</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>`;
}

export function featureList(items) {
  return `<ul class="feature-list">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
}

export function disclosure(text) {
  return `<p class="disclosure">${esc(text)}</p>`;
}

export const SPEC_DISCLOSURE =
  'Manufacturer-claimed figures. Specifications may vary by variant, model year and market. Confirm against the current brochure at MM Motors.';

export const PRICE_DISCLOSURE =
  'Indicative ex-showroom only. Not an on-road price — registration, insurance and accessories are extra. Confirm current pricing with MM Motors.';

/* -------------------------------------------------------------------------- */
export function vCard(v, opts = {}) {
  const pp = powerplant(v);
  const eff = efficiency(v);
  const weight = v.quick.find((q) => /weight/i.test(q.label));
  const metrics = [pp, eff, weight].filter(Boolean);

  return `<article class="v-card" data-vehicle="${v.id}" data-reveal>
    <div class="v-card__media">
      <span class="v-card__brand">${esc(BRANDS[v.brand].name)}</span>
      <span class="v-card__fuel">${fuelTag(v.fuel)}</span>
      ${mediaHTML(v, { sizes: opts.sizes || '(max-width: 720px) 78vw, 30vw' })}
    </div>
    <div class="v-card__body">
      <h3 class="v-card__name"><a href="model.html?m=${v.id}">${esc(v.model)}</a></h3>
      ${price(v.price, { short: true })}
      <div class="v-card__metrics">
        ${metrics.map((m) => metric(m, { small: true })).join('')}
      </div>
    </div>
    <div class="v-card__foot">
      ${cmpToggle(v)}
      <a class="link-rule" href="model.html?m=${v.id}" style="position:relative;z-index:2">Explore ${ICON.arrow}</a>
    </div>
  </article>`;
}

export function cmpToggle(v) {
  return `<button class="cmp-toggle" type="button" data-cmp="${v.id}" aria-pressed="false">
    <span class="cmp-toggle__box">${ICON.check}</span>
    <span class="cmp-toggle__text">Compare</span>
  </button>`;
}

/* -------------------------------------------------------------------------- */
export function swatches(v, opts = {}) {
  return `<div class="swatches" role="group" aria-label="Colour variants for ${esc(v.name)}">
    ${v.colours
      .map(
        (c, i) => `<button class="swatch" type="button" data-swatch="${i}"
        aria-pressed="${i === (opts.active ?? 0)}" title="${esc(c.name)}">
        <span class="swatch__chip" style="background:${c.paint}"></span>
        <span class="sr-only">${esc(c.name)}</span>
      </button>`
      )
      .join('')}
  </div>`;
}

/* -------------------------------------------------------------------------- */
export function rail(items) {
  return `<nav class="rail" aria-label="Breadcrumb"><ol style="display:flex;gap:var(--s-3);flex-wrap:wrap;align-items:center">
    ${items
      .map((it, i) => {
        const last = i === items.length - 1;
        return `<li style="display:flex;gap:var(--s-3);align-items:center">
        ${last ? `<span aria-current="page">${esc(it.label)}</span>` : `<a href="${it.href}">${esc(it.label)}</a><span class="rail__sep">/</span>`}
      </li>`;
      })
      .join('')}
  </ol></nav>`;
}

/* -------------------------------------------------------------------------- */
export function secHead({ index, eyebrow, title, aside }) {
  return `<header class="sec-head">
    <div>
      <p class="eyebrow" data-index="${esc(index)}" data-reveal="fade">${esc(eyebrow)}</p>
      <h2 class="h2" data-reveal>${title}</h2>
    </div>
    ${aside ? `<div data-reveal="fade">${aside}</div>` : ''}
  </header>`;
}
