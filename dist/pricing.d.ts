export declare const PRICING: {
    readonly plans: {
        readonly essentials: {
            readonly price_mo: 89;
            readonly price_yr: 890;
            readonly hosted: true;
            readonly bandwidth_gb: 10;
            readonly ai_credits: 200;
            readonly seats: 2;
            readonly domains: 1;
            readonly support_hrs: 1;
            readonly strategy_hours_mo: 0;
            readonly posture: "guided";
            readonly sla: false;
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
        };
    };
    readonly ai_visibility: {
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
    readonly overage: {
        readonly bandwidth_per_gb: 0.5;
        readonly ai_credit: 0.1;
        readonly extra_seat_mo: 15;
        readonly extra_domain_mo: 25;
        readonly reactivation_fee: 49;
    };
    readonly thresholds: {
        readonly warn: 0.8;
        readonly soft_cap: 1;
        readonly hard_cap: 1.5;
    };
    readonly fair_use: {
        readonly max_pages: 500;
        readonly max_storage_gb: 25;
        readonly max_deploys_day: 50;
    };
    readonly sla: {
        readonly target: 0.999;
        readonly credits: readonly [{
            readonly min: 0.99;
            readonly max: 0.999;
            readonly credit: 0.05;
        }, {
            readonly min: 0.95;
            readonly max: 0.99;
            readonly credit: 0.1;
        }, {
            readonly min: 0;
            readonly max: 0.95;
            readonly credit: 0.25;
        }];
        readonly cap: 0.3;
        readonly claim_window_days: 30;
    };
    readonly ai_credit_schedule: {
        readonly blog_draft: 10;
        readonly meta_rewrite: 2;
        readonly alt_tags_batch10: 2;
        readonly content_rewrite: 10;
        readonly content_audit: 25;
        readonly brand_voice_train: 20;
        readonly redirect_sweep: 5;
    };
    readonly billing: {
        readonly dunning_retries: 3;
        readonly dunning_window_days: 7;
        readonly suspend_day: 10;
        readonly terminate_day: 30;
        readonly data_retention_days: 30;
        readonly annual_renewal_notice_days: 30;
        readonly price_change_notice_days: 30;
        readonly offboarding_days: 14;
    };
    readonly enforcement: {
        readonly drift_alert_pct: 0.1;
        readonly reprice_after_over_cycles: 2;
        readonly usage_retention_months: 13;
    };
    readonly audit_log_retention: {
        readonly essentials_days: 30;
        readonly managed_days: 365;
        readonly white_glove_days: null;
    };
    readonly annual_prepay_build: {
        readonly managed: {
            readonly pages: 5;
            readonly retail_usd: 3500;
        };
        readonly white_glove: {
            readonly pages: 10;
            readonly retail_usd: 7500;
        };
    };
    readonly founding_member: {
        readonly cohort_cap: 25;
        readonly extra_support_hrs_mo: 2;
        readonly extra_support_hrs_window_days: 90;
        readonly intelligence_report_quarterly_retail_usd: 1500;
        readonly free_build_pages: 10;
        readonly free_build_retail_usd: 7500;
    };
    readonly legal: {
        readonly governing_law: "State of Florida, USA";
        readonly support_timezone: "America/New_York";
        readonly versions: {
            readonly terms: "1.0";
            readonly aup: "1.0";
            readonly fair_use: "1.0";
            readonly sla: "1.0";
            readonly privacy: "1.0";
        };
    };
};
export type PlanKey = keyof typeof PRICING.plans;
//# sourceMappingURL=pricing.d.ts.map