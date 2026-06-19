// config/pricing.config.ts
// SINGLE SOURCE OF TRUTH for WorkspaceCMS pricing, allowances, overage,
// SLA, fair-use, billing lifecycle, and legal versions.
// Every number on the site and in enforcement reads from here.
// Change a value once → it propagates everywhere. Do not hard-code these anywhere else.
//
// Effective: Jun 13, 2026 · v1.4 (AI credit schedule update)
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
export const PRICING = {
    plans: {
        // posture: human-involvement ladder from brief v1.1 §1.6
        //   guided      = "you drive, we set you up right and stay reachable"
        //   accompanied = "we work alongside you — strategy time + we host & maintain"
        //   led         = "we run it as your team — we drive strategy and execution"
        //
        // strategy_hours_mo: monthly strategy time (SEO consulting OR copywriting,
        //   client's choice). DISTINCT from support_hrs (operational break-fixes
        //   and ticketed updates). Essentials = 0 (30-min kickoff covers
        //   relationship start). Managed and White-Glove both = 1 hr flat — WG's
        //   value premium over Managed is paid in support hrs / AI credits / seats /
        //   bandwidth / AI-visibility cadence, not in strategist time.
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
        essentials: { price_mo: 89, price_yr: 1068, hosted: true, bandwidth_gb: 10, ai_credits: 200, seats: 2, domains: 1, support_hrs: 1, strategy_hours_mo: 0, posture: "guided", sla: false, max_cms_pages: 3 },
        managed: { price_mo: 199, price_yr: 2388, hosted: true, bandwidth_gb: 25, ai_credits: 700, seats: 5, domains: 1, support_hrs: 2, strategy_hours_mo: 1, posture: "accompanied", sla: true, max_cms_pages: 20 },
        white_glove: { price_mo: 449, price_yr: 5388, hosted: true, bandwidth_gb: 100, ai_credits: 1800, seats: 10, domains: 3, support_hrs: 4, strategy_hours_mo: 1, posture: "led", sla: true, max_cms_pages: 50 },
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
        essentials: { prompts_tracked: 5, runs_per_month: 1, cadence: "monthly" },
        managed: { prompts_tracked: 15, runs_per_month: 1, cadence: "monthly" },
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
        extra_seat_mo: 15,
        extra_domain_mo: 25,
        reactivation_fee: 49,
        cms_page_mo: 15, // $15/page/month for Premium (white_glove) clients above 50 pages
        cms_page_hard_cap: 75, // above this → block, require custom quote
    },
    thresholds: { warn: 0.80, soft_cap: 1.00, hard_cap: 1.50 }, // fraction of allowance
    fair_use: { max_pages: 500, max_storage_gb: 25, max_deploys_day: 50, blog_posts_note: "Unlimited blog posts on all plans, subject to plan storage allowance. Blog posts do not count toward CMS page caps." },
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
        blog_draft: 10,
        meta_rewrite: 2,
        alt_tags_batch10: 2,
        content_rewrite: 10,
        content_audit: 25,
        brand_voice_train: 20,
        redirect_sweep: 5,
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
    // cash discount on Managed and White-Glove monthly tiers). On the
    // White-Glove tier the same free build is also part of the founding
    // bundle below — the cohort just gets it without needing annual prepay.
    annual_prepay_build: {
        managed: { pages: 5, retail_usd: 3500 },
        white_glove: { pages: 10, retail_usd: 7500 },
    },
    // Founding-member bundle for the first 25 White-Glove customers. v1.3:
    // benefit #3 ("Direct founder line") replaced with "+2 support hrs/mo for
    // first 90 days" — founder bandwidth doesn't scale to 25 simultaneous
    // direct-line relationships, and extra support hours are a better-aligned
    // retention lever during the first quarter. WG support_hrs of 4/mo becomes
    // effectively 6/mo for founding members during Q1.
    founding_member: {
        cohort_cap: 25,
        extra_support_hrs_mo: 2,
        extra_support_hrs_window_days: 90,
        intelligence_report_quarterly_retail_usd: 1500,
        free_build_pages: 10,
        free_build_retail_usd: 7500,
    },
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
            credit_note: "Each automated action draws from your monthly AI credit allowance. Premium includes 1,800 credits/month.",
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