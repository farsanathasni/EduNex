
import type { Request, Response } from "express";
import { eq } from "drizzle-orm";

import asyncHandler from "../../middleware/asyncHandler.js";
import { studentService } from "./student.service.js";
import {
  createStudentProfileSchema,
  getStudentsSchema,
  updateStudentProfileSchema,
} from "./student.validation.js";
import { db } from "../../config/database.js";
import { departments } from "../../db/schema/others-schema.js";

export const CreateStudentProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    if (typeof user.name !== "string" || !user.name.trim()) {
      return res.status(400).json({
        success: false,
        message: "User name is required.",
      });
    }

    const validation = createStudentProfileSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { admissionNumber, departmentId, semester, phone } =
      validation.data;

    const [department] = await db
      .select({ id: departments.id })
      .from(departments)
      .where(eq(departments.id, Number(departmentId)))
      .limit(1);

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Selected department does not exist.",
      });
    }

    const result = await studentService.createProfile({
      userId: user.id,
      name: user.name.trim(),
      admissionNumber,
      departmentId: Number(departmentId),
      semester: Number(semester),
      phone: phone?.trim() || null,
    });

    if (result.alreadyExists) {
      return res.status(409).json({
        success: false,
        message: "Student profile already exists.",
        data: result.student,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Student profile created successfully.",
      data: result.student,
    });
  },
);

export const GetStudentProfile = asyncHandler(
  async (_req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const student = await studentService.getProfile(user.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student profile fetched successfully.",
      data: student,
    });
  },
);

export const GetStudents = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = getStudentsSchema.safeParse(req.query);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { departmentId, semester, search, page, limit } =
      validation.data;

    const result = await studentService.getStudents({
      departmentId,
      semester,
      search,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully.",
      data: result.students,
      pagination: result.pagination,
    });
  },
);

// Update a student's profile.
export const UpdateStudentProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId = Number(req.params.studentId);

    if (!Number.isSafeInteger(studentId) || studentId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID.",
      });
    }

    const validation = updateStudentProfileSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const data = validation.data;

    if (data.departmentId !== undefined) {
      const [department] = await db
        .select({ id: departments.id })
        .from(departments)
        .where(eq(departments.id, data.departmentId))
        .limit(1);

      if (!department) {
        return res.status(400).json({
          success: false,
          message: "Selected department does not exist.",
        });
      }
    }

    const student = await studentService.updateProfile(studentId, data);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully.",
      data: student,
    });
  },
);

// Soft-delete a student's profile.
export const DeleteStudentProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId = Number(req.params.studentId);

    if (!Number.isSafeInteger(studentId) || studentId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID.",
      });
    }

    const student = await studentService.softDelete(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found or already deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully.",
    });
  },
);


// Create a coordinator assignment and send the appointment email.
export const CreateCoordinator = asyncHandler(
  async (req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const studentId = Number(req.body.studentId);
    const clubId = Number(req.body.clubId);

    if (
      !Number.isSafeInteger(studentId) ||
      studentId <= 0 ||
      !Number.isSafeInteger(clubId) ||
      clubId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid student ID and club ID are required.",
      });
    }

    try {
      const result = await studentService.createCoordinator(
        studentId,
        clubId,
        user.id,
      );

      return res.status(201).json({
        success: true,
        message: result.emailSent
          ? "Coordinator assigned successfully. Appointment email sent."
          : "Coordinator assigned successfully, but the appointment email was not sent.",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "STUDENT_NOT_FOUND":
            return res.status(404).json({
              success: false,
              message: "Student not found.",
            });

          case "CLUB_NOT_FOUND":
            return res.status(404).json({
              success: false,
              message: "Club not found.",
            });

          case "COORDINATOR_ALREADY_ASSIGNED":
            return res.status(409).json({
              success: false,
              message: "This student is already assigned to this club.",
            });

          case "CLUB_COORDINATOR_ROLE_NOT_FOUND":
            return res.status(500).json({
              success: false,
              message: "Coordinator role is not configured.",
            });
        }
      }

      throw error;
    }
  },
);

// Get all coordinator assignments.
export const GetCoordinatorAssignments = asyncHandler(
  async (_req: Request, res: Response) => {
    const assignments =
      await studentService.getCoordinatorAssignments();

    return res.status(200).json({
      success: true,
      message: "Coordinator assignments fetched successfully.",
      data: assignments,
    });
  },
);

// Update a coordinator assignment.
export const UpdateCoordinator = asyncHandler(
  async (req: Request, res: Response) => {
    const assignmentId = Number(req.params.assignmentId);
    const studentId = Number(req.body.studentId);
    const clubId = Number(req.body.clubId);

    if (
      !Number.isSafeInteger(assignmentId) ||
      assignmentId <= 0 ||
      !Number.isSafeInteger(studentId) ||
      studentId <= 0 ||
      !Number.isSafeInteger(clubId) ||
      clubId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid assignment, student, and club IDs are required.",
      });
    }

    try {
      const assignment = await studentService.updateCoordinator(
        assignmentId,
        studentId,
        clubId,
      );

      return res.status(200).json({
        success: true,
        message: "Coordinator assignment updated successfully.",
        data: assignment,
      });
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "COORDINATOR_ASSIGNMENT_NOT_FOUND":
            return res.status(404).json({
              success: false,
              message: "Coordinator assignment not found.",
            });

          case "STUDENT_NOT_FOUND":
            return res.status(404).json({
              success: false,
              message: "Student not found.",
            });

          case "CLUB_NOT_FOUND":
            return res.status(404).json({
              success: false,
              message: "Club not found.",
            });

          case "COORDINATOR_ALREADY_ASSIGNED":
            return res.status(409).json({
              success: false,
              message: "This student is already assigned to this club.",
            });

          case "CLUB_COORDINATOR_ROLE_NOT_FOUND":
            return res.status(500).json({
              success: false,
              message: "Coordinator role is not configured.",
            });
        }
      }

      throw error;
    }
  },
);
