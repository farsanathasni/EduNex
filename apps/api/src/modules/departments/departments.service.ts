
import { and, asc, count, eq, ilike, or } from "drizzle-orm";

import { db } from "../../config/database.js";
import { departments } from "../../db/schema/others-schema.js";
import type {
  DepartmentInput,
  UpdateDepartmentInput,
} from "./departments.validation.js";

export const getAllDepartments = async (
  search = "",
  page = 1,
  limit = 10,
) => {
  const whereCondition = search
    ? or(
        ilike(departments.name, `%${search}%`),
        ilike(departments.code, `%${search}%`),
      )
    : undefined;

  const [departmentList, totalResult] = await Promise.all([
    db
      .select()
      .from(departments)
      .where(whereCondition)
      .orderBy(asc(departments.name))
      .limit(limit)
      .offset((page - 1) * limit),

    db
      .select({ total: count() })
      .from(departments)
      .where(whereCondition),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return {
    departments: departmentList,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getDepartmentById = async (id: number) => {
  const [department] = await db
    .select()
    .from(departments)
    .where(eq(departments.id, id))
    .limit(1);

  return department ?? null;
};

export const createDepartment = async (input: DepartmentInput[]) => {
  return db
    .insert(departments)
    .values(
      input.map((department) => ({
        name: department.name,
        code: department.code,
        description: department.description ?? null,
      })),
    )
    .returning();
};

export const updateDepartment = async (
  id: number,
  input: UpdateDepartmentInput,
) => {
 const result = await db
  .update(departments)
  .set({
    ...input,
    updatedAt: new Date().toISOString(),
  })
  .where(eq(departments.id, id))
  .returning();

return Array.isArray(result) ? result[0] ?? null : null;
}

export const deleteDepartment = async (id: number) => {
  const [department] = await db
    .delete(departments)
    .where(eq(departments.id, id))
    .returning();

  return department ?? null;
};
