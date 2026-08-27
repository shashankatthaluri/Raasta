import { describe, expect, it } from "vitest";
import { detectLanguage, extractIntent, journeyForIntent } from "./intent";

/**
 * Phase 7 — free-text intake. Deterministic extractor: no key, no network,
 * fully testable. An LLM extractor can replace it behind the same interface;
 * the case service never cares which one produced the intent.
 */
describe("intent extraction", () => {
  it("extracts PAYMENT_MISSING with PREVIOUSLY_RECEIVED context from the canonical example", () => {
    const r = extractIntent(
      "I used to receive the money every time, but this month I didn't get anything.",
    );
    expect(r).toMatchObject({
      service: "PM_KISAN",
      intent: "PAYMENT_MISSING",
      context: ["PREVIOUSLY_RECEIVED"],
      language: "en",
    });
  });

  it("detects PAYMENT_STOPPED when payments stopped without missing words", () => {
    expect(extractIntent("My payment stopped coming last month.").intent).toBe("PAYMENT_STOPPED");
  });

  it("detects Hindi input, intent and language", () => {
    const r = extractIntent("मुझे पैसे नहीं मिले इस महीने");
    expect(r.language).toBe("hi");
    expect(r.intent).toBe("PAYMENT_MISSING");
  });

  it("detects Hindi stopped payments with previous context", () => {
    const r = extractIntent("पहले हर बार पैसे आते थे, अब नहीं आ रहे");
    expect(r.intent).toBe("PAYMENT_MISSING");
    expect(r.context).toContain("PREVIOUSLY_RECEIVED");
    expect(r.language).toBe("hi");
  });

  it("falls back to OTHER for unrelated input", () => {
    expect(extractIntent("I want to know about my scholarship").intent).toBe("OTHER");
  });

  it("maps intents to journeys — AI absence never blocks deterministic journeys", () => {
    expect(journeyForIntent("PAYMENT_MISSING")).toBe("J3_PAYMENT_FAILURE");
    expect(journeyForIntent("PAYMENT_STOPPED")).toBe("J2_GOVT_VERIFICATION");
    expect(journeyForIntent("OTHER")).toBe("J1_FARMER_EKYC");
  });

  it("detects language by script", () => {
    expect(detectLanguage("hello")).toBe("en");
    expect(detectLanguage("पैसे नहीं मिले")).toBe("hi");
    expect(detectLanguage("")).toBe("en");
  });
});
