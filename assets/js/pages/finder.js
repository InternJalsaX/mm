/* ==========================================================================
   MM MOTORS — FIND YOUR RIDE (full page)
   Same widget as the homepage section, given the whole width and five results
   instead of three.
   ========================================================================== */

import { mountFinder } from '../finder-widget.js';

export function init() {
  const el = document.getElementById('finder-full');
  if (el) mountFinder(el, { limit: 5 });
}
