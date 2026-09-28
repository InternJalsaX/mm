/* ==========================================================================
   MM MOTORS — BROWSE TABS

   The panels are all present in the HTML and all but the first carry the
   `hidden` attribute, so the grid is complete and navigable before this
   module runs and remains so if it never does. This only moves `hidden`
   around and keeps the ARIA state honest.

   Follows the WAI-ARIA tabs pattern: one tab in the tab order at a time,
   arrow keys move between them, Home/End jump to the ends.
   ========================================================================== */

export function initBrowse(root = document) {
  root.querySelectorAll('[data-browse]:not([data-browse-ready])').forEach((el) => {
    el.dataset.browseReady = '1';

    const tabs = [...el.querySelectorAll('[role="tab"]')];
    if (tabs.length < 2) return;

    const panelFor = (tab) => el.querySelector('#' + tab.getAttribute('aria-controls'));

    const select = (tab, { focus = false } = {}) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = panelFor(t);
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    };

    el.querySelector('[role="tablist"]').addEventListener('click', (e) => {
      const tab = e.target.closest('[role="tab"]');
      if (tab) select(tab);
    });

    el.querySelector('[role="tablist"]').addEventListener('keydown', (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const last = tabs.length - 1;
      const to =
        e.key === 'ArrowRight' ? (i === last ? 0 : i + 1)
        : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1)
        : e.key === 'Home' ? 0
        : e.key === 'End' ? last
        : null;
      if (to == null) return;
      e.preventDefault();
      select(tabs[to], { focus: true });
    });
  });
}
