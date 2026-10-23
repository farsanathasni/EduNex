
import { and, eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { StudentProfile } from "../../db/schema/student-profile.js";

type CreateStudentProfileData = {
  userId: string;
  name: string;
  admissionNumber: string;
  departmentId: number;
  semester: number;
  phone: string | null;
};

type UpdateStudentProfileData = {
  name: string;
  admissionNumber: string;
  departmentId: number;
  semester: number;
  phone: string | null;
};

export const studentService = {
  // Create a student profile
  createProfile: async (data: CreateStudentProfileData) => {
    const [existingStudent] = await db
      .select()
      .from(StudentProfile)
      .where(eq(StudentProfile.userId, data.userId))
      .limit(1);

    if (existingStudent) {
      return {
        alreadyExists: true,
        student: existingStudent,
      };
    }

    const [student] = await db
      .insert(StudentProfile)
      .values({
        userId: data.userId,
        name: data.name,
        admissionNumber: data.admissionNumber,
        departmentId: data.departmentId,
        semester: data.semester,
        phone: data.phone,
      })
      .returning();

    return {
      alreadyExists: false,
      student,
    };
  },

  // Get the logged-in student's active profile
  getProfile: async (userId: string) => {
    const [student] = await db
      .select()
      .from(StudentProfile)
      .where(
        and(
          eq(StudentProfile.userId, userId),
          eq(StudentProfile.isActive, true),
        ),
      )
      .limit(1);

    return student ?? null;
  },

  // Update an active student profile
  updateProfile: async (
    studentId: number,
    data: UpdateStudentProfileData,
    departmentId: number,
  ) => {
    const [student] = await db
      .update(StudentProfile)
      .set({
        name: data.name,
        admissionNumber: data.admissionNumber,
        departmentId: data.departmentId,
        semester: data.semester,
        phone: data.phone,
      })
      .where(
        and(
          eq(StudentProfile.id, studentId),
          eq(StudentProfile.departmentId, departmentId),
          eq(StudentProfile.isActive, true),
        ),
      )
      .returning();

    return student ?? null;
  },

  // Soft-delete a student profile
  deleteProfile: async (studentId: number, departmentId: number) => {
    const [student] = await db
      .update(StudentProfile)
      .set({
        isActive: false,
        deletedAt: new Date(),
      })
      .where(
        and(
          eq(StudentProfile.id, studentId),
          eq(StudentProfile.departmentId, departmentId),
          eq(StudentProfile.isActive, true),
        ),
      )
      .returning();

    return student ?? null;
  },
};
