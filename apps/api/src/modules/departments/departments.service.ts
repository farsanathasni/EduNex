
import { asc, eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { departments } from "../../db/schema/others-schema.js";
import type { DepartmentInput } from "./departments.validation.js";

// Get all departments
export const getAllDepartments = async () => {
  return db
    .select()
    .from(departments)
    .orderBy(asc(departments.name));
};

// Get a department by ID
export const getDepartmentById = async (id: number) => {
  const [department] = await db
    .select()
    .from(departments)
    .where(eq(departments.id, id))
    .limit(1);

  return department ?? null;
};

// Create multiple departments
export const createDepartment = async (
  input: DepartmentInput[]
) => {
  return db
    .insert(departments)
    .values(
      input.map((department) => ({
        name: department.name,
        code: department.code,
        description: department.description ?? null,
      }))
    )
    .returning();
};

// Update a department
export const updateDepartment = async (
  id: number,
  input: {
    name?: string;
    code?: string;
    description?: string | null;
  }
) => {
  const [department] = await db
    .update(departments)
    .set({
      ...input,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(departments.id, id))
    .returning();

  return department ?? null;
};

// Delete a department
export const deleteDepartment = async (id: number) => {
  const [department] = await db
    .delete(departments)
    .where(eq(departments.id, id))
    .returning();

  return department ?? null;
};
