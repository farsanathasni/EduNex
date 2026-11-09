INSERT INTO "public"."permissions" ("resource", "action", "description")
VALUES ('event', 'publish', 'Allows publish access to event.')
ON CONFLICT ("resource", "action") DO NOTHING;
--> statement-breakpoint
DELETE FROM "public"."role_permissions" AS rp
USING "public"."roles" AS r, "public"."permissions" AS p
WHERE rp."role_id" = r."id"
  AND rp."permission_id" = p."id"
  AND p."resource" = 'event'
  AND p."action" = 'approve'
  AND r."slug" <> 'super-admin';
