
import { eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { clubs } from "../../db/schema/others-schema.js";

export const createClub = async (
  name: string,
  description?: string,
  departmentId?: number,
) => {
  const [club] = await db
    .insert(clubs)
    .values({
      name,
      description: description || null,
      departmentId: departmentId ?? null,
    })
    .returning();

  return club;
};

export const getAllClubs = async () => {
  return db.select().from(clubs);
};

export const getClubById = async (clubId: number) => {
  const [club] = await db
    .select()
    .from(clubs)
    .where(eq(clubs.id, clubId))
    .limit(1);

  return club ?? null;
};
