
import { eq, and } from "drizzle-orm";
import { db } from "../../config/database.js";
import { staff } from "../../db/schema/staff-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import { departments } from "../../db/schema/others-schema.js";


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

export const getHodStudents = async (
  departmentId?: number,
  semester?: number
) => {
  const conditions = [];

  if (departmentId !== undefined) {
    conditions.push(eq(StudentProfile.departmentId, departmentId));
  }

  if (semester !== undefined) {
    conditions.push(eq(StudentProfile.semester, semester));
  }

  const query = db
    .select({
      id: StudentProfile.id,
      name: StudentProfile.name,
      admissionNumber: StudentProfile.admissionNumber,
      departmentId: StudentProfile.departmentId,
      departmentName: departments.name,
      departmentCode: departments.code,
      semester: StudentProfile.semester,
      phone: StudentProfile.phone,
    })
    .from(StudentProfile)
    .innerJoin(
      departments,
      eq(StudentProfile.departmentId, departments.id)
    );

  if (conditions.length > 0) {
    return query.where(and(...conditions));
  }

  return query;
};
