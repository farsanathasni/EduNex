ALTER TABLE "event_approvals" ALTER COLUMN "reviewer_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "student-profile" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "student-profile" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp;