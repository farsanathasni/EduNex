
import type { Request, Response } from "express";
import { and, eq } from "drizzle-orm";

import asyncHandler from "../../middleware/asyncHandler.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { studentService } from "./student.service.js";
import {
  createStudentProfileSchema,
  updateStudentProfileSchema,
} from "./student.validation.js";
import { db } from "../../config/database.js";
import { departments } from "../../db/schema/others-schema.js";
import { staff } from "../../db/schema/staff-schema.js";

const getActiveStaff = async (userId: string) => {
  const [staffMember] = await db
    .select()
    .from(staff)
    .where(
      and(
        eq(staff.userId, userId),
        eq(staff.isActive, true),
      ),
    )
    .limit(1);

  return staffMember ?? null;
};

// Create the logged-in student's profile
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
      });
    }

    return res.status(201).json({
      success: true,
      message: "Student profile created successfully.",
      data: result.student,
    });
  },
);

// Get the logged-in student's active profile
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
        message: "Active student profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student profile fetched successfully.",
      data: student,
    });
  },
);

// Edit a student profile — faculty and HOD only
export const UpdateStudentProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const staffMember = await getActiveStaff(user.id);

    if (
      !staffMember ||
      (staffMember.role !== "faculty" && staffMember.role !== "hod")
    ) {
      return res.status(403).json({
        success: false,
        message: "Only active faculty members and HODs can edit students.",
      });
    }

    if (staffMember.departmentId === null) {
      return res.status(403).json({
        success: false,
        message: "Your staff account has no assigned department.",
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

    const studentId = Number(req.params.studentId);

    if (!Number.isSafeInteger(studentId) || studentId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID.",
      });
    }

    const data = validation.data;

    // Staff cannot move students into another department.
    if (Number(data.departmentId) !== staffMember.departmentId) {
      return res.status(403).json({
        success: false,
        message: "You can only manage students in your own department.",
      });
    }

    const [department] = await db
      .select({ id: departments.id })
      .from(departments)
      .where(eq(departments.id, Number(data.departmentId)))
      .limit(1);

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Selected department does not exist.",
      });
    }

    const student = await studentService.updateProfile(
      studentId,
      {
        name: data.name.trim(),
        admissionNumber: data.admissionNumber.trim(),
        departmentId: Number(data.departmentId),
        semester: Number(data.semester),
        phone: data.phone?.trim() || null,
      },
      staffMember.departmentId,
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Active student not found in your department.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student profile updated successfully.",
      data: student,
    });
  },
);

// Soft-delete a student profile — faculty and HOD only
export const DeleteStudentProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const staffMember = await getActiveStaff(user.id);

    if (
      !staffMember ||
      (staffMember.role !== "faculty" && staffMember.role !== "hod")
    ) {
      return res.status(403).json({
        success: false,
        message: "Only active faculty members and HODs can delete students.",
      });
    }

    if (staffMember.departmentId === null) {
      return res.status(403).json({
        success: false,
        message: "Your staff account has no assigned department.",
      });
    }

    const studentId = Number(req.params.studentId);

    if (!Number.isSafeInteger(studentId) || studentId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID.",
      });
    }

    const student = await studentService.deleteProfile(
      studentId,
      staffMember.departmentId,
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Active student not found in your department.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student profile soft-deleted successfully.",
    });
  },
);
