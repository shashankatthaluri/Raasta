import type { GovernmentSignal } from "./types";

/**
 * The four demo journeys — PRODUCT_CONTRACT.md §16.
 * Scripted official signals, driven by the mock adapter. Reproducible demo.
 */

export interface JourneyStep {
  label: string;
  signal: GovernmentSignal;
  /** Suggested delay before this signal fires (demo pacing). */
  waitSeconds?: number;
}

export interface Journey {
  id: string;
  name: string;
  description: string;
  steps: JourneyStep[];
}

const KYS = "PM-KISAN KYS (simulated)";

export const JOURNEYS: Journey[] = [
  {
    id: "J1_FARMER_EKYC",
    name: "Farmer action — e-KYC",
    description: "Payment missing → e-KYC required → citizen completes it → official confirmation → processing → credited.",
    steps: [
      {
        label: "Official signal: e-KYC incomplete",
        waitSeconds: 2,
        signal: { type: "EKYC_STATUS", status: "INCOMPLETE", verifiedAt: new Date(), source: KYS },
      },
      // ← citizen action COMPLETE_EKYC happens here (driven by UI/test, not a signal)
      {
        label: "Official signal: e-KYC complete",
        waitSeconds: 4,
        signal: { type: "EKYC_STATUS", status: "COMPLETE", verifiedAt: new Date(), source: KYS },
      },
      {
        label: "Official signal: payment processing",
        waitSeconds: 3,
        signal: { type: "PAYMENT_STATUS", status: "PROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: "Official signal: payment credited",
        waitSeconds: 3,
        signal: {
          type: "PAYMENT_STATUS",
          status: "CREDITED",
          amount: 2000,
          utr: "DEMO-UTR-2026-0001",
          bankName: "State Bank of India",
          paymentMode: "DBT",
          creditedAt: new Date(),
          verifiedAt: new Date(),
          source: KYS,
        },
      },
    ],
  },
  {
    id: "J2_GOVT_VERIFICATION",
    name: "Government action — physical verification",
    description: "Payment missing → verification pending → state has the next action → verification complete → processing → credited. The zero-action journey.",
    steps: [
      {
        label: "Official signal: payment processing",
        waitSeconds: 2,
        signal: { type: "PAYMENT_STATUS", status: "PROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: "Official signal: verification pending",
        waitSeconds: 4,
        signal: { type: "VERIFICATION_STATUS", status: "PENDING", verifiedAt: new Date(), source: KYS },
      },
      // ← state acts here; farmer does nothing
      {
        label: "Official signal: verification complete",
        waitSeconds: 6,
        signal: { type: "VERIFICATION_STATUS", status: "COMPLETE", verifiedAt: new Date(), source: KYS },
      },
      {
        label: "Official signal: payment processing",
        waitSeconds: 3,
        signal: { type: "PAYMENT_STATUS", status: "PROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: "Official signal: payment credited",
        waitSeconds: 3,
        signal: {
          type: "PAYMENT_STATUS",
          status: "CREDITED",
          amount: 2000,
          utr: "DEMO-UTR-2026-0002",
          bankName: "State Bank of India",
          paymentMode: "DBT",
          creditedAt: new Date(),
          verifiedAt: new Date(),
          source: KYS,
        },
      },
    ],
  },
  {
    id: "J3_PAYMENT_FAILURE",
    name: "Payment failure — reprocessing",
    description: "Transaction failed → state/system has the next action → reprocessing → processing → credited. Failed ≠ visit the bank.",
    steps: [
      {
        label: "Official signal: payment failed",
        waitSeconds: 2,
        signal: {
          type: "PAYMENT_STATUS",
          status: "FAILED",
          reprocessingAvailable: true,
          verifiedAt: new Date(),
          source: KYS,
        },
      },
      {
        label: "Official signal: reprocessing",
        waitSeconds: 4,
        signal: { type: "PAYMENT_STATUS", status: "REPROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: "Official signal: payment processing",
        waitSeconds: 3,
        signal: { type: "PAYMENT_STATUS", status: "PROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: "Official signal: payment credited",
        waitSeconds: 3,
        signal: {
          type: "PAYMENT_STATUS",
          status: "CREDITED",
          amount: 2000,
          utr: "DEMO-UTR-2026-0003",
          bankName: "State Bank of India",
          paymentMode: "DBT",
          creditedAt: new Date(),
          verifiedAt: new Date(),
          source: KYS,
        },
      },
    ],
  },
  {
    id: "J4_NO_ACTION",
    name: "No action — payment processing to credited",
    description: "Not every problem requires a task. Processing → credited, nothing asked of the citizen.",
    steps: [
      {
        label: "Official signal: payment processing",
        waitSeconds: 2,
        signal: { type: "PAYMENT_STATUS", status: "PROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: "Official signal: payment credited",
        waitSeconds: 5,
        signal: {
          type: "PAYMENT_STATUS",
          status: "CREDITED",
          amount: 2000,
          utr: "DEMO-UTR-2026-0004",
          bankName: "State Bank of India",
          paymentMode: "DBT",
          creditedAt: new Date(),
          verifiedAt: new Date(),
          source: KYS,
        },
      },
    ],
  },
];

export const JOURNEY_BY_ID: Record<string, Journey> = Object.fromEntries(
  JOURNEYS.map((j) => [j.id, j]),
);

/**
 * Escalation path — unit-tested, not a demo journey.
 * Repeated failures → retry guard R6 → CITIZEN_ACTION_REQUIRED (bank card).
 */
export const ESCALATION_SIGNALS: GovernmentSignal[] = [1, 2, 3].map(() => ({
  type: "PAYMENT_STATUS" as const,
  status: "FAILED" as const,
  reprocessingAvailable: true,
  verifiedAt: new Date(),
  source: KYS,
}));
