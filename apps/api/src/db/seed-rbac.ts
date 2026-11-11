

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

const CRUD = ["view", "create", "update", "delete"];

const permissionCatalog: Record<string, string[]> = {
  role: CRUD,
  admin: CRUD,
  student: CRUD,
  staff: CRUD,
  department: CRUD,
  club: CRUD,
  coordinator: CRUD,
  attendance: ["view", "mark"],
  event: [...CRUD, "approve", "publish"],
  membership: ["view", "approve", "reject"],
  member: ["view"],
  certificate: CRUD,
};

const rolePermissionMap: Record<string, string[]> = {
  "super-admin": Object.entries(permissionCatalog).flatMap(
    ([resource, actions]) => actions.map((action) => `${resource}:${action}`),
  ),

  hod: [
    "student:view",
    "student:update",
    "staff:view",
    "staff:update",
    "department:view",
    "club:view",
    "club:create",
    "club:update",
    "club:delete",
    "event:view",
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
    "coordinator:view",
    "club:view",
    "club:update",
    "attendance:view",
    "attendance:mark",
    "event:view",
    "event:create",
    "event:update",
    "membership:view",
    "membership:approve",
    "membership:reject",
    "member:view",
  ],
};

async function seedRbac() {
  
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


  for (const [resource, actions] of Object.entries(permissionCatalog)) {
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

 
  const savedRoles = await db.select().from(roles);
  const savedPermissions = await db.select().from(permissions);

  for (const role of savedRoles) {
    const allowedPermissions = rolePermissionMap[role.slug];

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
