import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";
import { actionFor } from "@/domain/actions";
import { STATE_CATALOG } from "@/domain/states";
import type {
  Actor,
  CaseEvent,
  CaseStateId,
  CitizenActionId,
  CitizenCase,
  Evidence,
  LifecycleId,
  ResolutionReason,
  SourceType,
} from "@/domain/types";

/**
 * Supabase persistence (deferred until after the UX passed).
 *
 * Persistence provides storage, NOT business logic. The case engine remains the
 * only authority on state — the adapter abstraction and rules engine are
 * untouched by where data lives.
 *
 * Snapshot semantics: the whole case (row + events + evidence) is rewritten on
 * every mutation. Demo volume is tiny; this guarantees refresh survival without
 * incremental sync complexity.
 *
 * No auth. No accounts. No unnecessary infrastructure. Demo cases remain
 * clearly simulated (isDemo flag + journey script).
 */

export const persistenceMode: "supabase" | "memory" = process.env.DATABASE_URL
  ? "supabase"
  : "memory";

const sql =
  persistenceMode === "supabase" ? postgres(process.env.DATABASE_URL!, { max: 5 }) : null;
export const db = sql ? drizzle(sql, { schema }) : null;

export interface CaseMeta {
  journeyId: string;
  journeyStep: number;
}

let seeded = false;
async function ensureSeeded(): Promise<void> {
  if (!db || seeded) return;
  seeded = true;
  const rows = await db.select({ id: schema.sources.id }).from(schema.sources).limit(1);
  if (rows.length === 0) {
    await db.insert(schema.sources).values({
      name: "PM-KISAN KYS (simulated)",
      url: "https://pmkisan.gov.in/",
      type: "OFFICIAL",
    });
  }
}

interface CaseRowLike {
  id: string;
  service: string;
  problemType: string;
  currentState: string;
  lifecycle: string;
  nextActor: string;
  citizenActionId: string | null;
  retryCount: number;
  lastVerifiedAt: Date | null;
  isDemo: boolean;
  pendingConfirmation: string | null;
  intakeLanguage: string | null;
  lastPaymentDetails: {
    amount?: number;
    utr?: string;
    bankName?: string;
    paymentMode?: string;
    creditedAt?: string;
  } | null;
  journeyId: string | null;
  journeyStep: number;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
  resolution: { reason: string; note: string } | null;
}

