import { describe, expect, it } from "vitest";
import { POST as createCaseRoute } from "@/app/api/cases/route";
import { GET as getCaseRoute } from "@/app/api/cases/[id]/route";
import { POST as actionRoute } from "@/app/api/cases/[id]/action/route";
import { POST as simulateRoute } from "@/app/api/cases/[id]/simulate-signal/route";
import { GET as nextActionRoute } from "@/app/api/cases/[id]/next-action/route";

/**
 * Phase 5+6 verification — the four demo journeys end-to-end through the real
 * API surface: create → action → simulate official signals → resolution,
 * asserting state, next actor, minimum citizen action, explanation, timeline,
 * terminal behavior and provenance at every step.
 */

const PARAMS = (id: string) => ({ params: Promise.resolve({ id }) });

async function createCase(journeyId: string, problemType = "PAYMENT_MISSING") {
  const res = await createCaseRoute(
    new Request("http://localhost/api/cases", {
      method: "POST",
      body: JSON.stringify({ journeyId, problemType }),
    }),
  );
  expect(res.status).toBe(201);
  const json = (await res.json()) as { case: Record<string, unknown> };
  return json.case;
}

async function postAction(id: string, actionId: string) {
  return actionRoute(
    new Request("http://localhost/api/cases", { method: "POST", body: JSON.stringify({ actionId }) }),
    PARAMS(id),
  );
}

async function simulate(id: string) {
  const res = await simulateRoute(new Request("http://localhost/api/cases", { method: "POST" }), PARAMS(id));
  expect(res.status).toBe(200);
  return (await res.json()) as { case: Record<string, unknown>; applied: boolean; done: boolean };
}

describe("J1 — Farmer action (e-KYC), end-to-end via API", () => {
  it("walks the full journey with correct experience at every step", async () => {
    const created = await createCase("J1_FARMER_EKYC");
    const id = created.id as string;

    // First screen: e-KYC required — action-required category, one CTA.
    expect(created.currentState).toBe("EKYC_REQUIRED");
    expect(created.stateCategory).toBe("action-required");
    expect(created.yourAction).toMatchObject({ required: true });
    expect((created.yourAction as { action: { id: string } }).action.id).toBe("COMPLETE_EKYC");
    expect(created.nextActorLabel).toMatchObject({ en: "You" });
    expect((created.demo as { step: number }).step).toBe(1);

    // Citizen completes the action → CITIZEN_REPORTED, waits for official confirmation.
    const afterAction = await postAction(id, "COMPLETE_EKYC");
    expect(afterAction.status).toBe(200);
    const acted = ((await afterAction.json()) as { case: Record<string, unknown> }).case;
    expect(acted.currentState).toBe("EKYC_REQUIRED");
    expect(acted.yourAction).toMatchObject({ required: false, awaitingConfirmation: true });

    // Official confirmation signal → EKYC_VERIFIED, flag cleared, ACTION_CONFIRMED on timeline.
    const s1 = await simulate(id);
    expect(s1.case.currentState).toBe("EKYC_VERIFIED");
    expect(s1.case.yourAction).toMatchObject({ awaitingConfirmation: false });
    const tl1 = s1.case.timeline as { eventType: string }[];
    expect(tl1.some((e) => e.eventType === "ACTION_CONFIRMED")).toBe(true);

    // Processing → credited.
    await simulate(id);
    const s3 = await simulate(id);
    expect(s3.case.currentState).toBe("PAYMENT_CREDITED");
    expect(s3.case.stateCategory).toBe("resolved");
    expect(s3.case.resolution).toMatchObject({ reason: "CREDITED" });
    expect(s3.case.credited).toMatchObject({ amount: 2000, utr: "DEMO-UTR-2026-0001" });
    expect(s3.case.nextActorLabel).toMatchObject({ en: "No one" });

    // Provenance preserved: official UTR evidence, citizen-reported action evidence.
    const ev = s3.case.evidence as { value: string; sourceType: string }[];
    expect(ev.some((e) => e.value.includes("UTR") && e.sourceType === "OFFICIAL")).toBe(true);
    expect(ev.some((e) => e.sourceType === "CITIZEN_REPORTED")).toBe(true);

    // Terminal: further simulation is a no-op.
    const done = await simulate(id);
    expect(done.done).toBe(true);
    expect(done.case.currentState).toBe("PAYMENT_CREDITED");
  });
});

