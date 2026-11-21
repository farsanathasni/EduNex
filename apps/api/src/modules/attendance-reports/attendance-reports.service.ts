import {
  and,
  asc,
  count,
  countDistinct,
  eq,
  gte,
  ilike,
  lte,
  or,
  sql,
  type SQL,
} from "drizzle-orm";

import { db } from "../../config/database.js";
import {
  classAttendance,
  classSessions,
  subjects,
} from "../../db/schema/attendance-schema.js";
import { departments } from "../../db/schema/others-schema.js";
import { staff } from "../../db/schema/staff-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import { hasRole, type Access } from "../rbac/rbac.access.js";
import type {
  OverviewQuery,
  StudentsQuery,
  SubjectsQuery,
} from "./attendance-reports.validation.js";

export const MIN_ATTENDANCE_PERCENT = 75;

type DepartmentScope =
  | { kind: "all" }
  | { kind: "department"; departmentId: number };

type AttendanceFilters = {
  semester?: number;
  subjectId?: number;
  from?: string;
  to?: string;
};

type StudentStatsRow = {
  studentId: number;
  name: string;
  admissionNumber: string;
  departmentId: number;
  departmentName: string;
  semester: number;
  attended: number;
  total: number;
  percentage: number;
  belowThreshold: boolean;
};

const roundPercentage = (value: number) => Math.round(value * 100) / 100;

const attendedExpression = sql<number>`
  count(*) filter (where ${classAttendance.status} in ('present', 'late'))
`
  .mapWith(Number)
  .as("attended");

const percentageExpression = sql<number>`
  round(
    coalesce(
      (count(*) filter (where ${classAttendance.status} in ('present', 'late')))::numeric
        * 100 / nullif(count(*), 0),
      0
    ),
    2
  )
`
  .mapWith(Number)
  .as("percentage");

export async function resolveReportScope(
  access: Access,
  requestedDepartmentId?: number,
): Promise<DepartmentScope> {
  const [staffRow] = await db
    .select({ role: staff.role, departmentId: staff.departmentId })
    .from(staff)
    .where(eq(staff.userId, access.userId))
    .limit(1);

  const isPrincipal =
    access.isSuperAdmin ||
    hasRole(access, "principal") ||
    staffRow?.role === "principal";

  if (isPrincipal) {
    if (requestedDepartmentId === undefined) return { kind: "all" };

    const [department] = await db
      .select({ id: departments.id })
      .from(departments)
      .where(eq(departments.id, requestedDepartmentId))
      .limit(1);

    if (!department) throw new Error("REPORT_DEPARTMENT_NOT_FOUND");
    return { kind: "department", departmentId: requestedDepartmentId };
  }

  const isHod = hasRole(access, "hod") || staffRow?.role === "hod";
  if (!isHod) throw new Error("REPORT_SCOPE_NOT_FOUND");
  if (!staffRow?.departmentId) throw new Error("REPORT_DEPARTMENT_NOT_ASSIGNED");
  if (
    requestedDepartmentId !== undefined &&
    requestedDepartmentId !== staffRow.departmentId
  ) {
    throw new Error("REPORT_DEPARTMENT_FORBIDDEN");
  }

  return { kind: "department", departmentId: staffRow.departmentId };
}

async function assertSubjectInScope(
  scope: DepartmentScope,
  subjectId?: number,
) {
  if (subjectId === undefined) return;

  const conditions: SQL[] = [eq(subjects.id, subjectId)];
  if (scope.kind === "department") {
    conditions.push(eq(subjects.departmentId, scope.departmentId));
  }

  const [subject] = await db
    .select({ id: subjects.id })
    .from(subjects)
    .where(and(...conditions))
    .limit(1);

  if (!subject) throw new Error("REPORT_SUBJECT_FORBIDDEN");
}

function attendanceConditions(
  scope: DepartmentScope,
  filters: AttendanceFilters,
  studentId?: number,
): SQL[] {
  const conditions: SQL[] = [];

  if (scope.kind === "department") {
    conditions.push(eq(subjects.departmentId, scope.departmentId));
  }
  if (filters.semester !== undefined) {
    conditions.push(eq(subjects.semester, filters.semester));
  }
  if (filters.subjectId !== undefined) {
    conditions.push(eq(subjects.id, filters.subjectId));
  }
  if (filters.from) conditions.push(gte(classSessions.sessionDate, filters.from));
  if (filters.to) conditions.push(lte(classSessions.sessionDate, filters.to));
  if (studentId !== undefined) {
    conditions.push(eq(classAttendance.studentId, studentId));
  }

  return conditions;
}

