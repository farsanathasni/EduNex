
import { eq, and } from "drizzle-orm";

import { db, pool } from "../config/database.js";
import { user } from "./schema/auth-schema.js";
import { roles, userRoles } from "./schema/rbac-schema.js";

async function seedSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();

  if (!email) {
    throw new Error(
      "SUPER_ADMIN_EMAIL is missing from the API environment variables.",
    );
  }

  // 1. Find the existing, verified account.
  const [adminUser] = await db
    .select({
      id: user.id,
      email: user.email,
    })
    .from(user)
    .where(
      and(
        eq(user.email, email),
        eq(user.emailVerified, true),
      ),
    )
    .limit(1);

  if (!adminUser) {
    throw new Error(
      "No verified user account was found for SUPER_ADMIN_EMAIL.",
    );
  }

  // 2. Find the Super Admin role.
  const [superAdminRole] = await db
    .select({
      id: roles.id,
      name: roles.name,
    })
    .from(roles)
    .where(eq(roles.slug, "super-admin"))
    .limit(1);

  if (!superAdminRole) {
    throw new Error(
      "Super Admin role not found. Run the RBAC seed script first.",
    );
  }

  // 3. Assign the role, drop the default Student role, and align the
  //    Better Auth role with the EduNex RBAC role.
  await db.transaction(async (tx) => {
    await tx
      .insert(userRoles)
      .values({
        userId: adminUser.id,
        roleId: superAdminRole.id,
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
            eq(userRoles.userId, adminUser.id),
            eq(userRoles.roleId, studentRole.id),
          ),
        );
    }

    await tx
      .update(user)
      .set({ role: "super-admin" })
      .where(eq(user.id, adminUser.id));
  });

  console.log("Super Admin role assigned successfully.");
  console.log(`Account: ${adminUser.email}`);
}

seedSuperAdmin()
  .catch((error: unknown) => {
    console.error("Failed to assign Super Admin role:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