describe("J2 — Government action (verification), end-to-end via API", () => {
  it("keeps the citizen in the zero-action state while the state acts", async () => {
    const created = await createCase("J2_GOVT_VERIFICATION");
    expect(created.currentState).toBe("PAYMENT_PROCESSING");

    const s1 = await simulate(idOf(created));
    expect(s1.case.currentState).toBe("PHYSICAL_VERIFICATION_PENDING");
    expect(s1.case.stateCategory).toBe("waiting");
    expect(s1.case.nextActorLabel).toMatchObject({ en: "State verification team" });
    expect(s1.case.yourAction).toMatchObject({ required: false });
    expect((s1.case.yourAction as { text: { en: string } }).text.en).toBe("Nothing right now");

    const s2 = await simulate(idOf(created));
    expect(s2.case.currentState).toBe("PAYMENT_PROCESSING");
    await simulate(idOf(created)); // journey's redundant PROCESSING signal — a no-op by design
    const s3 = await simulate(idOf(created));
    expect(s3.case.currentState).toBe("PAYMENT_CREDITED");
    expect(s3.case.resolution?.reason).toBe("CREDITED");
  });
});

describe("J3 — Payment failure (reprocessing), end-to-end via API", () => {
  it("opens on the killer moment: failed, nothing needed from the farmer", async () => {
    const created = await createCase("J3_PAYMENT_FAILURE");
    expect(created.currentState).toBe("TRANSACTION_FAILED");
    expect(created.stateCategory).toBe("waiting");
    expect(created.nextActorLabel).toMatchObject({ en: "State verification team" });
    expect(created.yourAction).toMatchObject({ required: false });
    // The screen must never say "visit your bank" here.
    expect((created.yourAction as { text: { en: string } }).text.en).toBe("Nothing right now");

    // Action endpoint refuses — there is no required action.
    const refused = await postAction(created.id as string, "COMPLETE_EKYC");
    expect(refused.status).toBe(409);

    // next-action endpoint agrees: nothing required, reason is the state.
    const na = await nextActionRoute(new Request("http://localhost/api/cases"), PARAMS(created.id as string));
    const naJson = (await na.json()) as { decision: { required: boolean; reason: string; actionId: null } };
    expect(naJson.decision).toMatchObject({ required: false, reason: "TRANSACTION_FAILED", actionId: null });

    // Reprocessing → processing → credited.
    const s1 = await simulate(created.id as string);
    expect(s1.case.currentState).toBe("PAYMENT_REPROCESSING");
    const s2 = await simulate(created.id as string);
    expect(s2.case.currentState).toBe("PAYMENT_PROCESSING");
    const s3 = await simulate(created.id as string);
    expect(s3.case.currentState).toBe("PAYMENT_CREDITED");
  });
});

describe("J4 — No action, end-to-end via API", () => {
  it("proves not every problem requires a task", async () => {
    const created = await createCase("J4_NO_ACTION");
    expect(created.currentState).toBe("PAYMENT_PROCESSING");
    expect(created.yourAction).toMatchObject({ required: false });
    const s1 = await simulate(created.id as string);
    expect(s1.case.currentState).toBe("PAYMENT_CREDITED");
    expect(s1.case.yourAction).toMatchObject({ required: false });
  });
});

describe("Guards", () => {
  it("404s for unknown cases and 400s for unknown journeys", async () => {
    const missing = await getCaseRoute(new Request("http://localhost/api/cases"), PARAMS("RAAS-DEMO-NOPE"));
    expect(missing.status).toBe(404);

    const bad = await createCaseRoute(
      new Request("http://localhost/api/cases", { method: "POST", body: JSON.stringify({ journeyId: "NOPE" }) }),
    );
    expect(bad.status).toBe(400);
  });
});

function idOf(c: Record<string, unknown>): string {
  return c.id as string;
}
