/* ==========================================================================
   MM MOTORS — BROWSE
   Also serves as the Petrol world and the Electric world via ?fuel=.
   Filter state lives in the URL, so a filtered view is a shareable link.
   ========================================================================== */

import { VEHICLES, BRANDS, PRIORITIES, BUDGETS } from '../data/vehicles.js';
import { vCard, rail, esc, ICON } from '../ui.js';

const FUELS = [
  { id: 'petrol', label: 'Petrol' },
  { id: 'electric', label: 'Electric' },
];
const TYPES = [
  { id: 'scooter', label: 'Scooter' },
  { id: 'motorcycle', label: 'Motorcycle' },
  { id: 'moped', label: 'Moped' },
];

const state = { fuel: null, brand: null, type: null, priority: [], budget: null, sort: 'price-asc' };

/* -------------------------------------------------------------------------- */
function readURL() {
  const q = new URLSearchParams(location.search);
  state.fuel = q.get('fuel');
  state.brand = q.get('brand');
  state.type = q.get('type');
  state.budget = q.get('budget');
  state.priority = (q.get('priority') || '').split(',').filter(Boolean);
  state.sort = q.get('sort') || 'price-asc';
}

function writeURL() {
  const q = new URLSearchParams();
  if (state.fuel) q.set('fuel', state.fuel);
  if (state.brand) q.set('brand', state.brand);
  if (state.type) q.set('type', state.type);
  if (state.budget) q.set('budget', state.budget);
  if (state.priority.length) q.set('priority', state.priority.join(','));
  if (state.sort !== 'price-asc') q.set('sort', state.sort);
  const qs = q.toString();
  history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
}

/* -------------------------------------------------------------------------- */
const numOf = (v, re) => {
  const m =
    v.quick.find((x) => re.test(x.label)) ||
    v.perf.find((x) => re.test(x.label)) ||
    v.practical.find((x) => re.test(x.label));
  const n = m ? parseFloat(String(m.value).replace(/,/g, '')) : NaN;
  return isFinite(n) ? n : null;
};

function results() {
  const budgetMax = BUDGETS.find((b) => b.id === state.budget)?.max ?? Infinity;

  let list = VEHICLES.filter((v) => {
    if (state.fuel && v.fuel !== state.fuel) return false;
    if (state.brand && v.brand !== state.brand) return false;
    if (state.type && v.type !== state.type) return false;
    if (v.price.from > budgetMax) return false;
    if (state.priority.length && !state.priority.some((p) => v.match.priority.includes(p)))
      return false;
    return true;
  });

  const by = {
    'price-asc': (a, b) => a.price.from - b.price.from,
    'price-desc': (a, b) => b.price.from - a.price.from,
    /* Mileage and range share a column but not a unit, so this sort groups by
       fuel first — otherwise "161 km" would outrank "69 km/l" meaninglessly. */
    'eff-desc': (a, b) =>
      a.fuel === b.fuel
        ? (numOf(b, /mileage|range/i) ?? 0) - (numOf(a, /mileage|range/i) ?? 0)
        : a.fuel.localeCompare(b.fuel),
    'weight-asc': (a, b) => (numOf(a, /weight/i) ?? 1e9) - (numOf(b, /weight/i) ?? 1e9),
    name: (a, b) => a.name.localeCompare(b.name),
  };

  return list.sort(by[state.sort] || by['price-asc']);
}

/* -------------------------------------------------------------------------- */
function chip(group, value, label, active) {
  return `<button class="chip" type="button" data-f="${group}" data-v="${value}"
    aria-pressed="${active}">${esc(label)}</button>`;
}

function filters() {
  const el = document.getElementById('filters');
  const counts = (pred) => VEHICLES.filter(pred).length;

  el.innerHTML = `
    <div class="filter-group">
      <p class="filter-group__title">Fuel</p>
      <div class="filter-group__opts">
        ${FUELS.map((f) =>
          chip('fuel', f.id, `${f.label} · ${counts((v) => v.fuel === f.id)}`, state.fuel === f.id)
        ).join('')}
      </div>
    </div>

    <div class="filter-group">
      <p class="filter-group__title">Manufacturer</p>
      <div class="filter-group__opts">
        ${Object.values(BRANDS)
          .map((b) =>
            chip('brand', b.id, `${b.name} · ${counts((v) => v.brand === b.id)}`, state.brand === b.id)
          )
          .join('')}
      </div>
    </div>

    <div class="filter-group">
      <p class="filter-group__title">Body</p>
      <div class="filter-group__opts">
        ${TYPES.filter((t) => counts((v) => v.type === t.id))
          .map((t) => chip('type', t.id, t.label, state.type === t.id))
          .join('')}
      </div>
    </div>

    <div class="filter-group">
      <p class="filter-group__title">Budget · ex-showroom</p>
      <div class="filter-group__opts">
        ${BUDGETS.map((b) => chip('budget', b.id, b.label, state.budget === b.id)).join('')}
      </div>
    </div>

    <div class="filter-group">
      <p class="filter-group__title">What matters</p>
      <div class="filter-group__opts">
        ${PRIORITIES.map((p) =>
          chip('priority', p.id, p.label, state.priority.includes(p.id))
        ).join('')}
      </div>
    </div>

    <button class="btn btn--ghost btn--sm" type="button" data-f-reset
            style="justify-self:start">Clear filters</button>`;
}

