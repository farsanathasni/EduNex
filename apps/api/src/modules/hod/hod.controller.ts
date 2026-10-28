
import type { Request, Response } from "express";

import asyncHandler from "../../middleware/asyncHandler.js";
import {
  getActiveHod,
  getHodDashboardStats,
  getPendingEvents,
  reviewEvent,
  getHodStudents,
  getHodClubs,
} from "./hod.service.js";

// Validate pagination parameters.
const getPaginationParams = (req: Request) => {
  const page =
    req.query.page === undefined ? 1 : Number(req.query.page);

  const limit =
    req.query.limit === undefined ? 10 : Number(req.query.limit);

  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    !Number.isSafeInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    return null;
  }

  return { page, limit };
};

// HOD dashboard.
export const GetHodDashboard = asyncHandler(
  async (_req: Request, res: Response) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const hod = await getActiveHod(currentUser.id);

    if (!hod) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Active HOD permission required.",
      });
    }

    // Fetch statistics for this HOD's department only.
    const stats = await getHodDashboardStats(hod.departmentId);

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

// Get students with department filtering, search, and pagination.
export const GetStudentsByDepartment = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const hod = await getActiveHod(currentUser.id);

    if (!hod) {
      return res.status(403).json({
        success: false,
        message: "Only an active HOD can view students.",
      });
    }

    const pagination = getPaginationParams(req);

    if (!pagination) {
      return res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be between 1 and 100.",
      });
    }

    const requestedDepartmentId =
      req.query.departmentId === undefined
        ? undefined
        : Number(req.query.departmentId);

    if (
      requestedDepartmentId !== undefined &&
      (!Number.isSafeInteger(requestedDepartmentId) ||
        requestedDepartmentId <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID.",
      });
    }

    // HODs can only view students in their own department.
    if (
      requestedDepartmentId !== undefined &&
      requestedDepartmentId !== hod.departmentId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only view students in your own department.",
      });
    }

    const semester =
      req.query.semester === undefined
        ? undefined
        : Number(req.query.semester);

    if (
      semester !== undefined &&
      (!Number.isSafeInteger(semester) ||
        semester < 1 ||
        semester > 8)
    ) {
      return res.status(400).json({
        success: false,
        message: "Semester must be between 1 and 8.",
      });
    }

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const result = await getHodStudents(
      hod.departmentId,
      semester,
      search,
      pagination.page,
      pagination.limit,
    );

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully.",
      data: result.students,
      pagination: result.pagination,
    });
  },
);

// Get clubs with search and pagination.
export const GetHodClubs = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const hod = await getActiveHod(currentUser.id);

    if (!hod) {
      return res.status(403).json({
        success: false,
        message: "Only an active HOD can view clubs.",
      });
    }

    const pagination = getPaginationParams(req);

    if (!pagination) {
      return res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be between 1 and 100.",
      });
    }

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const result = await getHodClubs(
      hod.departmentId,
      search,
      pagination.page,
      pagination.limit,
    );

    return res.status(200).json({
      success: true,
      message: "Clubs fetched successfully.",
      data: result.clubs,
      pagination: result.pagination,
    });
  },
);

// Get pending events with search and pagination.
export const GetPendingEvents = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const hod = await getActiveHod(currentUser.id);

    if (!hod) {
      return res.status(403).json({
        success: false,
        message: "Only an active HOD can view pending events.",
      });
    }

    const pagination = getPaginationParams(req);

    if (!pagination) {
      return res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be between 1 and 100.",
      });
    }

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const result = await getPendingEvents(
      hod.departmentId,
      search,
      pagination.page,
      pagination.limit,
    );

    return res.status(200).json({
      success: true,
      message: "Pending events fetched successfully.",
      data: result.events,
      pagination: result.pagination,
    });
  },
);

// Approve or reject a pending event.
export const ReviewEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const hod = await getActiveHod(currentUser.id);

    if (!hod) {
      return res.status(403).json({
        success: false,
        message: "Only an active HOD can review events.",
      });
    }

    const eventId = Number(req.params.eventId);

    if (!Number.isSafeInteger(eventId) || eventId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    const { decision, comments } = req.body ?? {};

    if (decision !== "approved" && decision !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "Decision must be approved or rejected.",
      });
    }

    if (
      comments !== undefined &&
      typeof comments !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Comments must be a string.",
      });
    }

    let result;

    try {
      result = await reviewEvent(
        eventId,
        hod.id,
        hod.departmentId,
        decision,
        comments,
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "EVENT_NOT_PENDING_OR_FORBIDDEN"
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Event not found, not pending, or not accessible to your department.",
        });
      }

      throw error;
    }

    return res.status(200).json({
      success: true,
      message: `Event ${decision} successfully.`,
      data: result,
    });
  },
);
