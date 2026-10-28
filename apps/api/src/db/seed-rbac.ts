
import { eq, and } from "drizzle-orm";

import { db, pool } from "../config/database.js";
import {
  roles,
  permissions,
  rolePermissions,
} from "./schema/rbac-schema.js";

const roleData = [
  {
    name: "Super Admin",
    slug: "super-admin",
    description: "Full access to all EduNex modules and permissions.",
    isSystem: true,
  },
  {
    name: "Principal",
    slug: "principal",
    description: "Legacy role. Principal accounts use the Super Admin role.",
    isSystem: true,
  },
  {
    name: "HOD",
    slug: "hod",
    description: "Manage department students, clubs, coordinators, and events.",
    isSystem: true,
  },
  {
    name: "Faculty",
    slug: "faculty",
    description: "Access faculty features and academic activities.",
    isSystem: true,
  },
  {
    name: "Student",
    slug: "student",
    description: "Access student features and college activities.",
    isSystem: true,
  },
  {
    name: "Club Coordinator",
    slug: "club-coordinator",
    description: "Manage events and activities for assigned clubs.",
    isSystem: true,
  },
];

const resources = [
  "role",
  "admin",
  "student",
  "staff",
  "department",
  "club",
  "coordinator",
  "event",
  "certificate",
];

const actions = ["view", "create", "update", "delete"];

// Each entry uses the format "resource:action".
const rolePermissionMap: Record<string, string[]> = {
  "super-admin": resources.flatMap((resource) =>
    actions.map((action) => `${resource}:${action}`),
  ),

  // The Principal account will use the Super Admin RBAC role.
  // This legacy role receives no permissions.
  principal: [],

hod: [
  "student:view",
  "staff:view",
  "department:view",
  "club:view",
  "club:create",
  "club:update",
  "coordinator:view",
  "coordinator:create",
  "coordinator:update",
  "event:view",
  "event:update",
  "certificate:view",
],

  faculty: [
    "student:view",
    "department:view",
    "club:view",
    "event:view",
    "event:create",
    "event:update",
    "certificate:view",
    "certificate:create",
  ],

  student: [
    "student:view",
    "department:view",
    "club:view",
    "event:view",
    "certificate:view",
  ],

  "club-coordinator": [
    "club:view",
    "club:update",
    "event:view",
    "event:create",
    "event:update",
  ],
};

async function seedRbac() {
  // 1. Create missing roles without duplicating existing roles.
  for (const role of roleData) {
    const [existingRole] = await db
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.slug, role.slug))
      .limit(1);

    if (!existingRole) {
      await db.insert(roles).values(role);
    }
  }

  // 2. Create missing permissions.
  for (const resource of resources) {
    for (const action of actions) {
      const [existingPermission] = await db
        .select({ id: permissions.id })
        .from(permissions)
        .where(
          and(
            eq(permissions.resource, resource),
            eq(permissions.action, action),
          ),
        )
        .limit(1);

      if (!existingPermission) {
        await db.insert(permissions).values({
          resource,
          action,
          description: `Allows ${action} access to ${resource}.`,
        });
      }
    }
  }

  // 3. Fetch all saved roles and permissions.
  const savedRoles = await db.select().from(roles);
  const savedPermissions = await db.select().from(permissions);

  // 4. Synchronize each role's permissions.
  // Missing assignments are added.
  // Assignments not allowed by the map are removed.
  for (const role of savedRoles) {
    const allowedPermissions = rolePermissionMap[role.slug];

    // Do not change roles this seed script does not manage.
    if (!allowedPermissions) {
      continue;
    }

    for (const permission of savedPermissions) {
      const permissionKey =
        `${permission.resource}:${permission.action}`;

      const [existingAssignment] = await db
        .select({ id: rolePermissions.id })
        .from(rolePermissions)
        .where(
          and(
            eq(rolePermissions.roleId, role.id),
            eq(rolePermissions.permissionId, permission.id),
          ),
        )
        .limit(1);

      const isAllowed = allowedPermissions.includes(permissionKey);

      if (isAllowed && !existingAssignment) {
        await db.insert(rolePermissions).values({
          roleId: role.id,
          permissionId: permission.id,
        });
      }

      if (!isAllowed && existingAssignment) {
        await db
          .delete(rolePermissions)
          .where(eq(rolePermissions.id, existingAssignment.id));
      }
    }
  }

  console.log("RBAC roles and permissions synchronized successfully.");
  console.log(`Roles found: ${savedRoles.length}`);
  console.log(`Permissions found: ${savedPermissions.length}`);
}

seedRbac()
  .catch((error: unknown) => {
    console.error("Failed to seed RBAC data:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
