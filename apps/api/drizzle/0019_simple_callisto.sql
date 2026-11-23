CREATE TABLE "issue_responses" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "issue_responses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"issue_id" bigint NOT NULL,
	"author_id" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "issues" ALTER COLUMN "reported_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "issues" ALTER COLUMN "assigned_to" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "issues" ADD COLUMN "department_id" bigint;--> statement-breakpoint
ALTER TABLE "issues" ADD COLUMN "resolved_by" text;--> statement-breakpoint
ALTER TABLE "issue_responses" ADD CONSTRAINT "issue_responses_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issue_responses" ADD CONSTRAINT "issue_responses_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "issue_responses_issue_id_idx" ON "issue_responses" USING btree ("issue_id");--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_reported_by_fkey" FOREIGN KEY ("reported_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "issues_recipient_status_idx" ON "issues" USING btree ("assigned_to","status");--> statement-breakpoint
CREATE INDEX "issues_reporter_idx" ON "issues" USING btree ("reported_by");--> statement-breakpoint
CREATE INDEX "issues_department_status_idx" ON "issues" USING btree ("department_id","status");