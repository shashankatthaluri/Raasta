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

export type Intent =
  | "EKYC_REQUIRED"
  | "STATE_VERIFICATION"
  | "PAYMENT_FAILURE"
  | "STATUS_CHECK"
  | "PAYMENT_MISSING"
  | "PAYMENT_STOPPED"
  | "UNRELATED_QUERY"
  | "OTHER";

export type IntentLanguage = "en" | "hi" | "te" | "ta" | "kn" | "mr" | "bn" | "pa" | "unknown";

export interface IntentResult {
  service: "PM_KISAN";
  intent: Intent;
  context: string[];
  language: IntentLanguage;
  explanation?: string;
}

export interface IntentExtractor {
  extract(message: string): IntentResult;
}

export interface AsyncIntentExtractor {
  extractAsync(message: string): Promise<IntentResult>;
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

/**
 * OpenAI intent extractor — active when OPENAI_API_KEY is configured.
 * Translates citizen colloquial speech / Hinglish / dialect into structured intent.
 * Rules engine still decides all state transitions.
 * Falls back seamlessly to RuleIntentExtractor on timeout, missing key, or error.
 */
export class OpenAIIntentExtractor implements AsyncIntentExtractor {
  private fallback = new RuleIntentExtractor();

  async extractAsync(message: string): Promise<IntentResult> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return this.fallback.extract(message);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You are the civic intent extractor for Raasta, an assistant specialized strictly in Direct Benefit Transfer (DBT), PM-KISAN, government welfare pensions, land verification, bank account DBT seeding, and Aadhaar e-KYC.\n\n" +
                "Classify the user's message into exactly one of these intents:\n" +
                "- 'EKYC_REQUIRED': Issues with Aadhaar linking, biometrics, fingerprint, OTP, e-KYC incomplete/pending.\n" +
                "- 'STATE_VERIFICATION': Land records, patwari, state government verification, physical verification, eligibility audit.\n" +
                "- 'PAYMENT_FAILURE': Transaction failed, bank account closed, IFSC changed, NPCI mapping failed, money deducted but not credited.\n" +
                "- 'STATUS_CHECK': Asking when the installment will come, checking normal payment progress, general inquiry.\n" +
                "- 'PAYMENT_MISSING': Installment didn't come, money missing, payment not received.\n" +
                "- 'PAYMENT_STOPPED': Money was received before but now stopped.\n" +
                "- 'UNRELATED_QUERY': Any questions or text completely unrelated to PM-KISAN, farming, welfare pensions, banks, Aadhaar, or government civic schemes (e.g. trivia like 'who is president of america', coding questions, general conversation, jokes).\n\n" +
                "Respond in valid JSON with schema:\n" +
                '{"service":"PM_KISAN","intent":"EKYC_REQUIRED"|"STATE_VERIFICATION"|"PAYMENT_FAILURE"|"STATUS_CHECK"|"PAYMENT_MISSING"|"PAYMENT_STOPPED"|"UNRELATED_QUERY"|"OTHER","context":["PREVIOUSLY_RECEIVED"|...],"language":"en"|"hi"|"te"|"ta"|"kn"|"mr"|"bn"|"pa"}',
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        return this.fallback.extract(message);
      }

      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent) return this.fallback.extract(message);

      const parsed = JSON.parse(rawContent) as Partial<IntentResult>;
      const validIntents: Intent[] = [
        "EKYC_REQUIRED",
        "STATE_VERIFICATION",
        "PAYMENT_FAILURE",
        "STATUS_CHECK",
        "PAYMENT_MISSING",
        "PAYMENT_STOPPED",
        "UNRELATED_QUERY",
        "OTHER",
      ];
      const intent = validIntents.includes(parsed.intent as Intent)
        ? (parsed.intent as Intent)
        : "OTHER";
      const validLangs: IntentLanguage[] = ["en", "hi", "te", "ta", "kn", "mr", "bn", "pa"];
      const language = validLangs.includes(parsed.language as IntentLanguage)
        ? (parsed.language as IntentLanguage)
        : "en";
      const context = Array.isArray(parsed.context) ? parsed.context.map(String) : [];

      return {
        service: "PM_KISAN",
        intent,
        context,
        language,
      };
    } catch {
      return this.fallback.extract(message);
    }
  }
}

export function extractIntentSync(message: string): IntentResult {
  return new RuleIntentExtractor().extract(message);
}

export async function extractIntent(message: string): Promise<IntentResult> {
  return new OpenAIIntentExtractor().extractAsync(message);
}

/** Intent → demo journey. Keeps "AI fails → journeys still work" literally true. */
export function journeyForIntent(intent: Intent): string {
  switch (intent) {
    case "EKYC_REQUIRED":
      return "J1_FARMER_EKYC";
    case "STATE_VERIFICATION":
    case "PAYMENT_STOPPED":
      return "J2_GOVT_VERIFICATION";
    case "PAYMENT_FAILURE":
    case "PAYMENT_MISSING":
      return "J3_PAYMENT_FAILURE";
    case "STATUS_CHECK":
      return "J4_NO_ACTION";
    default:
      return "J3_PAYMENT_FAILURE";
  }
}
