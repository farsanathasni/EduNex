import { and, asc, count, eq, sql } from "drizzle-orm";

import { db } from "../../config/database.js";
import { staff } from "../../db/schema/staff-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import {
  classAttendance,
  classSessions,
  facultySubjects,
  subjects,
} from "../../db/schema/attendance-schema.js";

export const MIN_ATTENDANCE_PERCENT = 75;

export type AttendanceStatus = "present" | "absent" | "late";

type SaveAttendanceInput = {
  subjectId: number;
  date: string; // YYYY-MM-DD
  period: number;
  records: {
    studentId: number;
    status: AttendanceStatus;
    remark?: string | null;
  }[];
};

// Today's date (YYYY-MM-DD) in India, so "today" matches the college day.
const todayInIndia = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

// Logged-in faculty member.
async function getFacultyContext(userId: string) {
  const [faculty] = await db
    .select({
      id: staff.id,
      departmentId: staff.departmentId,
    })
    .from(staff)
    .where(
      and(
        eq(staff.userId, userId),
        eq(staff.role, "faculty"),
        eq(staff.isActive, true),
      ),
    )
    .limit(1);

  if (!faculty) throw new Error("TEACHER_NOT_FOUND");
  return faculty;
}

// A subject, only if it is assigned to this faculty member.
async function getAssignedSubject(staffId: string, subjectId: number) {
  const [subject] = await db
    .select({
      id: subjects.id,
      name: subjects.name,
      code: subjects.code,
      departmentId: subjects.departmentId,
      semester: subjects.semester,
    })
    .from(facultySubjects)
    .innerJoin(subjects, eq(facultySubjects.subjectId, subjects.id))
    .where(
      and(
        eq(facultySubjects.staffId, staffId),
        eq(subjects.id, subjectId),
      ),
    )
    .limit(1);

  if (!subject) throw new Error("SUBJECT_NOT_ASSIGNED");
  return subject;
}

// Subjects the faculty member teaches.
export async function getMySubjects(userId: string) {
  const faculty = await getFacultyContext(userId);

  return db
    .select({
      id: subjects.id,
      name: subjects.name,
      code: subjects.code,
      semester: subjects.semester,
    })
    .from(facultySubjects)
    .innerJoin(subjects, eq(facultySubjects.subjectId, subjects.id))
    .where(eq(facultySubjects.staffId, faculty.id))
    .orderBy(asc(subjects.semester), asc(subjects.name));
}

// Marking page data: every student in the class, with saved statuses
// (or "present" as the default when nothing is saved yet).
export async function getAttendanceRoster(
  userId: string,
  subjectId: number,
  date: string,
  period: number,
) {
  const faculty = await getFacultyContext(userId);
  const subject = await getAssignedSubject(faculty.id, subjectId);

  const students = await db
    .select({
      id: StudentProfile.id,
      name: StudentProfile.name,
      admissionNumber: StudentProfile.admissionNumber,
    })
    .from(StudentProfile)
    .where(
      and(
        eq(StudentProfile.departmentId, subject.departmentId),
        eq(StudentProfile.semester, subject.semester),
        eq(StudentProfile.isDeleted, false),
      ),
    )
    .orderBy(asc(StudentProfile.name));

  const [session] = await db
    .select({ id: classSessions.id })
    .from(classSessions)
    .where(
      and(
        eq(classSessions.subjectId, subjectId),
        eq(classSessions.sessionDate, date),
        eq(classSessions.period, period),
      ),
    )
    .limit(1);

  const saved = session
    ? await db
        .select({
          studentId: classAttendance.studentId,
          status: classAttendance.status,
          remark: classAttendance.remark,
        })
        .from(classAttendance)
        .where(eq(classAttendance.sessionId, session.id))
    : [];

  const savedByStudent = new Map(saved.map((row) => [row.studentId, row]));

  return {
    subject,
    date,
    period,
    alreadyMarked: Boolean(session),
    editable: date === todayInIndia(),
    students: students.map((student) => ({
      ...student,
      status: (savedByStudent.get(student.id)?.status ??
        "present") as AttendanceStatus,
      remark: savedByStudent.get(student.id)?.remark ?? null,
    })),
  };
}

