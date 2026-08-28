import { describe, expect, it } from "vitest";
import {
  applySignal,
  calculateCitizenAction,
  completeCitizenAction,
  createCase,
  resolveCase,
} from "./engine";
import { ESCALATION_SIGNALS, JOURNEY_BY_ID } from "./journeys";
import type { CitizenCase } from "./types";

/**
 * The product contract is executable: the four demo journeys + escalation +
 * rules priority + evidence provenance, asserted step by step.
 */

function runJourney(journeyId: string, opts?: { completeActionAtStep?: number }): CitizenCase {
  const journey = JOURNEY_BY_ID[journeyId];
  const c = createCase({ id: `RAAS-DEMO-${journeyId}`, problemType: "PAYMENT_MISSING", isDemo: true });
  journey.steps.forEach((step, i) => {
    applySignal(c, step.signal);
    if (opts?.completeActionAtStep === i && c.citizenAction) {
      completeCitizenAction(c, c.citizenAction.id);
    }
  });
  return c;
}

describe("J1 — Farmer action (e-KYC)", () => {
  it("walks the full journey and resolves with payment credited", () => {
    const c = runJourney("J1_FARMER_EKYC", { completeActionAtStep: 0 });
    expect(c.currentState).toBe("PAYMENT_CREDITED");
    expect(c.lifecycle).toBe("RESOLVED");
    expect(c.resolution?.reason).toBe("CREDITED");
    expect(c.nextActor).toBe("NONE");
  });

  it("assigns the one required action at EKYC_REQUIRED", () => {
    const c = createCase({ id: "RAAS-DEMO-J1A", problemType: "PAYMENT_MISSING" });
    applySignal(c, JOURNEY_BY_ID.J1_FARMER_EKYC.steps[0].signal);
    expect(c.currentState).toBe("EKYC_REQUIRED");
    expect(c.nextActor).toBe("CITIZEN");
    const decision = calculateCitizenAction(c);
    expect(decision.required).toBe(true);
    expect(decision.action?.id).toBe("COMPLETE_EKYC");
    expect(decision.action?.href).toBe("https://pmkisan.gov.in/");
  });

  it("never claims verified on citizen self-report — waits for the official signal", () => {
    const c = createCase({ id: "RAAS-DEMO-J1B", problemType: "PAYMENT_MISSING" });
    applySignal(c, JOURNEY_BY_ID.J1_FARMER_EKYC.steps[0].signal); // eKYC INCOMPLETE
    completeCitizenAction(c, "COMPLETE_EKYC");
    // Citizen says done — but the case stays put.
    expect(c.currentState).toBe("EKYC_REQUIRED");
    expect(c.pendingConfirmation).toBe("COMPLETE_EKYC");
    expect(c.citizenAction).toBeNull();
    expect(c.nextActor).toBe("CENTRAL_SYSTEM");
    expect(calculateCitizenAction(c).reason).toBe("AWAITING_OFFICIAL_CONFIRMATION");
    // The official COMPLETE signal is what actually moves it.
    applySignal(c, JOURNEY_BY_ID.J1_FARMER_EKYC.steps[1].signal);
    expect(c.currentState).toBe("EKYC_VERIFIED");
    expect(c.pendingConfirmation).toBeNull();
    expect(c.events.some((e) => e.eventType === "ACTION_CONFIRMED")).toBe(true);
  });
});

describe("J2 — Government action (physical verification)", () => {
  it("puts the state in charge and asks nothing of the farmer", () => {
    const c = runJourney("J2_GOVT_VERIFICATION");
    expect(c.currentState).toBe("PAYMENT_CREDITED");
    // At the verification-pending point (step 2), the farmer has nothing to do.
    const probe = createCase({ id: "RAAS-DEMO-J2A", problemType: "PAYMENT_MISSING" });
    applySignal(probe, JOURNEY_BY_ID.J2_GOVT_VERIFICATION.steps[0].signal);
    applySignal(probe, JOURNEY_BY_ID.J2_GOVT_VERIFICATION.steps[1].signal);
    expect(probe.currentState).toBe("PHYSICAL_VERIFICATION_PENDING");
    expect(probe.nextActor).toBe("STATE");
    expect(probe.citizenAction).toBeNull();
    expect(calculateCitizenAction(probe).required).toBe(false);
    // Pending ≠ ineligible.
    expect(probe.currentState).not.toBe("RESOLVED");
    expect(probe.resolution).toBeNull();
  });
});

