import type { GovernmentSignal } from "../domain/types";

/**
 * Government adapter — PRODUCT_CONTRACT.md §11.
 * The case engine doesn't care where the signal comes from.
 *
 * DATA / INTEGRATION BOUNDARY:
 * Raasta currently uses SIMULATED government-service signals based on publicly
 * documented PM-KISAN workflows. It does NOT access live individual government
 * beneficiary data. The prototype demonstrates the experience and decision
 * model; it is not a live PM-KISAN integration.
 *
 * Today: MockGovernmentAdapter (scripted, demo-labeled).
 * Future: PMKisanOfficialAdapter (authorised) — same interface, no engine/UX changes.
 */

export interface GovernmentState {
  identifier: string;
  lastSignal: GovernmentSignal | null;
  updatedAt: Date | null;
}

export interface GovernmentAdapter {
  getBeneficiaryState(identifier: string): Promise<GovernmentState>;
  getPaymentStatus(identifier: string): Promise<GovernmentSignal | null>;
  getKycStatus(identifier: string): Promise<GovernmentSignal | null>;
}
