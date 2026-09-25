/* ==========================================================================
   MM MOTORS — MATCHING ENGINE

   Brand Bible §30: "The system should explain *why* the models match the
   customer's choices." So the engine returns reasons, not just a ranking —
   and a recommendation with no stated reason is treated as a bug.
   ========================================================================== */

import { VEHICLES, USE_CASES, PRIORITIES, BUDGETS } from './data/vehicles.js';

const label = (list, id) => list.find((x) => x.id === id)?.label ?? id;

/* answers = { use, priority: [..], fuel, budget } */
export function match(answers, limit = 3) {
  const { use, priority = [], fuel, budget } = answers;
  const budgetMax = BUDGETS.find((b) => b.id === budget)?.max ?? Infinity;

  const scored = VEHICLES.map((v) => {
    let score = 0;
    /* Reasons are collected into tiers and flattened most-specific-first.
       "Strong on storage" tells a customer something; "within your budget"
       barely does, and must never crowd the specific reason out of the top
       three that get shown. */
    const specific = [];
    const general = [];

    /* Fuel — a hard filter when stated. Somebody who has decided on electric
       is not helped by being shown petrol. */
    if (fuel && fuel !== 'unsure') {
      if (v.fuel !== fuel) return null;
      score += 3;
      general.push(`${fuel === 'electric' ? 'Electric' : 'Petrol'}, as you asked`);
    }

    /* Budget — also a hard filter. Showing a customer something they said they
       cannot afford wastes their time. */
    if (v.price.from > budgetMax) return null;
    if (budgetMax !== Infinity) {
      score += 2;
      general.push('Within your budget');
    }

    /* Use case */
    if (use) {
      if (v.match.use.includes(use)) {
        score += 4;
        specific.push(`Built for ${label(USE_CASES, use).toLowerCase()}`);
      } else {
        score -= 2;
      }
    }

    /* Priorities — the strongest signal, so weight per hit */
    const hits = priority.filter((p) => v.match.priority.includes(p));
    score += hits.length * 3;
    // Unshifted so a matched priority is always the first thing stated
    hits.forEach((p) => specific.unshift(`Strong on ${label(PRIORITIES, p).toLowerCase()}`));

    const misses = priority.filter((p) => !v.match.priority.includes(p));
    score -= misses.length;

    /* A featured model breaks ties toward what MM Motors can actually show
       the customer today. */
    if (v.featured) score += 0.5;

    return { vehicle: v, score, reasons: [...specific, ...general].slice(0, 3) };
  }).filter(Boolean);

  scored.sort((a, b) => b.score - a.score || a.vehicle.price.from - b.vehicle.price.from);

  return scored.slice(0, limit);
}

/* Is the questionnaire complete enough to show anything? */
export const isAnswered = (a) =>
  Boolean(a.use || (a.priority && a.priority.length) || a.fuel || a.budget);

export const answerCount = (a) =>
  [a.use, a.priority?.length ? 'p' : null, a.fuel, a.budget].filter(Boolean).length;
