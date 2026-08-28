import { NextResponse } from "next/server";
import { demoInfoFor, getStoredCase, recordDisputeOnCase } from "@/server/caseStore";
import { toCaseDTO } from "@/server/dto";

/**
 * POST /api/cases/:id/dispute — record a citizen's disagreement/counter-statement.
 * Creates a structured disagreement (OFFICIAL vs YOU) in case memory without adjudicating.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stored = await getStoredCase(id);
  if (!stored) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  let body: { statement?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "statement required" }, { status: 400 });
  }

  const statement = body.statement?.trim();
  if (!statement) {
    return NextResponse.json({ error: "statement required" }, { status: 400 });
  }

  try {
    const c = await recordDisputeOnCase(id, statement);
    return NextResponse.json({ case: toCaseDTO(c, demoInfoFor(stored)) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to record dispute";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
