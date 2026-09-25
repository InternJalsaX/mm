/* ==========================================================================
   MM MOTORS — COMPARISON
   Reads from the garage, so a shortlist built anywhere on the site arrives here.
   ========================================================================== */

import { VEHICLES, BRANDS, byId } from '../data/vehicles.js';
import { mediaHTML } from '../art.js';
import { renderCompare, ROWS } from '../compare-view.js';
import { esc, ICON } from '../ui.js';
import * as garage from '../garage.js';

/* -------------------------------------------------------------------------- */
function picker(selected) {
  const el = document.getElementById('cmp-picker');
  const full = selected.length >= garage.MAX;

  el.innerHTML = VEHICLES.map((v) => {
    const on = selected.includes(v.id);
    return `<button class="cmp-pick" type="button" data-cmp="${v.id}"
      aria-pressed="${on}" ${!on && full ? 'data-disabled="true"' : ''}>
      ${mediaHTML(v, { sizes: '64px' })}
      <span>
        <span class="micro" style="display:block">${esc(BRANDS[v.brand].name)}</span>
        <span class="cmp-pick__name">${esc(v.model)}</span>
      </span>
    </button>`;
  }).join('');

  window.__mmRescan?.(el);
}

/* -------------------------------------------------------------------------- */
function result(selected) {
  const el = document.getElementById('cmp-result');
  const vehicles = selected.map(byId).filter(Boolean);

  if (!vehicles.length) {
    el.innerHTML = `<div class="empty" style="margin-top:var(--s-6)">
      <p class="eyebrow" data-index="02">Comparison</p>
      <h2 class="h3">Pick two to get started.</h2>
      <p class="body-dim" style="font-size:var(--fs-small);max-width:52ch">
        Two is usually enough. Three is the maximum, because past that a
        comparison becomes a spreadsheet and stops helping you decide.
      </p>
      <div class="cluster">
        <button class="btn btn--primary btn--sm" type="button" data-cmp-suggest>
          Compare the two most popular ${ICON.arrow}
        </button>
      </div>
    </div>`;
    return;
  }

  const mixedFuel = new Set(vehicles.map((v) => v.fuel)).size > 1;

  el.innerHTML = `
    <header class="sec-head" style="margin-bottom:var(--s-5)">
      <div>
        <p class="eyebrow" data-index="02">Comparison</p>
        <h2 class="h3">
          ${vehicles.map((v) => esc(v.model)).join(' vs ')}
        </h2>
      </div>
      <div class="cluster">
        <a class="btn btn--primary btn--sm" href="test-ride.html">Ride them ${ICON.arrow}</a>
      </div>
    </header>

    ${
      mixedFuel
        ? `<div class="confirm" style="margin-bottom:var(--s-5)">
      <p class="micro" style="color:var(--accent)">Comparing petrol with electric</p>
      <p style="font-size:var(--fs-small)">
        These are measured differently, so some rows have no winner marked.
        Mileage is km per litre; range is km per charge. What they share is cost
        per kilometre — ask MM Motors to work that out for your actual daily
        distance, because that is the comparison that decides it.
      </p>
    </div>`
        : ''
    }

    <div style="overflow-x:auto">
      ${renderCompare(vehicles, { slots: Math.max(2, vehicles.length), rows: ROWS, showRemove: true })}
    </div>

    <p class="disclosure" style="margin-top:var(--s-5)">
      Manufacturer-claimed figures. A row is only marked with a strongest value
      when every column shares the same unit — otherwise no winner is shown.
      Prices are indicative ex-showroom. Confirm with MM Motors.
    </p>`;

  window.__mmRescan?.(el);
}

/* -------------------------------------------------------------------------- */
export function init() {
  garage.subscribe((selected) => {
    picker(selected);
    result(selected);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-cmp-suggest]')) return;
    garage.clear();
    garage.toggle('tvs-jupiter');
    garage.toggle('honda-activa');
  });
}
