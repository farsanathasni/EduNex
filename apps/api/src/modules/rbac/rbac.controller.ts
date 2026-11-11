import type { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import asyncHandler from "../../middleware/asyncHandler.js";
import { db } from "../../config/database.js";
import { user } from "../../db/schema/auth-schema.js";
import { staff } from "../../db/schema/staff-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import { clubs } from "../../db/schema/others-schema.js";
import { coordinatorAssignments } from "../../db/schema/coordinator-schema.js";
import { can, type Access } from "./rbac.access.js";
import {
  createRole,
  deleteRole,
  findUnknownPermissionIds,
  getPermissionCatalog,
  getRoleDetail,
  listRoles,
  permissionIdsToKeys,
  updateRole,
} from "./rbac.service.js";
import { createRoleSchema, roleIdSchema, updateRoleSchema } from "./rbac.validation.js";


export const GetMe = asyncHandler(async (_req: Request, res: Response) => {
  const access = res.locals.access as Access;
  const userId = res.locals.user.id as string;

  const [[account], [studentProfile], [staffProfile]] = await Promise.all([
    db
      .select({ id: user.id, name: user.name, email: user.email, image: user.image,role: user.role, })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1),
    db
      .select({ id: StudentProfile.id, departmentId: StudentProfile.departmentId })
      .from(StudentProfile)
      .where(and(eq(StudentProfile.userId, userId), eq(StudentProfile.isDeleted, false)))
      .limit(1),
    db
      .select({
        id: staff.id,
        role: staff.role,
        employeeId: staff.employeeId,
        departmentId: staff.departmentId,
        designation: staff.designation,
      })
      .from(staff)
      .where(eq(staff.userId, userId))
      .limit(1),
  ]);

  const coordinatedClubs = studentProfile
    ? await db
        .select({ id: clubs.id, name: clubs.name })
        .from(coordinatorAssignments)
        .innerJoin(clubs, eq(coordinatorAssignments.clubId, clubs.id))
        .where(eq(coordinatorAssignments.studentId, studentProfile.id))
    : [];

  return res.status(200).json({
    success: true,
    data: {
      user: account,
      roles: access.roles,
      isSuperAdmin: access.isSuperAdmin,
      permissions: [...access.permissions],
      // Students must finish their profile before using the app.
      hasStudentProfile: Boolean(studentProfile),
      studentProfile: studentProfile ?? null,
      staffProfile: staffProfile ?? null,
      coordinatedClubs,
    },
  });
});

export const GetRoles = asyncHandler(async (_req: Request, res: Response) =>
  res.status(200).json({ success: true, data: await listRoles() }),
);

export const GetPermissionCatalog = asyncHandler(async (_req: Request, res: Response) =>
  res.status(200).json({ success: true, data: await getPermissionCatalog() }),
);

export const GetRole = asyncHandler(async (req: Request, res: Response) => {
  const id = roleIdSchema.safeParse(req.params.id);
  if (!id.success) {
    return res.status(400).json({ success: false, message: "Invalid role ID." });
  }

  const role = await getRoleDetail(id.data);
  if (!role) {
    return res.status(404).json({ success: false, message: "Role not found." });
  }

  return res.status(200).json({ success: true, data: role });
});

const roleErrors: Record<string, [number, string]> = {
  ROLE_EXISTS: [409, "A role with this name already exists."],
  ROLE_RESERVED: [409, "The Principal role is reserved; use Super Admin instead."],
  ROLE_NAME_INVALID: [400, "Role name must contain letters or numbers."],
  ROLE_NOT_FOUND: [404, "Role not found."],
  ROLE_LOCKED: [403, "The Super Admin role cannot be edited."],
  ROLE_SYSTEM_RENAME: [403, "Built-in roles cannot be renamed."],
  ROLE_SYSTEM_DELETE: [403, "Built-in roles cannot be deleted."],
  ROLE_IN_USE: [409, "Remove this role from its users before deleting it."],
};

const sendRoleError = (res: Response, error: unknown) => {
  const mapped = error instanceof Error ? roleErrors[error.message] : undefined;
  if (!mapped) throw error;
  return res.status(mapped[0]).json({ success: false, message: mapped[1] });
};

// Rejects unknown permission ids, and permissions the caller does not hold
// themselves (so nobody can hand out more than they have).
const checkPermissionIds = async (res: Response, ids: number[]) => {
  if ((await findUnknownPermissionIds(ids)).length > 0) {
    res.status(400).json({ success: false, message: "Unknown permission in request." });
    return false;
  }

  const access = res.locals.access as Access;

  if (!access.isSuperAdmin) {
    const keys = await permissionIdsToKeys(ids);
    if (keys.some((key) => !access.permissions.has(key))) {
      res.status(403).json({
        success: false,
        message: "You cannot grant permissions that you do not have.",
      });
      return false;
    }
  }

  return true;
};

export const CreateRole = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createRoleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid role details.",
      errors: parsed.error.flatten(),
    });
  }

  if (!(await checkPermissionIds(res, parsed.data.permissionIds))) return;

  try {
    return res.status(201).json({ success: true, data: await createRole(parsed.data) });
  } catch (error) {
    return sendRoleError(res, error);
  }
});

export const UpdateRole = asyncHandler(async (req: Request, res: Response) => {
  const id = roleIdSchema.safeParse(req.params.id);
  const parsed = updateRoleSchema.safeParse(req.body);

  if (!id.success || !parsed.success) {
    return res.status(400).json({ success: false, message: "Invalid role details." });
  }

  const access = res.locals.access as Access;

  if (parsed.data.permissionIds) {
    // Editing your own role would let you widen your own access.
    if (!access.isSuperAdmin && access.roles.some((r) => r.id === id.data)) {
      return res.status(403).json({
        success: false,
        message: "You cannot change the permissions of your own role.",
      });
    }

    if (!(await checkPermissionIds(res, parsed.data.permissionIds))) return;
  }

  try {
    return res.status(200).json({ success: true, data: await updateRole(id.data, parsed.data) });
  } catch (error) {
    return sendRoleError(res, error);
  }
});

export const DeleteRole = asyncHandler(async (req: Request, res: Response) => {
  const id = roleIdSchema.safeParse(req.params.id);
  if (!id.success) {
    return res.status(400).json({ success: false, message: "Invalid role ID." });
  }

  try {
    await deleteRole(id.data);
    return res.status(200).json({ success: true, message: "Role deleted." });
  } catch (error) {
    return sendRoleError(res, error);
  }
});

export { can };