interface EventRowLike {
  id: string;
  caseId: string;
  previousState: string | null;
  newState: string;
  actor: string;
  eventType: string;
  humanLabel: { en: string; hi: string };
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

interface EvidenceRowLike {
  id: string;
  caseId: string;
  source: string;
  sourceType: string;
  verifiedAt: Date;
  value: { en: string; hi: string };
  confidence: number;
}

function toCaseRow(c: CitizenCase, meta: CaseMeta) {
  return {
    id: c.id,
    service: c.service,
    problemType: c.problemType,
    currentState: c.currentState,
    lifecycle: c.lifecycle,
    nextActor: c.nextActor,
    citizenActionId: c.citizenAction?.id ?? null,
    retryCount: c.retryCount,
    lastVerifiedAt: c.lastVerifiedAt,
    isDemo: c.isDemo,
    pendingConfirmation: c.pendingConfirmation,
    intakeLanguage: c.intakeLanguage,
    lastPaymentDetails: c.lastPaymentDetails,
    journeyId: meta.journeyId,
    journeyStep: meta.journeyStep,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    resolvedAt: c.resolvedAt,
    resolution: c.resolution,
  };
}

/** Persist the whole case snapshot (case row + events + evidence) atomically. */
export async function saveCaseSnapshot(c: CitizenCase, meta: CaseMeta): Promise<void> {
  if (!db) return;
  await ensureSeeded();
  await db.transaction(async (tx) => {
    const row = toCaseRow(c, meta);
    await tx
      .insert(schema.cases)
      .values(row)
      .onConflictDoUpdate({ target: schema.cases.id, set: { ...row } });

    await tx.delete(schema.caseEvents).where(eq(schema.caseEvents.caseId, c.id));
    if (c.events.length > 0) {
      await tx.insert(schema.caseEvents).values(
        c.events.map((e) => ({
          id: e.id,
          caseId: e.caseId,
          previousState: e.previousState,
          newState: e.newState,
          actor: e.actor,
          eventType: e.eventType,
          humanLabel: e.humanLabel,
          metadata: e.metadata,
          createdAt: e.createdAt,
        })),
      );
    }

    await tx.delete(schema.evidence).where(eq(schema.evidence.caseId, c.id));
    if (c.evidence.length > 0) {
      await tx.insert(schema.evidence).values(
        c.evidence.map((e) => ({
          id: e.id,
          caseId: c.id,
          source: e.source,
          sourceType: e.sourceType,
          verifiedAt: e.verifiedAt,
          value: e.value,
          confidence: e.confidence,
        })),
      );
    }
  });
}

/** Load a case snapshot; returns null when absent. */
export async function loadCaseSnapshot(
  id: string,
): Promise<{ c: CitizenCase; meta: CaseMeta } | null> {
  if (!db) return null;
  const [row] = await db.select().from(schema.cases).where(eq(schema.cases.id, id));
  if (!row) return null;
  const eventRows = await db.select().from(schema.caseEvents).where(eq(schema.caseEvents.caseId, id));
  const evidenceRows = await db.select().from(schema.evidence).where(eq(schema.evidence.caseId, id));
  return {
    c: toCitizenCase(row as CaseRowLike, eventRows as EventRowLike[], evidenceRows as EvidenceRowLike[]),
    meta: { journeyId: row.journeyId ?? "J3_PAYMENT_FAILURE", journeyStep: row.journeyStep ?? 0 },
  };
}

function toCitizenCase(
  row: CaseRowLike,
  eventRows: EventRowLike[],
  evidenceRows: EvidenceRowLike[],
): CitizenCase {
  const currentState = row.currentState as CaseStateId;
  return {
    id: row.id,
    service: "PM_KISAN",
    problemType: row.problemType,
    currentState,
    lifecycle: row.lifecycle as LifecycleId,
    nextActor: row.nextActor as Actor,
    citizenAction: actionFor(row.citizenActionId as CitizenActionId | null),
    nextState: STATE_CATALOG[currentState]?.nextStates[0] ?? null,
    retryCount: row.retryCount,
    lastVerifiedAt: row.lastVerifiedAt,
    isDemo: row.isDemo,
    intakeLanguage: row.intakeLanguage,
    pendingConfirmation: row.pendingConfirmation as CitizenActionId | null,
    lastPaymentDetails: row.lastPaymentDetails
      ? {
          ...row.lastPaymentDetails,
          creditedAt: row.lastPaymentDetails.creditedAt
            ? new Date(row.lastPaymentDetails.creditedAt)
            : undefined,
        }
      : null,
    evidence: evidenceRows.map((e): Evidence => ({
      id: e.id,
      source: e.source,
      sourceType: e.sourceType as SourceType,
      verifiedAt: e.verifiedAt,
      value: e.value,
      confidence: e.confidence,
    })),
    events: eventRows.map((e): CaseEvent => ({
      id: e.id,
      caseId: e.caseId,
      previousState: e.previousState as CaseStateId | null,
      newState: e.newState as CaseStateId,
      actor: e.actor as Actor,
      eventType: e.eventType as CaseEvent["eventType"],
      humanLabel: e.humanLabel,
      metadata: e.metadata ?? {},
      createdAt: e.createdAt,
    })),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    resolvedAt: row.resolvedAt,
    resolution: row.resolution
      ? { reason: row.resolution.reason as ResolutionReason, note: row.resolution.note }
      : null,
  };
}
