
import type { Request, Response } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import {
  getActiveHod,
  getHodDashboardStats,
  getPendingEvents,
  reviewEvent,
  getHodStudents,
} from "./hod.service.js";




export const GetHodDashboard = asyncHandler(
  async (_req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const hod = await getActiveHod(user.id);

    if (!hod) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Active HOD permission required.",
      });
    }

    const stats = await getHodDashboardStats();

    return res.status(200).json({
      success: true,
      message: "HOD dashboard fetched successfully.",
      data: {
        staffId: hod.id,
        employeeId: hod.employeeId,
        role: hod.role,
        departmentId: hod.departmentId,
        designation: hod.designation,
        totalStudents: stats.totalStudents,
        totalStaff: stats.totalStaff,
        totalCoordinators: stats.totalCoordinators,
        pendingApprovals: stats.pendingApprovals,
      },
    });
  },
);

export const GetStudentsByDepartment = asyncHandler(
  async (req: Request, res: Response) => {
    const departmentId = req.query.departmentId
      ? Number(req.query.departmentId)
      : undefined;

    const semester = req.query.semester
      ? Number(req.query.semester)
      : undefined;

    const search = req.query.search
      ? String(req.query.search)
      : undefined;

    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const result = await getHodStudents(
      departmentId,
      semester,
      search,
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully.",
      data: result.students,
      pagination: result.pagination,
    });
  },
);










export const GetPendingEvents = asyncHandler(
  async (_req: Request, res: Response) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const hod = await getActiveHod(currentUser.id);

    if (!hod) {
      return res.status(403).json({
        success: false,
        message: "Only an active HOD can view pending events",
      });
    }

    const pendingEvents = await getPendingEvents();

    return res.status(200).json({
      success: true,
      message: "Pending events fetched successfully",
      data: pendingEvents,
    });
  },
);

export const ReviewEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const hod = await getActiveHod(currentUser.id);

    if (!hod) {
      return res.status(403).json({
        success: false,
        message: "Only an active HOD can review events",
      });
    }

    const eventId = Number(req.params.eventId);

    if (!Number.isSafeInteger(eventId) || eventId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const { decision, comments } = req.body ?? {};

    if (decision !== "approved" && decision !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "Decision must be approved or rejected",
      });
    }

    if (comments !== undefined && typeof comments !== "string") {
      return res.status(400).json({
        success: false,
        message: "Comments must be a string",
      });
    }

    const result = await reviewEvent(
      eventId,
      hod.id,
      decision,
      comments,
    );

    return res.status(200).json({
      success: true,
      message: `Event ${decision} successfully`,
      data: result,
    });
  },
);
