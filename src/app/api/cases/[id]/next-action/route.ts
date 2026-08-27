import { NextResponse } from "next/server";
import { getStoredCase } from "@/server/caseStore";
import { calculateCitizenAction } from "@/domain/engine";

/** GET /api/cases/:id/next-action — the Minimum Human Action decision. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stored = getStoredCase(id);
  if (!stored) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }
  const decision = calculateCitizenAction(stored.case);
  return NextResponse.json({
    decision: {
      required: decision.required,
      reason: decision.reason,
      actionId: decision.action?.id ?? null,
    },
  });
}
