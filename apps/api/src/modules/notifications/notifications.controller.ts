import type { Request, Response } from "express";

import asyncHandler from "../../middleware/asyncHandler.js";
import { addClient, removeClient } from "../../lib/sse.js";
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "./notifications.service.js";
import { notifyUser } from "../../lib/notify.js";

// Live stream (SSE)
export const StreamNotifications = (req: Request, res: Response) => {
  const userId = res.locals.user.id as string;

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders();

  // tell the browser the connection is open
  res.write(": connected\n\n");

  addClient(userId, res);

  // heartbeat so proxies don't close the idle connection
  const ping = setInterval(() => res.write(": ping\n\n"), 25000);

  req.on("close", () => {
    clearInterval(ping);
    removeClient(userId, res);
  });
};

export const GetNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const limit = req.query.limit === undefined ? 50 : Number(req.query.limit);

    if (
      !Number.isSafeInteger(page) || page < 1 ||
      !Number.isSafeInteger(limit) || limit < 1 || limit > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be between 1 and 100.",
      });
    }

    const unreadOnly = req.query.unread === "true";

    const result = await getUserNotifications(
      res.locals.user.id,
      page,
      limit,
      unreadOnly,
    );

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully.",
      data: result.rows,
      pagination: result.pagination,
    });
  },
);


export const MarkNotificationRead = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    const updated = await markNotificationRead(id, res.locals.user.id);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
    });
  },
);

export const MarkAllNotificationsRead = asyncHandler(
  async (_req: Request, res: Response) => {
    await markAllNotificationsRead(res.locals.user.id);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
    });
  },
);

