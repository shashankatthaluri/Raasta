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
  humanLabel: Record<string, string>,
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
  let value: Record<string, string>;

  const STATUS_DICT: Record<string, Record<string, string>> = {
    FAILED: { en: "failed", hi: "विफल", te: "విఫలమైంది", ta: "தோல்வியடைந்தது", kn: "ವಿಫಲವಾಗಿದೆ", mr: "विफल", bn: "ব্যর্থ", pa: "ਅਸਫਲ" },
    PROCESSING: { en: "processing", hi: "प्रोसेसिंग", te: "ప్రాసెసింగ్", ta: "செயலாக்கத்தில்", kn: "ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ", mr: "प्रक्रिया सुरू", bn: "প্রক্রিয়াধীন", pa: "ਪ੍ਰਕਿਰਿਆ ਅਧੀਨ" },
    REPROCESSING: { en: "reprocessing", hi: "दोबारा प्रोसेस", te: "పునఃపరిశీలన", ta: "மறுசெயலாக்கம்", kn: "ಮರುಪ್ರಕ್ರಿಯೆ", mr: "पुनर्प्रक्रिया", bn: "পুনঃপ্রক্রিয়া", pa: "ਮੁੜ ਪ੍ਰਕਿਰਿਆ" },
    CREDITED: { en: "credited", hi: "जमा", te: "జమ అయింది", ta: "வரவு வைக்கப்பட்டது", kn: "ಜಮೆಯಾಗಿದೆ", mr: "जमा", bn: "জমা হয়েছে", pa: "ਜਮ੍ਹਾ ਹੋਇਆ" },
    PENDING: { en: "pending", hi: "लंबित", te: "పెండింగ్‌లో ఉంది", ta: "நிலுவையில் உள்ளது", kn: "ಬಾಕಿ ಇದೆ", mr: "प्रलंबित", bn: "মুলতুবি", pa: "ਬਕਾਇਆ" },
    COMPLETE: { en: "complete", hi: "पूर्ण", te: "పూర్తయింది", ta: "முடிந்தது", kn: "ಪೂರ್ಣಗೊಂಡಿದೆ", mr: "पूर्ण", bn: "সম্পূর্ণ", pa: "ਪੂਰਾ" },
  };

  const LABELS = {
    paymentStatus: { en: "Payment status", hi: "भुगतान स्थिति", te: "చెల్లింపు స్థితి", ta: "கட்டண நிலை", kn: "ಪಾವತಿ ಸ್ಥಿತಿ", mr: "पेमेंट स्थिती", bn: "পেমেন্ট স্থিতি", pa: "ਭੁਗਤਾਨ ਸਥਿਤੀ" },
    ekycStatus: { en: "e-KYC status", hi: "ई-केवाईसी स्थिति", te: "ఇ-కెవైసి స్థితి", ta: "இ-கேஒய்சி நிலை", kn: "ಇ-ಕೆವೈಸಿ ಸ್ಥಿತಿ", mr: "ई-केवायसी स्थिती", bn: "ই-কেওয়াইসি স্থিতি", pa: "ਈ-ਕੇਵਾਈਸੀ ਸਥਿਤੀ" },
    eligibility: { en: "Eligibility verification", hi: "पात्रता सत्यापन", te: "అర్హత ధృవీకరణ", ta: "தகுதி சரிபார்ப்பு", kn: "ಅರ್ಹತೆ ಪರಿಶೀಲನೆ", mr: "पात्रता पडताळणी", bn: "যোগ্যতা যাচাইকরণ", pa: "ਯੋਗਤਾ ਤਸਦੀਕ" },
    amount: { en: "amount", hi: "राशि", te: "మొత్తం", ta: "தொகை", kn: "ಮೊತ್ತ", mr: "रक्कम", bn: "পরিমাণ", pa: "ਰਕਮ" },
    bank: { en: "bank", hi: "बैंक", te: "బ్యాంక్", ta: "வங்கி", kn: "ಬ್ಯಾಂಕ್", mr: "बँक", bn: "ব্যাঙ্ক", pa: "ਬੈਂਕ" },
  };

  if (signal.type === "PAYMENT_STATUS") {
    const langs = ["en", "hi", "te", "ta", "kn", "mr", "bn", "pa"];
    value = {};
    for (const l of langs) {
      const st = STATUS_DICT[signal.status]?.[l] ?? signal.status.toLowerCase();
      const pStatus = LABELS.paymentStatus[l as keyof typeof LABELS.paymentStatus] ?? "Payment status";
      const parts = [`${pStatus}: ${st}`];
      if (signal.amount !== undefined) parts.push(`${LABELS.amount[l as keyof typeof LABELS.amount] ?? "amount"} ₹${signal.amount}`);
      if (signal.utr) parts.push(`UTR ${signal.utr}`);
      if (signal.bankName) parts.push(`${LABELS.bank[l as keyof typeof LABELS.bank] ?? "bank"} ${signal.bankName}`);
      value[l] = parts.join(" · ");
    }
  } else if (signal.type === "EKYC_STATUS") {
    const langs = ["en", "hi", "te", "ta", "kn", "mr", "bn", "pa"];
    value = {};
    for (const l of langs) {
      const st = STATUS_DICT[signal.status]?.[l] ?? signal.status.toLowerCase();
      const ekLabel = LABELS.ekycStatus[l as keyof typeof LABELS.ekycStatus] ?? "e-KYC status";
      value[l] = `${ekLabel}: ${st}`;
    }
  } else {
    const langs = ["en", "hi", "te", "ta", "kn", "mr", "bn", "pa"];
    value = {};
    for (const l of langs) {
      const st = STATUS_DICT[signal.status]?.[l] ?? signal.status.toLowerCase();
      const elLabel = LABELS.eligibility[l as keyof typeof LABELS.eligibility] ?? "Eligibility verification";
      value[l] = `${elLabel}: ${st}`;
    }
  }

  return {
    id: uuid(),
    source: signal.source,
    sourceType: "OFFICIAL",
    verifiedAt: signal.verifiedAt,
    value: value as any,
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
  registrationNumber?: string;
  isDemo?: boolean;
  intake?: { message: string; language: string };
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
    registrationNumber: input.registrationNumber ?? null,
    intakeLanguage: input.intake?.language ?? null,
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
    makeEvent(c, "CASE_CREATED", null, "PAYMENT_EXPECTED", "CENTRAL_SYSTEM", {
      en: "Case created",
      hi: "केस बनाया गया",
      te: "కేసు నమోదు చేయబడింది",
      ta: "வழக்கு உருவாக்கப்பட்டது",
      kn: "ಪ್ರಕರಣ ರಚಿಸಲಾಗಿದೆ",
      mr: "केस नोंदवली गेली",
      bn: "কেস তৈরি করা হয়েছে",
      pa: "ਕੇਸ ਬਣਾਇਆ ਗਿਆ",
    }),
  );
  // The citizen's own words are evidence — CITIZEN_REPORTED, never mistaken for OFFICIAL.
  if (input.intake) {
    c.evidence.push({
      id: uuid(),
      source: "Citizen report",
      sourceType: "CITIZEN_REPORTED",
      verifiedAt: now,
      value: { en: `You told us: ${input.intake.message}`, hi: `आपने बताया: ${input.intake.message}` },
      confidence: 1,
    });
  }
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
    makeEvent(c, "SIGNAL_RECEIVED", c.currentState, c.currentState, "CENTRAL_SYSTEM", {
      en: `Signal received: ${signal.type} ${signal.status}`,
      hi: `संकेत प्राप्त: ${signal.type} ${signal.status}`,
    }, { signal: `${signal.type}:${signal.status}` }),
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
      makeEvent(c, "ACTION_ASSIGNED", previousState, next, "CITIZEN", {
        en: `Next action: ${c.citizenAction.title}`,
        hi: `अगली कार्रवाई: ${c.citizenAction.titleHi}`,
      }, {
        actionId: c.citizenAction.id,
      }),
    );
  }

  const humanTitleObj = typeof def.humanTitle === "object" ? def.humanTitle : { en: def.humanTitle, hi: def.humanTitleHi };

  c.events.push(
    makeEvent(c, "STATE_CHANGED", previousState, next, def.nextActor, humanTitleObj as any, {
      from: previousState,
      to: next,
    }),
  );

  // Official confirmation of a completed citizen action (trust boundary):
  // the citizen's self-report never moves the case — only this does.
  if (c.pendingConfirmation && (next === "EKYC_VERIFIED" || next === "PAYMENT_CREDITED" || next === "PAYMENT_PROCESSING")) {
    const confirmed = c.pendingConfirmation;
    c.pendingConfirmation = null;
    const actDef = ACTION_CATALOG[confirmed];
    const actTitleEn = actDef ? (typeof actDef.title === "object" ? actDef.title.en : actDef.title) : confirmed;
    const actTitleHi = actDef ? (typeof actDef.title === "object" ? actDef.title.hi : actDef.titleHi) : confirmed;
    c.events.push(
      makeEvent(c, "ACTION_CONFIRMED", previousState, next, "CENTRAL_SYSTEM", {
        en: `Official confirmation: ${actTitleEn}`,
        hi: `आधिकारिक पुष्टि: ${actTitleHi}`,
      }, {
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
      makeEvent(c, "RESOLVED", previousState, next, "NONE", { en: "Case resolved — payment credited", hi: "केस हल — भुगतान जमा" }),
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
  const actTitleEn = typeof action.title === "object" ? action.title.en : action.title;
  const actTitleHi = typeof action.title === "object" ? action.title.hi : action.titleHi;

  c.citizenAction = null;
  // Responsibility baton: back to the system until the official signal confirms.
  c.nextActor = "CENTRAL_SYSTEM";
  c.evidence.push({
    id: uuid(),
    source: "Citizen report",
    sourceType: "CITIZEN_REPORTED",
    verifiedAt: new Date(),
    value: { en: `Citizen completed: ${actTitleEn}`, hi: `आपने पूरा किया: ${actTitleHi}` },
    confidence: 1,
  });
  c.events.push(
    makeEvent(c, "ACTION_COMPLETED", c.currentState, c.currentState, "CITIZEN", {
      en: `${actTitleEn} — waiting for official confirmation`,
      hi: `${actTitleHi} — आधिकारिक पुष्टि की प्रतीक्षा`,
    }, {
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
  const actDef = ACTION_CATALOG[actionId];
  const actTitleEn = actDef ? (typeof actDef.title === "object" ? actDef.title.en : actDef.title) : actionId;
  const actTitleHi = actDef ? (typeof actDef.title === "object" ? actDef.title.hi : actDef.titleHi) : actionId;
  c.events.push(
    makeEvent(c, "ACTION_CONFIRMED", c.currentState, c.currentState, "CENTRAL_SYSTEM", {
      en: `Official confirmation: ${actTitleEn}`,
      hi: `आधिकारिक पुष्टि: ${actTitleHi}`,
    }, {
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
  c.events.push(makeEvent(c, "RESOLVED", c.currentState, "RESOLVED", "NONE", { en: "Case resolved", hi: "केस हल हो गया" }));
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

/**
 * Record a citizen dispute / structured disagreement.
 * Raasta creates a structured contrast: OFFICIAL vs YOU without adjudicating.
 */
export function recordDispute(c: CitizenCase, statement: string): CitizenCase {
  const def = STATE_CATALOG[c.currentState];
  const now = new Date();
  c.dispute = {
    officialClaim: { en: def.humanExplanation, hi: def.humanExplanationHi },
    citizenStatement: { en: statement, hi: statement },
    submittedAt: now,
  };
  c.evidence.push({
    id: uuid(),
    source: "Citizen statement",
    sourceType: "CITIZEN_REPORTED",
    verifiedAt: now,
    value: {
      en: `You told us (dispute): ${statement}`,
      hi: `आपने बताया (असहमति): ${statement}`,
    },
    confidence: 1,
  });
  c.events.push(
    makeEvent(c, "ACTION_COMPLETED", c.currentState, c.currentState, "CITIZEN", {
      en: "Citizen statement recorded",
      hi: "नागरिक का बयान दर्ज किया गया",
    }, {
      statement,
    }),
  );
  c.updatedAt = now;
  return c;
}

/**
 * Compile a structured grievance draft from verified case memory.
 * No fabricated claims — strictly compiles official facts, dates, and citizen statements.
 */
export function compileGrievanceDraft(c: CitizenCase): {
  registrationNumber: string;
  category: Record<string, string>;
  subject: Record<string, string>;
  summary: Record<string, string>;
  request: Record<string, string>;
  facts: Record<string, string>[];
  citizenStatement?: Record<string, string>;
  officialPortalUrl: string;
} {
  const def = STATE_CATALOG[c.currentState];
  const facts: Record<string, string>[] = c.evidence
    .filter((e) => e.sourceType === "OFFICIAL")
    .map((e) => e.value);

  return {
    registrationNumber: c.registrationNumber ?? c.id,
    category: {
      en: "PM-KISAN Payment / Verification Discrepancy",
      hi: "PM-KISAN भुगतान / सत्यापन विसंगति",
    },
    subject: {
      en: `Request for review: PM-KISAN case ${c.registrationNumber ?? c.id}`,
      hi: `समीक्षा अनुरोध: PM-KISAN मामला ${c.registrationNumber ?? c.id}`,
    },
    summary: {
      en: `Current official status: ${typeof def.humanTitle === "object" ? def.humanTitle.en : def.humanTitle}. Reason: ${typeof def.humanExplanation === "object" ? def.humanExplanation.en : def.humanExplanation}`,
      hi: `वर्तमान आधिकारिक स्थिति: ${typeof def.humanTitle === "object" ? def.humanTitle.hi : def.humanTitleHi}। कारण: ${typeof def.humanExplanation === "object" ? def.humanExplanation.hi : def.humanExplanationHi}`,
    },
    request: {
      en: "Please review the verified case records and advise on the required resolution or correction.",
      hi: "कृपया सत्यापित मामले के रिकॉर्ड की समीक्षा करें और आवश्यक समाधान या सुधार पर सलाह दें।",
    },
    facts,
    citizenStatement: c.dispute?.citizenStatement,
    officialPortalUrl: "https://pmkisan.gov.in/Grievance.aspx",
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
  const titleEn = typeof def.humanTitle === "object" ? def.humanTitle.en : def.humanTitle;
  const titleHi = typeof def.humanTitle === "object" ? def.humanTitle.hi : def.humanTitleHi;
  const whyEn = typeof def.humanExplanation === "object" ? def.humanExplanation.en : def.humanExplanation;
  const whyHi = typeof def.humanExplanation === "object" ? def.humanExplanation.hi : def.humanExplanationHi;
  const chainEn = Array.isArray(def.chain) ? def.chain : (def.chain as any)?.en ?? [];
  const chainHi = Array.isArray(def.chain) ? def.chainHi : (def.chain as any)?.hi ?? [];

  return {
    state: c.currentState,
    title: titleEn,
    titleHi: titleHi,
    why: whyEn,
    whyHi: whyHi,
    nextActor: c.nextActor,
    yourAction: decision.required && decision.action
      ? {
          required: true,
          text: ((decision.action.title as unknown as Record<string, string>)?.en) ?? decision.action.title,
          textHi: ((decision.action.title as unknown as Record<string, string>)?.hi) ?? decision.action.titleHi,
        }
      : c.pendingConfirmation
        ? { required: false, text: "Action done — waiting for official confirmation", textHi: "कार्रवाई पूरी — आधिकारिक पुष्टि की प्रतीक्षा" }
        : { required: false, text: "Nothing right now", textHi: "अभी कुछ नहीं करना है" },
    chain: chainEn,
    chainHi: chainHi,
    lastVerifiedAt: c.lastVerifiedAt,
    color: def.color,
  };
}
