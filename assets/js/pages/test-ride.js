/* ==========================================================================
   MM MOTORS — TEST RIDE REQUEST

   There is no backend in this build, so the form does not pretend to submit to
   one. On success it composes the request and hands it to WhatsApp — which is
   how this dealership actually takes bookings, and is honest about where the
   information is going. If a real endpoint is added later, replace `deliver()`
   and nothing else changes.
   ========================================================================== */

import { VEHICLES, BRANDS, byId, DEALER } from '../data/vehicles.js';
import { mediaHTML } from '../art.js';
import { esc, ICON } from '../ui.js';
import * as garage from '../garage.js';

const MAX_MODELS = 3;
let chosen = [];

/* -------------------------------------------------------------------------- */
function modelPicker() {
  const el = document.getElementById('tr-models');
  if (!el) return;

  el.innerHTML = VEHICLES.map((v) => {
    const on = chosen.includes(v.id);
    return `<button class="cmp-pick" type="button" data-tr="${v.id}" aria-pressed="${on}">
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
function fieldError(input, message) {
  const field = input.closest('.field');
  let note = field.querySelector('.field-error');
  if (!message) {
    note?.remove();
    input.removeAttribute('aria-invalid');
    input.style.borderColor = '';
    return;
  }
  if (!note) {
    note = document.createElement('p');
    note.className = 'form-note field-error';
    note.style.color = 'var(--accent)';
    field.appendChild(note);
  }
  note.textContent = message;
  input.setAttribute('aria-invalid', 'true');
  input.style.borderColor = 'var(--accent)';
}

function validate(form) {
  let ok = true;
  let firstBad = null;

  const name = form.elements.name;
  const phone = form.elements.phone;
  const date = form.elements.date;

  if (!name.value.trim()) {
    fieldError(name, 'We need a name to hold the slot against.');
    ok = false;
    firstBad ||= name;
  } else fieldError(name, null);

  const digits = phone.value.replace(/\D/g, '');
  if (digits.length < 10) {
    fieldError(phone, 'A 10-digit mobile number, so we can confirm the slot.');
    ok = false;
    firstBad ||= phone;
  } else fieldError(phone, null);

  if (!date.value) {
    fieldError(date, 'Pick a date — we will confirm whether it is free.');
    ok = false;
    firstBad ||= date;
  } else {
    const picked = new Date(date.value + 'T00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (picked < today) {
      fieldError(date, 'That date has already passed.');
      ok = false;
      firstBad ||= date;
    } else fieldError(date, null);
  }

  if (!chosen.length) {
    const note = document.querySelector('#tr-models')?.closest('.field')?.querySelector('.form-note');
    if (note) {
      note.textContent = 'Pick at least one model to ride.';
      note.style.color = 'var(--accent)';
    }
    ok = false;
  }

  firstBad?.focus();
  return ok;
}

/* -------------------------------------------------------------------------- */
function compose(form) {
  const models = chosen.map((id) => byId(id)?.name).filter(Boolean);
  const f = form.elements;

  return [
    'Test ride request — via the MM Motors website',
    '',
    `Name: ${f.name.value.trim()}`,
    `Phone: ${f.phone.value.trim()}`,
    `Date: ${f.date.value}`,
    `Time: ${f.slot.value}`,
    `Models: ${models.join(', ')}`,
    f.note.value.trim() ? `Notes: ${f.note.value.trim()}` : null,
  ]
    .filter((x) => x !== null)
    .join('\n');
}

function deliver(message) {
  const url = `https://wa.me/${DEALER.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener');
}

/* -------------------------------------------------------------------------- */
function success(form, message) {
  const models = chosen.map((id) => byId(id)?.model).filter(Boolean);

  form.innerHTML = `<div class="confirm">
    <p class="eyebrow" data-index="✓" style="margin:0">Request ready</p>
    <h2 class="h3">We've opened WhatsApp with your request.</h2>
    <p style="font-size:var(--fs-small)">
      This site has no booking backend, so nothing is stored here and nothing is
      confirmed yet — send the message and MM Motors will call you back to confirm
      the slot for ${models.length ? esc(models.join(' and ')) : 'your chosen models'}.
    </p>
    <details style="font-size:var(--fs-small)">
      <summary class="micro" style="cursor:pointer;color:var(--accent)">
        Show the request, to send another way
      </summary>
      <pre style="white-space:pre-wrap;font-family:var(--ff-data);font-size:var(--fs-data);
                  margin-top:var(--s-3);color:var(--fg-dim)">${esc(message)}</pre>
    </details>
    <div class="cluster">
      <a class="btn btn--primary" data-whatsapp href="#">Open WhatsApp again</a>
      <a class="btn btn--outline" data-dealer="phone" href="#"></a>
      <a class="btn btn--ghost" href="models.html">Back to the models</a>
    </div>
    <p class="form-note">You need a valid two-wheeler licence to ride.</p>
  </div>`;

  // Re-run the dealer/WhatsApp wiring for the freshly injected buttons
  const wa = `https://wa.me/${DEALER.whatsapp}?text=${encodeURIComponent(message)}`;
  form.querySelectorAll('[data-whatsapp]').forEach((a) => {
    a.href = wa;
    a.target = '_blank';
    a.rel = 'noopener';
  });
  form.querySelectorAll('[data-dealer="phone"]').forEach((a) => {
    a.href = `tel:${DEALER.phone.replace(/\s/g, '')}`;
    a.textContent = DEALER.phone;
  });
}

/* -------------------------------------------------------------------------- */
export function init() {
  /* Seed from ?m= and from the garage — whatever the customer already chose */
  const fromUrl = new URLSearchParams(location.search).get('m');
  const seed = [...new Set([fromUrl, ...garage.get()].filter((id) => id && byId(id)))];
  chosen = seed.slice(0, MAX_MODELS);

  modelPicker();

  const dateEl = document.getElementById('tr-date');
  if (dateEl) {
    const today = new Date();
    dateEl.min = today.toISOString().slice(0, 10);
    const soon = new Date(today.getTime() + 86400000);
    dateEl.value = soon.toISOString().slice(0, 10);
  }

  document.getElementById('tr-models')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tr]');
    if (!btn) return;

    const id = btn.dataset.tr;
    if (chosen.includes(id)) chosen = chosen.filter((x) => x !== id);
    else if (chosen.length < MAX_MODELS) chosen = [...chosen, id];
    else {
      const note = btn.closest('.field').querySelector('.form-note');
      if (note) {
        note.textContent = `Three models is the most we can prepare for one visit.`;
        note.style.color = 'var(--accent)';
        setTimeout(() => {
          note.textContent = 'Pick up to three. Anything in your garage is already selected.';
          note.style.color = '';
        }, 2600);
      }
      return;
    }
    modelPicker();
  });

  const form = document.getElementById('tr-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(form)) return;
    const message = compose(form);
    deliver(message);
    success(form, message);
  });
}
