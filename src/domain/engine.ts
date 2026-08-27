import { ACTION_CATALOG, actionFor } from "./actions";
import { decideNextState } from "./rules";
import { STATE_CATALOG, TERMINAL_STATES } from "./states";
import type {
  Actor,
  CaseEvent,
  CaseStateId,
  CitizenActionId,
  CitizenCase,
  EventType,
  Evidence,
  GovernmentSignal,
  NextActionDecision,
  ResolutionReason,
} from "./types";

/**
 * Case engine — PRODUCT_CONTRACT.md §8, §19 (Phase 2).
 * Persistence (Recovery Case), ownership (Responsibility Baton) and
 * workload minimisation (Minimum Human Action) all live on CitizenCase.
 */

function uuid(): string {
  return crypto.randomUUID();
}

function makeEvent(
  c: CitizenCase,
  eventType: EventType,
  previousState: CaseStateId | null,
  newState: CaseStateId,
  actor: Actor,
  humanLabel: string,
  metadata: Record<string, unknown> = {},
): CaseEvent {
  return {
    id: uuid(),
    caseId: c.id,
    previousState,
    newState,
    actor,
    eventType,
    humanLabel,
    metadata,
    createdAt: new Date(),
  };
}

function evidenceFromSignal(signal: GovernmentSignal): Evidence {
  // Evidence values are L4 "official status" copy — KYS-style, never raw enum names.
  let value: string;
  if (signal.type === "PAYMENT_STATUS") {
    const parts: string[] = [`Payment status: ${signal.status.toLowerCase()}`];
    if (signal.amount !== undefined) parts.push(`amount ₹${signal.amount}`);
    if (signal.utr) parts.push(`UTR ${signal.utr}`);
    if (signal.bankName) parts.push(`bank ${signal.bankName}`);
    if (signal.paymentMode) parts.push(`mode ${signal.paymentMode}`);
    if (signal.reprocessingAvailable === false) parts.push("reprocessing unavailable");
    value = parts.join(" · ");
  } else if (signal.type === "EKYC_STATUS") {
    value = `e-KYC status: ${signal.status === "COMPLETE" ? "complete" : "incomplete"}`;
  } else {
    const map = { PENDING: "pending", COMPLETE: "complete", FAILED: "failed" } as const;
    value = `Eligibility verification: ${map[signal.status]}`;
  }
  return {
    id: uuid(),
    source: signal.source,
    sourceType: "OFFICIAL",
    verifiedAt: signal.verifiedAt,
    value,
    confidence: 1,
  };
}

function advanceLifecycle(c: CitizenCase): void {
  if (c.lifecycle === "RESOLVED") return;
  if (c.currentState === "PAYMENT_CREDITED" || c.currentState === "RESOLVED") {
    c.lifecycle = "RESOLVED";
    return;
  }
  if (c.pendingConfirmation) {
    c.lifecycle = "WAITING";
    return;
  }
  if (c.nextActor === "CITIZEN" || c.citizenAction) {
    c.lifecycle = "ACTION_ASSIGNED";
  } else {
    c.lifecycle = "WAITING";
  }
}

export function createCase(input: {
  id: string;
  problemType: string;
  isDemo?: boolean;
}): CitizenCase {
  const now = new Date();
  const c: CitizenCase = {
    id: input.id,
    service: "PM_KISAN",
    problemType: input.problemType,
    currentState: "PAYMENT_EXPECTED",
    lifecycle: "DISCOVERED",
    nextActor: STATE_CATALOG.PAYMENT_EXPECTED.nextActor,
    citizenAction: null,
    nextState: "PAYMENT_CHECK",
    retryCount: 0,
    lastVerifiedAt: null,
    isDemo: input.isDemo ?? true,
    pendingConfirmation: null,
    lastPaymentDetails: null,
    evidence: [],
    events: [],
    createdAt: now,
    updatedAt: now,
    resolvedAt: null,
    resolution: null,
  };
  c.events.push(
    makeEvent(c, "CASE_CREATED", null, "PAYMENT_EXPECTED", "CENTRAL_SYSTEM", "Case created"),
  );
  return c;
}

