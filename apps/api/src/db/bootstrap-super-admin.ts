
import { eq, and } from "drizzle-orm";
import { auth } from "../auth.js";
import { db, pool } from "../config/database.js";
import { user } from "./schema/auth-schema.js";
import { roles, userRoles } from "./schema/rbac-schema.js";

async function bootstrapSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const name = process.env.SUPER_ADMIN_NAME?.trim();

  if (!email || !password || !name) {
    throw new Error(
      "Set SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, and SUPER_ADMIN_NAME in apps/api/.env.",
    );
  }

  if (password.length < 8) {
    throw new Error("The Super Admin password must be at least 8 characters.");
  }

  // Find the account, or create it through Better Auth.
  let [adminUser] = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (!adminUser) {
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    adminUser = {
      id: result.user.id,
      email: result.user.email,
    };

    console.log("Super Admin account created through Better Auth.");
  } else {
    console.log("Using the existing account for the supplied email.");
  }

  // Find the RBAC Super Admin role.
  const [superAdminRole] = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.slug, "super-admin"))
    .limit(1);

  if (!superAdminRole) {
    throw new Error(
      "Super Admin role not found. Run the RBAC seed script first.",
    );
  }

  // Avoid assigning the same role twice.
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

  if (!existingAssignment) {
    await db.insert(userRoles).values({
      userId: adminUser.id,
      roleId: superAdminRole.id,
    });
  }

  console.log("Super Admin role is assigned.");
  console.log(`Account: ${adminUser.email}`);
}

bootstrapSuperAdmin()
  .catch((error: unknown) => {
    console.error("Super Admin bootstrap failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
