import type { Request, Response } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import {
  getActiveHod,
  getHodDashboardStats,
  getHodStudents,
  createCoordinator,
  getCoordinatorAssignments,
  getPendingEvents,
  reviewEvent
} from "./hod.service.js";
import { getHodStudentsSchema , createCoordinatorSchema } from "./hod.validation.js";

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

    const stats = await getHodDashboardStats()

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

export const GetHodStudents = asyncHandler(
  async (req: Request, res: Response) => {
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

    if (hod.departmentId === null) {
      return res.status(400).json({
        success: false,
        message: "No department is assigned to this HOD.",
      });
    }

    // Validate the semester query parameter.
    const validation = getHodStudentsSchema.safeParse(req.query);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters.",
        errors: validation.error.flatten(),
      });
    }

    // Read and validate the optional department filter.
    const departmentIdParam = req.query.departmentId;
    let departmentId: number | undefined;

    if (departmentIdParam !== undefined) {
      if (
        typeof departmentIdParam !== "string" ||
        !/^\d+$/.test(departmentIdParam) ||
        !Number.isSafeInteger(Number(departmentIdParam)) ||
        Number(departmentIdParam) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid department ID.",
        });
      }

      departmentId = Number(departmentIdParam);
    }

    const semester =
      validation.data.semester === undefined
        ? undefined
        : Number(validation.data.semester);

    // Apply both filters when provided.
    const students = await getHodStudents(
      departmentId,
      semester,
    );

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully.",
      data: students,
    });
  },
);

// Keep this export if the router from the other branch uses this name.
export const GetStudentsByDepartment = GetHodStudents;






export const CreateCoordinator = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Please log in.",
      });
    }

    const hod = await getActiveHod(currentUser.id);

    if (!hod) {
      return res.status(403).json({
        success: false,
        message: "Active HOD permission required.",
      });
    }

    const validation = createCoordinatorSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinator details.",
        errors: validation.error.flatten(),
      });
    }

    try {
      const result = await createCoordinator(
        validation.data.studentId,
        validation.data.clubId,
        currentUser.id,
      );

      return res.status(201).json({
        success: true,
        message: result.emailSent
          ? "Coordinator appointed successfully. Confirmation email sent."
          : "Coordinator appointed successfully, but the confirmation email could not be sent.",
        data: result.assignment,
        emailSent: result.emailSent,
      });
    } catch (error) {
      if (error instanceof Error) {
        const messages: Record<string, string> = {
          STUDENT_NOT_FOUND: "Student not found.",
          CLUB_NOT_FOUND: "Club not found.",
          COORDINATOR_ALREADY_ASSIGNED:
            "This student is already assigned to this club.",
        };

        if (messages[error.message]) {
          return res.status(400).json({
            success: false,
            message: messages[error.message],
          });
        }
      }

      throw error;
    }
  },
);



export const GetCoordinatorAssignments = asyncHandler(
  async (_req: Request, res: Response) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Please log in.",
      });
    }

    const hod = await getActiveHod(currentUser.id);

    if (!hod) {
      return res.status(403).json({
        success: false,
        message: "Active HOD permission required.",
      });
    }

    const data = await getCoordinatorAssignments();

    return res.status(200).json({
      success: true,
      message: "Coordinator assignments fetched successfully.",
      data,
    });
  },
);

// Get events waiting for HOD approval
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

// Approve or reject an event
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
