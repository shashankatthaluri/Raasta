import { NextResponse } from "next/server";
import { createDemoCase, demoInfoFor, getStoredCase } from "@/server/caseStore";
import { toCaseDTO } from "@/server/dto";
import { JOURNEY_BY_ID } from "@/domain/journeys";

/**
 * POST /api/cases — create a case from the entry experience.
 * Demo mode: creates a case driven by a scripted journey of simulated official signals.
 * Default journey is J3 (the star: failure → nothing → reprocessing → credited).
 */
export async function POST(request: Request) {
  let body: { journeyId?: string; problemType?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    // empty body is fine
  }

  const journeyId = body.journeyId ?? "J3_PAYMENT_FAILURE";
  if (!JOURNEY_BY_ID[journeyId]) {
    return NextResponse.json({ error: `Unknown journey: ${journeyId}` }, { status: 400 });
  }

  const c = createDemoCase({ journeyId, problemType: body.problemType });
  const stored = getStoredCase(c.id)!;
  return NextResponse.json({ case: toCaseDTO(c, demoInfoFor(stored)) }, { status: 201 });
}
