ALTER TABLE "event_approvals" ALTER COLUMN "reviewer_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'student';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET NOT NULL;