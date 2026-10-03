// config/pricing.config.ts
// SINGLE SOURCE OF TRUTH for WorkspaceCMS pricing, allowances, overage,
// SLA, fair-use, billing lifecycle, and legal versions.
// Every number on the site and in enforcement reads from here.
// Change a value once → it propagates everywhere. Do not hard-code these anywhere else.
//
// Effective: Jun 13, 2026 · v1.4 (AI credit schedule update)
//
//   v0.9.0 (2026-10-03) — package caught up with what the dashboard enforces:
//     • plans.*.max_cms_pages: 3/20/50 → 10/25/null (null = no limit). Page
//       caps came back on 2026-09-22 (dashboard config/pricing.config.ts and
//       docs/cross-repo/cms-page-cap-contract.md). Type is now number | null.
//     • fair_use.blog_posts_note: "CMS pages are unlimited too" removed.
//     • features.enhanced_skills.credit_note: 1,800 → 1,200 (the real
//       Premium allowance since v0.4).
//     • plans.*.support_response: NEW — the response windows v0.7.0 left as
//       per-consumer prose (1 business day / 8 / 4 business hours).
//     • extra_user_offers: NEW — the per-tier additional-user add-on the
//       dashboard sells: Growth $29 (up to 5 extra), Premium $15 (up to 25).
//       overage.extra_seat_mo stays for back-compat only.
//     • overage.extra_domain_mo: REMOVED. No surface can sell an extra domain;
//       the dashboard hard-blocks domains at the plan allowance.
//     • ai_credit_schedule.blog_draft is PER 500 WORDS (ai_credit_units,
//       NEW, deliberately outside the schedule); a 1,500-word post costs 30.
//       redirect_sweep: 5 → 10.
//     • Ultra ($749) is still not modelled here; each consumer keeps a local
//       ULTRA block.
//
//   v0.7.0 (2026-07-28) — change-turnaround SLA hoisted into the package:
//     • plans.*.change_sla_days: NEW — business days to deliver a standard
//       ticketed change (4 / 2 / 1). Previously this number existed ONLY as
//       hand-written prose in each consumer, with nothing keeping them in
//       sync, and it drifted: 1digitalagency.com/cms-platform advertised a
//       Premium turnaround of "12-24 hrs" while workspacecms.ai promised
//       "1 business day" on /pricing, /premium and /plans. 12-24 hours spans
//       overnight and implies weekend coverage; a business day does not — so
//       one product was publicly committing to a faster SLA than we deliver.
//     • derived.changeTurnaround(): NEW — formats the number for display
//       ("4 business days" / "1 business day"), so consumers never re-derive
//       the pluralisation or re-type the figure.
//     • NOTE: emergency-response windows (Essentials 1 business day, Growth
//       8 business hours, Premium 4 business hours) are still per-consumer
//       prose and remain a drift risk. They mix units (days vs hours), so
//       modelling them is a deliberate follow-up rather than a silent
//       widening of this change.
//
//   v0.6.0 (2026-07-26) — CMS page caps + $15/page overage RETIRED:
//     • overage.cms_page_mo: 15 → 0 ($15/page/month page overage retired;
//       Stripe page-overage metering is now a no-op in the dashboard)
//     • overage.cms_page_hard_cap: retained as a key for back-compat but NO
//       LONGER ENFORCED — CMS pages are unlimited on every plan, subject to
//       the Fair Use Policy (fair_use.max_pages soft limit still applies)
//     • plans.*.max_cms_pages: retained as an informational reference only
//       (formerly the per-tier hard cap) — consumers no longer block on it
//     • fair_use.blog_posts_note: reworded — no "page cap" concept remains
//     • Marketing (workspacecms.ai) + dashboard both updated in lockstep;
//       Terms bumped (site v2.1-2026-07-26, dashboard BILLING_TERMS_VERSION
//       2026-07-26). Consumers should bump to this package version.
//
//   v0.3.2 (2026-06-19) — Essentials annual price corrected:
//     • essentials.price_yr: 890 → 1068 (12 × $89/mo = $1,068/yr; 890 was bad math)
//     • cms-platform/page.tsx override (priceAnnual: 1068) can now be removed
//
//   v0.3.1 (2026-06-17) — Enhanced Skills plan-gating:
//     • features.enhanced_skills: new block — auto-enabled for white_glove tier
//     • label, description, credit_note, capabilities documented as marketing source-of-truth
//     • All three repos (workspacecms.ai, 1digitalagency.com, dashboard) consume this block
//   v0.3.0 (2026-06-17) — CMS page caps per tier:
//     • max_cms_pages added to each plan: essentials=3, managed=20, white_glove=50
//     • overage.cms_page_mo: $15/page/month for white_glove clients above 50 pages
//     • overage.cms_page_hard_cap: 75 (above this → custom quote required)
//     • fair_use.blog_posts_note: blog posts are unlimited, not counted toward page cap
//     • legal.versions: terms → 1.1, fair_use → 1.1
//     • Blog posts (tenant_posts) are explicitly excluded from page cap counting
//   Decisions (full rationale in docs/superpowers/specs/2026-06-02-pricing-v1.3-design.md):
//
//   Plans:
//     • Seats:     3/8/25 → 2/5/10   (right-sized; overage seats remain $15/mo each)
//     • Bandwidth: 50/200 → 25/100 GB (interim until per-tenant bandwidth meter ships)
//     • Strategy hrs: 0/1/3 → 0/1/1  (flat 1 hr on Managed + WG; WG premium lives in
//                                     support hours / AI credits / seats / bandwidth /
//                                     AI-visibility cadence, not in strategist time)
//   Support hrs unchanged (1/2/4) — these are the real Managed→WG differentiator.
//
//   AI Visibility (new block — caps enforced server-side per calendar month):
//     • Prompts tracked: 5 / 15 / 30 (was 5 / 15 / 50 — "unlimited" removed)
//     • Runs per month:  1 / 2 / 4   (monthly / bi-weekly / weekly)
//     • Cost cap is GLOBAL today (lib/ai-visibility/cost-tracker.ts), not per-tenant.
//       Public copy describes "we manage LLM cost on our side" instead of printing
//       per-tenant $-caps. Per-tenant accumulator is a follow-up engineering ticket.
//
//   Overage rates: PRESERVED in this config so they're ready when Stripe metered
//     billing is wired. Public copy (landing blocks, sales briefs) drops $-figures
//     and says "if you exceed your allowance, we'll get in touch about upgrading
//     your plan." Verified: app/api/webhooks/stripe/route.ts handles checkout/sub
//     events but never writes usage records. Two engineering deliverables sequenced:
//     (a) Vercel Analytics → tenant_usage_meters.bandwidth_gb_used (~1 week)
//     (b) Stripe usage records for AI credits + seats + domains (~1-2 weeks).
//
//   Founding-member bundle (LANDING_FOUNDING_MEMBER_DEFAULT_BENEFITS in
//     app/_landing/sections.tsx): benefit #3 changed from "Direct founder line —
//     first 90 days" to "+2 support hours per month — first 90 days" so WG
//     founding members get 6 support hrs/mo in Q1, then settle to standard 4 hrs/mo.
//     ^ SUPERSEDED 2026-08-22 (v0.8.0): the founding-member promotion has ended
//       and `founding_member` is removed from this file. The renderer symbol
//       named above no longer exists in 1digital-sites either. Kept as a dated
//       record of what the package used to publish, not as current fact.
export const PRICING = {
    plans: {
        // posture: human-involvement ladder from brief v1.1 §1.6
        //   guided      = "you drive, we set you up right and stay reachable"
        //   accompanied = "we work alongside you — strategy time + we host & maintain"
        //   led         = "we run it as your team — we drive strategy and execution"
        //
        // strategy_hours_mo: monthly strategy time (SEO consulting OR copywriting,
        //   client's choice). DISTINCT from platform support (operational
        //   break-fixes and ticketed updates), which is UNMETERED on every tier
        //   as of v0.8.0. Essentials = 0 (30-min kickoff covers relationship
        //   start). Managed and White-Glove both = 1 hr flat — WG's value premium
        //   over Managed is paid in AI credits / seats / bandwidth / turnaround /
        //   AI-visibility cadence, not in strategist time.
        // 2026-06-04 v0.2.0 — margin-tightening pass (strategy review). Growth
        // + Premium AI-credit caps dropped from 1,000 -> 700 and 2,500 -> 1,800
        // respectively. The previous allowances were over-provisioned by ~3x
        // vs realistic SMB usage and were leaving ~$10-25/tenant/mo on the
        // table at no perceived-value loss (a 700-credit Growth cap is still
        // 350 blog drafts/mo; a 1,800-credit Premium cap is 900 drafts/mo --
        // well past any plausible single-tenant consumption rate). Essentials
        // stays at 200 -- right-sized today. Per-action schedule + $0.10/
        // credit overage rate unchanged. Full rationale + worst-case-COGS math
        // in the strategy-pass report from 2026-06-04.
        // 2026-08-22 v0.8.0 — plans.*.support_hrs REMOVED. Platform support is
        // full and unmetered on every paid tier (Dan): anything inside
        // WorkspaceCMS is supported for as long as it takes, and only third-party
        // systems we don't run stay outside it. Tiers differ on RESPONSE SPEED
        // (change_sla_days) and never on how much help you get. The field was
        // deleted rather than zeroed because a 0 reads as "no support included",
        // which is the opposite of the policy. No consumer read it at the time of
        // removal — the dashboard dropped its last reader in
        // v0-1-digital-ai-dashboard#6251, and neither 1digital-sites nor
        // 1digital-new-site ever referenced it.
        // 2026-07-05 v0.4.0 — seat + AI-credit right-sizing. Seats trimmed to
        // 1/2/4 (was 2/5/10) with additional seats a Premium-only $15/seat/mo
        // add-on; monthly AI credits trimmed to 100/400/1,200 (was 200/700/1,800)
        // — the prior allowances flattened the tier ladder and over-provisioned
        // vs realistic SMB usage. These values had already shipped as local
        // overrides in all three consumers (1digital-sites, dashboard,
        // 1digital-new-site); this bump folds them into the shared source so the
        // overrides can be deleted. Per-action credit schedule + overage rates
        // unchanged.
        essentials: { price_mo: 89, price_yr: 1068, hosted: true, bandwidth_gb: 10, ai_credits: 100, seats: 1, domains: 1, change_sla_days: 4, support_response: "1 business day", strategy_hours_mo: 0, posture: "guided", sla: false, max_cms_pages: 10 },
        managed: { price_mo: 199, price_yr: 2388, hosted: true, bandwidth_gb: 25, ai_credits: 400, seats: 2, domains: 1, change_sla_days: 2, support_response: "8 business hours", strategy_hours_mo: 1, posture: "accompanied", sla: true, max_cms_pages: 25 },
        white_glove: { price_mo: 449, price_yr: 5388, hosted: true, bandwidth_gb: 100, ai_credits: 1200, seats: 4, domains: 3, change_sla_days: 1, support_response: "4 business hours", strategy_hours_mo: 1, posture: "led", sla: true, max_cms_pages: null },
    },
    // AI Visibility tracker caps — enforced server-side per calendar month.
    // Cost-cap enforcement today is GLOBAL (lib/ai-visibility/cost-tracker.ts);
    // per-tenant accumulator is a follow-up engineering ticket. Public copy does
    // not print per-tenant $-caps — only prompts + cadence.
    // 2026-06-03: simplified to monthly cadence on every tier. Previously
    // Growth/Premium were bi-weekly/weekly, but the prompt-volume ladder
    // (5/15/30) is the real differentiator and the cadence variation was
    // muddying the comparison. Unified to monthly across all tiers.
    ai_visibility: {
        // 2026-07-06 v0.5.0 — AI Visibility Tracking is PREMIUM-ONLY (enforced by the
        // dashboard tier-flags). Essentials/Growth prompt allocations zeroed so the
        // source of truth matches what's delivered; they were vestigial and no
        // customer surface reads them.
        essentials: { prompts_tracked: 0, runs_per_month: 0, cadence: "monthly" },
        managed: { prompts_tracked: 0, runs_per_month: 0, cadence: "monthly" },
        white_glove: { prompts_tracked: 30, runs_per_month: 1, cadence: "monthly" },
        // Internal-only safeguards. Raised global ceiling to cover full 25-WG
        // cohort at realistic worst-case burn (~$12/mo per WG tenant × 25 = $300)
        // with $200 buffer. Not printed in any public copy.
        global_cost_ceiling_usd_default: 500,
        engines: ["chatgpt", "claude", "perplexity", "gemini"],
    },
    // Overage rates: kept here for when Stripe metered billing is wired
    // (sequenced as a separate engineering plan). Public copy on the marketing
    // site and in the sales briefs does NOT print these figures — see
    // docs/superpowers/specs/2026-06-02-pricing-v1.3-design.md §4.
    overage: {
        bandwidth_per_gb: 0.50, // ~3.3x the ~$0.15/GB Vercel cost
        ai_credit: 0.10,
        extra_seat_mo: 15, // back-compat only; the real offer is per tier, see extra_user_offers
        reactivation_fee: 49,
        cms_page_mo: 0, // RETIRED 2026-07-26 — no per-page overage
        cms_page_hard_cap: 75, // RETIRED 2026-07-26 — never enforced again (kept for back-compat); see plans.*.max_cms_pages
    },
    // Additional users beyond plan seats, a self-serve add-on (dashboard
    // lib/billing/extra-users.ts). Essentials has none.
    extra_user_offers: {
        managed: { price_mo: 29, max_extra: 5 },
        white_glove: { price_mo: 15, max_extra: 25 },
    },
    thresholds: { warn: 0.80, soft_cap: 1.00, hard_cap: 1.50 }, // fraction of allowance
    fair_use: { max_pages: 500, max_storage_gb: 25, max_deploys_day: 50, blog_posts_note: "Unlimited blog posts on all plans, subject to plan storage allowance. Blog posts never count toward the CMS page limit." },
    sla: {
        target: 0.999,
        credits: [
            { min: 0.990, max: 0.999, credit: 0.05 },
            { min: 0.950, max: 0.990, credit: 0.10 },
            { min: 0.000, max: 0.950, credit: 0.25 },
        ],
        cap: 0.30,
        claim_window_days: 30,
    },
    ai_credit_schedule: {
        blog_draft: 10, // per ai_credit_units.blog_draft_words — a 1,500-word post costs 30
        meta_rewrite: 2,
        alt_tags_batch10: 2,
        content_rewrite: 10,
        content_audit: 25,
        brand_voice_train: 20,
        redirect_sweep: 10,
    },
    // Units for schedule entries that are not a flat per-action price. Kept
    // OUT of ai_credit_schedule on purpose: consumers spread that block and treat
    // every key as a billable action, so a unit there would read as an action
    // costing 500 credits.
    ai_credit_units: {
        blog_draft_words: 500, // blog_draft is charged per this many words
    },
    billing: {
        dunning_retries: 3,
        dunning_window_days: 7,
        suspend_day: 10,
        terminate_day: 30,
        data_retention_days: 30,
        annual_renewal_notice_days: 30,
        price_change_notice_days: 30,
        offboarding_days: 14,
    },
    enforcement: {
        drift_alert_pct: 0.10, // |sum(tenant meters) - Vercel invoice| alert threshold
        reprice_after_over_cycles: 2, // consecutive "Over" cycles before reprice recommendation
        usage_retention_months: 13,
    },
    // Audit log retention policy (per tier, in days). 2026-06-03 honesty
    // pass v3 — re-adds the per-tier differentiation that PR #225 dropped,
    // this time sourced from a single config block so the marketing site
    // (this repo) and the customer dashboard (sibling repo at
    // app.1digital.ai) can read the same numbers and the dashboard can
    // enforce the per-tier purge cycle. The numbers below match what was
    // previously claimed in marketing copy (30 / 365 / null), so the
    // dashboard team can adopt this config without re-negotiating
    // customer expectations.
    //
    // DASHBOARD ENFORCEMENT REQUIREMENT: for this claim to be operationally
    // true, the dashboard repo must (a) consume PRICING.audit_log_retention,
    // (b) tag every audit_log row with the tenant's plan tier, and (c) run
    // a purge cycle that deletes rows older than the per-tier window. Until
    // that's confirmed in place, this is a marketing-config claim awaiting
    // backend enforcement — see commit message + PR description.
    //
    // Shape: days-as-number, with `null` reserved for "no automatic purge"
    // (the White-Glove tier). The marketing-copy formatter converts null
    // to "Unlimited" at render time; the dashboard enforcer should treat
    // null as "skip the purge step for this tier."
    audit_log_retention: {
        essentials_days: 30,
        managed_days: 365, // 1 year
        white_glove_days: null, // unlimited — no automatic purge
    },
    // Annual-prepay free-build perks (single source of truth for the $-values
    // marketing copy interpolates). Added 2026-06-03 honesty pass v2 — the
    // White-Glove $7,500 figure already lived under `founding_member` for the
    // founding-bundle context (where the free build ships regardless of
    // billing cadence). The Managed $3,500 figure, by contrast, was only in
    // the marketing copy at app/_landing/sections.tsx and not sourced from
    // anywhere — exactly the shape of duplication that lets values drift
    // out of sync over time. Both annual-prepay values now live here as the
    // authoritative source; marketing copy and JSON-LD interpolate.
    //
    // These cover the ANNUAL PREPAY perk specifically (the build replaces the
    // cash discount on Managed and White-Glove monthly tiers). (Until v0.8.0
    // the White-Glove free build was also part of a founding-member bundle
    // below; that promotion has ended and the block is gone.)
    annual_prepay_build: {
        // 2026-07-02 (v0.3.3): page counts synced to the live product — free
        // builds are 3 (Essentials, added), 7 (Growth), 12 (Premium). The old
        // 5/10 values predated the free-build-on-every-plan offer and were
        // being shimmed locally in 1digital-sites/config/pricing.config.ts.
        essentials: { pages: 3, retail_usd: 1500 },
        managed: { pages: 7, retail_usd: 3500 },
        white_glove: { pages: 12, retail_usd: 7500 },
    },
    // 2026-08-22 v0.8.0 — `founding_member` REMOVED. The founding-member
    // promotion (first 25 White-Glove customers: a larger free build, a
    // quarterly intelligence report, and "+2 support hrs/mo for the first 90
    // days") is no longer running (Dan). Removed outright rather than left as a
    // dormant block: a published cohort_cap and retail values read as a live
    // offer to anyone building from this package, and the support-hours half of
    // it stopped meaning anything when platform support became unmetered in
    // this same version. Nothing consumed it — an org-wide search found the
    // definition here and prose only in dated planning docs.
    //
    // The free build it referenced is not lost: `annual_prepay_build` above is
    // the live free-build offer, on every tier.
    // Plan-gated features — capabilities that are automatically enabled or locked
    // based on plan tier. Consumed by the dashboard (enhanced-skills-context.tsx)
    // and by marketing copy (pricing grid, compare table).
    //
    // credit_note: displayed alongside the feature in the UI as a fair-use warning.
    // plans: tiers that get this feature automatically, no manual flag needed.
    features: {
        enhanced_skills: {
            plans: ['white_glove'],
            label: "AI-Powered SEO Automation",
            description: "Auto-fix SEO audit issues, generate JSON-LD schema from page content, and run AI-driven internal linking sweeps — directly from your dashboard.",
            credit_note: "Each automated action draws from your monthly AI credit allowance. Premium includes 1,200 credits/month.",
            capabilities: [
                "SEO Audit AI Fix — auto-remediate audit findings in one click",
                "Schema Generator — AI-generated JSON-LD structured data from your content",
                "Internal Linking AI Sweep — automated internal link building across your site",
            ],
        },
    },
    legal: {
        governing_law: "State of Florida, USA",
        support_timezone: "America/New_York", // Eastern Time
        versions: { terms: "1.1", aup: "1.0", fair_use: "1.1", sla: "1.0", privacy: "1.0" },
    },
};
//# sourceMappingURL=pricing.js.map