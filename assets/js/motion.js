/* ==========================================================================
   MM MOTORS — MOTION SYSTEM

   Architecture decision: nothing on the critical path depends on a motion
   library. Reveals and counters run on IntersectionObserver plus CSS
   transitions — a few hundred bytes, GPU-only properties, no layout thrash.

   GSAP + ScrollTrigger are loaded lazily and used for exactly two things:
   the pinned scroll story and the 3D camera. If the CDN is unreachable those
   sections resolve to their finished state instead of breaking.

   Native scroll throughout. No scroll hijacking (Brand Bible §40).
   ========================================================================== */

export const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --------------------------------------------------------------------------
   REVEALS — content rises 24px and fades, once, never on scroll-back.
   -------------------------------------------------------------------------- */
export function initReveals(root = document) {
  const targets = root.querySelectorAll('[data-reveal]:not([data-revealed])');
  if (!targets.length) return;

  if (reduceMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((el) => {
      el.dataset.revealed = 'true';
      el.classList.add('is-in');
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = Number(el.dataset.revealDelay || 0);
        // Stagger siblings inside a [data-reveal-group]
        const group = el.closest('[data-reveal-group]');
        const index = group
          ? [...group.querySelectorAll('[data-reveal]')].indexOf(el)
          : 0;
        el.style.transitionDelay = `${delay + index * 60}ms`;
        el.classList.add('is-in');
        el.dataset.revealed = 'true';
        io.unobserve(el);
        // Drop the will-change hint once the transition has run
        el.addEventListener(
          'transitionend',
          () => {
            el.style.willChange = 'auto';
            el.style.transitionDelay = '';
          },
          { once: true }
        );
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
  );

  targets.forEach((el) => io.observe(el));
}

/* --------------------------------------------------------------------------
   COUNTERS — a specification number counts up once when it comes into view.
   Respects tabular alignment by keeping the digit count stable.
   -------------------------------------------------------------------------- */
export function initCounters(root = document) {
  const targets = root.querySelectorAll('[data-count]:not([data-counted])');
  if (!targets.length) return;

  const print = (el, n, decimals) =>
    (el.textContent = decimals
      ? n.toFixed(decimals)
      : Math.round(n).toLocaleString('en-IN'));

  if (reduceMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((el) => {
      el.dataset.counted = 'true';
      el.textContent = el.dataset.count;
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        io.unobserve(el);
        el.dataset.counted = 'true';

        const raw = String(el.dataset.count);
        const target = parseFloat(raw.replace(/,/g, ''));
        if (!isFinite(target)) {
          el.textContent = raw;
          return;
        }
        const decimals = (raw.split('.')[1] || '').length;
        const dur = 900;
        const t0 = performance.now();

        const tick = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          // easeOutExpo — settles like a needle, no overshoot
          const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          print(el, target * e, decimals);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = raw;
        };
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.4 }
  );

  targets.forEach((el) => io.observe(el));
}

/* --------------------------------------------------------------------------
   GSAP — loaded on demand, cached, never fatal.
   -------------------------------------------------------------------------- */
let gsapPromise = null;

export function loadGSAP() {
  if (reduceMotion()) return Promise.resolve(null);
  if (gsapPromise) return gsapPromise;

  gsapPromise = (async () => {
    try {
      // GSAP ships real ES modules at the package root
      const [core, st] = await Promise.all([
        import('https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js'),
        import('https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js'),
      ]);
      const gsap = core.gsap || core.default;
      const ScrollTrigger = st.ScrollTrigger || st.default;
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    } catch (err) {
      console.info('[MM Motors] Motion library unavailable — sections resolve statically.');
      return null;
    }
  })();

  return gsapPromise;
}

/* --------------------------------------------------------------------------
   SCROLL PROGRESS — reports 0→1 for an element's pass through the viewport.
   Uses ScrollTrigger when present; otherwise a passive rAF-throttled listener
   so the scroll story still works without the library.
   -------------------------------------------------------------------------- */
export async function onScrollProgress(el, onUpdate, opts = {}) {
  const { start = 'top top', end = 'bottom bottom', pin = null } = opts;
  const lib = await loadGSAP();

  if (lib) {
    const trigger = lib.ScrollTrigger.create({
      trigger: el,
      start,
      end,
      pin,
      pinSpacing: !!pin,
      scrub: true,
      onUpdate: (self) => onUpdate(self.progress),
      onRefresh: (self) => onUpdate(self.progress),
    });
    return () => trigger.kill();
  }

  // Fallback: element progress through its own scroll range
  let raf = 0;
  const compute = () => {
    raf = 0;
    const rect = el.getBoundingClientRect();
    const range = rect.height - window.innerHeight;
    const p = range > 0 ? Math.min(Math.max(-rect.top / range, 0), 1) : 0;
    onUpdate(p);
  };
  const handler = () => {
    if (!raf) raf = requestAnimationFrame(compute);
  };
  window.addEventListener('scroll', handler, { passive: true });
  window.addEventListener('resize', handler, { passive: true });
  compute();
  return () => {
    window.removeEventListener('scroll', handler);
    window.removeEventListener('resize', handler);
  };
}

/* --------------------------------------------------------------------------
   Utility: run a callback the first time an element is near the viewport.
   Used to defer every expensive initialisation on the page.
   -------------------------------------------------------------------------- */
export function whenVisible(el, cb, rootMargin = '200px') {
  if (!el) return;
  if (!('IntersectionObserver' in window)) return cb();
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        cb();
      }
    },
    { rootMargin }
  );
  io.observe(el);
}
