import { NextResponse } from "next/server";
import { demoInfoFor, getStoredCase } from "@/server/caseStore";
import { toCaseDTO } from "@/server/dto";

/** GET /api/cases/:id — the four-question block, chain, timeline, evidence, demo info. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stored = getStoredCase(id);
  if (!stored) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }
  return NextResponse.json({ case: toCaseDTO(stored.case, demoInfoFor(stored)) });
}
