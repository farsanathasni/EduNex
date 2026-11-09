
import type { Request, Response } from "express";

import asyncHandler from "../../middleware/asyncHandler.js";
import {
  resolveHodDepartmentScope,
  type Access,
} from "../rbac/rbac.access.js";
// import { getAllEvents, getMyEvents } from "./events.service.js";
// import { eventsQuerySchema } from "./events.validation.js";
import { createEventRequest, getAllEvents, getMyEventRequests, getMyEvents } from "./events.service.js";
import { createEventRequestSchema, eventsQuerySchema } from "./events.validation.js";

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

    const departmentId = await resolveHodDepartmentScope(
      res.locals.access as Access,
    );

    if (departmentId === null) {
      return res.status(403).json({
        success: false,
        message: "No department is assigned to your account.",
      });
    }

    const result = await getAllEvents(search, page, limit, departmentId);

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



export const createEventRequestController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const validation = createEventRequestSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid event request details.",
        errors: validation.error.flatten(),
      });
    }

    const result = await createEventRequest(userId, validation.data);

    if (!result) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned as coordinator of this club.",
      });
    }

    return res.status(201).json({
      success: true,
      data: result,
      message: "Event request submitted successfully. Waiting for Principal approval.",
    });
  },
);


export const getMyEventRequestsController = asyncHandler(
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
        message: "Invalid event request search or pagination parameters.",
        errors: validation.error.flatten(),
      });
    }

    const { search, page, limit } = validation.data;

    const result = await getMyEventRequests(
      userId,
      search,
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      data: result.events,
      pagination: result.pagination,
      message: "My event requests fetched successfully.",
    });
  },
);