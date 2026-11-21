import {
  and,
  asc,
  count,
  eq,
  ilike,
  notInArray,
  or,
  sql,
  type SQL,
} from "drizzle-orm";

import { db } from "../../config/database.js";
import { departments } from "../../db/schema/others-schema.js";
import { staff } from "../../db/schema/staff-schema.js";
import { user } from "../../db/schema/auth-schema.js";
import {
  classSessions,
  facultySubjects,
  subjects,
} from "../../db/schema/attendance-schema.js";
import {
  hasRole,
  type Access,
  type DepartmentScope,
} from "../rbac/rbac.access.js";

export type SubjectScope = DepartmentScope;

type ListQuery = {
  search?: string;
  semester?: number;
  page?: number;
  limit?: number;
};

type FacultyListQuery = {
  search?: string;
  page?: number;
  limit?: number;
};

const buildPagination = (page: number, limit: number, total: number) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

const isUniqueViolation = (error: unknown) =>
  (error as { code?: string })?.code === "23505";

export async function resolveSubjectScope(
  access: Access,
  requestedDepartmentId?: number,
): Promise<SubjectScope> {
  if (access.isSuperAdmin || hasRole(access, "principal")) {
    if (requestedDepartmentId === undefined) return { kind: "all" };
    return { kind: "department", departmentId: requestedDepartmentId };
  }

  const [member] = await db
    .select({ departmentId: staff.departmentId })
    .from(staff)
    .where(and(eq(staff.userId, access.userId), eq(staff.isActive, true)))
    .limit(1);

  return member?.departmentId
    ? { kind: "department", departmentId: member.departmentId }
    : { kind: "all" };
}

export const getScopeDepartmentId = (scope: SubjectScope) =>
  scope.kind === "department" ? scope.departmentId : undefined;

// One subject, only if it is inside the caller's department scope.
async function getSubjectInScope(subjectId: number, departmentId?: number) {
  const [subject] = await db
    .select({
      id: subjects.id,
      name: subjects.name,
      code: subjects.code,
      semester: subjects.semester,
      departmentId: subjects.departmentId,
    })
    .from(subjects)
    .where(
      and(
        eq(subjects.id, subjectId),
        departmentId !== undefined
          ? eq(subjects.departmentId, departmentId)
          : undefined,
      ),
    )
    .limit(1);

  return subject ?? null;
}

// ---------- Subjects ----------

async function assertDepartmentExists(departmentId: number) {
  const [department] = await db
    .select({ id: departments.id })
    .from(departments)
    .where(eq(departments.id, departmentId))
    .limit(1);

  if (!department) throw new Error("DEPARTMENT_NOT_FOUND");
}

export async function listSubjects(
  departmentId: number | undefined,
  query: ListQuery,
) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  const conditions: SQL[] = [];

  if (departmentId !== undefined) {
    conditions.push(eq(subjects.departmentId, departmentId));
  }

  if (query.semester !== undefined) {
    conditions.push(eq(subjects.semester, query.semester));
  }

  if (query.search?.trim()) {
    const term = `%${query.search.trim()}%`;
    const searchCondition = or(
      ilike(subjects.name, term),
      ilike(subjects.code, term),
    );
    if (searchCondition) conditions.push(searchCondition);
  }

  const where = and(...conditions);

  const [rows, totalResult] = await Promise.all([
    db
      .select({
        id: subjects.id,
        name: subjects.name,
        code: subjects.code,
        semester: subjects.semester,
        departmentId: subjects.departmentId,
        departmentName: departments.name,
        departmentCode: departments.code,
        facultyCount: sql<number>`(select count(*) from faculty_subjects fs where fs.subject_id = ${subjects.id})`.mapWith(
          Number,
        ),
      })
      .from(subjects)
      .innerJoin(departments, eq(subjects.departmentId, departments.id))
      .where(where)
      .orderBy(asc(subjects.semester), asc(subjects.name))
      .limit(limit)
      .offset((page - 1) * limit),

    db.select({ total: count() }).from(subjects).where(where),
  ]);

  return {
    subjects: rows,
    pagination: buildPagination(page, limit, totalResult[0]?.total ?? 0),
  };
}

