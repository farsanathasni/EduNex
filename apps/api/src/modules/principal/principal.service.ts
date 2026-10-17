import { eq, and } from "drizzle-orm";
import { db } from "../../config/database.js";
import { staff } from "../../db/schema/staff-schema.js";

export const getActivePrincipal = async (userId: string) => {
  const [principal] = await db
    .select()
    .from(staff)
    .where(
      and(
        eq(staff.userId, userId),
        eq(staff.role, "principal"),
        eq(staff.isActive, true)
      )
    )
    .limit(1);

  return principal ?? null;
};