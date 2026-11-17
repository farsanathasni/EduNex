import { and, desc, eq, count } from "drizzle-orm";

import { db } from "../../config/database.js";
import { notifications } from "../../db/schema/others-schema.js";

export const getUserNotifications = async (
  userId: string,
  page = 1,
  limit = 50,
  unreadOnly = false,
) => {
  const where = and(
    eq(notifications.userId, userId),
    unreadOnly ? eq(notifications.isRead, false) : undefined,
  );
  const offset = (page - 1) * limit;

  const [rows, totalResult] = await Promise.all([
    db
      .select()
      .from(notifications)
      .where(where)
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(notifications).where(where),
  ]);

  const total = totalResult[0].total;

  return {
    rows,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const markNotificationRead = async (id: number, userId: string) => {
  const updated = await db
    .update(notifications)
    .set({ isRead: true, readAt: new Date().toISOString() })
    .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
    .returning({ id: notifications.id });

  return updated.length > 0;
};

export const markAllNotificationsRead = async (userId: string) => {
  await db
    .update(notifications)
    .set({ isRead: true, readAt: new Date().toISOString() })
    .where(
      and(eq(notifications.userId, userId), eq(notifications.isRead, false)),
    );
};