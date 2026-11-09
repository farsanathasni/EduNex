ALTER TABLE "event_approvals" DROP CONSTRAINT "event_approvals_reviewer_role_check";--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "requested_by" text;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_requested_by_user_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_approvals" ADD CONSTRAINT "event_approvals_reviewer_role_check" CHECK (reviewer_role = 'principal');