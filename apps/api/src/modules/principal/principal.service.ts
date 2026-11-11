

import { eq, and } from "drizzle-orm";
import { db } from "../../config/database.js";
import { auth } from "../../auth.js";
import { user } from "../../db/schema/auth-schema.js";
import { staff } from "../../db/schema/staff-schema.js";
import type { CreateHodInput } from "../hod/hod.validation.js";
import { departments } from "../../db/schema/others-schema.js";
import { roles, userRoles } from "../../db/schema/rbac-schema.js";
import { randomBytes } from "node:crypto";
import type { CreateStaffInput } from "../staff/staff.validation.js";
import type { CreateManagedStudentInput } from "../students/student.validation.js";
import { StudentProfile } from "../../db/schema/student-profile.js";


export const getStaffProfile = async (userId: string) => {
  const [profile] = await db
    .select()
    .from(staff)
    .where(and(eq(staff.userId, userId), eq(staff.isActive, true)))
    .limit(1);

  return profile ?? null;
};

export class StaffCreationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "StaffCreationError";
  }
}


export const createStaffAccount = async (
  input: CreateStaffInput,
  createdBy: string,
) => {
  const [existingUser] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, input.email))
    .limit(1);
  if (existingUser) {
    throw new StaffCreationError("Email is already registered.", 409);
  }

  const [existingStaff] = await db
    .select({ id: staff.id })
    .from(staff)
    .where(eq(staff.employeeId, input.employeeId))
    .limit(1);
  if (existingStaff) {
    throw new StaffCreationError("Employee ID is already registered.", 409);
  }

  const [department] = await db
    .select({ id: departments.id })
    .from(departments)
    .where(eq(departments.id, input.departmentId))
    .limit(1);
  if (!department) {
    throw new StaffCreationError("Selected department was not found.", 400);
  }

  const temporaryPassword = randomBytes(32).toString("base64url");
  let createdUser: { id: string; name: string; email: string } | undefined;

  try {
    
    const result = await auth.api.signUpEmail({
      body: {
        name: input.name,
        email: input.email,
        password: temporaryPassword,
      },
    });

    if (!result.user) {
      throw new Error("Unable to create the staff login account.");
    }
    createdUser = result.user;

    await db.transaction(async (tx) => {
      await tx.insert(staff).values({
        id: crypto.randomUUID(),
        userId: createdUser!.id,
        employeeId: input.employeeId,
        role: input.role,
        departmentId: input.departmentId,
        designation: input.designation,
        phone: input.phone || null,
        isActive: true,
      });

      const [staffRole] = await tx
        .select({ id: roles.id })
        .from(roles)
        .where(eq(roles.slug, input.role))
        .limit(1);
      if (!staffRole) {
        throw new Error(`${input.role.toUpperCase()} role is missing. Run the RBAC seed script.`);
      }

      await tx
        .insert(userRoles)
        .values({
          userId: createdUser!.id,
          roleId: staffRole.id,
          assignedBy: createdBy,
        })
        .onConflictDoNothing();

      const [studentRole] = await tx
        .select({ id: roles.id })
        .from(roles)
        .where(eq(roles.slug, "student"))
        .limit(1);
      if (studentRole) {
        await tx
          .delete(userRoles)
          .where(
            and(
              eq(userRoles.userId, createdUser!.id),
              eq(userRoles.roleId, studentRole.id),
            ),
          );
      }

      await tx
        .update(user)
        .set({ role: input.role })
        .where(eq(user.id, createdUser!.id));
    });

    
    await auth.api.requestPasswordReset({
      body: {
        email: createdUser.email,
        redirectTo: `${process.env.WEB_URL || "http://localhost:3000"}/resetPassword`,
      },
    });
  } catch (error) {
    if (createdUser) {
      
      try {
        await db.delete(user).where(eq(user.id, createdUser.id));
      } catch {
   
      }
    }

    const dbError = error as { code?: string; constraint?: string };
    if (dbError.code === "23505") {
      if (dbError.constraint?.includes("employee")) {
        throw new StaffCreationError("Employee ID is already registered.", 409);
      }
      if (dbError.constraint?.includes("email")) {
        throw new StaffCreationError("Email is already registered.", 409);
      }
    }

    if (error instanceof StaffCreationError) throw error;
    throw new StaffCreationError(
      "Unable to create the staff account or send its password setup email.",
      502,
    );
  }

  return {
    id: createdUser!.id,
    name: createdUser!.name,
    email: createdUser!.email,
    employeeId: input.employeeId,
    role: input.role,
    departmentId: input.departmentId,
    designation: input.designation,
    phone: input.phone || null,
  };
};


export const createHod = async (
  input: CreateHodInput,
  createdBy: string,
) => {
  const created = await createStaffAccount(
    {
      ...input,
      role: "hod",
      departmentId: Number(input.departmentId),
    },
    createdBy,
  );

  return { ...created, departmentId: input.departmentId, role: "hod" as const };
};

export const createStudentAccount = async (
  input: CreateManagedStudentInput,
) => {
  const [existingAccount] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, input.email))
    .limit(1);
  if (existingAccount) {
    throw new StaffCreationError("Email is already registered.", 409);
  }

  const [existingAdmission] = await db
    .select({ id: StudentProfile.id })
    .from(StudentProfile)
    .where(eq(StudentProfile.admissionNumber, input.admissionNumber))
    .limit(1);
  if (existingAdmission) {
    throw new StaffCreationError("Admission number is already registered.", 409);
  }

  const [department] = await db
    .select({ id: departments.id })
    .from(departments)
    .where(eq(departments.id, input.departmentId))
    .limit(1);
  if (!department) {
    throw new StaffCreationError("Selected department was not found.", 400);
  }

  let createdUser: { id: string; name: string; email: string } | undefined;
  let createdProfileId: number | undefined;
  try {
  
    const result = await auth.api.signUpEmail({
      body: {
        name: input.name,
        email: input.email,
        password: randomBytes(32).toString("base64url"),
      },
    });
    if (!result.user) throw new Error("Unable to create the student login account.");
    createdUser = result.user;

    const [createdProfile] = await db.insert(StudentProfile).values({
      userId: createdUser.id,
      name: input.name,
      admissionNumber: input.admissionNumber,
      departmentId: input.departmentId,
      semester: input.semester,
      phone: input.phone || null,
    }).returning({ id: StudentProfile.id });
    createdProfileId = createdProfile?.id;

    
    await auth.api.requestPasswordReset({
      body: {
        email: createdUser.email,
        redirectTo: `${process.env.WEB_URL || "http://localhost:3000"}/resetPassword`,
      },
    });
  } catch (error) {
    if (createdUser) {
      try {
        await db.delete(user).where(eq(user.id, createdUser.id));
      } catch {
        
      }
    }

    const dbError = error as { code?: string; constraint?: string };
    if (dbError.code === "23505") {
      if (dbError.constraint?.toLowerCase().includes("admission")) {
        throw new StaffCreationError("Admission number is already registered.", 409);
      }
      if (dbError.constraint?.toLowerCase().includes("email")) {
        throw new StaffCreationError("Email is already registered.", 409);
      }
    }
    if (error instanceof StaffCreationError) throw error;
    throw new StaffCreationError(
      "Unable to create the student account or send its password setup email.",
      502,
    );
  }

  return {
    id: createdProfileId!,
    name: createdUser!.name,
    email: createdUser!.email,
    admissionNumber: input.admissionNumber,
    departmentId: input.departmentId,
    semester: input.semester,
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
