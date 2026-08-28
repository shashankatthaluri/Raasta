import { MockGovernmentAdapter } from "@/adapters/mockGovernmentAdapter";
import { applySignal, completeCitizenAction, createCase } from "@/domain/engine";
import { JOURNEY_BY_ID } from "@/domain/journeys";
import type { CitizenActionId, CitizenCase } from "@/domain/types";
import { detectLanguage } from "@/ai/intent";
import {
  loadCaseSnapshot,
  persistenceMode,
  saveCaseSnapshot,
  type CaseMeta,
} from "./persistence";

/**
 * Case store — the only place cases are created, loaded and advanced.
 *
 * Two backends behind one API, decided by env, never by call sites:
 *  - memory:  dev/demo default (no DATABASE_URL) — cases die with the process
 *  - supabase: snapshot persistence — state and timeline survive refresh
 *
 * Business logic never lives here: engine decides, this file stores.
 * No auth. No accounts. Demo cases remain clearly simulated.
 */

export interface StoredCase {
  case: CitizenCase;
  journeyId: string;
  /** Journey script cursor — persisted so a case resumes after refresh. */
  step: number;
}

const globalForCases = globalThis as unknown as { caseMemory?: Map<string, StoredCase> };
const memory = globalForCases.caseMemory ?? new Map<string, StoredCase>();
if (process.env.NODE_ENV !== "production") {
  globalForCases.caseMemory = memory;
}

export function persistenceInfo(): string {
  return persistenceMode;
}

