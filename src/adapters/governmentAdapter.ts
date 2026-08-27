import type { GovernmentSignal } from "../domain/types";

/**
 * Government adapter — PRODUCT_CONTRACT.md §11.
 * The case engine doesn't care where the signal comes from.
 * Today: MockGovernmentAdapter (scripted). Future: PMKisanOfficialAdapter (same interface).
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
