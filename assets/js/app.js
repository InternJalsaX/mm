/* ==========================================================================
   MM MOTORS — APPLICATION SHELL
   Shared chrome behaviour, then a lazy import of the module for this page.
   Each page loads only its own code (Brand Bible §40).
   ========================================================================== */

import { initReveals, initCounters } from './motion.js';
import { initMedia } from './art.js';
import * as garage from './garage.js';
import { DEALER } from './data/vehicles.js';

document.documentElement.classList.add('js');

/* --------------------------------------------------------------------------
   Header — scroll state and mobile drawer
   -------------------------------------------------------------------------- */
function initHeader() {
  const hdr = document.querySelector('.hdr');
  if (!hdr) return;

  let raf = 0;
  const update = () => {
    raf = 0;
    hdr.dataset.scrolled = String(window.scrollY > 24);
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!raf) raf = requestAnimationFrame(update);
    },
    { passive: true }
  );
  update();

  const drawer = document.querySelector('.drawer');
  const burger = document.querySelector('.hdr__burger');
  if (!drawer || !burger) return;

  const setOpen = (open) => {
    drawer.dataset.open = String(open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) drawer.querySelector('a, button')?.focus();
    else burger.focus();
  };

  burger.addEventListener('click', () => setOpen(drawer.dataset.open !== 'true'));
  drawer.querySelector('.drawer__close')?.addEventListener('click', () => setOpen(false));
  drawer.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.dataset.open === 'true') setOpen(false);
  });
}

/* --------------------------------------------------------------------------
   Fill dealer contact details from the single data source
   -------------------------------------------------------------------------- */
function initDealerDetails() {
  document.querySelectorAll('[data-dealer]').forEach((el) => {
    const key = el.dataset.dealer;
    const value = DEALER[key];
    if (value == null) return;
    if (el.tagName === 'A' && key === 'phone') el.href = `tel:${value.replace(/\s/g, '')}`;
    if (el.tagName === 'A' && key === 'email') el.href = `mailto:${value}`;
    el.textContent = value;
  });

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const wa = `https://wa.me/${DEALER.whatsapp}?text=${encodeURIComponent(
    'Hi MM Motors — I found you through your website and I have a question about a two-wheeler.'
  )}`;
  document.querySelectorAll('[data-whatsapp]').forEach((a) => {
    a.href = wa;
    a.rel = 'noopener';
    a.target = '_blank';
  });
}

/* --------------------------------------------------------------------------
   Mark the active navigation item
   -------------------------------------------------------------------------- */
function initActiveNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.dataset.nav === page) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

/* --------------------------------------------------------------------------
   Page modules
   -------------------------------------------------------------------------- */
const PAGES = {
  home: () => import('./pages/home.js'),
  models: () => import('./pages/models.js'),
  model: () => import('./pages/model.js'),
  brand: () => import('./pages/brand.js'),
  compare: () => import('./pages/compare.js'),
  finder: () => import('./pages/finder.js'),
  'test-ride': () => import('./pages/test-ride.js'),
  services: () => import('./pages/services.js'),
};

async function boot() {
  initHeader();
  initActiveNav();
  initDealerDetails();

  garage.mountTray();
  garage.bindToggles();

  const page = document.body.dataset.page;
  const loader = PAGES[page];

  if (loader) {
    try {
      const mod = await loader();
      await mod.init?.();
    } catch (err) {
      console.error(`[MM Motors] Failed to initialise "${page}":`, err);
    }
  }

  // Run after page render so freshly injected content is included
  initMedia();
  initReveals();
  initCounters();
  garage.syncToggles();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}

/* Re-scan after any page module injects content asynchronously */
export function rescan(root = document) {
  initMedia(root);
  initReveals(root);
  initCounters(root);
  garage.syncToggles(root);
}
window.__mmRescan = rescan;