function buildStudentStats(
  scope: DepartmentScope,
  filters: AttendanceFilters,
  studentId?: number,
) {
  return db
    .select({
      studentId: classAttendance.studentId,
      attended: attendedExpression,
      total: count().mapWith(Number).as("total"),
      percentage: percentageExpression,
    })
    .from(classAttendance)
    .innerJoin(classSessions, eq(classAttendance.sessionId, classSessions.id))
    .innerJoin(subjects, eq(classSessions.subjectId, subjects.id))
    .where(and(...attendanceConditions(scope, filters, studentId)))
    .groupBy(classAttendance.studentId)
    .as("attendance_stats");
}

async function fetchStudentStats(
  scope: DepartmentScope,
  filters: AttendanceFilters,
  options: {
    search?: string;
    belowThreshold?: boolean;
    studentId?: number;
  } = {},
): Promise<StudentStatsRow[]> {
  const stats = buildStudentStats(scope, filters, options.studentId);
  const conditions: SQL[] = [eq(StudentProfile.isDeleted, false)];

  if (scope.kind === "department") {
    conditions.push(eq(StudentProfile.departmentId, scope.departmentId));
  }
  if (filters.semester !== undefined) {
    conditions.push(eq(StudentProfile.semester, filters.semester));
  }
  if (options.search?.trim()) {
    const term = `%${options.search.trim()}%`;
    const searchCondition = or(
      ilike(StudentProfile.name, term),
      ilike(StudentProfile.admissionNumber, term),
    );
    if (searchCondition) conditions.push(searchCondition);
  }
  if (filters.subjectId !== undefined || filters.from || filters.to) {
    conditions.push(sql`coalesce(${stats.total}, 0) > 0`);
  }
  if (options.belowThreshold) {
    conditions.push(sql`coalesce(${stats.total}, 0) > 0`);
    conditions.push(
      sql`coalesce(${stats.percentage}, 0) < ${MIN_ATTENDANCE_PERCENT}`,
    );
  }
  if (options.studentId !== undefined) {
    conditions.push(eq(StudentProfile.id, options.studentId));
  }

  const rows = await db
    .select({
      studentId: StudentProfile.id,
      name: StudentProfile.name,
      admissionNumber: StudentProfile.admissionNumber,
      departmentId: StudentProfile.departmentId,
      departmentName: departments.name,
      semester: StudentProfile.semester,
      attended: sql<number>`coalesce(${stats.attended}, 0)`.mapWith(Number),
      total: sql<number>`coalesce(${stats.total}, 0)`.mapWith(Number),
      percentage: sql<number>`coalesce(${stats.percentage}, 0)`.mapWith(Number),
    })
    .from(StudentProfile)
    .innerJoin(departments, eq(StudentProfile.departmentId, departments.id))
    .leftJoin(stats, eq(StudentProfile.id, stats.studentId))
    .where(and(...conditions));

  return rows.map((row) => ({
    ...row,
    belowThreshold: row.total > 0 && row.percentage < MIN_ATTENDANCE_PERCENT,
  }));
}

function sortStudentRows(
  rows: StudentStatsRow[],
  sort: StudentsQuery["sort"],
  order: StudentsQuery["order"],
) {
  const direction = order === "asc" ? 1 : -1;

  return [...rows].sort((a, b) => {
    let result = 0;
    if (sort === "name") {
      result = a.name.localeCompare(b.name);
    } else if (sort === "admissionNumber") {
      result = a.admissionNumber.localeCompare(b.admissionNumber);
    } else {
      result = a.percentage - b.percentage;
    }

    if (result === 0) result = a.studentId - b.studentId;
    return result * direction;
  });
}

export async function getOverview(access: Access, query: OverviewQuery) {
  const scope = await resolveReportScope(access, query.departmentId);
  const rows = await fetchStudentStats(scope, { semester: query.semester });

  const attended = rows.reduce((sum, row) => sum + row.attended, 0);
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const department =
    scope.kind === "department"
      ? await db
          .select({ id: departments.id, name: departments.name })
          .from(departments)
          .where(eq(departments.id, scope.departmentId))
          .limit(1)
      : [];

  return {
    departmentId: department[0]?.id ?? null,
    departmentName: department[0]?.name ?? null,
    students: rows.length,
    attended,
    total,
    averagePercentage: total > 0 ? roundPercentage((attended * 100) / total) : 0,
    belowThreshold: rows.filter((row) => row.belowThreshold).length,
  };
}

