import { eq, and } from "drizzle-orm";
import { db } from "../../config/database.js";
import { staff } from "../../db/schema/staff-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import { departments, clubs } from "../../db/schema/others-schema.js";
import { user } from "../../db/schema/auth-schema.js";
import { coordinatorAssignments } from "../../db/schema/coordinator-schema.js";



export const getActiveHod = async (userId: string) => {
  const [hod] = await db
    .select()
    .from(staff)
    .where(
      and(
        eq(staff.userId, userId),
        eq(staff.role, "hod"),
        eq(staff.isActive, true),
      ),
    )
    .limit(1);

  return hod ?? null;
};

export const getHodStudents = async (
  departmentId?: number,
  semester?: number,
) => {
  const conditions = [];

  // Apply the department filter when one is selected.
  if (departmentId !== undefined) {
    conditions.push(eq(StudentProfile.departmentId, departmentId));
  }

  // Apply the semester filter when one is selected.
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
      userId: StudentProfile.userId,
      email: user.email,
    })
    .from(StudentProfile)
    .innerJoin(
      departments,
      eq(StudentProfile.departmentId, departments.id),
    )
    .innerJoin(
      user,
      eq(StudentProfile.userId, user.id),
    );

  // AND means students must match every selected filter.
  if (conditions.length > 0) {
    return query.where(and(...conditions));
  }

  // If neither filter is selected, return all students.
  return query;
};


export const getHodClubs = async () => {
  return db
    .select({
      id: clubs.id,
      name: clubs.name,
      departmentId: clubs.departmentId,
    })
    .from(clubs);
};

export const createCoordinator = async (
  studentId: number,
  clubId: number,
  appointedBy: string,
) => {
  const [student] = await db
    .select({ id: StudentProfile.id })
    .from(StudentProfile)
    .where(eq(StudentProfile.id, studentId))
    .limit(1);

  if (!student) {
    throw new Error("STUDENT_NOT_FOUND");
  }

  const [club] = await db
    .select({ id: clubs.id })
    .from(clubs)
    .where(eq(clubs.id, clubId))
    .limit(1);

  if (!club) {
    throw new Error("CLUB_NOT_FOUND");
  }

  const [existing] = await db
    .select({ id: coordinatorAssignments.id })
    .from(coordinatorAssignments)
    .where(
      and(
        eq(coordinatorAssignments.studentId, studentId),
        eq(coordinatorAssignments.clubId, clubId),
      ),
    )
    .limit(1);

  if (existing) {
    throw new Error("COORDINATOR_ALREADY_ASSIGNED");
  }

  const [assignment] = await db
    .insert(coordinatorAssignments)
    .values({
      studentId,
      clubId,
      appointedBy,
    })
    .returning();

  return assignment;
};

export const getCoordinatorAssignments = async () => {
  return db
    .select({
      id: coordinatorAssignments.id,
      studentId: StudentProfile.id,
      studentName: StudentProfile.name,
      admissionNumber: StudentProfile.admissionNumber,
      clubId: clubs.id,
      clubName: clubs.name,
      appointedBy: coordinatorAssignments.appointedBy,
      createdAt: coordinatorAssignments.createdAt,
    })
    .from(coordinatorAssignments)
    .innerJoin(
      StudentProfile,
      eq(coordinatorAssignments.studentId, StudentProfile.id),
    )
    .innerJoin(
      clubs,
      eq(coordinatorAssignments.clubId, clubs.id),
    );
};
