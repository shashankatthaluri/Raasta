import type { CaseStateId, CitizenActionId, GovernmentSignal } from "./types";

/**
 * Deterministic rules engine — PRODUCT_CONTRACT.md §8.
 * AI never writes these decisions. Rules determine reality.
 *
 * Priority when signals conflict: R3 (credited) > R2 (eKYC incomplete) > R1/R6 (failure) > R5 (verification) > R4 (processing).
 *
 * retryCount semantics: number of failed payment attempts seen.
 * Escalation (R6) triggers when a FAILED signal arrives while retryCount >= 2
 * (i.e., the third failure), or when reprocessing is unavailable.
 */

export interface RuleOutcome {
  /** null = no state transition (signal recorded as evidence only). */
  next: CaseStateId | null;
  retryDelta: number;
  actionId: CitizenActionId | null;
}

export function decideNextState(
  current: CaseStateId,
  signal: GovernmentSignal,
  retryCount: number,
): RuleOutcome {
  const noop: RuleOutcome = { next: null, retryDelta: 0, actionId: null };

  // Terminal guard: a resolved case accepts no more transitions.
  if (current === "PAYMENT_CREDITED" || current === "RESOLVED") return noop;

  if (signal.type === "EKYC_STATUS") {
    // R2 — e-KYC incomplete dominates everything else.
    if (signal.status === "INCOMPLETE") {
      return { next: "EKYC_REQUIRED", retryDelta: 0, actionId: "COMPLETE_EKYC" };
    }
    // COMPLETE only matters where e-KYC was the blocker.
    if (
      current === "EKYC_REQUIRED" ||
      current === "CITIZEN_ACTION_REQUIRED" ||
      current === "PAYMENT_EXPECTED" ||
      current === "PAYMENT_CHECK"
    ) {
      return { next: "EKYC_VERIFIED", retryDelta: 0, actionId: null };
    }
    return noop;
  }

  if (signal.type === "PAYMENT_STATUS") {
    // R3 — credited is final.
    if (signal.status === "CREDITED") {
      return { next: "PAYMENT_CREDITED", retryDelta: 0, actionId: null };
    }
    if (signal.status === "FAILED") {
      // R2 dominates: e-KYC must be resolved first.
      if (current === "EKYC_REQUIRED") return noop;
      // R6 — stuck policy: too many failures → one specific citizen action.
      if (retryCount >= 2) {
        return { next: "CITIZEN_ACTION_REQUIRED", retryDelta: 0, actionId: "SHOW_CARD_AT_BANK" };
      }
      if (signal.reprocessingAvailable === false) {
        return { next: "CITIZEN_ACTION_REQUIRED", retryDelta: 0, actionId: "SHOW_CASE_AT_CSC" };
      }
      // R1 — failed → returned for verification/reprocessing (never auto "visit bank").
      if (current === "TRANSACTION_FAILED" || current === "PAYMENT_REPROCESSING") {
        return { next: "PAYMENT_REPROCESSING", retryDelta: 1, actionId: null };
      }
      return { next: "TRANSACTION_FAILED", retryDelta: 1, actionId: null };
    }
    if (signal.status === "PROCESSING") {
      // R2 dominates while e-KYC is still blocking.
      if (current === "EKYC_REQUIRED") return noop;
      if (
        current === "PAYMENT_PROCESSING" ||
        current === "EKYC_VERIFIED" ||
        current === "TRANSACTION_FAILED" ||
        current === "PAYMENT_REPROCESSING" ||
        current === "PAYMENT_EXPECTED" ||
        current === "PAYMENT_CHECK"
      ) {
        return { next: "PAYMENT_PROCESSING", retryDelta: 0, actionId: null };
      }
      return noop;
    }
    if (signal.status === "REPROCESSING") {
      if (current === "TRANSACTION_FAILED" || current === "PAYMENT_PROCESSING") {
        return { next: "PAYMENT_REPROCESSING", retryDelta: 0, actionId: null };
      }
      return noop;
    }
    return noop;
  }

  if (signal.type === "VERIFICATION_STATUS") {
    if (signal.status === "PENDING") {
      // R5 — pending verification; R2 still dominates.
      if (current === "EKYC_REQUIRED") return noop;
      return { next: "PHYSICAL_VERIFICATION_PENDING", retryDelta: 0, actionId: null };
    }
    if (signal.status === "COMPLETE") {
      if (current === "PHYSICAL_VERIFICATION_PENDING") {
        return { next: "PAYMENT_PROCESSING", retryDelta: 0, actionId: null };
      }
      return noop;
    }
    if (signal.status === "FAILED") {
      if (current === "PHYSICAL_VERIFICATION_PENDING") {
        return { next: "CITIZEN_ACTION_REQUIRED", retryDelta: 0, actionId: "PROVIDE_INFORMATION" };
      }
      return noop;
    }
    return noop;
  }

  return noop;
}