export async function createDemoCase(input: {
  journeyId: string;
  problemType?: string;
  registrationNumber?: string;
  message?: string;
}): Promise<CitizenCase> {
  const journey = JOURNEY_BY_ID[input.journeyId];
  if (!journey) throw new Error(`Unknown journey: ${input.journeyId}`);

  const id = `RAAS-DEMO-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const c = createCase({
    id,
    problemType: input.problemType ?? "PAYMENT_MISSING",
    registrationNumber: input.registrationNumber,
    isDemo: true,
    intake: input.message
      ? { message: input.message, language: detectLanguage(input.message) }
      : undefined,
  });
  const adapter = new MockGovernmentAdapter(input.journeyId, id, 0);

  // The first scripted signal fires immediately so the first screen shows a meaningful state.
  const first = adapter.nextSignal();
  if (first) applySignal(c, first);

  const stored: StoredCase = { case: c, journeyId: input.journeyId, step: adapter.currentStepIndex };
  await persist(stored);
  return c;
}

export async function getStoredCase(id: string): Promise<StoredCase | null> {
  const cached = memory.get(id);
  if (cached) return cached;

  // Check if any stored case in memory matches registrationNumber
  for (const stored of memory.values()) {
    if (stored.case.registrationNumber === id) {
      memory.set(id, stored);
      return stored;
    }
  }

  if (persistenceMode === "supabase") {
    try {
      const snap = await loadCaseSnapshot(id);
      if (snap) {
        const stored: StoredCase = {
          case: snap.c,
          journeyId: snap.meta.journeyId,
          step: snap.meta.journeyStep,
        };
        memory.set(id, stored);
        return stored;
      }
    } catch (err) {
      console.error("Supabase loadCaseSnapshot error (falling back to memory):", err);
    }
  }

  // If an 11-digit registration number is accessed directly in URL
  if (/^\d{11}$/.test(id)) {
    const journeyId = id.includes("EKYC")
      ? "J1_FARMER_EKYC"
      : id.includes("LAND")
      ? "J2_GOVT_VERIFICATION"
      : "J3_PAYMENT_FAILURE";
    const c = createCase({
      id,
      problemType: "PAYMENT_MISSING",
      registrationNumber: /^\d{11}$/.test(id) ? id : "10203040506",
      isDemo: true,
    });
    const adapter = new MockGovernmentAdapter(journeyId, id, 0);
    const first = adapter.nextSignal();
    if (first) applySignal(c, first);
    const stored: StoredCase = { case: c, journeyId, step: adapter.currentStepIndex };
    memory.set(id, stored);
    await persist(stored);
    return stored;
  }

  return null;
}

export function demoInfoFor(stored: StoredCase): DemoInfo {
  const journey = JOURNEY_BY_ID[stored.journeyId];
  return {
    journeyId: stored.journeyId,
    journeyName: journey.name,
    step: stored.step,
    totalSteps: journey.steps.length,
    nextSignalLabel: journey.steps[stored.step]?.label ?? null,
    complete: stored.step >= journey.steps.length,
  };
}

export async function simulateNextSignal(id: string): Promise<{
  applied: boolean;
  signalLabel: { en: string; hi: string } | null;
}> {
  const stored = await getStoredCase(id);
  if (!stored) throw new Error(`Case not found: ${id}`);
  const c = stored.case;
  if (!c.isDemo) throw new Error("simulate-signal is demo-only");

  // The adapter cursor is reconstructed from the persisted step — the same
  // script drives the case whether it lived in memory or survived a refresh.
  const adapter = new MockGovernmentAdapter(stored.journeyId, id, stored.step);
  const signal = adapter.nextSignal();
  if (!signal) return { applied: false, signalLabel: null };

  applySignal(c, signal);
  stored.step = adapter.currentStepIndex;
  await persist(stored);
  return {
    applied: true,
    signalLabel: adapter.journey.steps[adapter.currentStepIndex - 1]?.label ?? null,
  };
}

export async function completeActionOnCase(id: string, actionId: CitizenActionId): Promise<CitizenCase> {
  const stored = await getStoredCase(id);
  if (!stored) throw new Error(`Case not found: ${id}`);
  completeCitizenAction(stored.case, actionId);
  await persist(stored);
  return stored.case;
}

export async function updateRegistrationNumber(id: string, registrationNumber: string): Promise<CitizenCase> {
  const stored = await getStoredCase(id);
  if (!stored) throw new Error(`Case not found: ${id}`);
  stored.case.registrationNumber = registrationNumber.trim();
  stored.case.updatedAt = new Date();
  await persist(stored);
  return stored.case;
}

export async function resetDemoCase(id: string): Promise<StoredCase> {
  const stored = await getStoredCase(id);
  if (!stored) throw new Error(`Case not found: ${id}`);
  const journeyId = stored.journeyId;
  const c = createCase({
    id,
    problemType: stored.case.problemType,
    registrationNumber: stored.case.registrationNumber ?? undefined,
    intake: stored.case.intakeLanguage
      ? { message: "", language: stored.case.intakeLanguage }
      : undefined,
    isDemo: true,
  });
  const adapter = new MockGovernmentAdapter(journeyId, id, 0);
  const first = adapter.nextSignal();
  if (first) applySignal(c, first);
  const updated: StoredCase = { case: c, journeyId, step: adapter.currentStepIndex };
  memory.set(id, updated);
  await persist(updated);
  return updated;
}

export async function recordDisputeOnCase(id: string, statement: string): Promise<CitizenCase> {
  const stored = await getStoredCase(id);
  if (!stored) throw new Error(`Case not found: ${id}`);
  const { recordDispute } = await import("@/domain/engine");
  recordDispute(stored.case, statement);
  await persist(stored);
  return stored.case;
}

async function persist(stored: StoredCase): Promise<void> {
  memory.set(stored.case.id, stored);
  if (persistenceMode === "supabase") {
    const meta: CaseMeta = { journeyId: stored.journeyId, journeyStep: stored.step };
    try {
      await saveCaseSnapshot(stored.case, meta);
    } catch (err) {
      console.error("Supabase saveCaseSnapshot error (falling back to memory):", err);
    }
  }
}

export interface DemoInfo {
  journeyId: string;
  journeyName: { en: string; hi: string };
  step: number;
  totalSteps: number;
  nextSignalLabel: { en: string; hi: string } | null;
  complete: boolean;
}
