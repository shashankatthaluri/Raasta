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
  let body: { journeyId?: string; problemType?: string; registrationNumber?: string; message?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    // empty body is fine
  }

  let journeyId = body.journeyId ?? "J3_PAYMENT_FAILURE";

  // Check 11-digit number suffix routing
  if (body.registrationNumber?.trim()) {
    const reg = body.registrationNumber.trim();
    const lastChar = reg.slice(-1);

    // Ending in 0 or 5 -> Record Not Found
    if (lastChar === "0" || lastChar === "5" || reg === "00000000000") {
      return NextResponse.json(
        {
          error:
            "No PM-KISAN record found for registration #" +
            reg +
            ". Please verify the 11-digit number or register at pmkisan.gov.in.",
        },
        { status: 404 }
      );
    }

    // Exact Core Mapping:
    // ...1 or ...6 -> Core 1: Citizen Action Required (e-KYC)
    // ...2 or ...7 -> Core 2: State Land Verification (Zero-Action Relief)
    // ...3 or ...8 -> Core 3: Payment Failure & Reprocessing (Dispute & Grievance)
    // ...4 or ...9 -> Core 4: Direct Processing to Credited
    if (lastChar === "1" || lastChar === "6") {
      journeyId = "J1_FARMER_EKYC";
    } else if (lastChar === "2" || lastChar === "7") {
      journeyId = "J2_GOVT_VERIFICATION";
    } else if (lastChar === "3" || lastChar === "8") {
      journeyId = "J3_PAYMENT_FAILURE";
    } else if (lastChar === "4" || lastChar === "9") {
      journeyId = "J4_NO_ACTION";
    }
  }

  if (body.message?.trim()) {
    const intent = await extractIntent(body.message);
    if (intent.intent === "UNRELATED_QUERY") {
      return NextResponse.json(
        {
          error:
            "Raasta is specialized for PM-KISAN and Direct Benefit Transfer (DBT) welfare assistance. " +
            "Please describe an issue related to your PM-KISAN installment, e-KYC, bank account, or government verification.",
        },
        { status: 422 }
      );
    }
    journeyId = journeyForIntent(intent.intent);
    body.problemType = intent.intent;
  }

  if (!JOURNEY_BY_ID[journeyId]) {
    return NextResponse.json({ error: `Unknown journey: ${journeyId}` }, { status: 400 });
  }

  const c = await createDemoCase({
    journeyId,
    problemType: body.problemType,
    registrationNumber: body.registrationNumber?.trim() || undefined,
    message: body.message?.trim() || undefined,
  });
  const stored = await getStoredCase(c.id);
  return NextResponse.json({ case: toCaseDTO(c, stored ? demoInfoFor(stored) : null) }, { status: 201 });
}
