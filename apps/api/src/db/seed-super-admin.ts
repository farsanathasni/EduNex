
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

  // 3. Check whether the account already has this role.
  const [existingAssignment] = await db
    .select({ id: userRoles.id })
    .from(userRoles)
    .where(
      and(
        eq(userRoles.userId, adminUser.id),
        eq(userRoles.roleId, superAdminRole.id),
      ),
    )
    .limit(1);

  if (existingAssignment) {
    console.log("This account already has the Super Admin role.");
    return;
  }

  // 4. Assign the role to the existing account.
  await db.insert(userRoles).values({
    userId: adminUser.id,
    roleId: superAdminRole.id,
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
