import { and, eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { staff } from "../../db/schema/staff-schema.js";
import {
  permissions,
  rolePermissions,
  roles,
  userRoles,
} from "../../db/schema/rbac-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import { coordinatorAssignments } from "../../db/schema/coordinator-schema.js";

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

  // Dynamically grant coordinator permissions to assigned students.
const isStudent = [...roleMap.values()].some(
  (role) => role.slug === "student",
);

if (isStudent && !isSuperAdmin) {
  const assignments = await db
    .select({
      studentId: coordinatorAssignments.studentId,
    })
    .from(coordinatorAssignments)
    .innerJoin(
      StudentProfile,
      eq(coordinatorAssignments.studentId, StudentProfile.id),
    )
    .where(
      and(
        eq(StudentProfile.userId, userId),
        eq(StudentProfile.isDeleted, false),
      ),
    );

  // Only students with coordinator assignments receive these permissions.
  if (assignments.length > 0) {
    granted.add("membership:view");
    granted.add("membership:approve");
    granted.add("membership:reject");
    granted.add("member:view");
  }
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

// undefined = unrestricted (Super Admin, students, faculty, coordinators).
// number = HOD scoped to that department. null = HOD with no department.
export const resolveHodDepartmentScope = async (
  access: Access,
): Promise<number | undefined | null> => {
  if (access.isSuperAdmin) return undefined;

  const isHod = access.roles.some((role) => role.slug === "hod");
  if (!isHod) return undefined;

  const scope = await resolveDepartmentScope(access);
  return scope?.kind === "department" ? scope.departmentId : null;
};
