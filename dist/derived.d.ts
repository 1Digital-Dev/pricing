/** Shorthand: `P.essentials`, `P.managed`, `P.white_glove`. */
export declare const P: {
    readonly essentials: {
        readonly price_mo: 89;
        readonly price_yr: 1068;
        readonly hosted: true;
        readonly bandwidth_gb: 10;
        readonly ai_credits: 200;
        readonly seats: 2;
        readonly domains: 1;
        readonly support_hrs: 1;
        readonly strategy_hours_mo: 0;
        readonly posture: "guided";
        readonly sla: false;
        readonly max_cms_pages: 3;
    };
    readonly managed: {
        readonly price_mo: 199;
        readonly price_yr: 2388;
        readonly hosted: true;
        readonly bandwidth_gb: 25;
        readonly ai_credits: 700;
        readonly seats: 5;
        readonly domains: 1;
        readonly support_hrs: 2;
        readonly strategy_hours_mo: 1;
        readonly posture: "accompanied";
        readonly sla: true;
        readonly max_cms_pages: 20;
    };
    readonly white_glove: {
        readonly price_mo: 449;
        readonly price_yr: 5388;
        readonly hosted: true;
        readonly bandwidth_gb: 100;
        readonly ai_credits: 1800;
        readonly seats: 10;
        readonly domains: 3;
        readonly support_hrs: 4;
        readonly strategy_hours_mo: 1;
        readonly posture: "led";
        readonly sla: true;
        readonly max_cms_pages: 50;
    };
};
/** Shorthand: AI Visibility per-tier caps. */
export declare const AV: {
    readonly essentials: {
        readonly prompts_tracked: 5;
        readonly runs_per_month: 1;
        readonly cadence: "monthly";
    };
    readonly managed: {
        readonly prompts_tracked: 15;
        readonly runs_per_month: 1;
        readonly cadence: "monthly";
    };
    readonly white_glove: {
        readonly prompts_tracked: 30;
        readonly runs_per_month: 1;
        readonly cadence: "monthly";
    };
    readonly global_cost_ceiling_usd_default: 500;
    readonly engines: readonly ["chatgpt", "claude", "perplexity", "gemini"];
};
/** Shorthand: annual-prepay free-build retail values per tier. */
export declare const APB: {
    readonly managed: {
        readonly pages: 5;
        readonly retail_usd: 3500;
    };
    readonly white_glove: {
        readonly pages: 10;
        readonly retail_usd: 7500;
    };
};
/** Shorthand: per-action AI credit cost schedule. */
export declare const AI_CREDIT_SCHEDULE: {
    readonly blog_draft: 10;
    readonly meta_rewrite: 2;
    readonly alt_tags_batch10: 2;
    readonly content_rewrite: 10;
    readonly content_audit: 25;
    readonly brand_voice_train: 20;
    readonly redirect_sweep: 5;
};
/** Shorthand: notify-and-upgrade thresholds (`warn`, `soft_cap`). */
export declare const THRESHOLDS: {
    readonly warn: 0.8;
    readonly soft_cap: 1;
    readonly hard_cap: 1.5;
};
/** Shorthand: legal version + jurisdiction. */
export declare const LEGAL: {
    readonly governing_law: "State of Florida, USA";
    readonly support_timezone: "America/New_York";
    readonly versions: {
        readonly terms: "1.1";
        readonly aup: "1.0";
        readonly fair_use: "1.1";
        readonly sla: "1.0";
        readonly privacy: "1.0";
    };
};
/** Shorthand: billing lifecycle config (price-change notice, etc.). */
export declare const BILLING: {
    readonly dunning_retries: 3;
    readonly dunning_window_days: 7;
    readonly suspend_day: 10;
    readonly terminate_day: 30;
    readonly data_retention_days: 30;
    readonly annual_renewal_notice_days: 30;
    readonly price_change_notice_days: 30;
    readonly offboarding_days: 14;
};
/** Formatted SLA target percentage, e.g. `"99.9"`. */
export declare const SLA_PCT: string;
/** Per-tier free-build retail USD, pre-formatted with thousands separators. */
export declare const APB_MGD_USD: string;
export declare const APB_WG_USD: string;
/**
 * Essentials annual is structured as "pay for N months instead of 12".
 * Derive N from `price_yr / price_mo` so the copy can't drift if the
 * discount ratio changes. Today: $890 / $89 = 10 months billed → 2 months free.
 */
export declare const ESSENTIALS_MONTHS_BILLED: number;
export declare const ESSENTIALS_MONTHS_FREE: number;
/**
 * Per-page retail rate implied by the free-build offer ($/page). Used in
 * the /pricing "additional pages are an upcharge" copy so the implied
 * rate scales with the build retail values automatically.
 */
export declare const APB_MGD_PER_PAGE_USD: number;
export declare const APB_WG_PER_PAGE_USD: number;
/**
 * Audit-log retention formatter. `null` → "Unlimited"; multiples of 365 →
 * "N year(s)"; otherwise "N days". Used in compare-table cells and the
 * /terms allowance table.
 *
 * The Audit-log compare row was removed 2026-06-04, but this helper
 * stays for the dashboard's enforcement display + any future restore.
 */
export declare function formatAuditLogRetention(days: number | null): string;
//# sourceMappingURL=derived.d.ts.map