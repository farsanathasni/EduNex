CREATE TYPE "public"."staff_role" AS ENUM('faculty', 'hod', 'principal');--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "announcements_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854776000 START WITH 1 CACHE 1),
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"department_id" bigint,
	"published_by" bigint NOT NULL,
	"audience" varchar(20) DEFAULT 'campus' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "announcements_audience_check" CHECK ((audience)::text = ANY ((ARRAY['campus'::character varying, 'department'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "attendance_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854776000 START WITH 1 CACHE 1),
	"event_id" bigint NOT NULL,
	"student_id" bigint NOT NULL,
	"status" varchar(20) DEFAULT 'present' NOT NULL,
	"marked_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "attendance_event_id_student_id_key" UNIQUE("event_id","student_id"),
	CONSTRAINT "attendance_status_check" CHECK ((status)::text = ANY ((ARRAY['present'::character varying, 'absent'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "club_memberships" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "club_memberships_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854776000 START WITH 1 CACHE 1),
	"club_id" bigint NOT NULL,
	"student_id" bigint NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone,
	CONSTRAINT "club_memberships_club_id_student_id_key" UNIQUE("club_id","student_id"),
	CONSTRAINT "club_memberships_status_check" CHECK ((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "clubs" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "clubs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854776000 START WITH 1 CACHE 1),
	"name" varchar(150) NOT NULL,
	"description" text,
	"department_id" bigint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clubs_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "departments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854776000 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"code" varchar(20) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "departments_name_key" UNIQUE("name"),
	CONSTRAINT "departments_code_key" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "event_approvals" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_approvals_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854776000 START WITH 1 CACHE 1),
	"event_id" bigint NOT NULL,
	"reviewer_id" bigint NOT NULL,
	"reviewer_role" varchar(20) NOT NULL,
	"decision" varchar(20) NOT NULL,
	"comments" text,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_approvals_reviewer_role_check" CHECK ((reviewer_role)::text = ANY ((ARRAY['hod'::character varying, 'admin'::character varying])::text[])),
	CONSTRAINT "event_approvals_decision_check" CHECK ((decision)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854776000 START WITH 1 CACHE 1),
	"club_id" bigint NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"location" varchar(255),
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_status_check" CHECK ((status)::text = ANY ((ARRAY['draft'::character varying, 'pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'published'::character varying, 'cancelled'::character varying, 'completed'::character varying])::text[])),
	CONSTRAINT "valid_event_time" CHECK (end_time > start_time)
);
--> statement-breakpoint
CREATE TABLE "issues" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "issues_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854776000 START WITH 1 CACHE 1),
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(100),
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	"reported_by" bigint NOT NULL,
	"assigned_to" bigint,
	"response" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	CONSTRAINT "issues_status_check" CHECK ((status)::text = ANY ((ARRAY['open'::character varying, 'in_progress'::character varying, 'resolved'::character varying, 'rejected'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "lost_and_found" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lost_and_found_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854776000 START WITH 1 CACHE 1),
	"title" varchar(200) NOT NULL,
	"description" text,
	"category" varchar(100),
	"item_type" varchar(10) NOT NULL,
	"location" varchar(255),
	"image_url" text,
	"reported_by" bigint NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"reported_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lost_and_found_item_type_check" CHECK ((item_type)::text = ANY ((ARRAY['lost'::character varying, 'found'::character varying])::text[])),
	CONSTRAINT "lost_and_found_status_check" CHECK ((status)::text = ANY ((ARRAY['active'::character varying, 'claimed'::character varying, 'returned'::character varying, 'closed'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "notifications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854776000 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"notification_type" varchar(50) NOT NULL,
	"reference_type" varchar(50),
	"reference_id" bigint,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"read_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "resources_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854776000 START WITH 1 CACHE 1),
	"title" varchar(200) NOT NULL,
	"description" text,
	"file_url" text NOT NULL,
	"file_type" varchar(50),
	"department_id" bigint,
	"uploaded_by" bigint NOT NULL,
	"visibility" varchar(20) DEFAULT 'department' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "resources_visibility_check" CHECK ((visibility)::text = ANY ((ARRAY['department'::character varying, 'campus'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "study_group_members" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "study_group_members_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854776000 START WITH 1 CACHE 1),
	"study_group_id" bigint NOT NULL,
	"student_id" bigint NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "study_group_members_study_group_id_student_id_key" UNIQUE("student_id","study_group_id")
);
--> statement-breakpoint
CREATE TABLE "study_groups" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "study_groups_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854776000 START WITH 1 CACHE 1),
	"name" varchar(150) NOT NULL,
	"description" text,
	"department_id" bigint,
	"created_by" bigint NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"employee_id" text NOT NULL,
	"role" "staff_role" DEFAULT 'faculty' NOT NULL,
	"department_id" bigint,
	"designation" text,
	"phone" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "staff_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "staff_employee_id_unique" UNIQUE("employee_id")
);
--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_memberships" ADD CONSTRAINT "club_memberships_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_approvals" ADD CONSTRAINT "event_approvals_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_group_members" ADD CONSTRAINT "study_group_members_study_group_id_fkey" FOREIGN KEY ("study_group_id") REFERENCES "public"."study_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_groups" ADD CONSTRAINT "study_groups_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "staff_role_idx" ON "staff" USING btree ("role");--> statement-breakpoint
CREATE INDEX "staff_department_idx" ON "staff" USING btree ("department_id");