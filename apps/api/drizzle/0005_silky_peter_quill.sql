CREATE TABLE "coordinator_assignments" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "coordinator_assignments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"student_id" bigint NOT NULL,
	"club_id" bigint NOT NULL,
	"appointed_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "coordinator_assignments_student_club_key" UNIQUE("student_id","club_id")
);
--> statement-breakpoint
ALTER TABLE "student-profile" ALTER COLUMN "department_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "student-profile" ALTER COLUMN "semester" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "coordinator_assignments" ADD CONSTRAINT "coordinator_assignments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."student-profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coordinator_assignments" ADD CONSTRAINT "coordinator_assignments_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coordinator_assignments" ADD CONSTRAINT "coordinator_assignments_appointed_by_fkey" FOREIGN KEY ("appointed_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student-profile" ADD CONSTRAINT "student-profile_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE restrict ON UPDATE no action;