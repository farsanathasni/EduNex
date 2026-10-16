import type { Request, Response } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import { getActiveHod } from "./hod.service.js";

export const GetHodDashboard = asyncHandler(
  async (_req: Request, res: Response) => {
    // Get authenticated user from Better Auth session
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    // Check whether the user is an active HOD
    const hod = await getActiveHod(user.id);

    if (!hod) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Active HOD permission required.",
      });
    }

    // Return HOD dashboard information
    return res.status(200).json({
      success: true,
      message: "HOD dashboard fetched successfully.",
      data: {
        staffId: hod.id,
        employeeId: hod.employeeId,
        role: hod.role,
        departmentId: hod.departmentId,
        designation: hod.designation,
      },
    });
  }
);