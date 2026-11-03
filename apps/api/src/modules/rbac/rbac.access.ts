import { eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { staff } from "../../db/schema/staff-schema.js";
import {
  permissions,
  rolePermissions,
  roles,
  userRoles,
} from "../../db/schema/rbac-schema.js";

export const SUPER_ADMIN_SLUG = "super-admin";

export type Access = {
  userId: string;
  roles: { id: number; slug: string; name: string }[];
  isSuperAdmin: boolean;
  // "resource:action", e.g. "event:approve". Union of all the user's roles.
  permissions: Set<string>;
};

// Loads every role the user holds and the union of their permissions.
// Returns null when the account is a deactivated staff member.
export const loadAccess = async (userId: string): Promise<Access | null> => {
  const [staffRow] = await db
    .select({ isActive: staff.isActive })
    .from(staff)
    .where(eq(staff.userId, userId))
    .limit(1);

  if (staffRow && !staffRow.isActive) return null;

  const rows = await db
    .select({
      roleId: roles.id,
      slug: roles.slug,
      name: roles.name,
      resource: permissions.resource,
      action: permissions.action,
    })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .leftJoin(rolePermissions, eq(rolePermissions.roleId, roles.id))
    .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(userRoles.userId, userId));

  const roleMap = new Map<number, { id: number; slug: string; name: string }>();
  const granted = new Set<string>();

  for (const row of rows) {
    roleMap.set(row.roleId, { id: row.roleId, slug: row.slug, name: row.name });
    if (row.resource && row.action) granted.add(`${row.resource}:${row.action}`);
  }

  const isSuperAdmin = [...roleMap.values()].some((r) => r.slug === SUPER_ADMIN_SLUG);

  // Super Admin always has every permission that exists, even ones added
  // after the last seed run.
  if (isSuperAdmin) {
    const all = await db
      .select({ resource: permissions.resource, action: permissions.action })
      .from(permissions);
    for (const p of all) granted.add(`${p.resource}:${p.action}`);
  }

  return { userId, roles: [...roleMap.values()], isSuperAdmin, permissions: granted };
};

export const can = (access: Access, resource: string, action: string) =>
  access.isSuperAdmin || access.permissions.has(`${resource}:${action}`);

export type DepartmentScope =
  | { kind: "all" }
  | { kind: "department"; departmentId: number };

// Replaces getActiveHod() in controllers. Permission middleware already decided
// WHAT the caller may do; this decides WHICH department's data they may touch:
// Super Admin -> every department, staff -> their own department only.
// Returns null when a non-super-admin has no department assigned.
export const resolveDepartmentScope = async (
  access: Access,
): Promise<DepartmentScope | null> => {
  if (access.isSuperAdmin) return { kind: "all" };

  const [row] = await db
    .select({ departmentId: staff.departmentId })
    .from(staff)
    .where(eq(staff.userId, access.userId))
    .limit(1);

  return row?.departmentId
    ? { kind: "department", departmentId: row.departmentId }
    : null;
};
