import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Phase 3 — data model. PRODUCT_CONTRACT.md §12.
 * PostgreSQL via Supabase. Not migrated yet (no database attached in Phase 2).
 */

export const citizens = pgTable("citizens", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  mobile: text("mobile"),
  language: text("language").default("hi"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cases = pgTable(
  "cases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    citizenId: uuid("citizen_id").references(() => citizens.id),
    service: text("service").notNull().default("PM_KISAN"),
    problemType: text("problem_type").notNull(),
    currentState: text("current_state").notNull(),
    lifecycle: text("lifecycle").notNull().default("DISCOVERED"),
    nextActor: text("next_actor").notNull(),
    citizenAction: jsonb("citizen_action"),
    retryCount: integer("retry_count").notNull().default(0),
    lastVerifiedAt: timestamp("last_verified_at"),
    isDemo: boolean("is_demo").notNull().default(true),
    pendingConfirmation: text("pending_confirmation"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    resolvedAt: timestamp("resolved_at"),
    resolution: jsonb("resolution"),
  },
  (t) => [index("cases_citizen_idx").on(t.citizenId)],
);

export const caseEvents = pgTable(
  "case_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    caseId: uuid("case_id")
      .notNull()
      .references(() => cases.id),
    previousState: text("previous_state"),
    newState: text("new_state").notNull(),
    actor: text("actor").notNull(),
    eventType: text("event_type").notNull(),
    humanLabel: text("human_label").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("case_events_case_idx").on(t.caseId)],
);

export const caseStates = pgTable("case_states", {
  id: text("id").primaryKey(),
  stateKey: text("state_key").notNull(),
  humanTitle: text("human_title").notNull(),
  humanTitleHi: text("human_title_hi").notNull(),
  humanExplanation: text("human_explanation").notNull(),
  color: text("color").notNull(),
  nextActor: text("next_actor").notNull(),
  defaultNext: text("default_next"),
});

export const evidence = pgTable(
  "evidence",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    caseId: uuid("case_id")
      .notNull()
      .references(() => cases.id),
    source: text("source").notNull(),
    sourceType: text("source_type").notNull(),
    verifiedAt: timestamp("verified_at").notNull(),
    value: text("value").notNull(),
    confidence: integer("confidence").notNull().default(1),
  },
  (t) => [index("evidence_case_idx").on(t.caseId)],
);

export const actions = pgTable(
  "actions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    caseId: uuid("case_id")
      .notNull()
      .references(() => cases.id),
    actionId: text("action_id").notNull(),
    status: text("status").notNull().default("PENDING"),
    completedAt: timestamp("completed_at"),
  },
  (t) => [index("actions_case_idx").on(t.caseId)],
);

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  url: text("url"),
  type: text("type").notNull().default("OFFICIAL"),
  lastCheckedAt: timestamp("last_checked_at"),
});

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    caseId: uuid("case_id")
      .notNull()
      .references(() => cases.id),
    channel: text("channel").notNull().default("in_app"),
    kind: text("kind").notNull(), // STATE_CHANGED | ACTION_REQUIRED
    body: text("body").notNull(),
    sentAt: timestamp("sent_at").defaultNow(),
  },
  (t) => [index("notifications_case_idx").on(t.caseId)],
);