export async function createSubject(
  input: {
    name: string;
    code: string;
    semester: number;
    departmentId?: number;
  },
  departmentId?: number,
) {
  const targetDepartmentId = departmentId ?? input.departmentId;
  if (targetDepartmentId === undefined) {
    throw new Error("DEPARTMENT_REQUIRED");
  }

  await assertDepartmentExists(targetDepartmentId);

  try {
    const [created] = await db
      .insert(subjects)
      .values({
        name: input.name,
        code: input.code,
        semester: input.semester,
        departmentId: targetDepartmentId,
      })
      .returning();

    return created;
  } catch (error) {
    if (isUniqueViolation(error)) throw new Error("SUBJECT_CODE_EXISTS");
    throw error;
  }
}

export async function updateSubject(
  subjectId: number,
  input: {
    name?: string;
    code?: string;
    semester?: number;
    departmentId?: number;
  },
  departmentId?: number,
) {
  const existing = await getSubjectInScope(subjectId, departmentId);
  if (!existing) throw new Error("SUBJECT_NOT_FOUND");

  if (
    input.departmentId !== undefined &&
    input.departmentId !== existing.departmentId
  ) {
    await assertDepartmentExists(input.departmentId);
  }

  try {
    const [updated] = await db
      .update(subjects)
      .set({ ...input, updatedAt: new Date().toISOString() })
      .where(eq(subjects.id, subjectId))
      .returning();

    return updated;
  } catch (error) {
    if (isUniqueViolation(error)) throw new Error("SUBJECT_CODE_EXISTS");
    throw error;
  }
}

// Blocked once classes have been taken, so attendance history is never lost.
export async function deleteSubject(
  subjectId: number,
  departmentId?: number,
) {
  const existing = await getSubjectInScope(subjectId, departmentId);
  if (!existing) throw new Error("SUBJECT_NOT_FOUND");

  const [sessionResult] = await db
    .select({ total: count() })
    .from(classSessions)
    .where(eq(classSessions.subjectId, subjectId));

  if ((sessionResult?.total ?? 0) > 0) {
    throw new Error("SUBJECT_HAS_SESSIONS");
  }

  await db.delete(subjects).where(eq(subjects.id, subjectId));

  return { id: subjectId };
}

// ---------- Faculty assignments ----------

// Faculty already assigned to a subject.
export async function listSubjectFaculty(
  subjectId: number,
  departmentId: number | undefined,
  query: FacultyListQuery,
) {
  const subject = await getSubjectInScope(subjectId, departmentId);
  if (!subject) throw new Error("SUBJECT_NOT_FOUND");

  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  const conditions: SQL[] = [
    eq(facultySubjects.subjectId, subjectId),
    eq(staff.departmentId, subject.departmentId),
  ];

  if (query.search?.trim()) {
    const term = `%${query.search.trim()}%`;
    const searchCondition = or(
      ilike(user.name, term),
      ilike(user.email, term),
      ilike(staff.employeeId, term),
    );
    if (searchCondition) conditions.push(searchCondition);
  }

  const where = and(...conditions);

  const [rows, totalResult] = await Promise.all([
    db
      .select({
        staffId: staff.id,
        name: user.name,
        email: user.email,
        employeeId: staff.employeeId,
        designation: staff.designation,
        assignedAt: facultySubjects.createdAt,
      })
      .from(facultySubjects)
      .innerJoin(staff, eq(facultySubjects.staffId, staff.id))
      .innerJoin(user, eq(staff.userId, user.id))
      .where(where)
      .orderBy(asc(user.name))
      .limit(limit)
      .offset((page - 1) * limit),

    db
      .select({ total: count() })
      .from(facultySubjects)
      .innerJoin(staff, eq(facultySubjects.staffId, staff.id))
      .innerJoin(user, eq(staff.userId, user.id))
      .where(where),
  ]);

  return {
    faculty: rows,
    pagination: buildPagination(page, limit, totalResult[0]?.total ?? 0),
  };
}

