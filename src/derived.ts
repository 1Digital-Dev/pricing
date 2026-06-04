// src/derived.ts
//
// Derived helpers + aliases on top of the PRICING config. Every consumer
// surface (workspacecms.ai landing, app.1digital.ai dashboard, the
// 1digitalagency.com /cms-platform page) ended up computing the same
// shortcuts locally — `P` for `PRICING.plans`, `SLA_PCT` for the
// formatted target, the Essentials cash-discount months-billed math,
// per-build retail-value formatting. Hoisting them here means every
// consumer reads from the same derivation, not a hand-copied snippet.
//
// If you add a new helper here, the rule is:
//   1. It MUST be pure (deterministic, no side effects).
//   2. It MUST be derived from PRICING values — never hardcoded.
//   3. Name it after the consumer concept, not the implementation
//      (e.g. `essentialsMonthsFree`, not `priceYrDivPriceMo`).

import { PRICING } from "./pricing.js";

/** Shorthand: `P.essentials`, `P.managed`, `P.white_glove`. */
export const P = PRICING.plans;

/** Shorthand: AI Visibility per-tier caps. */
export const AV = PRICING.ai_visibility;

/** Shorthand: annual-prepay free-build retail values per tier. */
export const APB = PRICING.annual_prepay_build;

/** Shorthand: per-action AI credit cost schedule. */
export const AI_CREDIT_SCHEDULE = PRICING.ai_credit_schedule;

/** Shorthand: notify-and-upgrade thresholds (`warn`, `soft_cap`). */
export const THRESHOLDS = PRICING.thresholds;

/** Shorthand: legal version + jurisdiction. */
export const LEGAL = PRICING.legal;

/** Shorthand: billing lifecycle config (price-change notice, etc.). */
export const BILLING = PRICING.billing;

/** Formatted SLA target percentage, e.g. `"99.9"`. */
export const SLA_PCT = (PRICING.sla.target * 100).toFixed(1);

/** Per-tier free-build retail USD, pre-formatted with thousands separators. */
export const APB_MGD_USD = `$${APB.managed.retail_usd.toLocaleString()}`;
export const APB_WG_USD = `$${APB.white_glove.retail_usd.toLocaleString()}`;

/**
 * Essentials annual is structured as "pay for N months instead of 12".
 * Derive N from `price_yr / price_mo` so the copy can't drift if the
 * discount ratio changes. Today: $890 / $89 = 10 months billed → 2 months free.
 */
export const ESSENTIALS_MONTHS_BILLED = Math.round(
  P.essentials.price_yr / P.essentials.price_mo,
);
export const ESSENTIALS_MONTHS_FREE = 12 - ESSENTIALS_MONTHS_BILLED;

/**
 * Per-page retail rate implied by the free-build offer ($/page). Used in
 * the /pricing "additional pages are an upcharge" copy so the implied
 * rate scales with the build retail values automatically.
 */
export const APB_MGD_PER_PAGE_USD = Math.round(
  APB.managed.retail_usd / APB.managed.pages,
);
export const APB_WG_PER_PAGE_USD = Math.round(
  APB.white_glove.retail_usd / APB.white_glove.pages,
);

/**
 * Audit-log retention formatter. `null` → "Unlimited"; multiples of 365 →
 * "N year(s)"; otherwise "N days". Used in compare-table cells and the
 * /terms allowance table.
 *
 * The Audit-log compare row was removed 2026-06-04, but this helper
 * stays for the dashboard's enforcement display + any future restore.
 */
export function formatAuditLogRetention(days: number | null): string {
  if (days === null) return "Unlimited";
  if (days >= 365 && days % 365 === 0) {
    const years = days / 365;
    return `${years} ${years === 1 ? "year" : "years"}`;
  }
  return `${days} days`;
}