/* -------------------------------------------------------------------------- */
function grid() {
  const list = results();
  const gridEl = document.getElementById('browse-grid');
  const countEl = document.getElementById('browse-count');

  countEl.textContent =
    list.length === VEHICLES.length
      ? `All ${list.length} models`
      : `${list.length} of ${VEHICLES.length} models`;

  if (!list.length) {
    gridEl.innerHTML = `<div class="empty" style="grid-column:1/-1">
      <p class="eyebrow" data-index="0">No matches</p>
      <h2 class="h3">Nothing fits all of those filters.</h2>
      <p class="body-dim" style="font-size:var(--fs-small);max-width:52ch">
        It is usually the budget against the fuel choice — electric costs more up
        front and much less to run. Drop one filter, or ask us to work backwards
        from what you can spend.
      </p>
      <div class="cluster">
        <button class="btn btn--primary btn--sm" type="button" data-f-reset>Clear filters</button>
        <a class="btn btn--outline btn--sm" data-whatsapp href="#">WhatsApp MM Motors</a>
      </div>
    </div>`;
  } else {
    gridEl.innerHTML = list
      .map((v) => vCard(v, { sizes: '(max-width:720px) 88vw, 26vw' }))
      .join('');
  }

  window.__mmRescan?.(gridEl);
}

/* -------------------------------------------------------------------------- */
function heading() {
  const eyebrow = document.getElementById('models-eyebrow');
  const title = document.getElementById('models-title');
  const lede = document.getElementById('models-lede');
  const railEl = document.getElementById('models-rail');

  if (state.fuel === 'petrol') {
    document.title = 'Petrol scooters & motorcycles — MM Motors';
    eyebrow.textContent = 'Petrol';
    title.innerHTML = 'Built for<br>the everyday.';
    lede.textContent =
      'Refuel in two minutes, service anywhere, resell easily. The concerns here are engine size, mileage, weight and tank capacity.';
  } else if (state.fuel === 'electric') {
    document.title = 'Electric scooters — MM Motors';
    eyebrow.textContent = 'Electric';
    title.innerHTML = 'Charge.<br>Ride. Repeat.';
    lede.textContent =
      'More to buy, much less to run. The concerns here are battery capacity, claimed range, charging time and motor power — and whether you can charge where you park.';
  } else if (state.brand && BRANDS[state.brand]) {
    const b = BRANDS[state.brand];
    document.title = `${b.name} models — MM Motors`;
    eyebrow.textContent = b.name;
    title.innerHTML = `Everything<br>${b.name} builds.`;
    lede.textContent = b.blurb;
  }

  railEl.innerHTML = rail([
    { label: 'MM Motors', href: 'index.html' },
    {
      label:
        state.fuel === 'petrol'
          ? 'Petrol'
          : state.fuel === 'electric'
          ? 'Electric'
          : state.brand && BRANDS[state.brand]
          ? BRANDS[state.brand].name
          : 'All models',
    },
  ]);
}

/* -------------------------------------------------------------------------- */
export function init() {
  readURL();
  heading();
  filters();
  grid();

  const sortEl = document.getElementById('sort');
  sortEl.value = state.sort;
  sortEl.addEventListener('change', () => {
    state.sort = sortEl.value;
    writeURL();
    grid();
  });

  document.getElementById('filters').addEventListener('click', (e) => {
    if (e.target.closest('[data-f-reset]')) {
      Object.assign(state, { fuel: null, brand: null, type: null, priority: [], budget: null });
      writeURL();
      heading();
      filters();
      grid();
      return;
    }

    const btn = e.target.closest('[data-f]');
    if (!btn) return;

    const { f, v } = btn.dataset;
    if (f === 'priority') {
      const set = new Set(state.priority);
      set.has(v) ? set.delete(v) : set.add(v);
      state.priority = [...set];
    } else {
      state[f] = state[f] === v ? null : v;
    }

    writeURL();
    heading();
    filters();
    grid();

    // The rail is re-rendered, so put focus back on the filter just toggled
    if (btn.matches(':focus-visible')) {
      document.querySelector(`[data-f="${f}"][data-v="${v}"]`)?.focus();
    }
  });

  // Reset buttons can also live inside the empty state
  document.getElementById('browse-grid').addEventListener('click', (e) => {
    if (!e.target.closest('[data-f-reset]')) return;
    Object.assign(state, { fuel: null, brand: null, type: null, priority: [], budget: null });
    writeURL();
    heading();
    filters();
    grid();
  });
}
