/**
 * Raasta — domain types.
 * Contract: docs/PRODUCT_CONTRACT.md v1.1 (frozen 2026-08-27).
 * Rules determine reality. AI explains reality.
 */

export type Actor = "CITIZEN" | "CSC" | "BANK" | "STATE" | "CENTRAL_SYSTEM" | "NONE";

export type SourceType = "OFFICIAL" | "CITIZEN_REPORTED" | "SYSTEM_DERIVED" | "AI_INTERPRETED";

export type ColorSemantic = "green" | "amber" | "red" | "neutral";

export type CaseStateId =
  | "PAYMENT_EXPECTED"
  | "PAYMENT_CHECK"
  | "EKYC_REQUIRED"
  | "EKYC_VERIFIED"
  | "PAYMENT_PROCESSING"
  | "PHYSICAL_VERIFICATION_PENDING"
  | "TRANSACTION_FAILED"
  | "PAYMENT_REPROCESSING"
  | "CITIZEN_ACTION_REQUIRED"
  | "PAYMENT_CREDITED"
  | "RESOLVED";

export type LifecycleId =
  | "DISCOVERED"
  | "UNDERSTOOD"
  | "VERIFIED"
  | "ACTION_ASSIGNED"
  | "WAITING"
  | "STATE_CHANGED"
  | "RE_EVALUATED"
  | "RESOLVED";

export type CitizenActionId =
  | "COMPLETE_EKYC"
  | "SHOW_CASE_AT_CSC"
  | "SHOW_CARD_AT_BANK"
  | "PREPARE_GRIEVANCE"
  | "PROVIDE_INFORMATION";

export interface HandoffCard {
  heading: string;
  statement: string;
  lines: string[];
}

export interface CitizenAction {
  id: CitizenActionId;
  effort: "LOW" | "MEDIUM";
  title: string;
  titleHi: string;
  why: string;
  whyHi: string;
  after: string;
  afterHi: string;
  href?: string;
  card?: HandoffCard;
}

export interface Evidence {
  id: string;
  source: string;
  sourceType: SourceType;
  verifiedAt: Date;
  value: string;
  confidence: number;
}

export interface CaseStateDef {
  id: CaseStateId;
  humanTitle: string;
  humanTitleHi: string;
  humanExplanation: string;
  humanExplanationHi: string;
  nextActor: Actor;
  citizenActionId: CitizenActionId | null;
  nextStates: CaseStateId[];
  chain: string[];
  chainHi: string[];
  color: ColorSemantic;
  isTerminal?: boolean;
  isInternal?: boolean;
}

export type PaymentStatus = "PROCESSING" | "FAILED" | "CREDITED" | "REPROCESSING";
export type EkycStatus = "INCOMPLETE" | "COMPLETE";
export type VerificationStatus = "PENDING" | "COMPLETE" | "FAILED";

/**
 * Government signals — the ONLY thing that may mutate official case state.
 * sourceType is always OFFICIAL when produced by an adapter.
 */
export type GovernmentSignal =
  | { type: "EKYC_STATUS"; status: EkycStatus; verifiedAt: Date; source: string }
  | {
      type: "PAYMENT_STATUS";
      status: PaymentStatus;
      reprocessingAvailable?: boolean;
      amount?: number;
      utr?: string;
      bankName?: string;
      paymentMode?: string;
      creditedAt?: Date;
      verifiedAt: Date;
      source: string;
    }
  | { type: "VERIFICATION_STATUS"; status: VerificationStatus; verifiedAt: Date; source: string };

export type EventType =
  | "CASE_CREATED"
  | "SIGNAL_RECEIVED"
  | "STATE_CHANGED"
  | "ACTION_ASSIGNED"
  | "ACTION_COMPLETED"
  | "ACTION_CONFIRMED"
  | "RESOLVED";

export interface CaseEvent {
  id: string;
  caseId: string;
  previousState: CaseStateId | null;
  newState: CaseStateId;
  actor: Actor;
  eventType: EventType;
  humanLabel: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export type ResolutionReason = "CREDITED" | "NO_ACTION" | "ESCALATED";

export interface CitizenCase {
  id: string;
  service: "PM_KISAN";
  problemType: string;
  currentState: CaseStateId;
  lifecycle: LifecycleId;
  nextActor: Actor;
  citizenAction: CitizenAction | null;
  nextState: CaseStateId | null;
  /** Number of failed payment attempts seen. Escalation (R6) triggers when a FAILED arrives with retryCount >= 2. */
  retryCount: number;
  lastVerifiedAt: Date | null;
  isDemo: boolean;
  /** Set when the citizen completes an action; cleared when an OFFICIAL signal confirms it. */
  pendingConfirmation: CitizenActionId | null;
  evidence: Evidence[];
  events: CaseEvent[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
  resolution: { reason: ResolutionReason; note: string } | null;
}

export interface NextActionDecision {
  required: boolean;
  action: CitizenAction | null;
  reason: string;
}
