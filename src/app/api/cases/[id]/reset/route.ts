import { NextResponse } from "next/server";
import { demoInfoFor, getStoredCase, resetDemoCase } from "@/server/caseStore";
import { toCaseDTO } from "@/server/dto";

/**
 * POST /api/cases/:id/reset — DEMO ONLY.
 * Resets the demo case back to Step 1/4 (the initial unresolved state)
 * so the user can replay the Magic Demo anytime.
 */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stored = await getStoredCase(id);
  if (!stored) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const updated = await resetDemoCase(id);
  return NextResponse.json({
    case: toCaseDTO(updated.case, demoInfoFor(updated)),
    reset: true,
  });
}
