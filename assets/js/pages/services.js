/* ==========================================================================
   MM MOTORS — SERVICES
   The page is static content; this only handles the in-page deep links so
   arriving at /services.html#finance lands correctly under the fixed header.
   ========================================================================== */

export function init() {
  const focusTarget = () => {
    const id = location.hash.slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    // The header is fixed; scroll-padding-top handles anchors, but a hash that
    // arrives before layout settles needs one nudge.
    requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
  };

  focusTarget();
  window.addEventListener('hashchange', focusTarget);
}
