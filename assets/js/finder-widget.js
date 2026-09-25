/* ==========================================================================
   MM MOTORS — FIND YOUR RIDE (reusable widget)
   Mounted inline on the homepage and full-width on finder.html.
   ========================================================================== */

import { USE_CASES, PRIORITIES, BUDGETS, COUNTS } from './data/vehicles.js';
import { match, answerCount } from './match.js';
import { mediaHTML } from './art.js';
import { fuelTag, price, ICON, esc, cmpToggle } from './ui.js';

const FUELS = [
  { id: 'petrol', label: 'Petrol' },
  { id: 'electric', label: 'Electric' },
  { id: 'unsure', label: 'Not sure yet' },
];

export function mountFinder(root, opts = {}) {
  const { limit = 3, persistKey = 'mm-motors:finder' } = opts;

  let answers = load();

  function load() {
    try {
      return JSON.parse(sessionStorage.getItem(persistKey) || '{}');
    } catch {
      return {};
    }
  }
  function save() {
    try {
      sessionStorage.setItem(persistKey, JSON.stringify(answers));
    } catch {
      /* ignore */
    }
  }

  function steps() {
    return `
    <div class="finder__steps">
      <fieldset class="fstep">
        <legend class="fstep__head">
          <span class="fstep__num">Q1</span>
          <span class="fstep__q">What are you buying it for?</span>
        </legend>
        <div class="fstep__opts">
          ${USE_CASES.map(
            (u) => `<button class="chip" type="button" data-q="use" data-v="${u.id}"
              aria-pressed="${answers.use === u.id}" title="${esc(u.note)}">${esc(u.label)}</button>`
          ).join('')}
        </div>
      </fieldset>

      <fieldset class="fstep">
        <legend class="fstep__head">
          <span class="fstep__num">Q2</span>
          <span class="fstep__q">What matters most? Pick any.</span>
        </legend>
        <div class="fstep__opts">
          ${PRIORITIES.map(
            (p) => `<button class="chip" type="button" data-q="priority" data-v="${p.id}"
              aria-pressed="${(answers.priority || []).includes(p.id)}">${esc(p.label)}</button>`
          ).join('')}
        </div>
      </fieldset>

      <fieldset class="fstep">
        <legend class="fstep__head">
          <span class="fstep__num">Q3</span>
          <span class="fstep__q">Petrol or electric?</span>
        </legend>
        <div class="fstep__opts">
          ${FUELS.map(
            (f) => `<button class="chip" type="button" data-q="fuel" data-v="${f.id}"
              aria-pressed="${answers.fuel === f.id}">${esc(f.label)}</button>`
          ).join('')}
        </div>
      </fieldset>

      <fieldset class="fstep">
        <legend class="fstep__head">
          <span class="fstep__num">Q4</span>
          <span class="fstep__q">Budget, ex-showroom?</span>
        </legend>
        <div class="fstep__opts">
          ${BUDGETS.map(
            (b) => `<button class="chip" type="button" data-q="budget" data-v="${b.id}"
              aria-pressed="${answers.budget === b.id}">${esc(b.label)}</button>`
          ).join('')}
        </div>
      </fieldset>

      <div class="cluster">
        <button class="btn btn--ghost btn--sm" type="button" data-finder-reset>Start again</button>
        <span class="micro" data-finder-count></span>
      </div>
    </div>`;
  }

  function result() {
    const answered = answerCount(answers);

    if (!answered) {
      return `<div class="finder__result">
        <p class="eyebrow" data-index="→" style="margin:0">Your matches</p>
        <div class="finder__empty">
          <p class="h3" style="color:var(--fg)">Nothing selected yet.</p>
          <p style="font-size:var(--fs-small)">
            Answer any one question and models start appearing here. Answer all four
            and we narrow it to the three worth test riding.
          </p>
        </div>
      </div>`;
    }

    const matches = match(answers, limit);

    if (!matches.length) {
      return `<div class="finder__result">
        <p class="eyebrow" data-index="→" style="margin:0">Your matches</p>
        <div class="finder__empty">
          <p class="h3" style="color:var(--fg)">Nothing fits all of that.</p>
          <p style="font-size:var(--fs-small)">
            Usually it's the budget against the fuel choice — electric costs more
            up front and less to run. Widen one answer, or talk to MM Motors and
            we'll work backwards from what you can spend.
          </p>
          <a class="btn btn--outline btn--sm" data-whatsapp href="#" style="justify-self:start">WhatsApp MM Motors</a>
        </div>
      </div>`;
    }

    return `<div class="finder__result">
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:var(--s-4)">
        <p class="eyebrow" data-index="→" style="margin:0">Your matches</p>
        <span class="micro">${matches.length} of ${COUNTS.models} · ${answered}/4 answered</span>
      </div>

      <div class="match">
        ${matches
          .map(
            (m) => `<article class="match__item" data-vehicle="${m.vehicle.id}">
          <a href="model.html?m=${m.vehicle.id}" aria-label="${esc(m.vehicle.name)}">
            ${mediaHTML(m.vehicle, { sizes: '120px' })}
          </a>
          <div class="stack" style="min-width:0">
            <div class="cluster" style="gap:var(--s-3)">
              <a class="h3" href="model.html?m=${m.vehicle.id}">${esc(m.vehicle.name)}</a>
              ${fuelTag(m.vehicle.fuel)}
            </div>
            ${price(m.vehicle.price, { short: true })}
            <p class="match__why">${m.reasons.map(esc).join(' · ')}</p>
            <div class="cluster">${cmpToggle(m.vehicle)}</div>
          </div>
        </article>`
          )
          .join('')}
      </div>

      <div class="cluster">
        <a class="btn btn--primary btn--sm" href="test-ride.html">Book a test ride ${ICON.arrow}</a>
        <a class="btn btn--outline btn--sm" href="compare.html">Compare these</a>
      </div>

      <p class="disclosure">
        Matches are based on the answers above and on published specifications —
        not on stock, offers or what we would like to sell you. Confirm availability
        with MM Motors.
      </p>
    </div>`;
  }

  /* Re-rendering replaces the chips, which would drop keyboard focus to the
     body after every selection — so a keyboard user answering four questions
     gets thrown out of the form four times. `refocus` puts focus back on the
     control that was just operated. */
  function render(refocus = null) {
    root.innerHTML = steps() + result();

    const counter = root.querySelector('[data-finder-count]');
    if (counter) {
      const n = answerCount(answers);
      counter.textContent = n === 4 ? 'All four answered' : `${n} of 4 answered`;
    }

    if (refocus) {
      root.querySelector(`[data-q="${refocus.q}"][data-v="${refocus.v}"]`)?.focus();
    }

    window.__mmRescan?.(root);
  }

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-finder-reset]')) {
      answers = {};
      save();
      render();
      root.querySelector('[data-q]')?.focus();
      return;
    }

    const chip = e.target.closest('[data-q]');
    if (!chip) return;

    const { q, v } = chip.dataset;

    if (q === 'priority') {
      const cur = new Set(answers.priority || []);
      cur.has(v) ? cur.delete(v) : cur.add(v);
      answers.priority = [...cur];
    } else {
      // Single-select, and clicking the active option clears it
      answers[q] = answers[q] === v ? undefined : v;
    }

    save();
    // Only restore focus when the interaction came from the keyboard path;
    // a mouse click does not need it, and forcing focus would show a ring.
    render(chip.matches(':focus-visible') ? { q, v } : null);
  });

  render();
  return { get: () => ({ ...answers }), render };
}