/**
 * Apply a verified government signal. The ONLY path that mutates official case state.
 * Returns the same (mutated) case for chaining.
 */
export function applySignal(c: CitizenCase, signal: GovernmentSignal): CitizenCase {
  if (TERMINAL_STATES.includes(c.currentState)) return c;

  const { next, retryDelta, actionId } = decideNextState(c.currentState, signal, c.retryCount);

  // Every signal is evidence, even when it doesn't change the state.
  const evidence = evidenceFromSignal(signal);
  c.evidence.push(evidence);
  if (signal.type === "PAYMENT_STATUS") {
    c.lastPaymentDetails = {
      amount: signal.amount ?? c.lastPaymentDetails?.amount,
      utr: signal.utr ?? c.lastPaymentDetails?.utr,
      bankName: signal.bankName ?? c.lastPaymentDetails?.bankName,
      paymentMode: signal.paymentMode ?? c.lastPaymentDetails?.paymentMode,
      creditedAt: signal.creditedAt ?? c.lastPaymentDetails?.creditedAt,
    };
  }
  c.lastVerifiedAt = signal.verifiedAt;
  c.updatedAt = new Date();
  c.events.push(
    makeEvent(c, "SIGNAL_RECEIVED", c.currentState, c.currentState, "CENTRAL_SYSTEM", `Signal received: ${signal.type} ${signal.status}`, { signal: `${signal.type}:${signal.status}` }),
  );

  if (!next || next === c.currentState) return c;

  const previousState = c.currentState;
  c.currentState = next;
  c.retryCount += retryDelta;
  const def = STATE_CATALOG[next];
  c.nextActor = def.nextActor;
  c.citizenAction = actionFor(actionId);
  c.nextState = def.nextStates[0] ?? null;

  // Action assignment is itself an event — "Next action assigned to state."
  if (c.citizenAction) {
    c.events.push(
      makeEvent(c, "ACTION_ASSIGNED", previousState, next, "CITIZEN", `Next action: ${c.citizenAction.title}`, {
        actionId: c.citizenAction.id,
      }),
    );
  }

  c.events.push(
    makeEvent(c, "STATE_CHANGED", previousState, next, def.nextActor, def.humanTitle, {
      from: previousState,
      to: next,
    }),
  );

  // Official confirmation of a completed citizen action (trust boundary):
  // the citizen's self-report never moves the case — only this does.
  if (c.pendingConfirmation && (next === "EKYC_VERIFIED" || next === "PAYMENT_CREDITED")) {
    const confirmed = c.pendingConfirmation;
    c.pendingConfirmation = null;
    c.events.push(
      makeEvent(c, "ACTION_CONFIRMED", previousState, next, "CENTRAL_SYSTEM", `Official confirmation: ${ACTION_CATALOG[confirmed].title}`, {
        actionId: confirmed,
      }),
    );
  }

  if (next === "PAYMENT_CREDITED") {
    c.resolvedAt = new Date();
    c.resolution = {
      reason: "CREDITED",
      note: "Payment credited to the beneficiary's bank account.",
    };
    c.nextActor = "NONE";
    c.citizenAction = null;
    c.events.push(
      makeEvent(c, "RESOLVED", previousState, next, "NONE", "Case resolved — payment credited"),
    );
  }

  advanceLifecycle(c);
  return c;
}

/**
 * The citizen completes their one required action.
 * This is CITIZEN_REPORTED — the case stays put and waits for an OFFICIAL
 * confirmation signal before claiming verified (official status updates can take time).
 */
