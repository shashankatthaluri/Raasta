CREATE TABLE "actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_id" uuid NOT NULL,
	"action_id" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "case_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_id" uuid NOT NULL,
	"previous_state" text,
	"new_state" text NOT NULL,
	"actor" text NOT NULL,
	"event_type" text NOT NULL,
	"human_label" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "case_states" (
	"id" text PRIMARY KEY NOT NULL,
	"state_key" text NOT NULL,
	"human_title" text NOT NULL,
	"human_title_hi" text NOT NULL,
	"human_explanation" text NOT NULL,
	"color" text NOT NULL,
	"next_actor" text NOT NULL,
	"default_next" text
);
--> statement-breakpoint
CREATE TABLE "cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"citizen_id" uuid,
	"service" text DEFAULT 'PM_KISAN' NOT NULL,
	"problem_type" text NOT NULL,
	"current_state" text NOT NULL,
	"lifecycle" text DEFAULT 'DISCOVERED' NOT NULL,
	"next_actor" text NOT NULL,
	"citizen_action_id" text,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"last_verified_at" timestamp,
	"is_demo" boolean DEFAULT true NOT NULL,
	"pending_confirmation" text,
	"intake_language" text,
	"last_payment_details" jsonb,
	"journey_id" text,
	"journey_step" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"resolved_at" timestamp,
	"resolution" jsonb
);
--> statement-breakpoint
CREATE TABLE "citizens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"mobile" text,
	"language" text DEFAULT 'hi',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_id" uuid NOT NULL,
	"source" text NOT NULL,
	"source_type" text NOT NULL,
	"verified_at" timestamp NOT NULL,
	"value" text NOT NULL,
	"confidence" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_id" uuid NOT NULL,
	"channel" text DEFAULT 'in_app' NOT NULL,
	"kind" text NOT NULL,
	"body" text NOT NULL,
	"sent_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"url" text,
	"type" text DEFAULT 'OFFICIAL' NOT NULL,
	"last_checked_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "actions" ADD CONSTRAINT "actions_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_events" ADD CONSTRAINT "case_events_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cases" ADD CONSTRAINT "cases_citizen_id_citizens_id_fk" FOREIGN KEY ("citizen_id") REFERENCES "public"."citizens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "actions_case_idx" ON "actions" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "case_events_case_idx" ON "case_events" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "cases_citizen_idx" ON "cases" USING btree ("citizen_id");--> statement-breakpoint
CREATE INDEX "evidence_case_idx" ON "evidence" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "notifications_case_idx" ON "notifications" USING btree ("case_id");