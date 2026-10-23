ALTER TABLE "announcements" DROP CONSTRAINT IF EXISTS "announcements_audience_check";--> statement-breakpoint
ALTER TABLE "club_memberships" DROP CONSTRAINT IF EXISTS "club_memberships_status_check";--> statement-breakpoint
ALTER TABLE "announcements" DROP CONSTRAINT IF EXISTS "announcements_department_id_fkey";--> statement-breakpoint
ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "club_id" bigint;--> statement-breakpoint
ALTER TABLE "announcements" DROP CONSTRAINT IF EXISTS "announcements_club_id_fkey";--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_memberships" DROP CONSTRAINT IF EXISTS "club_memberships_student_id_fkey";--> statement-breakpoint
ALTER TABLE "club_memberships" ADD CONSTRAINT "club_memberships_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."student-profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_audience_check" CHECK ((audience)::text = ANY (
    (ARRAY['campus', 'department', 'club']::varchar[])::text[]
  ));--> statement-breakpoint
ALTER TABLE "club_memberships" ADD CONSTRAINT "club_memberships_status_check" CHECK (status IN ('pending', 'approved', 'rejected'));