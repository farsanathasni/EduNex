
import type { Request, Response } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import { studentService } from "./student.service.js";
import { createStudentProfileSchema } from "./student.validation.js";
import { db } from "../../config/database.js";
import { departments } from "../../db/schema/others.schema.js";
import { eq } from "drizzle-orm";

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

    // Zod validation
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

    // Check whether the department exists
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
  }
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
      message: "Student profile fetched successfully",
      data: student,
    });
  }
);
