CREATE TABLE "class_attendance" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_attendance_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"session_id" bigint NOT NULL,
	"student_id" bigint NOT NULL,
	"status" varchar(10) DEFAULT 'present' NOT NULL,
	"remark" text,
	"marked_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "class_attendance_session_student_key" UNIQUE("session_id","student_id"),
	CONSTRAINT "class_attendance_status_check" CHECK (status IN ('present', 'absent', 'late'))
);
--> statement-breakpoint
CREATE TABLE "class_sessions" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_sessions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"subject_id" bigint NOT NULL,
	"taken_by" text NOT NULL,
	"session_date" date NOT NULL,
	"period" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "class_sessions_subject_date_period_key" UNIQUE("subject_id","session_date","period"),
	CONSTRAINT "class_sessions_period_check" CHECK (period >= 1 AND period <= 12)
);
--> statement-breakpoint
CREATE TABLE "faculty_subjects" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "faculty_subjects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"staff_id" text NOT NULL,
	"subject_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "faculty_subjects_staff_subject_key" UNIQUE("staff_id","subject_id")
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "subjects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar(150) NOT NULL,
	"code" varchar(30) NOT NULL,
	"department_id" bigint NOT NULL,
	"semester" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subjects_code_department_key" UNIQUE("code","department_id")
);
--> statement-breakpoint
ALTER TABLE "class_attendance" ADD CONSTRAINT "class_attendance_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."class_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_attendance" ADD CONSTRAINT "class_attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."student-profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_sessions" ADD CONSTRAINT "class_sessions_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_sessions" ADD CONSTRAINT "class_sessions_taken_by_fkey" FOREIGN KEY ("taken_by") REFERENCES "public"."staff"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty_subjects" ADD CONSTRAINT "faculty_subjects_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty_subjects" ADD CONSTRAINT "faculty_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "class_attendance_student_idx" ON "class_attendance" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "class_sessions_date_idx" ON "class_sessions" USING btree ("session_date");--> statement-breakpoint
CREATE INDEX "subjects_department_semester_idx" ON "subjects" USING btree ("department_id","semester");