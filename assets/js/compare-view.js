/* ==========================================================================
   MM MOTORS — COMPARISON VIEW

   Visual, not spreadsheet-like (Brand Bible §31).

   The one rule that matters here: a "best" marker is only ever drawn when
   every vehicle in the column shares the same unit. A 57 km/l petrol scooter
   and a 100 km electric scooter are not comparable on one axis, and pretending
   otherwise would be exactly the kind of invented claim §34 forbids.
   ========================================================================== */

import { priceLabel, QUALIFIERS, BRANDS } from './data/vehicles.js';
import { mediaHTML } from './art.js';
import { fuelTag, esc, ICON } from './ui.js';

/* Pull a spec out of whichever level holds it */
function find(v, re) {
  return (
    v.quick.find((m) => re.test(m.label)) ||
    v.perf.find((m) => re.test(m.label)) ||
    v.practical.find((m) => re.test(m.label)) ||
    null
  );
}

const num = (m) => {
  if (!m) return null;
  const n = parseFloat(String(m.value).replace(/,/g, ''));
  return isFinite(n) ? n : null;
};

export const ROWS = [
  {
    label: 'Price from',
    better: 'lower',
    get: (v) => ({ value: `₹${priceLabel(v.price.from)}`, unit: 'ex-showroom' }),
    sort: (v) => v.price.from,
    unit: () => 'inr',
  },
  {
    label: 'Fuel',
    get: (v) => ({ html: fuelTag(v.fuel) }),
  },
  {
    label: 'Engine / motor',
    get: (v) =>
      v.fuel === 'electric'
        ? find(v, /motor/i) || find(v, /battery/i)
        : find(v, /^engine/i),
    unit: (v) => (v.fuel === 'electric' ? 'kw' : 'cc'),
    better: 'higher',
    sort: (v) => num(v.fuel === 'electric' ? find(v, /motor/i) : find(v, /^engine/i)),
  },
  {
    label: 'Battery',
    get: (v) => (v.fuel === 'electric' ? find(v, /battery/i) : { value: '—', unit: '' }),
    unit: (v) => (v.fuel === 'electric' ? 'kwh' : 'none'),
    better: 'higher',
    sort: (v) => (v.fuel === 'electric' ? num(find(v, /battery/i)) : null),
  },
  {
    label: 'Mileage / range',
    get: (v) => find(v, /mileage|range/i),
    unit: (v) => (v.fuel === 'electric' ? 'km' : 'kmpl'),
    better: 'higher',
    sort: (v) => num(find(v, /mileage|range/i)),
  },
  {
    label: 'Charging time',
    get: (v) => (v.fuel === 'electric' ? find(v, /charging time/i) : { value: '—', unit: '' }),
    unit: (v) => (v.fuel === 'electric' ? 'hrs' : 'none'),
  },
  {
    label: 'Max power',
    get: (v) => find(v, /max power|motor power/i),
    unit: () => 'power',
  },
  {
    label: 'Max torque',
    get: (v) => find(v, /torque/i) || { value: '—', unit: '' },
    unit: () => 'nm',
  },
  {
    label: 'Kerb weight',
    get: (v) => find(v, /weight/i) || { value: '—', unit: '' },
    unit: () => 'kg',
    better: 'lower',
    sort: (v) => num(find(v, /weight/i)),
  },
  {
    label: 'Storage',
    get: (v) => find(v, /storage/i) || { value: '—', unit: '' },
    unit: (v) => (find(v, /storage/i) ? 'litre' : 'none'),
    better: 'higher',
    sort: (v) => num(find(v, /storage/i)),
  },
  {
    label: 'Fuel capacity',
    get: (v) => (v.fuel === 'petrol' ? find(v, /fuel (tank|capacity)/i) : { value: '—', unit: '' }),
    unit: (v) => (v.fuel === 'petrol' ? 'litre' : 'none'),
  },
  {
    label: 'Seat height',
    get: (v) => find(v, /seat height/i) || { value: '—', unit: '' },
    unit: () => 'mm',
  },
  {
    label: 'Ground clearance',
    get: (v) => find(v, /clearance/i) || { value: '—', unit: '' },
    unit: () => 'mm',
    better: 'higher',
    sort: (v) => num(find(v, /clearance/i)),
  },
  {
    label: 'Transmission',
    get: (v) => find(v, /transmission|gearbox/i) || { value: '—', unit: '' },
  },
];