// Faculty of the subject's department who are not assigned yet (for the picker).
export async function listAvailableFaculty(
  subjectId: number,
  departmentId: number | undefined,
  query: FacultyListQuery,
) {
  const subject = await getSubjectInScope(subjectId, departmentId);
  if (!subject) throw new Error("SUBJECT_NOT_FOUND");

  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  const conditions: SQL[] = [
    eq(staff.role, "faculty"),
    eq(staff.isActive, true),
    eq(staff.departmentId, subject.departmentId),
    notInArray(
      staff.id,
      db
        .select({ id: facultySubjects.staffId })
        .from(facultySubjects)
        .where(eq(facultySubjects.subjectId, subjectId)),
    ),
  ];

  if (query.search?.trim()) {
    const term = `%${query.search.trim()}%`;
    const searchCondition = or(
      ilike(user.name, term),
      ilike(user.email, term),
      ilike(staff.employeeId, term),
    );
    if (searchCondition) conditions.push(searchCondition);
  }

  const where = and(...conditions);

  const [rows, totalResult] = await Promise.all([
    db
      .select({
        staffId: staff.id,
        name: user.name,
        email: user.email,
        employeeId: staff.employeeId,
        designation: staff.designation,
      })
      .from(staff)
      .innerJoin(user, eq(staff.userId, user.id))
      .where(where)
      .orderBy(asc(user.name))
      .limit(limit)
      .offset((page - 1) * limit),

    db
      .select({ total: count() })
      .from(staff)
      .innerJoin(user, eq(staff.userId, user.id))
      .where(where),
  ]);

  return {
    faculty: rows,
    pagination: buildPagination(page, limit, totalResult[0]?.total ?? 0),
  };
}

export async function assignFaculty(
  subjectId: number,
  staffId: string,
  departmentId?: number,
) {
  const subject = await getSubjectInScope(subjectId, departmentId);
  if (!subject) throw new Error("SUBJECT_NOT_FOUND");

  const [member] = await db
    .select({
      id: staff.id,
      role: staff.role,
      departmentId: staff.departmentId,
    })
    .from(staff)
    .where(and(eq(staff.id, staffId), eq(staff.isActive, true)))
    .limit(1);

  if (!member || member.role !== "faculty") {
    throw new Error("FACULTY_NOT_FOUND");
  }

  if (member.departmentId !== subject.departmentId) {
    throw new Error("FACULTY_DEPARTMENT_MISMATCH");
  }

  const [existing] = await db
    .select({ id: facultySubjects.id })
    .from(facultySubjects)
    .where(
      and(
        eq(facultySubjects.subjectId, subjectId),
        eq(facultySubjects.staffId, staffId),
      ),
    )
    .limit(1);

  if (existing) throw new Error("FACULTY_ALREADY_ASSIGNED");

  const [assignment] = await db
    .insert(facultySubjects)
    .values({ subjectId, staffId })
    .returning();

  return assignment;
}

export async function removeFaculty(
  subjectId: number,
  staffId: string,
  departmentId?: number,
) {
  const subject = await getSubjectInScope(subjectId, departmentId);
  if (!subject) throw new Error("SUBJECT_NOT_FOUND");

  const [member] = await db
    .select({ departmentId: staff.departmentId })
    .from(staff)
    .where(eq(staff.id, staffId))
    .limit(1);

  if (!member) throw new Error("FACULTY_NOT_FOUND");
  if (member.departmentId !== subject.departmentId) {
    throw new Error("FACULTY_DEPARTMENT_MISMATCH");
  }

  const [removed] = await db
    .delete(facultySubjects)
    .where(
      and(
        eq(facultySubjects.subjectId, subjectId),
        eq(facultySubjects.staffId, staffId),
      ),
    )
    .returning({ id: facultySubjects.id });

  if (!removed) throw new Error("FACULTY_ASSIGNMENT_NOT_FOUND");

  return removed;
}