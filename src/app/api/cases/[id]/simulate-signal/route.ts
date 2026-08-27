import { NextResponse } from "next/server";
import { demoInfoFor, getStoredCase, simulateNextSignal } from "@/server/caseStore";
import { toCaseDTO } from "@/server/dto";

/**
 * POST /api/cases/:id/simulate-signal — DEMO ONLY.
 * Injects the next scripted official-style signal from the journey.
 * Blocked for non-demo cases (no live integration is ever implied).
 */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stored = await getStoredCase(id);
  if (!stored) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }
  if (!stored.case.isDemo) {
    return NextResponse.json({ error: "simulate-signal is demo-only" }, { status: 403 });
  }

  const result = await simulateNextSignal(id);
  return NextResponse.json({
    case: toCaseDTO(stored.case, demoInfoFor(stored)),
    applied: result.applied,
    signalLabel: result.signalLabel,
    done: !result.applied,
  });
}
