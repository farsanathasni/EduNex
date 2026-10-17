import type { Request, Response } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import { getActivePrincipal } from "./principal.service.js";

export const GetPrincipalDashboard = asyncHandler(
  async (_req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const principal = await getActivePrincipal(user.id);

    if (!principal) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Active Principal permission required.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Principal dashboard fetched successfully.",
      data: {
        staffId: principal.id,
        employeeId: principal.employeeId,
        role: principal.role,
        designation: principal.designation,
      },
    });
  }
);