// Save (create or update) attendance for one class session.
export async function saveAttendance(
  userId: string,
  input: SaveAttendanceInput,
) {
  const faculty = await getFacultyContext(userId);
  const subject = await getAssignedSubject(faculty.id, input.subjectId);

  // Only today can be marked or edited.
  const today = todayInIndia();
  if (input.date > today) throw new Error("FUTURE_DATE_NOT_ALLOWED");
  if (input.date < today) throw new Error("ATTENDANCE_LOCKED");

  // Every student must belong to this subject's class.
  const classStudents = await db
    .select({ id: StudentProfile.id })
    .from(StudentProfile)
    .where(
      and(
        eq(StudentProfile.departmentId, subject.departmentId),
        eq(StudentProfile.semester, subject.semester),
        eq(StudentProfile.isDeleted, false),
      ),
    );
  const allowedIds = new Set(classStudents.map((student) => student.id));

  if (input.records.some((record) => !allowedIds.has(record.studentId))) {
    throw new Error("STUDENT_NOT_IN_CLASS");
  }

  return db.transaction(async (tx) => {
    const [session] = await tx
      .insert(classSessions)
      .values({
        subjectId: input.subjectId,
        takenBy: faculty.id,
        sessionDate: input.date,
        period: input.period,
      })
      .onConflictDoUpdate({
        target: [
          classSessions.subjectId,
          classSessions.sessionDate,
          classSessions.period,
        ],
        set: { updatedAt: new Date().toISOString() },
      })
      .returning({ id: classSessions.id });

    if (input.records.length > 0) {
      await tx
        .insert(classAttendance)
        .values(
          input.records.map((record) => ({
            sessionId: session.id,
            studentId: record.studentId,
            status: record.status,
            remark: record.remark?.trim() || null,
          })),
        )
        .onConflictDoUpdate({
          target: [classAttendance.sessionId, classAttendance.studentId],
          set: {
            status: sql`excluded.status`,
            remark: sql`excluded.remark`,
            markedAt: sql`now()`,
          },
        });
    }

    return { sessionId: session.id, saved: input.records.length };
  });
}

// Student view: attendance per subject plus the overall percentage.
export async function getStudentAttendanceSummary(userId: string) {
  const [student] = await db
    .select({ id: StudentProfile.id })
    .from(StudentProfile)
    .where(
      and(
        eq(StudentProfile.userId, userId),
        eq(StudentProfile.isDeleted, false),
      ),
    )
    .limit(1);

  if (!student) throw new Error("STUDENT_NOT_FOUND");

  const rows = await db
    .select({
      subjectId: subjects.id,
      subjectName: subjects.name,
      subjectCode: subjects.code,
      total: count(),
      attended: sql<number>`count(*) filter (where ${classAttendance.status} in ('present', 'late'))`.mapWith(
        Number,
      ),
    })
    .from(classAttendance)
    .innerJoin(
      classSessions,
      eq(classAttendance.sessionId, classSessions.id),
    )
    .innerJoin(subjects, eq(classSessions.subjectId, subjects.id))
    .where(eq(classAttendance.studentId, student.id))
    .groupBy(subjects.id, subjects.name, subjects.code)
    .orderBy(asc(subjects.name));

  const percent = (attended: number, total: number) =>
    total === 0 ? 0 : Math.round((attended / total) * 1000) / 10;

  const subjectsSummary = rows.map((row) => ({
    ...row,
    percentage: percent(row.attended, row.total),
    belowMinimum: percent(row.attended, row.total) < MIN_ATTENDANCE_PERCENT,
  }));

  const totalClasses = rows.reduce((sum, row) => sum + row.total, 0);
  const totalAttended = rows.reduce((sum, row) => sum + row.attended, 0);

  return {
    minimumPercentage: MIN_ATTENDANCE_PERCENT,
    overall: {
      total: totalClasses,
      attended: totalAttended,
      percentage: percent(totalAttended, totalClasses),
    },
    subjects: subjectsSummary,
  };
}