describe("J3 — Payment failure (reprocessing)", () => {
  it("tells the farmer nothing is needed on failure — the killer moment", () => {
    const c = createCase({ id: "RAAS-DEMO-J3A", problemType: "PAYMENT_MISSING" });
    applySignal(c, JOURNEY_BY_ID.J3_PAYMENT_FAILURE.steps[0].signal);
    expect(c.currentState).toBe("TRANSACTION_FAILED");
    expect(c.nextActor).toBe("STATE");
    expect(c.citizenAction).toBeNull();
    expect(calculateCitizenAction(c).required).toBe(false);
    expect(c.retryCount).toBe(1);
  });

  it("reprocesses and resolves", () => {
    const c = runJourney("J3_PAYMENT_FAILURE");
    expect(c.currentState).toBe("PAYMENT_CREDITED");
    expect(c.resolution?.reason).toBe("CREDITED");
    expect(c.retryCount).toBe(1);
  });
});

describe("J4 — No action", () => {
  it("proves not every problem requires a task", () => {
    const c = runJourney("J4_NO_ACTION");
    expect(c.currentState).toBe("PAYMENT_CREDITED");
    for (const step of JOURNEY_BY_ID.J4_NO_ACTION.steps) {
      const probe = createCase({ id: "RAAS-DEMO-J4A", problemType: "PAYMENT_MISSING" });
      applySignal(probe, step.signal);
      expect(calculateCitizenAction(probe).required).toBe(false);
    }
  });
});

describe("Escalation — stuck policy (R6)", () => {
  it("asks for one specific action after repeated failures", () => {
    const c = createCase({ id: "RAAS-DEMO-ESC", problemType: "PAYMENT_MISSING" });
    for (const signal of ESCALATION_SIGNALS) applySignal(c, signal);
    expect(c.currentState).toBe("CITIZEN_ACTION_REQUIRED");
    expect(c.nextActor).toBe("CITIZEN");
    expect(c.citizenAction?.id).toBe("SHOW_CARD_AT_BANK");
    expect(calculateCitizenAction(c).required).toBe(true);
    // The bank card exists — "What do I even say at the bank?"
    expect(c.citizenAction?.card?.statement).toContain("Aadhaar/DBT mapping issue");
  });
});

describe("Rules priority & terminal guard", () => {
  it("R2 (eKYC incomplete) dominates R4 (processing)", () => {
    const c = createCase({ id: "RAAS-DEMO-P1", problemType: "PAYMENT_MISSING" });
    applySignal(c, JOURNEY_BY_ID.J4_NO_ACTION.steps[0].signal); // PROCESSING
    expect(c.currentState).toBe("PAYMENT_PROCESSING");
    applySignal(c, JOURNEY_BY_ID.J1_FARMER_EKYC.steps[0].signal); // eKYC INCOMPLETE
    expect(c.currentState).toBe("EKYC_REQUIRED");
  });

  it("R3 (credited) dominates everything and is terminal", () => {
    const c = createCase({ id: "RAAS-DEMO-P2", problemType: "PAYMENT_MISSING" });
    applySignal(c, JOURNEY_BY_ID.J1_FARMER_EKYC.steps[0].signal); // EKYC_REQUIRED
    applySignal(c, JOURNEY_BY_ID.J4_NO_ACTION.steps[1].signal); // CREDITED
    expect(c.currentState).toBe("PAYMENT_CREDITED");
    const eventsBefore = c.events.length;
    applySignal(c, JOURNEY_BY_ID.J1_FARMER_EKYC.steps[2].signal); // late PROCESSING
    expect(c.currentState).toBe("PAYMENT_CREDITED");
    expect(c.events.length).toBe(eventsBefore); // terminal cases are inert — no new events
  });
});

