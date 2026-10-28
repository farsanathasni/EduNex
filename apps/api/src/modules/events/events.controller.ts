
import type { Request, Response } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import { getAllEvents, getMyEvents } from "./events.service.js";

export const getAllEventsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const events = await getAllEvents();

    res.status(200).json({
      success: true,
      data: events,
      message: "Events fetched successfully.",
    });
  },
);

export const getMyEventsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const userId = res.locals.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const events = await getMyEvents(userId);

    res.status(200).json({
      success: true,
      data: events,
      message: "My events fetched successfully.",
    });
  },
);