export async function getStudents(access: Access, query: StudentsQuery) {
  const scope = await resolveReportScope(access, query.departmentId);
  await assertSubjectInScope(scope, query.subjectId);

  const rows = await fetchStudentStats(
    scope,
    {
      semester: query.semester,
      subjectId: query.subjectId,
      from: query.from,
      to: query.to,
    },
    {
      search: query.search,
      belowThreshold: query.belowThreshold,
    },
  );

  const sorted = sortStudentRows(rows, query.sort, query.order);
  const total = sorted.length;
  const offset = (query.page - 1) * query.limit;

  return {
    students: sorted.slice(offset, offset + query.limit),
    pagination: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function getStudentReport(
  access: Access,
  studentId: number,
  query: OverviewQuery,
) {
  const scope = await resolveReportScope(access, query.departmentId);
  const studentConditions: SQL[] = [
    eq(StudentProfile.id, studentId),
    eq(StudentProfile.isDeleted, false),
  ];
  if (scope.kind === "department") {
    studentConditions.push(eq(StudentProfile.departmentId, scope.departmentId));
  }

  const [student] = await db
    .select({
      studentId: StudentProfile.id,
      name: StudentProfile.name,
      admissionNumber: StudentProfile.admissionNumber,
      departmentId: StudentProfile.departmentId,
      departmentName: departments.name,
      semester: StudentProfile.semester,
    })
    .from(StudentProfile)
    .innerJoin(departments, eq(StudentProfile.departmentId, departments.id))
    .where(and(...studentConditions))
    .limit(1);

  if (!student) throw new Error("REPORT_STUDENT_NOT_FOUND");

  const rows = await db
    .select({
      subjectId: subjects.id,
      subjectName: subjects.name,
      subjectCode: subjects.code,
      semester: subjects.semester,
      attended: attendedExpression,
      total: count().mapWith(Number),
      percentage: percentageExpression,
    })
    .from(classAttendance)
    .innerJoin(classSessions, eq(classAttendance.sessionId, classSessions.id))
    .innerJoin(subjects, eq(classSessions.subjectId, subjects.id))
    .where(
      and(
        ...attendanceConditions(
          scope,
          { semester: query.semester },
          studentId,
        ),
      ),
    )
    .groupBy(subjects.id, subjects.name, subjects.code, subjects.semester)
    .orderBy(asc(subjects.semester), asc(subjects.name));

  const attended = rows.reduce((sum, row) => sum + row.attended, 0);
  const total = rows.reduce((sum, row) => sum + row.total, 0);

  return {
    student,
    overall: {
      attended,
      total,
      percentage: total > 0 ? roundPercentage((attended * 100) / total) : 0,
    },
    subjects: rows.map((row) => ({
      ...row,
      belowThreshold: row.total > 0 && row.percentage < MIN_ATTENDANCE_PERCENT,
    })),
  };
}

export async function getSubjectAverages(
  access: Access,
  query: SubjectsQuery,
) {
  const scope = await resolveReportScope(access, query.departmentId);
  const conditions = attendanceConditions(scope, query);

  const rows = await db
    .select({
      subjectId: subjects.id,
      subjectName: subjects.name,
      subjectCode: subjects.code,
      semester: subjects.semester,
      departmentId: subjects.departmentId,
      departmentName: departments.name,
      students: countDistinct(classAttendance.studentId).mapWith(Number),
      attended: attendedExpression,
      total: count().mapWith(Number),
      percentage: percentageExpression,
    })
    .from(classAttendance)
    .innerJoin(classSessions, eq(classAttendance.sessionId, classSessions.id))
    .innerJoin(subjects, eq(classSessions.subjectId, subjects.id))
    .innerJoin(departments, eq(subjects.departmentId, departments.id))
    .where(and(...conditions))
    .groupBy(
      subjects.id,
      subjects.name,
      subjects.code,
      subjects.semester,
      subjects.departmentId,
      departments.name,
    )
    .orderBy(asc(subjects.semester), asc(subjects.name));

  return rows.map((row) => ({
    ...row,
    belowThreshold: row.total > 0 && row.percentage < MIN_ATTENDANCE_PERCENT,
  }));
}
