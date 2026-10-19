
import { eq } from "drizzle-orm";
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

export const studentService = {
  createProfile: async (data: CreateStudentProfileData) => {
    const existingStudent = await db
      .select()
      .from(StudentProfile)
      .where(eq(StudentProfile.userId, data.userId))
      .limit(1);

    if (existingStudent.length > 0) {
      return {
        alreadyExists: true,
        student: existingStudent[0],
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

  getProfile: async (userId: string) => {
    const [student] = await db
      .select()
      .from(StudentProfile)
      .where(eq(StudentProfile.userId, userId))
      .limit(1);

    return student ?? null;
  },
};
