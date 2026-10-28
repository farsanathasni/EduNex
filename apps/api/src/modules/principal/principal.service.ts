import { eq, and } from "drizzle-orm";
import { db } from "../../config/database.js";
import { auth } from "../../auth.js";
import { staff } from "../../db/schema/staff-schema.js";
import type { CreateHodInput } from "../hod/hod.validation.js";
import { departments } from "../../db/schema/others-schema.js";
import { randomBytes } from "node:crypto";

// Check whether the user is an active Principal
export const getActivePrincipal = async (userId: string) => {
  const [principal] = await db
    .select()
    .from(staff)
    .where(
      and(
        eq(staff.userId, userId),
        eq(staff.role, "principal"),
        eq(staff.isActive, true),
      ),
    )
    .limit(1);

  return principal ?? null;
};

// Create a new HOD account
export const createHod = async (input: CreateHodInput) => {
  // Check whether the employee ID is already registered
  const [existingStaff] = await db
    .select({ id: staff.id })
    .from(staff)
    .where(eq(staff.employeeId, input.employeeId))
    .limit(1);

  if (existingStaff) {
    throw new Error("Employee ID is already registered");
  }

  const temporaryPassword = randomBytes(32).toString("base64url");


  // Create the login account using Better Auth
  const result = await auth.api.signUpEmail({
    body: {
      name: input.name,
      email: input.email,
      password: temporaryPassword,
    },
  });

  if (!result.user) {
    throw new Error("Unable to create the HOD login account");
  }

  
  try {
    await db.insert(staff).values({
      id: crypto.randomUUID(),
      userId: result.user.id,
      employeeId: input.employeeId,
      role: "hod",
      departmentId: Number(input.departmentId),
      designation: input.designation,
      phone: input.phone || null,
      isActive: true,
    });
  } catch (error) {
    
    throw error;
  }

 
await auth.api.requestPasswordReset({
  body: {
    email: result.user.email,
    redirectTo: `${process.env.WEB_URL || "http://localhost:3000"}/resetPassword`,
  },
});

  return {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    employeeId: input.employeeId,
    role: "hod" as const,
    departmentId: input.departmentId,
    designation: input.designation,
    phone: input.phone || null,
  };
};


export const getDepartments = async () => {
  return await db
    .select({
      id: departments.id,
      name: departments.name,
      code: departments.code,
    })
    .from(departments)
    .orderBy(departments.name);
};