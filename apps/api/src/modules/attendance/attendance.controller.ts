import type { Request, Response } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import { isHod, resolveDepartmentScope, type Access } from "../rbac/rbac.access.js";
import { getEventAttendance, getHodAttendanceEvents, getStudentAttendance, saveAttendance } from "./attendance.service.js";
import { attendanceQuerySchema } from "./attendance.validation.js";



export const getEventAttendanceController = asyncHandler(
  async (req: Request, res: Response) => {
    const eventId = Number(req.params.eventId);
    const userId = res.locals.user.id as string;
    const isSuperAdmin = (res.locals.access as Access).isSuperAdmin;

    const query = attendanceQuerySchema.parse(req.query);

    const result = await getEventAttendance(
      eventId,
      userId,
      isSuperAdmin,
      query,
    );

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


export const getStudentAttendanceController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user.id as string;

    const result = await getStudentAttendance(userId);

    return res.status(200).json({
      success: true,
      message: "Student attendance fetched successfully",
      data: result,
    });
  },
);



export const GetHodAttendanceEvents = asyncHandler(
  async (_req: Request, res: Response) => {
    const access = res.locals.access as Access;

    if (!access.isSuperAdmin && !isHod(access)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view attendance reports.",
      });
    }

    let departmentId: number | undefined;

    // Super Admin (Principal) can view events from every department.
    if (!access.isSuperAdmin) {
      const scope = await resolveDepartmentScope(access);

      if (!scope) {
        return res.status(403).json({
          success: false,
          message: "Department access not available.",
        });
      }

      departmentId =
        scope.kind === "department" ? scope.departmentId : undefined;
    }

const query = attendanceQuerySchema.parse(_req.query);

const result = await getHodAttendanceEvents(
  departmentId,
  query,
);
    return res.status(200).json({
      success: true,
      message: access.isSuperAdmin
        ? "All college events fetched successfully."
        : "Department events fetched successfully.",
      data: result,
    });
  },
);


