// import { eq, and } from "drizzle-orm";
// import { db } from "../../config/database.js";
// import { auth } from "../../auth.js";
// import { staff } from "../../db/schema/staff-schema.js";
// import type { CreateHodInput } from "../hod/hod.validation.js";
// import { departments } from "../../db/schema/others-schema.js";
// import { randomBytes } from "node:crypto";

// // Check whether the user is an active Principal
// export const getActivePrincipal = async (userId: string) => {
//   const [principal] = await db
//     .select()
//     .from(staff)
//     .where(
//       and(
//         eq(staff.userId, userId),
//         eq(staff.role, "principal"),
//         eq(staff.isActive, true),
//       ),
//     )
//     .limit(1);

//   return principal ?? null;
// };

// // Create a new HOD account
// export const createHod = async (input: CreateHodInput) => {
//   // Check whether the employee ID is already registered
//   const [existingStaff] = await db
//     .select({ id: staff.id })
//     .from(staff)
//     .where(eq(staff.employeeId, input.employeeId))
//     .limit(1);

//   if (existingStaff) {
//     throw new Error("Employee ID is already registered");
//   }

//   const temporaryPassword = randomBytes(32).toString("base64url");


//   // Create the login account using Better Auth
//   const result = await auth.api.signUpEmail({
//     body: {
//       name: input.name,
//       email: input.email,
//       password: temporaryPassword,
//     },
//   });

//   if (!result.user) {
//     throw new Error("Unable to create the HOD login account");
//   }

  
//   try {
//     await db.insert(staff).values({
//       id: crypto.randomUUID(),
//       userId: result.user.id,
//       employeeId: input.employeeId,
//       role: "hod",
//       departmentId: Number(input.departmentId),
//       designation: input.designation,
//       phone: input.phone || null,
//       isActive: true,
//     });
//   } catch (error) {
    
//     throw error;
//   }

 
// await auth.api.requestPasswordReset({
//   body: {
//     email: result.user.email,
//     redirectTo: `${process.env.WEB_URL || "http://localhost:3000"}/resetPassword`,
//   },
// });

//   return {
//     id: result.user.id,
//     name: result.user.name,
//     email: result.user.email,
//     employeeId: input.employeeId,
//     role: "hod" as const,
//     departmentId: input.departmentId,
//     designation: input.designation,
//     phone: input.phone || null,
//   };
// };


// export const getDepartments = async () => {
//   return await db
//     .select({
//       id: departments.id,
//       name: departments.name,
//       code: departments.code,
//     })
//     .from(departments)
//     .orderBy(departments.name);
// };

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

// Optional staff record for display (employee ID, designation).
// Permissions come from RBAC, not from this table, so a Super Admin
// without a staff row is fine and gets null.
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

// Shared account/staff/RBAC creation used by both the Principal staff API
// and the existing HOD creation endpoint.
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
    // Better Auth hashes this generated temporary password. It is never
    // returned or sent to the new staff member.
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

    // This uses Better Auth's existing sendResetPassword hook and EduNex
    // email template to deliver the setup link.
    await auth.api.requestPasswordReset({
      body: {
        email: createdUser.email,
        redirectTo: `${process.env.WEB_URL || "http://localhost:3000"}/resetPassword`,
      },
    });
  } catch (error) {
    if (createdUser) {
      // The auth user, staff record, and RBAC rows should not remain partial
      // if the transaction or password setup email fails.
      try {
        await db.delete(user).where(eq(user.id, createdUser.id));
      } catch {
        // Preserve the original creation failure for the controller.
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

// Keep the existing HOD endpoint and request shape while sharing the
// account creation and password setup implementation.
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

  // Match the pre-existing HOD response field types and shape.
  return { ...created, departmentId: input.departmentId, role: "hod" as const };
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
