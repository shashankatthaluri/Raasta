import { calculateCitizenAction, caseSummary } from "@/domain/engine";
import type { Actor, CaseStateId, CitizenCase } from "@/domain/types";
import type { DemoInfo } from "./caseStore";

/**
 * Case → UI projection. The frontend renders this and nothing else.
 * Human labels for actors and state categories live here (presentation layer),
 * never in the engine, so the citizen never sees internal terminology.
 */

export type StateCategory = "waiting" | "action-required" | "resolved" | "informational";

export const ACTOR_LABELS: Record<Actor, { en: string; hi: string }> = {
  CITIZEN: { en: "You", hi: "आप" },
  CSC: { en: "A CSC operator", hi: "CSC ऑपरेटर" },
  BANK: { en: "Your bank", hi: "आपका बैंक" },
  STATE: { en: "State verification team", hi: "राज्य सत्यापन टीम" },
  CENTRAL_SYSTEM: { en: "The payment system", hi: "भुगतान प्रणाली" },
  NONE: { en: "No one", hi: "कोई नहीं" },
};

const CATEGORY: Record<CaseStateId, StateCategory> = {
  PAYMENT_EXPECTED: "informational",
  PAYMENT_CHECK: "informational",
  EKYC_REQUIRED: "action-required",
  EKYC_VERIFIED: "informational",
  PAYMENT_PROCESSING: "informational",
  PHYSICAL_VERIFICATION_PENDING: "waiting",
  TRANSACTION_FAILED: "waiting",
  PAYMENT_REPROCESSING: "informational",
  CITIZEN_ACTION_REQUIRED: "action-required",
  PAYMENT_CREDITED: "resolved",
  RESOLVED: "resolved",
};

const WAITING_CONFIRMATION: { en: string; hi: string } = {
  en: "Action done — waiting for official confirmation",
  hi: "कार्रवाई पूरी — आधिकारिक पुष्टि की प्रतीक्षा",
};

const NOTHING_NOW: { en: string; hi: string } = {
  en: "Nothing right now",
  hi: "अभी कुछ नहीं करना है",
};

export interface CaseDTO {
  id: string;
  isDemo: boolean;
  service: string;
  problemType: string;
  currentState: CaseStateId;
  stateCategory: StateCategory;
  color: string;
  title: { en: string; hi: string };
  why: { en: string; hi: string };
  nextActor: Actor;
  nextActorLabel: { en: string; hi: string };
  yourAction: {
    required: boolean;
    awaitingConfirmation: boolean;
    text: { en: string; hi: string };
    action: {
      id: string;
      title: { en: string; hi: string };
      why: { en: string; hi: string };
      after: { en: string; hi: string };
      href?: string;
      card?: { heading: string; statement: string; lines: string[] };
    } | null;
  };
  chain: { en: string[]; hi: string[] };
  lastVerifiedAt: string | null;
  lifecycle: string;
  resolution: { reason: string; note: string } | null;
  credited: {
    amount: number | null;
    utr: string | null;
    bankName: string | null;
    paymentMode: string | null;
    creditedAt: string | null;
  };
  timeline: { id: string; humanLabel: string; eventType: string; createdAt: string }[];
  evidence: { id: string; value: string; source: string; sourceType: string; verifiedAt: string }[];
  demo: DemoInfo | null;
}

export function toCaseDTO(c: CitizenCase, demo: DemoInfo | null): CaseDTO {
  const s = caseSummary(c);
  const decision = calculateCitizenAction(c);

  const action = decision.action
    ? {
        id: decision.action.id,
        title: { en: decision.action.title, hi: decision.action.titleHi },
        why: { en: decision.action.why, hi: decision.action.whyHi },
        after: { en: decision.action.after, hi: decision.action.afterHi },
        href: decision.action.href,
        card: decision.action.card,
      }
    : null;

  return {
    id: c.id,
    isDemo: c.isDemo,
    service: c.service,
    problemType: c.problemType,
    currentState: c.currentState,
    stateCategory: CATEGORY[c.currentState],
    color: s.color,
    title: { en: s.title, hi: s.titleHi },
    why: { en: s.why, hi: s.whyHi },
    nextActor: c.nextActor,
    nextActorLabel: ACTOR_LABELS[c.nextActor],
    yourAction: {
      required: decision.required,
      awaitingConfirmation: Boolean(c.pendingConfirmation),
      text: decision.required
        ? { en: decision.action?.title ?? "", hi: decision.action?.titleHi ?? "" }
        : c.pendingConfirmation
          ? WAITING_CONFIRMATION
          : NOTHING_NOW,
      action,
    },
    chain: { en: s.chain, hi: s.chainHi },
    lastVerifiedAt: c.lastVerifiedAt?.toISOString() ?? null,
    lifecycle: c.lifecycle,
    resolution: c.resolution,
    credited: {
      amount: c.lastPaymentDetails?.amount ?? null,
      utr: c.lastPaymentDetails?.utr ?? null,
      bankName: c.lastPaymentDetails?.bankName ?? null,
      paymentMode: c.lastPaymentDetails?.paymentMode ?? null,
      creditedAt: c.lastPaymentDetails?.creditedAt?.toISOString() ?? null,
    },
    timeline: c.events.map((e) => ({
      id: e.id,
      humanLabel: e.humanLabel,
      eventType: e.eventType,
      createdAt: e.createdAt.toISOString(),
    })),
    evidence: c.evidence.map((e) => ({
      id: e.id,
      value: e.value,
      source: e.source,
      sourceType: e.sourceType,
      verifiedAt: e.verifiedAt.toISOString(),
    })),
    demo,
  };
}
