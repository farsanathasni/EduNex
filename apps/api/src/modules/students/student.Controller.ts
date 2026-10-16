
import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import asyncHandler from "../../middleware/asyncHandler.js";
import { db } from "../../config/database.js";
import { StudentProfile } from "../../db/schema/student-profile.js";

export const CreateStudentProfile = asyncHandler(
  async (req: Request, res: Response) => {
    // Get authenticated user from Better Auth session
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const userId = user.id;
    const name = user.name;
    const {
      admissionNumber,
      departmentId,
      semester,
      phone,
    } = req.body;

    // Validate required fields
    if (!name || !admissionNumber) {
      return res.status(400).json({
        success: false,
        message: "Name and admission number are required.",
      });
    }

    // Check whether this user already has a profile
    const [existingProfile] = await db
      .select()
      .from(StudentProfile)
      .where(eq(StudentProfile.userId, userId))
      .limit(1);

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Student profile already exists.",
        data: existingProfile,
      });
    }

    // Create the student profile
    const [student] = await db
      .insert(StudentProfile)
      .values({
        userId,
        name,
        admissionNumber,
        departmentId: departmentId ?? null,
        semester: semester ?? null,
        phone: phone ?? null,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Student profile created successfully.",
      data: student,
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

    const [student] = await db
      .select()
      .from(StudentProfile)
      .where(eq(StudentProfile.userId, user.id))
      .limit(1);

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
  }
);
