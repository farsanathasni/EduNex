INSERT INTO "public"."roles" ("name", "slug", "description", "is_system")
VALUES (
  'Super Admin',
  'super-admin',
  'Full access to all EduNex modules and permissions.',
  true
)
ON CONFLICT ("slug") DO NOTHING;
--> statement-breakpoint

DO $$
DECLARE
  super_admin_id bigint;
  super_admin_is_system boolean;
BEGIN
  SELECT "id", "is_system"
  INTO super_admin_id, super_admin_is_system
  FROM "public"."roles"
  WHERE "slug" = 'super-admin';

  IF super_admin_id IS NULL THEN
    RAISE EXCEPTION 'Could not establish the Super Admin RBAC role';
  END IF;

  IF super_admin_is_system IS DISTINCT FROM true THEN
    RAISE EXCEPTION
      'The existing super-admin role is not marked as a system role; Principal RBAC assignments were not changed';
  END IF;
END $$;
--> statement-breakpoint

INSERT INTO "public"."user_roles" ("user_id", "role_id", "assigned_by")
SELECT
  old_assignment."user_id",
  super_admin."id",
  old_assignment."assigned_by"
FROM "public"."user_roles" AS old_assignment
JOIN "public"."roles" AS old_principal
  ON old_principal."id" = old_assignment."role_id"
JOIN "public"."roles" AS super_admin
  ON super_admin."slug" = 'super-admin'
WHERE old_principal."slug" = 'principal'
ON CONFLICT ("user_id", "role_id") DO NOTHING;
--> statement-breakpoint

DO $$
DECLARE
  super_admin_id bigint;
  principal_id bigint;
BEGIN
  SELECT "id" INTO super_admin_id
  FROM "public"."roles"
  WHERE "slug" = 'super-admin';

  SELECT "id" INTO principal_id
  FROM "public"."roles"
  WHERE "slug" = 'principal';

  IF principal_id IS NULL THEN
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM "public"."user_roles" AS old_assignment
    WHERE old_assignment."role_id" = principal_id
      AND NOT EXISTS (
        SELECT 1
        FROM "public"."user_roles" AS replacement
        WHERE replacement."user_id" = old_assignment."user_id"
          AND replacement."role_id" = super_admin_id
      )
  ) THEN
    RAISE EXCEPTION
      'Principal RBAC assignments were not all transferred to Super Admin; duplicate role was not removed';
  END IF;

  DELETE FROM "public"."roles"
  WHERE "id" = principal_id;
END $$;
