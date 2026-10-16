CREATE TABLE "student-profile" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "student-profile_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"admission-number" text NOT NULL,
	"department_id" bigint,
	"semester" integer,
	"phone" text,
	CONSTRAINT "student-profile_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "student-profile_admission-number_unique" UNIQUE("admission-number")
);
--> statement-breakpoint
ALTER TABLE "student-profile" ADD CONSTRAINT "student-profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;