
import {
  and,
  count,
  desc,
  eq,
  ilike,
  inArray,
  isNull,
  or,
} from "drizzle-orm";

import { db } from "../../config/database.js";
import {
  announcements,
  clubMemberships,
  clubs,
  departments,
  events,
} from "../../db/schema/others-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import { user } from "../../db/schema/auth-schema.js";
import { coordinatorAssignments } from "../../db/schema/coordinator-schema.js";

const getPagination = (page: number, limit: number) => ({
  limit,
  offset: (page - 1) * limit,
});

export const createClub = async (
  name: string,
  description?: string,
  departmentId?: number,
) => {
  const result = await db
    .insert(clubs)
    .values({
      name,
      description: description || null,
      departmentId: departmentId ?? null,
    })
    .returning();

  return Array.isArray(result) ? result[0] ?? null : null;
};

export const getAllClubs = async (
  search = "",
  page = 1,
  limit = 10,
  departmentId?: number,
) => {
  const conditions = and(
    search ? ilike(clubs.name, `%${search}%`) : undefined,
    departmentId !== undefined
      ? eq(clubs.departmentId, departmentId)
      : undefined,
  );

  const pagination = getPagination(page, limit);

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(clubs)
      .where(conditions)
      .orderBy(desc(clubs.id))
      .limit(pagination.limit)
      .offset(pagination.offset),

    db
      .select({ total: count() })
      .from(clubs)
      .where(conditions),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return {
    clubs: data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getClubById = async (clubId: number) => {
  const result = await db
    .select()
    .from(clubs)
    .where(eq(clubs.id, clubId))
    .limit(1);

  return result[0] ?? null;
};

// Attach a department only when the club is still unassigned. Existing
// department assignments are never overwritten by this operation.
export const assignClubDepartment = async (
  clubId: number,
  departmentId: number,
) => {
  const result = await db
    .update(clubs)
    .set({ departmentId })
    .where(and(eq(clubs.id, clubId), isNull(clubs.departmentId)))
    .returning();

  return Array.isArray(result) ? result[0] ?? null : null;
};

export const getClubCoordinators = async (
  clubId: number,
  search = "",
  page = 1,
  limit = 10,
) => {
  const conditions = [
    eq(coordinatorAssignments.clubId, clubId),
  ];

  if (search) {
    conditions.push(
      or(
        ilike(user.name, `%${search}%`),
        ilike(user.email, `%${search}%`),
      )!,
    );
  }

  const whereCondition = and(...conditions);
  const pagination = getPagination(page, limit);

  const [data, totalResult] = await Promise.all([
    db
      .select({
        studentId: StudentProfile.id,
        name: user.name,
        email: user.email,
      })
      .from(coordinatorAssignments)
      .innerJoin(
        StudentProfile,
        eq(coordinatorAssignments.studentId, StudentProfile.id),
      )
      .innerJoin(user, eq(StudentProfile.userId, user.id))
      .where(whereCondition)
      .orderBy(desc(coordinatorAssignments.id))
      .limit(pagination.limit)
      .offset(pagination.offset),

    db
      .select({ total: count() })
      .from(coordinatorAssignments)
      .innerJoin(
        StudentProfile,
        eq(coordinatorAssignments.studentId, StudentProfile.id),
      )
      .innerJoin(user, eq(StudentProfile.userId, user.id))
      .where(whereCondition),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return {
    coordinators: data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createMemberShipRequest = async (
  clubId: number,
  studentId: number,
) => {
  const [club] = await db
    .select({ id: clubs.id })
    .from(clubs)
    .where(eq(clubs.id, clubId))
    .limit(1);

  if (!club) {
    throw new Error("CLUB_NOT_FOUND");
  }

  const [existing] = await db
    .select({
      id: clubMemberships.id,
      status: clubMemberships.status,
    })
    .from(clubMemberships)
    .where(
      and(
        eq(clubMemberships.clubId, clubId),
        eq(clubMemberships.studentId, studentId),
      ),
    )
    .limit(1);

  if (existing) {
    throw new Error("MEMBERSHIP_REQUEST_EXISTS");
  }

  const result = await db
    .insert(clubMemberships)
    .values({
      clubId,
      studentId,
      status: "pending",
    })
    .returning();

  return Array.isArray(result) ? result[0] ?? null : null;
};

export const getMyMembershipRequests = async (
  studentId: number,
  search = "",
  page = 1,
  limit = 10,
) => {
  const conditions = [
    eq(clubMemberships.studentId, studentId),
  ];

  if (search) {
    conditions.push(ilike(clubs.name, `%${search}%`));
  }

  const whereCondition = and(...conditions);
  const pagination = getPagination(page, limit);

  const [data, totalResult] = await Promise.all([
    db
      .select({
        id: clubMemberships.id,
        clubId: clubs.id,
        clubName: clubs.name,
        status: clubMemberships.status,
        requestedAt: clubMemberships.requestedAt,
        reviewedAt: clubMemberships.reviewedAt,
      })
      .from(clubMemberships)
      .innerJoin(clubs, eq(clubMemberships.clubId, clubs.id))
      .where(whereCondition)
      .orderBy(desc(clubMemberships.requestedAt))
      .limit(pagination.limit)
      .offset(pagination.offset),

    db
      .select({ total: count() })
      .from(clubMemberships)
      .innerJoin(clubs, eq(clubMemberships.clubId, clubs.id))
      .where(whereCondition),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return {
    requests: data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getClubEvents = async (
  clubId: number,
  search = "",
  page = 1,
  limit = 10,
) => {
  const conditions = [
    eq(events.clubId, clubId),
    inArray(events.status, ["approved", "published"]),
  ];

  if (search) {
    conditions.push(
      or(
        ilike(events.title, `%${search}%`),
        ilike(events.description, `%${search}%`),
        ilike(events.location, `%${search}%`),
      )!,
    );
  }

  const whereCondition = and(...conditions);
  const pagination = getPagination(page, limit);

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(events)
      .where(whereCondition)
      .orderBy(events.startTime)
      .limit(pagination.limit)
      .offset(pagination.offset),

    db
      .select({ total: count() })
      .from(events)
      .where(whereCondition),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return {
    events: data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getClubAnnouncements = async (
  clubId: number,
  page = 1,
  limit = 10,
) => {
  const conditions = [
    eq(announcements.clubId, clubId),
    eq(announcements.audience, "club"),
  ];

  const whereCondition = and(...conditions);
  const pagination = getPagination(page, limit);

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(announcements)
      .where(whereCondition)
      .orderBy(desc(announcements.publishedAt))
      .limit(pagination.limit)
      .offset(pagination.offset),

    db
      .select({ total: count() })
      .from(announcements)
      .where(whereCondition),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return {
    announcements: data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getStudentProfileByUserId = async (userId: string) => {
  const [student] = await db
    .select({
      id: StudentProfile.id,
    })
    .from(StudentProfile)
    .where(eq(StudentProfile.userId, userId))
    .limit(1);

  return student ?? null;
};



export const getCoordinatorProfileByUserId = async (userId: string) => {
  const [coordinator] = await db
    .select({
      id: StudentProfile.id,
    })
    .from(StudentProfile)
    .where(
      and(
        eq(StudentProfile.userId, userId),
        eq(StudentProfile.isDeleted, false),
      ),
    )
    .limit(1);

  return coordinator ?? null;
};


export const getCoordinatorMembershipRequests = async (
  coordinatorStudentId: number,
) => {
  const requests = await db
    .select({
      requestId: clubMemberships.id,
      clubId: clubs.id,
      clubName: clubs.name,
      status: clubMemberships.status,
      requestedAt: clubMemberships.requestedAt,

      studentId: StudentProfile.id,
      studentName: StudentProfile.name,
      admissionNumber: StudentProfile.admissionNumber,
      email: user.email,
      phone: StudentProfile.phone,
      semester: StudentProfile.semester,

      departmentId: departments.id,
      departmentName: departments.name,
      departmentCode: departments.code,
    })
    .from(clubMemberships)
    .innerJoin(
      clubs,
      eq(clubMemberships.clubId, clubs.id),
    )
    .innerJoin(
      coordinatorAssignments,
      and(
        eq(coordinatorAssignments.clubId, clubMemberships.clubId),
        eq(coordinatorAssignments.studentId, coordinatorStudentId),
      ),
    )
    .innerJoin(
      StudentProfile,
      eq(clubMemberships.studentId, StudentProfile.id),
    )
    .innerJoin(
      user,
      eq(StudentProfile.userId, user.id),
    )
    .innerJoin(
      departments,
      eq(StudentProfile.departmentId, departments.id),
    )
    .where(
      eq(clubMemberships.status, "pending")
    )
    .orderBy(desc(clubMemberships.requestedAt));

  return requests;
};



export const reviewClubMembershipRequest = async (
  coordinatorStudentId: number,
  requestId: number,
  decision: "approved" | "rejected",
) => {
  // Check whether this request belongs to a club
  // assigned to the logged-in coordinator.
  const [request] = await db
    .select({
      id: clubMemberships.id,
      status: clubMemberships.status,
    })
    .from(clubMemberships)
    .innerJoin(
      coordinatorAssignments,
      and(
        eq(coordinatorAssignments.clubId, clubMemberships.clubId),
        eq(coordinatorAssignments.studentId, coordinatorStudentId),
      ),
    )
    .where(eq(clubMemberships.id, requestId))
    .limit(1);

  if (!request) {
    throw new Error("MEMBERSHIP_REQUEST_NOT_FOUND");
  }

  if (request.status !== "pending") {
    throw new Error("MEMBERSHIP_REQUEST_ALREADY_REVIEWED");
  }

  const [updatedRequest] = await db
    .update(clubMemberships)
    .set({
      status: decision,
      reviewedAt: new Date().toISOString(),
    })
    .where(
      and(
        eq(clubMemberships.id, requestId),
        eq(clubMemberships.status, "pending"),
      ),
    )
    .returning();

  if (!updatedRequest) {
    throw new Error("MEMBERSHIP_REQUEST_ALREADY_REVIEWED");
  }

  return updatedRequest;
};



export const getCoordinatorClubMembers = async (
  coordinatorStudentId: number,
) => {
  const members = await db
    .select({
      clubId: clubs.id,
      clubName: clubs.name,
      studentId: StudentProfile.id,
      studentName: StudentProfile.name,
      admissionNumber: StudentProfile.admissionNumber,
      email: user.email,
      phone: StudentProfile.phone,
      semester: StudentProfile.semester,
      departmentName: departments.name,
      departmentCode: departments.code,
      status: clubMemberships.status,
      joinedAt: clubMemberships.reviewedAt,
    })
    .from(clubMemberships)
    .innerJoin(
      clubs,
      eq(clubMemberships.clubId, clubs.id),
    )
    .innerJoin(
      coordinatorAssignments,
      and(
        eq(coordinatorAssignments.clubId, clubMemberships.clubId),
        eq(coordinatorAssignments.studentId, coordinatorStudentId),
      ),
    )
    .innerJoin(
      StudentProfile,
      eq(clubMemberships.studentId, StudentProfile.id),
    )
    .innerJoin(user, eq(StudentProfile.userId, user.id))
    .innerJoin(
      departments,
      eq(StudentProfile.departmentId, departments.id),
    )
    .where(
      and(
        inArray(clubMemberships.status, ["approved", "rejected"]),
        eq(StudentProfile.isDeleted, false),
      ),
    )
    .orderBy(desc(clubMemberships.reviewedAt));

  return members;
};