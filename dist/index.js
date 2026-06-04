// @1digital/pricing — single source of truth
//
// Public entry point. Re-exports the PRICING config + derived helpers so
// consumer repos can either pull everything from one import:
//
//   import { PRICING, P, SLA_PCT } from "@1digital/pricing";
//
// or import the granular files (`@1digital/pricing/pricing`,
// `@1digital/pricing/derived`) when they want tighter tree-shaking.
export * from "./pricing.js";
export * from "./derived.js";
//# sourceMappingURL=index.js.map