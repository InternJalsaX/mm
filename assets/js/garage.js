/* ==========================================================================
   MM MOTORS — THE GARAGE
   A shortlist that follows the customer across the whole site, because the
   journey the Brand Bible describes (§07) is "these are the two models I am
   considering" — which only works if the selection survives navigation.

   Max three vehicles, the most a comparison can show without becoming the
   spreadsheet the Brand Bible forbids (§31).
   ========================================================================== */

import { byId } from './data/vehicles.js';
import { vehicleSVG } from './art.js';
import { ICON, esc } from './ui.js';

const KEY = 'mm-motors:garage';
export const MAX = 3;

let items = load();
const listeners = new Set();

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    // Drop anything that no longer exists in the catalogue
    return Array.isArray(raw) ? raw.filter((id) => byId(id)).slice(0, MAX) : [];
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* private mode — the shortlist simply does not persist */
  }
}

function emit() {
  listeners.forEach((fn) => fn(items));
}

export const get = () => [...items];
export const has = (id) => items.includes(id);
export const isFull = () => items.length >= MAX;
export const subscribe = (fn) => {
  listeners.add(fn);
  fn(items);
  return () => listeners.delete(fn);
};

export function toggle(id) {
  if (!byId(id)) return { ok: false, reason: 'unknown' };

  if (has(id)) {
    items = items.filter((x) => x !== id);
    save();
    emit();
    return { ok: true, added: false };
  }
  if (isFull()) return { ok: false, reason: 'full' };

  items = [...items, id];
  save();
  emit();
  return { ok: true, added: true };
}

export function remove(id) {
  items = items.filter((x) => x !== id);
  save();
  emit();
}

export function clear() {
  items = [];
  save();
  emit();
}

/* --------------------------------------------------------------------------
   Bind every [data-cmp] toggle on the page and keep them in sync.
   -------------------------------------------------------------------------- */
export function bindToggles(root = document) {
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cmp]');
    if (!btn) return;
    e.preventDefault();

    const res = toggle(btn.dataset.cmp);
    if (!res.ok && res.reason === 'full') {
      flashTrayLimit();
    }
  });

  subscribe(() => syncToggles(root));
}

export function syncToggles(root = document) {
  root.querySelectorAll('[data-cmp]').forEach((btn) => {
    const on = has(btn.dataset.cmp);
    btn.setAttribute('aria-pressed', String(on));
    const label = btn.querySelector('.cmp-toggle__text');
    if (label) label.textContent = on ? 'In garage' : 'Compare';
  });
}

/* --------------------------------------------------------------------------
   The tray — persistent, dismissible, keyboard reachable.
   -------------------------------------------------------------------------- */
let trayEl = null;

export function mountTray() {
  if (trayEl) return trayEl;

  trayEl = document.createElement('aside');
  trayEl.className = 'tray';
  trayEl.setAttribute('aria-label', 'Your garage');
  document.body.appendChild(trayEl);

  subscribe(renderTray);
  return trayEl;
}

function renderTray(list) {
  if (!trayEl) return;

  trayEl.dataset.open = String(list.length > 0);

  if (!list.length) {
    trayEl.innerHTML = '';
    return;
  }

  const vehicles = list.map(byId).filter(Boolean);

  trayEl.innerHTML = `<div class="tray__inner">
    <p class="micro tray__label" style="flex:none;color:var(--accent)">
      Your garage · ${vehicles.length}/${MAX}
    </p>
    <div class="tray__items">
      ${vehicles
        .map(
          (v) => `<div class="tray__item">
        ${vehicleSVG(v)}
        <span class="micro">${esc(v.model)}</span>
        <button class="tray__drop" type="button" data-drop="${v.id}"
                aria-label="Remove ${esc(v.name)} from your garage">${ICON.close}</button>
      </div>`
        )
        .join('')}
    </div>
    <div style="display:flex;gap:var(--s-3);flex:none;align-items:center">
      <button class="btn btn--ghost btn--sm" type="button" data-garage-clear>Clear</button>
      <a class="btn btn--primary btn--sm" href="compare.html">
        Compare ${vehicles.length > 1 ? `${vehicles.length} models` : ''} ${ICON.arrow}
      </a>
    </div>
  </div>`;
}

document.addEventListener('click', (e) => {
  const drop = e.target.closest('[data-drop]');
  if (drop) {
    remove(drop.dataset.drop);
    return;
  }
  if (e.target.closest('[data-garage-clear]')) clear();
});

function flashTrayLimit() {
  if (!trayEl) return;
  const label = trayEl.querySelector('.tray__label');
  if (!label) return;
  const original = label.textContent;
  label.textContent = `Garage is full — remove one to add another`;
  label.style.color = 'var(--accent)';
  setTimeout(() => {
    label.textContent = original;
  }, 2400);
}
