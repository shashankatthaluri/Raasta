/**
 * Phase 7 — the ONE AI capability: free-text intake.
 *
 * "Tell us what happened" → structured intent → the deterministic case engine.
 * AI never decides government state; it only converts words into intent.
 *
 * Two implementations behind one interface:
 *  - RuleIntentExtractor (active): deterministic, no key required, tested.
 *  - An LLM extractor can be dropped in behind the same interface when a key is
 *    configured — the case service does not care which one produced the intent.
 *
 * If extraction fails or is ambiguous, the deterministic demo journeys still
 * work perfectly (intent falls back to OTHER → the default journey).
 */

export type Intent = "PAYMENT_MISSING" | "PAYMENT_STOPPED" | "OTHER";
export type IntentLanguage = "en" | "hi" | "unknown";

export interface IntentResult {
  service: "PM_KISAN";
  intent: Intent;
  context: string[];
  language: IntentLanguage;
}

export interface IntentExtractor {
  extract(message: string): IntentResult;
}

const DEVANAGARI = /[\u0900-\u097F]/;

/** Priority order matters: a missing payment dominates "used to receive". */
const MISSING_PATTERNS = [
  /didn'?t (get|receive)/i,
  /did not (get|receive)/i,
  /not (get|receive|received)/i,
  /no payment/i,
  /no money/i,
  /nothing (came|arrived)/i,
  /money didn'?t (come|arrive)/i,
  /didn'?t (come|arrive)/i,
  /not (come|arrive)/i,
  /नहीं\s*(आया|आई|आये|आए|आ|मिला|मिली|मिले|मिल)/u,
];

const STOPPED_PATTERNS = [
  /stopped/i,
  /stop (ho|gaya|gayi|hua|ho gay)/i,
  /no longer/i,
  /used to (receive|get)/i,
  /रुक गया/u,
  /रुक गई/u,
  /बंद हो/u,
  /पहले (आता|मिलता) था/u,
];

const PREVIOUSLY_PATTERNS = [
  /used to/i,
  /previously/i,
  /earlier/i,
  /always/i,
  /every time/i,
  /har baar/i,
  /पहले/u,
  /हर बार/u,
];

export function detectLanguage(message: string): IntentLanguage {
  return DEVANAGARI.test(message) ? "hi" : "en";
}

export class RuleIntentExtractor implements IntentExtractor {
  extract(message: string): IntentResult {
    const text = message.trim();
    const language = detectLanguage(text);

    let intent: Intent = "OTHER";
    if (MISSING_PATTERNS.some((p) => p.test(text))) {
      intent = "PAYMENT_MISSING";
    } else if (STOPPED_PATTERNS.some((p) => p.test(text))) {
      intent = "PAYMENT_STOPPED";
    }

    const context: string[] = [];
    if (PREVIOUSLY_PATTERNS.some((p) => p.test(text))) {
      context.push("PREVIOUSLY_RECEIVED");
    }

    return { service: "PM_KISAN", intent, context, language };
  }
}

export function extractIntent(message: string): IntentResult {
  return new RuleIntentExtractor().extract(message);
}

/** Intent → demo journey. Keeps "AI fails → journeys still work" literally true. */
export function journeyForIntent(intent: Intent): string {
  switch (intent) {
    case "PAYMENT_MISSING":
      return "J3_PAYMENT_FAILURE";
    case "PAYMENT_STOPPED":
      return "J2_GOVT_VERIFICATION";
    default:
      return "J1_FARMER_EKYC";
  }
}