describe("Evidence & provenance", () => {
  it("marks official signals OFFICIAL and citizen reports CITIZEN_REPORTED", () => {
    const c = createCase({ id: "RAAS-DEMO-EV", problemType: "PAYMENT_MISSING" });
    applySignal(c, JOURNEY_BY_ID.J1_FARMER_EKYC.steps[0].signal);
    completeCitizenAction(c, "COMPLETE_EKYC");
    applySignal(c, JOURNEY_BY_ID.J3_PAYMENT_FAILURE.steps[3].signal); // CREDITED with UTR
    const credited = c.evidence.find((e) => e.value.en.includes("UTR"));
    expect(credited?.sourceType).toBe("OFFICIAL");
    expect(credited?.value.en).toContain("amount ₹2000");
    const citizen = c.evidence.find((e) => e.sourceType === "CITIZEN_REPORTED");
    expect(citizen?.value.en).toContain("Citizen completed");
  });

  it("builds the full timeline automatically from events", () => {
    const c = runJourney("J2_GOVT_VERIFICATION");
    const labels = c.events.map((e) => e.eventType);
    expect(labels).toContain("CASE_CREATED");
    expect(labels).toContain("STATE_CHANGED");
    expect(labels).toContain("RESOLVED");
    // Timeline is monotonic in time.
    for (let i = 1; i < c.events.length; i += 1) {
      expect(c.events[i].createdAt.getTime()).toBeGreaterThanOrEqual(
        c.events[i - 1].createdAt.getTime(),
      );
    }
  });
});

describe("resolveCase", () => {
  it("closes a case without a credit (no-action / escalated)", () => {
    const c = createCase({ id: "RAAS-DEMO-RZ", problemType: "PAYMENT_MISSING" });
    resolveCase(c, "NO_ACTION", "Nothing was owed — instalment not due.");
    expect(c.currentState).toBe("RESOLVED");
    expect(c.lifecycle).toBe("RESOLVED");
    expect(c.resolution?.reason).toBe("NO_ACTION");
    expect(calculateCitizenAction(c).required).toBe(false);
  });
});

describe("Structured Dispute & Grievance Compiler", () => {
  it("records a citizen dispute without adjudicating and sets dispute property", async () => {
    const { recordDispute } = await import("./engine");
    const c = createCase({ id: "RAAS-DEMO-DSP", problemType: "PAYMENT_MISSING" });
    applySignal(c, JOURNEY_BY_ID.J1_FARMER_EKYC.steps[0].signal);
    recordDispute(c, "My Aadhaar details are correct and updated.");

    expect(c.dispute).toBeDefined();
    expect(c.dispute?.citizenStatement.en).toBe("My Aadhaar details are correct and updated.");
    expect(c.dispute?.officialClaim.en).toBeDefined();
    const disputeEvidence = c.evidence.find((e) => e.value.en.includes("dispute"));
    expect(disputeEvidence?.sourceType).toBe("CITIZEN_REPORTED");
  });

  it("compiles a structured grievance draft from verified case memory", async () => {
    const { compileGrievanceDraft } = await import("./engine");
    const c = createCase({
      id: "RAAS-DEMO-GRV",
      problemType: "PAYMENT_MISSING",
      registrationNumber: "10203040506",
    });
    applySignal(c, JOURNEY_BY_ID.J3_PAYMENT_FAILURE.steps[0].signal);

    const draft = compileGrievanceDraft(c);
    expect(draft.registrationNumber).toBe("10203040506");
    expect(draft.subject.en).toContain("10203040506");
    expect(draft.officialPortalUrl).toBe("https://pmkisan.gov.in/Grievance.aspx");
    expect(draft.facts.length).toBeGreaterThan(0);
  });
});

