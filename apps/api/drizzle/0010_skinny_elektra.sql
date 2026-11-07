ALTER TABLE "student-profile"
ADD COLUMN "is_deleted" boolean NOT NULL DEFAULT false;--> statement-breakpoint

UPDATE "student-profile"
SET "is_deleted" = ("deleted_at" IS NOT NULL);--> statement-breakpoint

ALTER TABLE "student-profile"
DROP COLUMN "is_active";--> statement-breakpoint

ALTER TABLE "student-profile"
DROP COLUMN "deleted_at";--> statement-breakpoint



ALTER TABLE "attendance"
ADD CONSTRAINT "attendance_student_id_fkey"
FOREIGN KEY ("student_id")
REFERENCES "public"."student-profile"("id")
ON DELETE cascade ON UPDATE no action;