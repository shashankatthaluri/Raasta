import { NextResponse } from "next/server";
import { demoInfoFor, getStoredCase, updateRegistrationNumber } from "@/server/caseStore";
import { toCaseDTO } from "@/server/dto";

/** GET /api/cases/:id — the four-question block, chain, timeline, evidence, demo info. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stored = await getStoredCase(id);
  if (!stored) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }
  return NextResponse.json({ case: toCaseDTO(stored.case, demoInfoFor(stored)) });
}

/** PATCH /api/cases/:id — update registration number or citizen metadata. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = (await request.json()) as { registrationNumber?: string };
    if (body.registrationNumber) {
      const updatedCase = await updateRegistrationNumber(id, body.registrationNumber);
      const stored = await getStoredCase(id);
      return NextResponse.json({ case: toCaseDTO(updatedCase, stored ? demoInfoFor(stored) : undefined) });
    }
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Could not update case" }, { status: 500 });
  }
}
