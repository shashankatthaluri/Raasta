import { NextResponse } from "next/server";
import { extractIntent, journeyForIntent } from "@/ai/intent";
import { JOURNEY_BY_ID } from "@/domain/journeys";
import { createDemoCase, demoInfoFor, getStoredCase } from "@/server/caseStore";
import { toCaseDTO } from "@/server/dto";

/**
 * POST /api/cases — create a case.
 * Two paths:
 *  1. { message }          free-text intake → structured intent → deterministic engine
 *  2. { journeyId }        explicit demo journey (still fully supported — AI failing
 *                          or absent never blocks the deterministic journeys)
 * No auth. Demo cases remain clearly simulated.
 */
export async function POST(request: Request) {
  let body: { journeyId?: string; problemType?: string; message?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    // empty body is fine
  }

  let journeyId = body.journeyId ?? "J3_PAYMENT_FAILURE";
  if (body.message?.trim()) {
    const intent = extractIntent(body.message);
    journeyId = journeyForIntent(intent.intent);
    body.problemType = intent.intent;
  }
  if (!JOURNEY_BY_ID[journeyId]) {
    return NextResponse.json({ error: `Unknown journey: ${journeyId}` }, { status: 400 });
  }

  const c = await createDemoCase({
    journeyId,
    problemType: body.problemType,
    message: body.message?.trim() || undefined,
  });
  const stored = await getStoredCase(c.id);
  return NextResponse.json({ case: toCaseDTO(c, stored ? demoInfoFor(stored) : null) }, { status: 201 });
}
