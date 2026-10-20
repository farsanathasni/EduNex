import { eq, and } from "drizzle-orm";
import { db } from "../../config/database.js";
import { staff } from "../../db/schema/staff-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import { name } from "nodemailer/lib/package-info.js";
import { departments } from "../../db/schema/others-schema.js";
import { user } from "../../db/schema/auth-schema.js";

export const getActiveHod = async (userId: string) => {
  const [hod] = await db
    .select()
    .from(staff)
    .where(
      and(
        eq(staff.userId, userId),
        eq(staff.role, "hod"),
        eq(staff.isActive, true)
      )
    )
    .limit(1);

  return hod ?? null;
};

export const getAllStudents = async (departmentId?: number) => {
  const query = db
    .select({
      id: StudentProfile.id,
      name: StudentProfile.name,
      admissionNumber: StudentProfile.admissionNumber,
      departmentId: StudentProfile.departmentId,
      departmentName: departments.name,
      semester: StudentProfile.semester,
      phone: StudentProfile.phone,
      userId: StudentProfile.userId,
      email: user.email,
    })
    .from(StudentProfile)
    .innerJoin(
      departments,
      eq(StudentProfile.departmentId, departments.id),
    )
    .innerJoin(user, eq(StudentProfile.userId, user.id));

  if (departmentId !== undefined) {
    return query.where(eq(StudentProfile.departmentId, departmentId));
  }

  return query;
};