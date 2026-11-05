import { and, count, eq, ilike, ne, or, type SQL } from "drizzle-orm";

import { db } from "../../config/database.js";
import { departments } from "../../db/schema/others-schema.js";
import { staff } from "../../db/schema/staff-schema.js";
import { user } from "../../db/schema/auth-schema.js";
import type { DepartmentScope } from "../rbac/rbac.access.js";
import type { StaffListQuery, UpdateStaffInput } from "./staff.validation.js";

export class StaffUpdateError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "StaffUpdateError";
  }
}

export class StaffDeactivationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "StaffDeactivationError";
  }
}

export const listStaff = async (
  query: StaffListQuery,
  departmentId?: number,
) => {
  const conditions: SQL[] = [
    eq(staff.isActive, true),
    or(eq(staff.role, "hod"), eq(staff.role, "faculty"))!,
  ];

  if (query.type !== "all") {
    conditions.push(eq(staff.role, query.type));
  }

  if (departmentId !== undefined) {
    conditions.push(eq(staff.departmentId, departmentId));
  }

  if (query.search) {
    const term = `%${query.search}%`;
    const searchCondition = or(
      ilike(user.name, term),
      ilike(staff.employeeId, term),
      ilike(user.email, term),
    );
    if (searchCondition) conditions.push(searchCondition);
  }

  const where = and(...conditions);
  const offset = (query.page - 1) * query.limit;

  const [rows, totalRows] = await Promise.all([
    db
      .select({
        id: staff.id,
        userId: staff.userId,
        name: user.name,
        email: user.email,
        employeeId: staff.employeeId,
        role: staff.role,
        departmentId: staff.departmentId,
        departmentName: departments.name,
        departmentCode: departments.code,
        designation: staff.designation,
        phone: staff.phone,
        isActive: staff.isActive,
      })
      .from(staff)
      .innerJoin(user, eq(staff.userId, user.id))
      .leftJoin(departments, eq(staff.departmentId, departments.id))
      .where(where)
      .orderBy(user.name)
      .limit(query.limit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(staff)
      .innerJoin(user, eq(staff.userId, user.id))
      .where(where),
  ]);

  const total = totalRows[0]?.total ?? 0;
  return {
    staff: rows,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};

export const updateStaff = async (
  staffId: string,
  input: UpdateStaffInput,
  scope: DepartmentScope,
) => {
  if (scope.kind === "department" && input.departmentId !== undefined) {
    throw new StaffUpdateError(
      "You cannot change a staff member's department.",
      403,
    );
  }

  const [current] = await db
    .select({
      id: staff.id,
      userId: staff.userId,
      role: staff.role,
      departmentId: staff.departmentId,
    })
    .from(staff)
    .where(and(eq(staff.id, staffId), eq(staff.isActive, true)))
    .limit(1);

  if (!current || (current.role !== "hod" && current.role !== "faculty")) {
    throw new StaffUpdateError("Staff member not found.", 404);
  }

  if (
    scope.kind === "department" &&
    current.departmentId !== scope.departmentId
  ) {
    throw new StaffUpdateError(
      "You can only edit staff in your own department.",
      403,
    );
  }

  if (input.departmentId !== undefined) {
    const [department] = await db
      .select({ id: departments.id })
      .from(departments)
      .where(eq(departments.id, input.departmentId))
      .limit(1);
    if (!department) {
      throw new StaffUpdateError("Selected department was not found.", 400);
    }
  }

  if (input.email !== undefined) {
    const [duplicateEmail] = await db
      .select({ id: user.id })
      .from(user)
      .where(and(eq(user.email, input.email), ne(user.id, current.userId)))
      .limit(1);
    if (duplicateEmail) {
      throw new StaffUpdateError("Email is already used by another account.", 409);
    }
  }

  if (input.employeeId !== undefined) {
    const [duplicateEmployeeId] = await db
      .select({ id: staff.id })
      .from(staff)
      .where(
        and(
          eq(staff.employeeId, input.employeeId),
          ne(staff.id, current.id),
        ),
      )
      .limit(1);
    if (duplicateEmployeeId) {
      throw new StaffUpdateError(
        "Employee ID is already assigned to another staff member.",
        409,
      );
    }
  }

  try {
    return await db.transaction(async (tx) => {
      const userChanges: { name?: string; email?: string } = {};
      if (input.name !== undefined) userChanges.name = input.name;
      if (input.email !== undefined) userChanges.email = input.email;
      if (Object.keys(userChanges).length > 0) {
        await tx.update(user).set(userChanges).where(eq(user.id, current.userId));
      }

      const staffChanges: {
        employeeId?: string;
        designation?: string | null;
        phone?: string | null;
        departmentId?: number;
        updatedAt?: Date;
      } = {};
      if (input.employeeId !== undefined) {
        staffChanges.employeeId = input.employeeId;
      }
      if (input.designation !== undefined) {
        staffChanges.designation = input.designation;
      }
      if (input.phone !== undefined) staffChanges.phone = input.phone;
      if (input.departmentId !== undefined) {
        staffChanges.departmentId = input.departmentId;
      }
      if (Object.keys(staffChanges).length > 0) {
        staffChanges.updatedAt = new Date();
        await tx.update(staff).set(staffChanges).where(eq(staff.id, current.id));
      }

      const [updated] = await tx
        .select({
          id: staff.id,
          userId: staff.userId,
          name: user.name,
          email: user.email,
          employeeId: staff.employeeId,
          role: staff.role,
          departmentId: staff.departmentId,
          departmentName: departments.name,
          departmentCode: departments.code,
          designation: staff.designation,
          phone: staff.phone,
          isActive: staff.isActive,
        })
        .from(staff)
        .innerJoin(user, eq(staff.userId, user.id))
        .leftJoin(departments, eq(staff.departmentId, departments.id))
        .where(eq(staff.id, current.id))
        .limit(1);

      return updated;
    });
  } catch (error) {
    const dbError = error as { code?: string; constraint?: string };
    if (dbError.code === "23505") {
      if (dbError.constraint?.includes("employee")) {
        throw new StaffUpdateError("Employee ID is already in use.", 409);
      }
      if (dbError.constraint?.includes("email")) {
        throw new StaffUpdateError("Email is already in use.", 409);
      }
    }
    throw error;
  }
};

export const deactivateStaff = async (staffId: string) => {
  const [current] = await db
    .select({
      id: staff.id,
      role: staff.role,
      isActive: staff.isActive,
    })
    .from(staff)
    .where(eq(staff.id, staffId))
    .limit(1);

  if (!current || (current.role !== "hod" && current.role !== "faculty")) {
    throw new StaffDeactivationError("Staff member not found.", 404);
  }

  if (!current.isActive) {
    throw new StaffDeactivationError("Staff member is already deactivated.", 409);
  }

  const [deactivated] = await db
    .update(staff)
    .set({ isActive: false, updatedAt: new Date() })
    .where(and(eq(staff.id, current.id), eq(staff.isActive, true)))
    .returning({ id: staff.id });

  if (!deactivated) {
    throw new StaffDeactivationError("Staff member is already deactivated.", 409);
  }

  return { id: deactivated.id, isActive: false };
};
