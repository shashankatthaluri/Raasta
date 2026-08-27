import type { GovernmentSignal } from "./types";

/**
 * The four demo journeys — PRODUCT_CONTRACT.md §16.
 * Scripted official signals, driven by the mock adapter. Reproducible demo.
 */

export interface JourneyStep {
  label: { en: string; hi: string };
  signal: GovernmentSignal;
  /** Suggested delay before this signal fires (demo pacing). */
  waitSeconds?: number;
}

export interface Journey {
  id: string;
  name: { en: string; hi: string };
  description: string;
  steps: JourneyStep[];
}

const KYS = "PM-KISAN KYS (simulated)"; // source citation — proper noun; boundary marker translated in UI render

export const JOURNEYS: Journey[] = [
  {
    id: "J1_FARMER_EKYC",
    name: { en: "Farmer action — e-KYC", hi: "किसान कार्रवाई — ई-केवाईसी" },
    description: "Payment missing → e-KYC required → citizen completes it → official confirmation → processing → credited.",
    steps: [
      {
        label: { en: "Official signal: e-KYC incomplete", hi: "आधिकारिक संकेत: ई-केवाईसी अधूरा" },
        waitSeconds: 2,
        signal: { type: "EKYC_STATUS", status: "INCOMPLETE", verifiedAt: new Date(), source: KYS },
      },
      // ← citizen action COMPLETE_EKYC happens here (driven by UI/test, not a signal)
      {
        label: { en: "Official signal: e-KYC complete", hi: "आधिकारिक संकेत: ई-केवाईसी पूर्ण" },
        waitSeconds: 4,
        signal: { type: "EKYC_STATUS", status: "COMPLETE", verifiedAt: new Date(), source: KYS },
      },
      {
        label: { en: "Official signal: payment processing", hi: "आधिकारिक संकेत: भुगतान प्रोसेसिंग" },
        waitSeconds: 3,
        signal: { type: "PAYMENT_STATUS", status: "PROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: { en: "Official signal: payment credited", hi: "आधिकारिक संकेत: भुगतान जमा" },
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
    name: { en: "Government action — physical verification", hi: "सरकारी कार्रवाई — भौतिक सत्यापन" },
    description: "Payment missing → verification pending → state has the next action → verification complete → processing → credited. The zero-action journey.",
    steps: [
      {
        label: { en: "Official signal: payment processing", hi: "आधिकारिक संकेत: भुगतान प्रोसेसिंग" },
        waitSeconds: 2,
        signal: { type: "PAYMENT_STATUS", status: "PROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: { en: "Official signal: verification pending", hi: "आधिकारिक संकेत: सत्यापन लंबित" },
        waitSeconds: 4,
        signal: { type: "VERIFICATION_STATUS", status: "PENDING", verifiedAt: new Date(), source: KYS },
      },
      // ← state acts here; farmer does nothing
      {
        label: { en: "Official signal: verification complete", hi: "आधिकारिक संकेत: सत्यापन पूर्ण" },
        waitSeconds: 6,
        signal: { type: "VERIFICATION_STATUS", status: "COMPLETE", verifiedAt: new Date(), source: KYS },
      },
      {
        label: { en: "Official signal: payment processing", hi: "आधिकारिक संकेत: भुगतान प्रोसेसिंग" },
        waitSeconds: 3,
        signal: { type: "PAYMENT_STATUS", status: "PROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: { en: "Official signal: payment credited", hi: "आधिकारिक संकेत: भुगतान जमा" },
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
    name: { en: "Payment failure — reprocessing", hi: "भुगतान विफलता — दोबारा प्रोसेस" },
    description: "Transaction failed → state/system has the next action → reprocessing → processing → credited. Failed ≠ visit the bank.",
    steps: [
      {
        label: { en: "Official signal: payment failed", hi: "आधिकारिक संकेत: भुगतान विफल" },
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
        label: { en: "Official signal: reprocessing", hi: "आधिकारिक संकेत: दोबारा प्रोसेस" },
        waitSeconds: 4,
        signal: { type: "PAYMENT_STATUS", status: "REPROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: { en: "Official signal: payment processing", hi: "आधिकारिक संकेत: भुगतान प्रोसेसिंग" },
        waitSeconds: 3,
        signal: { type: "PAYMENT_STATUS", status: "PROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: { en: "Official signal: payment credited", hi: "आधिकारिक संकेत: भुगतान जमा" },
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
    name: { en: "No action — payment processing to credited", hi: "कोई कार्रवाई नहीं — भुगतान प्रोसेस से जमा तक" },
    description: "Not every problem requires a task. Processing → credited, nothing asked of the citizen.",
    steps: [
      {
        label: { en: "Official signal: payment processing", hi: "आधिकारिक संकेत: भुगतान प्रोसेसिंग" },
        waitSeconds: 2,
        signal: { type: "PAYMENT_STATUS", status: "PROCESSING", verifiedAt: new Date(), source: KYS },
      },
      {
        label: { en: "Official signal: payment credited", hi: "आधिकारिक संकेत: भुगतान जमा" },
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
