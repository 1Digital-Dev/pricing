# @1digital/pricing

Single source of truth for Workspace CMS pricing, allowances, overage, SLA, fair-use, billing lifecycle, and legal versions. Consumed by every surface that displays or enforces tier values.

## Why this exists

Three repos publish or enforce the same numbers:

1. **`1digital-sites`** (workspacecms.ai) — public marketing site
2. **`v0-1-digital-ai-dashboard`** (app.1digital.ai) — customer dashboard that enforces AI-credit caps, seat caps, bandwidth notify-and-upgrade
3. **`1digital-new-site`** (1digitalagency.com/cms-platform) — agency-site product page

Before this package, each repo carried its own copy of the values:

- workspacecms.ai had `config/pricing.config.ts` (the canonical source) plus dozens of FAQ/copy interpolations
- the dashboard had `lib/billing/plans.ts` with its own PLANS + PLAN_TIERS catalogs
- the agency site had its own `TIERS` array in `src/app/cms-platform/page.tsx`

In a single 24-hour audit pass (2026-06-04), **5 distinct drift bugs** were caught across these three repos — the dashboard was enforcing AI-credit caps ~4× below stated marketing limits, the agency site was advertising wrong seat counts and annual prices, and `llms.txt` was sending stale seat numbers to AI crawlers. All five originated the same way: someone edited the values in one place and didn't know two other repos cached the same data.

This package turns that sync from a policy (audit + correct) into a structure (every consumer imports from one place).

## What's in here

| Export | What it is |
|---|---|
| `PRICING` | The full config object — plans, AI visibility, AI credit schedule, thresholds, SLA, billing, fair-use, legal. |
| `P` | Shorthand for `PRICING.plans` (the per-tier price + allowance object). |
| `AV` | Shorthand for `PRICING.ai_visibility`. |
| `APB` | Shorthand for `PRICING.annual_prepay_build` (per-tier free-build retail values + page counts). |
| `AI_CREDIT_SCHEDULE` | Shorthand for the per-action credit cost table. |
| `THRESHOLDS` | Notify-at-warn / soft-cap percentages. |
| `LEGAL`, `BILLING` | Jurisdiction, legal versions, price-change notice days. |
| `SLA_PCT` | Pre-formatted SLA target percentage string (e.g. `"99.9"`). |
| `APB_MGD_USD`, `APB_WG_USD` | Pre-formatted free-build retail values (e.g. `"$3,500"`). |
| `APB_MGD_PER_PAGE_USD`, `APB_WG_PER_PAGE_USD` | Implied per-page rate of the free build. |
| `ESSENTIALS_MONTHS_BILLED`, `ESSENTIALS_MONTHS_FREE` | Derived from `price_yr / price_mo`. |
| `formatAuditLogRetention(days)` | Helper that renders `null` → `"Unlimited"`, multiples of 365 → `"N year(s)"`, otherwise `"N days"`. |

## Install

While this package is unpublished, consume it locally via a Git URL:

```jsonc
// package.json
{
  "dependencies": {
    "@1digital/pricing": "git+ssh://git@github.com:1Digital-Dev/pricing.git#main"
  }
}
```

When GitHub Packages publishing is set up, switch to:

```jsonc
"@1digital/pricing": "^0.1.0"
```

## Use

```ts
import { PRICING, P, APB, SLA_PCT, formatAuditLogRetention } from "@1digital/pricing";

const growthPrice = P.managed.price_mo;        // 199
const growthBuild = APB.managed.pages;          // 5
const slaTarget  = SLA_PCT;                     // "99.9"
const audit      = formatAuditLogRetention(365); // "1 year"
```

## Source of truth ground rules

1. **One number, one place.** If you find a tier value hardcoded in a consumer repo, replace it with an import from this package or a value derived from one. Tripwire tests in each consumer repo should catch regressions.

2. **Internal config keys stay stable.** The tier slugs (`essentials`, `managed`, `white_glove`) are persisted as `tenants.plan_tier` in the dashboard's database. The display names (`Essentials`, `Growth`, `Premium`) can change without a migration; the keys cannot.

3. **Versioning.** This package follows semver:
   - Patch: copy tweaks, comment edits.
   - Minor: new helper, new exported field, additive types.
   - Major: tier rename, slug change, removed field, structural reshape.
   Bump the version in `package.json` and tag a release before merging.

4. **Don't add side effects.** Every export must be pure data or a pure function. No I/O, no network, no env reads. The package is bundled into the consumer's client surface; anything heavy goes in the consumer.

## Build

```sh
pnpm install
pnpm build       # tsc to dist/
pnpm typecheck   # tsc --noEmit
```

## History

- **2026-06-04**: package extracted from `1digital-sites/config/pricing.config.ts` after the cross-repo drift audit. v0.1.0.