/* Which column wins this row — or none, if the units differ */
function bestIndex(row, vehicles) {
  if (!row.better || !row.sort || vehicles.length < 2) return -1;

  const units = vehicles.map((v) => (row.unit ? row.unit(v) : 'x'));
  if (new Set(units).size > 1) return -1; // not comparable — no winner drawn
  if (units.includes('none')) return -1;

  const values = vehicles.map(row.sort);
  if (values.some((n) => n == null)) return -1;
  if (new Set(values).size === 1) return -1; // a tie is not a win

  const target = row.better === 'lower' ? Math.min(...values) : Math.max(...values);
  return values.indexOf(target);
}

function cell(row, v, isBest) {
  const m = row.get(v);
  if (!m) return '<span class="cmp-strip__value" style="color:var(--fg-faint)">—</span>';
  if (m.html) return m.html;

  return `<span class="cmp-strip__value${isBest ? ' is-best' : ''}">
    ${esc(m.value)}${m.unit ? `<span class="metric__unit">${esc(m.unit)}</span>` : ''}
    ${m.q ? `<span class="qualifier">${QUALIFIERS[m.q] || m.q}</span>` : ''}
  </span>`;
}

/* --------------------------------------------------------------------------
   Render. `slots` pads the grid to a fixed number of columns so the layout
   does not jump as vehicles are added.
   -------------------------------------------------------------------------- */
export function renderCompare(vehicles, opts = {}) {
  const { slots = 3, rows = ROWS, showRemove = false } = opts;
  const cols = Math.max(slots, vehicles.length);

  const head = `
    <div class="cmp-strip__cell cmp-strip__rowlabel"></div>
    ${Array.from({ length: cols })
      .map((_, i) => {
        const v = vehicles[i];
        if (!v) {
          return `<div class="cmp-strip__cell">
          <div class="cmp-slot">
            <span class="micro">Slot ${i + 1} empty</span>
            <a class="btn btn--outline btn--sm" href="models.html">Add a model</a>
          </div>
        </div>`;
        }
        return `<div class="cmp-strip__cell">
        <div class="cmp-strip__head">
          ${mediaHTML(v, { sizes: '(max-width:860px) 40vw, 22vw' })}
          <div>
            <span class="micro" style="display:block">${esc(BRANDS[v.brand].name)}</span>
            <a class="cmp-strip__name" href="model.html?m=${v.id}">${esc(v.model)}</a>
          </div>
          ${
            showRemove
              ? `<button class="btn btn--ghost btn--sm" type="button" data-drop="${v.id}"
                   style="justify-self:start">Remove</button>`
              : ''
          }
        </div>
      </div>`;
      })
      .join('')}`;

  const body = rows
    .map((row) => {
      const best = bestIndex(row, vehicles);
      return `
      <div class="cmp-strip__cell cmp-strip__rowlabel">${esc(row.label)}</div>
      ${Array.from({ length: cols })
        .map((_, i) => {
          const v = vehicles[i];
          return `<div class="cmp-strip__cell">${
            v ? cell(row, v, i === best) : '<span class="metric__unit">—</span>'
          }</div>`;
        })
        .join('')}`;
    })
    .join('');

  return `<div class="cmp-strip" style="grid-template-columns:148px repeat(${cols}, minmax(0,1fr))">
    ${head}${body}
  </div>`;
}

/* A compact two-up strip for the homepage */
export const HOME_ROWS = ROWS.filter((r) =>
  ['Price from', 'Fuel', 'Engine / motor', 'Mileage / range', 'Kerb weight', 'Storage'].includes(r.label)
);
