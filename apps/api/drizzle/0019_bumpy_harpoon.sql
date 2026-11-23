ALTER TABLE "resources" ADD COLUMN "file_public_id" text;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "file_resource_type" varchar(20);--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "file_size" integer;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "file_name" text;