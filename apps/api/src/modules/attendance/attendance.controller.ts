import type { Request, Response } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import type { Access } from "../rbac/rbac.access.js";
import { getEventAttendance, saveAttendance } from "./attendance.service.js";

export const getEventAttendanceController = asyncHandler(
  async (req: Request, res: Response) => {
    const eventId = Number(req.params.eventId);
    const userId = res.locals.user.id as string;
    const isSuperAdmin = (res.locals.access as Access).isSuperAdmin;

    const result = await getEventAttendance(eventId, userId, isSuperAdmin);

    return res.status(200).json({
      success: true,
      message: "Event attendance fetched successfully",
      data: result,
    });
  },
);

export const saveAttendanceController = asyncHandler(
  async (req: Request, res: Response) => {
    const eventId = Number(req.params.eventId);
    const userId = res.locals.user.id as string;
    const isSuperAdmin = (res.locals.access as Access).isSuperAdmin;
    const { attendance } = req.body;

    const result = await saveAttendance(
      eventId,
      userId,
      attendance,
      isSuperAdmin,
    );

    return res.status(200).json({
      success: true,
      message: "Attendance saved successfully",
      data: result,
    });
  },
);