export function completeCitizenAction(c: CitizenCase, actionId: CitizenActionId): CitizenCase {
  if (!c.citizenAction || c.citizenAction.id !== actionId) {
    throw new Error(`No required action ${actionId} on case ${c.id} (current: ${c.citizenAction?.id ?? "none"})`);
  }
  if (c.pendingConfirmation) {
    throw new Error(`Action ${actionId} already completed on case ${c.id} — waiting for official confirmation`);
  }
  const action = ACTION_CATALOG[actionId];
  c.pendingConfirmation = actionId;
  c.citizenAction = null;
  // Responsibility baton: back to the system until the official signal confirms.
  c.nextActor = "CENTRAL_SYSTEM";
  c.evidence.push({
    id: uuid(),
    source: "Citizen report",
    sourceType: "CITIZEN_REPORTED",
    verifiedAt: new Date(),
    value: `Citizen completed: ${action.title}`,
    confidence: 1,
  });
  c.events.push(
    makeEvent(c, "ACTION_COMPLETED", c.currentState, c.currentState, "CITIZEN", `${action.title} — waiting for official confirmation`, {
      actionId,
    }),
  );
  c.updatedAt = new Date();
  advanceLifecycle(c);
  return c;
}

/** Official confirmation that a completed citizen action took effect. */
export function confirmCitizenAction(c: CitizenCase, actionId: CitizenActionId): CitizenCase {
  if (c.pendingConfirmation !== actionId) {
    throw new Error(`No pending confirmation for ${actionId} on case ${c.id}`);
  }
  c.pendingConfirmation = null;
  c.events.push(
    makeEvent(c, "ACTION_CONFIRMED", c.currentState, c.currentState, "CENTRAL_SYSTEM", `Official confirmation: ${ACTION_CATALOG[actionId].title}`, {
      actionId,
    }),
  );
  c.updatedAt = new Date();
  return c;
}

export function resolveCase(c: CitizenCase, reason: ResolutionReason, note: string): CitizenCase {
  if (TERMINAL_STATES.includes(c.currentState)) return c;
  c.currentState = "RESOLVED";
  c.lifecycle = "RESOLVED";
  c.nextActor = "NONE";
  c.citizenAction = null;
  c.nextState = null;
  c.pendingConfirmation = null;
  c.resolvedAt = new Date();
  c.resolution = { reason, note };
  c.events.push(makeEvent(c, "RESOLVED", c.currentState, "RESOLVED", "NONE", "Case resolved"));
  c.updatedAt = new Date();
  return c;
}

export function getNextActor(c: CitizenCase): Actor {
  return c.nextActor;
}

/**
 * Minimum Human Action — the engine's workload-minimisation function.
 * `estimatedEffort` is internal (decides presentation), never shown as a score.
 */
export function calculateCitizenAction(c: CitizenCase): NextActionDecision {
  if (c.pendingConfirmation) {
    return {
      required: false,
      action: null,
      reason: "AWAITING_OFFICIAL_CONFIRMATION",
    };
  }
  if (c.citizenAction) {
    return {
      required: true,
      action: c.citizenAction,
      reason: c.currentState,
    };
  }
  return {
    required: false,
    action: null,
    reason: c.currentState,
  };
}

/** The four-question answer block for the case screen. */
export function caseSummary(c: CitizenCase): {
  state: CaseStateId;
  title: string;
  titleHi: string;
  why: string;
  whyHi: string;
  nextActor: Actor;
  yourAction: { required: boolean; text: string; textHi: string };
  chain: string[];
  chainHi: string[];
  lastVerifiedAt: Date | null;
  color: string;
} {
  const def = STATE_CATALOG[c.currentState];
  const decision = calculateCitizenAction(c);
  return {
    state: c.currentState,
    title: def.humanTitle,
    titleHi: def.humanTitleHi,
    why: def.humanExplanation,
    whyHi: def.humanExplanationHi,
    nextActor: c.nextActor,
    yourAction: decision.required && decision.action
      ? { required: true, text: decision.action.title, textHi: decision.action.titleHi }
      : c.pendingConfirmation
        ? { required: false, text: "Action done — waiting for official confirmation", textHi: "कार्रवाई पूरी — आधिकारिक पुष्टि की प्रतीक्षा" }
        : { required: false, text: "Nothing right now", textHi: "अभी कुछ नहीं करना है" },
    chain: def.chain,
    chainHi: def.chainHi,
    lastVerifiedAt: c.lastVerifiedAt,
    color: def.color,
  };
}
