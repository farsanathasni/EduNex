
import type { Request, Response } from "express";

import asyncHandler from "../../middleware/asyncHandler.js";
import { getAllEvents, getMyEvents } from "./events.service.js";
import { eventsQuerySchema } from "./events.validation.js";

export const getAllEventsController = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = eventsQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid event search or pagination parameters.",
        errors: validation.error.flatten(),
      });
    }

    const { search, page, limit } = validation.data;

    const result = await getAllEvents(search, page, limit);

    return res.status(200).json({
      success: true,
      data: result.events,
      pagination: result.pagination,
      message: "Events fetched successfully.",
    });
  },
);

export const getMyEventsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const validation = eventsQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid event search or pagination parameters.",
        errors: validation.error.flatten(),
      });
    }

    const { search, page, limit } = validation.data;

    const result = await getMyEvents(userId, search, page, limit);

    return res.status(200).json({
      success: true,
      data: result.events,
      pagination: result.pagination,
      message: "My events fetched successfully.",
    });
  },
);
