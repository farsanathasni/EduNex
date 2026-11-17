import { db } from "../config/database.js"; // adjust to your db export
import { notifications } from "../db/schema/index.js";
import { sendToUser } from "./sse.js";

type Payload = {
  title: string;
  message: string;
  notificationType: string;
  referenceType?: string;
  referenceId?: number;
};

export async function notifyMany(userIds: string[], p: Payload) {
  if (userIds.length === 0) return;

  const saved = await db
    .insert(notifications)
    .values(
      userIds.map((userId) => ({
        userId,
        title: p.title,
        message: p.message,
        notificationType: p.notificationType,
        referenceType: p.referenceType ?? null,
        referenceId: p.referenceId ?? null,
      }))
    )
    .returning();

  saved.forEach((n) => sendToUser(n.userId, n));
}

export const notifyUser = (userId: string, p: Payload) => notifyMany([userId], p);