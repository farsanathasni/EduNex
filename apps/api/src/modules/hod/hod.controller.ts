import type { Request, Response } from "express";

import asyncHandler from "../../middleware/asyncHandler.js";
import {
  getHodDashboardStats,
  getPendingEvents,
  reviewEvent,
  getHodStudents,
  getHodClubs,
  getStaffByUserId,
} from "./hod.service.js";
import {
  resolveDepartmentScope,
  type Access,
} from "../rbac/rbac.access.js";
import { createClub } from "../clubs/clubs.service.js";
import { createHodClubSchema } from "../clubs/clubs.validation.js";

// Validate pagination parameters.
const getPaginationParams = (req: Request) => {
  const page =
    req.query.page === undefined ? 1 : Number(req.query.page);

  const limit =
    req.query.limit === undefined ? 50 : Number(req.query.limit);

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

// Permission middleware (rbac) already decided WHAT the caller may do.
// This decides WHICH department's data they may touch:
//   Super Admin -> every department (departmentId undefined)
//   HOD / staff -> their own department only
// Sends the 403 itself and returns null when no scope applies.
const getScope = async (res: Response) => {
  const scope = await resolveDepartmentScope(
    res.locals.access as Access,
  );

  if (!scope) {
    res.status(403).json({
      success: false,
      message: "No department is assigned to your account.",
    });
    return null;
  }

  return {
    scope,
    departmentId:
      scope.kind === "department" ? scope.departmentId : undefined,
  };
};

// HOD dashboard (also used by the Super Admin, across all departments).

export const GetHodDashboard = asyncHandler(
  async (_req: Request, res: Response) => {
    const resolved = await getScope(res);
    if (!resolved) return;

    const staffRow = await getStaffByUserId(res.locals.user.id);

    const stats = await getHodDashboardStats(
      resolved.departmentId,
    );

    return res.status(200).json({
      success: true,
      message: "HOD dashboard fetched successfully.",
      data: {
        staffId: staffRow?.id ?? null,
        employeeId: staffRow?.employeeId ?? null,
        role: staffRow?.role ?? null,

        departmentId: staffRow?.departmentId ?? null,

        // Added department details
        department: stats.department,

        designation: staffRow?.designation ?? null,

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
    const resolved = await getScope(res);
    if (!resolved) return;

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

    const access = res.locals.access as Access;

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

    // Super Admin may choose any department. HOD and other scoped staff are
    // always restricted to their assigned department.
    if (
      !access.isSuperAdmin &&
      resolved.departmentId !== undefined &&
      requestedDepartmentId !== undefined &&
      requestedDepartmentId !== resolved.departmentId
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
      access.isSuperAdmin ? requestedDepartmentId : resolved.departmentId,
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
    const resolved = await getScope(res);
    if (!resolved) return;

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
      resolved.departmentId,
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

// Create a club in the authenticated HOD's department. Any departmentId in
// the request body is ignored; only the server-resolved scope is used.
export const CreateHodClub = asyncHandler(
  async (req: Request, res: Response) => {
    const resolved = await getScope(res);
    if (!resolved) return;

    if (resolved.departmentId === undefined) {
      return res.status(403).json({
        success: false,
        message: "Only an HOD assigned to a department can create clubs here.",
      });
    }

    const validation = createHodClubSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid club details.",
        errors: validation.error.flatten(),
      });
    }

    const { name, description } = validation.data;

    const club = await createClub(
      name,
      description,
      resolved.departmentId,
    );

    return res.status(201).json({
      success: true,
      message: "Club created successfully.",
      data: club,
    });
  },
);

// Get pending events with search and pagination.
export const GetPendingEvents = asyncHandler(
  async (req: Request, res: Response) => {
    const resolved = await getScope(res);
    if (!resolved) return;

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
      resolved.departmentId,
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
    const resolved = await getScope(res);
    if (!resolved) return;

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

    const access = res.locals.access as Access;
    const staffRow = await getStaffByUserId(res.locals.user.id);

    let result;

    try {
      result = await reviewEvent(
        eventId,
        // Keep recording the staff id when there is one (as before).
        staffRow?.id ?? res.locals.user.id,
        resolved.departmentId,
        decision,
        comments,
        access.isSuperAdmin ? "admin" : "hod",
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
