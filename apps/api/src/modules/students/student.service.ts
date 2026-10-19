import { eq } from "drizzle-orm";
import { StudentProfile } from "../../db/schema/student-profile.js";
import { db } from "../../config/database.js";

interface CreateStudentProfileInput {
  userId: string;
  name: string;
  admissionNumber: string;
  departmentId: number | null;
  semester: number | null;
  phone: string | null;
}

export const studentService = {
  async createProfile(input: CreateStudentProfileInput) {
    const [existingProfile] = await db
      .select()
      .from(StudentProfile)
      .where(eq(StudentProfile.userId, input.userId))
      .limit(1);

    if (existingProfile) {
      return {
        alreadyExists: true,
        student: existingProfile,
      };
    }

    const [student] = await db
      .insert(StudentProfile)
      .values({
        userId: input.userId,
        name: input.name,
        admissionNumber: input.admissionNumber,
        departmentId: input.departmentId,
        semester: input.semester,
        phone: input.phone,
      })
      .returning();

    return {
      alreadyExists: false,
      student,
    };
  },

  async getProfile(userId: string) {
    const [student] = await db
      .select()
      .from(StudentProfile)
      .where(eq(StudentProfile.userId, userId))
      .limit(1);

    return student ?? null;
  },
};