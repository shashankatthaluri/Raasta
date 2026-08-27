import { NextResponse } from "next/server";
import { completeActionOnCase, demoInfoFor, getStoredCase } from "@/server/caseStore";
import { toCaseDTO } from "@/server/dto";
import type { CitizenActionId } from "@/domain/types";

/**
 * POST /api/cases/:id/action — the citizen completes their one required action.
 * CITIZEN_REPORTED: the case waits for an OFFICIAL confirmation signal before
 * claiming verified. The citizen's self-report never mutates official state.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stored = getStoredCase(id);
  if (!stored) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  let body: { actionId?: CitizenActionId } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "actionId required" }, { status: 400 });
  }
  if (!body.actionId) {
    return NextResponse.json({ error: "actionId required" }, { status: 400 });
  }

  try {
    const c = completeActionOnCase(id, body.actionId);
    return NextResponse.json({ case: toCaseDTO(c, demoInfoFor(stored)) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Action failed";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
