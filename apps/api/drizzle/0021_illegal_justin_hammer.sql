CREATE TABLE "lost_found_audit_events" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lost_found_audit_events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"item_id" bigint NOT NULL,
	"claim_id" bigint,
	"actor_user_id" text,
	"action" varchar(50) NOT NULL,
	"details" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lost_found_claims" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lost_found_claims_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"item_id" bigint NOT NULL,
	"claimant_user_id" text NOT NULL,
	"answers" jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"decision_note" text,
	"decided_by" text,
	"decided_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lost_found_claims_status_check" CHECK ((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'withdrawn'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "lost_found_items" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lost_found_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"finder_user_id" text NOT NULL,
	"finder_department_id" bigint,
	"item_type" varchar(10) DEFAULT 'found' NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(30) NOT NULL,
	"place" varchar(255) NOT NULL,
	"date_found" date NOT NULL,
	"photos" jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"verification_questions" jsonb NOT NULL,
	"expected_answers" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lost_found_items_item_type_check" CHECK ((item_type)::text = ANY ((ARRAY['found'::character varying, 'lost'::character varying])::text[])),
	CONSTRAINT "lost_found_items_category_check" CHECK ((category)::text = ANY ((ARRAY['bags'::character varying, 'electronics'::character varying, 'documents'::character varying, 'books'::character varying, 'clothing'::character varying, 'accessories'::character varying, 'keys'::character varying, 'other'::character varying])::text[])),
	CONSTRAINT "lost_found_items_status_check" CHECK ((status)::text = ANY ((ARRAY['active'::character varying, 'claimed'::character varying, 'returned'::character varying, 'closed'::character varying])::text[])),
	CONSTRAINT "lost_found_items_photos_check" CHECK (jsonb_array_length(photos) BETWEEN 1 AND 3),
	CONSTRAINT "lost_found_items_questions_check" CHECK (jsonb_array_length(verification_questions) BETWEEN 1 AND 3)
);
--> statement-breakpoint
ALTER TABLE "lost_found_audit_events" ADD CONSTRAINT "lost_found_audit_events_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."lost_found_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lost_found_audit_events" ADD CONSTRAINT "lost_found_audit_events_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "public"."lost_found_claims"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lost_found_audit_events" ADD CONSTRAINT "lost_found_audit_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lost_found_claims" ADD CONSTRAINT "lost_found_claims_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."lost_found_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lost_found_claims" ADD CONSTRAINT "lost_found_claims_claimant_user_id_fkey" FOREIGN KEY ("claimant_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lost_found_claims" ADD CONSTRAINT "lost_found_claims_decided_by_fkey" FOREIGN KEY ("decided_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lost_found_items" ADD CONSTRAINT "lost_found_items_finder_user_id_fkey" FOREIGN KEY ("finder_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lost_found_items" ADD CONSTRAINT "lost_found_items_finder_department_id_fkey" FOREIGN KEY ("finder_department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lost_found_audit_events_item_id_created_at_idx" ON "lost_found_audit_events" USING btree ("item_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "lost_found_claims_pending_item_claimant_key" ON "lost_found_claims" USING btree ("item_id","claimant_user_id") WHERE status = 'pending';--> statement-breakpoint
CREATE INDEX "lost_found_claims_item_id_status_idx" ON "lost_found_claims" USING btree ("item_id","status");--> statement-breakpoint
CREATE INDEX "lost_found_claims_claimant_user_id_status_idx" ON "lost_found_claims" USING btree ("claimant_user_id","status");--> statement-breakpoint
CREATE INDEX "lost_found_items_finder_user_id_idx" ON "lost_found_items" USING btree ("finder_user_id");--> statement-breakpoint
CREATE INDEX "lost_found_items_status_created_at_idx" ON "lost_found_items" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "lost_found_items_category_status_idx" ON "lost_found_items" USING btree ("category","status");