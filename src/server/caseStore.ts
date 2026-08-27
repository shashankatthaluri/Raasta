import { MockGovernmentAdapter } from "@/adapters/mockGovernmentAdapter";
import { applySignal, completeCitizenAction, createCase } from "@/domain/engine";
import { JOURNEY_BY_ID } from "@/domain/journeys";
import type { CitizenActionId, CitizenCase } from "@/domain/types";

/**
 * In-memory demo case store (Phase 5 — before persistence).
 * Deliberate: the complete case experience is built against the mock adapter FIRST;
 * Supabase becomes persistence afterwards and must not block product development.
 * NOTE: in-memory only — restarts lose cases. Demo-scoped, clearly documented.
 * All cases here are demo cases driven by simulated government signals — no live
 * government data is accessed or implied.
 */

export interface DemoInfo {
  journeyId: string;
  journeyName: string;
  step: number;
  totalSteps: number;
  nextSignalLabel: string | null;
  complete: boolean;
}

interface StoredCase {
  case: CitizenCase;
  adapter: MockGovernmentAdapter;
  journeyId: string;
}

const store = new Map<string, StoredCase>();

export function createDemoCase(input: { journeyId: string; problemType?: string }): CitizenCase {
  const journey = JOURNEY_BY_ID[input.journeyId];
  if (!journey) throw new Error(`Unknown journey: ${input.journeyId}`);

  const id = `RAAS-DEMO-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const c = createCase({ id, problemType: input.problemType ?? "PAYMENT_MISSING", isDemo: true });
  const adapter = new MockGovernmentAdapter(input.journeyId, id);
  store.set(id, { case: c, adapter, journeyId: input.journeyId });

  // The first scripted signal fires immediately so the first screen shows a meaningful state.
  const first = adapter.nextSignal();
  if (first) applySignal(c, first);
  return c;
}

export function getStoredCase(id: string): StoredCase | undefined {
  return store.get(id);
}

export function demoInfoFor(stored: StoredCase): DemoInfo {
  const journey = JOURNEY_BY_ID[stored.journeyId];
  return {
    journeyId: stored.journeyId,
    journeyName: journey.name,
    step: stored.adapter.currentStepIndex,
    totalSteps: journey.steps.length,
    nextSignalLabel: stored.adapter.peek()?.label ?? null,
    complete: stored.adapter.isComplete,
  };
}

export function simulateNextSignal(id: string): {
  applied: boolean;
  signalLabel: string | null;
} {
  const stored = store.get(id);
  if (!stored) throw new Error(`Case not found: ${id}`);
  const c = stored.case;
  if (!c.isDemo) throw new Error("simulate-signal is demo-only");
  const signal = stored.adapter.nextSignal();
  if (!signal) return { applied: false, signalLabel: null };
  applySignal(c, signal);
  const lastIndex = stored.adapter.currentStepIndex - 1;
  return {
    applied: true,
    signalLabel: stored.adapter.journey.steps[lastIndex]?.label ?? null,
  };
}

export function completeActionOnCase(id: string, actionId: CitizenActionId): CitizenCase {
  const stored = store.get(id);
  if (!stored) throw new Error(`Case not found: ${id}`);
  completeCitizenAction(stored.case, actionId);
  return stored.case;
}
