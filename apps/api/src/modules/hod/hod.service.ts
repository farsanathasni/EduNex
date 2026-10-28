
import { eq, and, count, ilike, or } from "drizzle-orm";
import type { SQL } from "drizzle-orm";

import { db } from "../../config/database.js";
import { staff } from "../../db/schema/staff-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import {
  departments,
  clubs,
  events,
  eventApprovals,
} from "../../db/schema/others-schema.js";
import { user } from "../../db/schema/auth-schema.js";
import { coordinatorAssignments } from "../../db/schema/coordinator-schema.js";

// Get the active HOD account.
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

// Get dashboard statistics for the HOD's department.
export const getHodDashboardStats = async (
  departmentId: number,
) => {
  const [
    studentResult,
    staffResult,
    coordinatorResult,
    approvalResult,
  ] = await Promise.all([
    db
      .select({ total: count() })
      .from(StudentProfile)
      .where(
        and(
          eq(StudentProfile.departmentId, departmentId),
          eq(StudentProfile.isDeleted, false),
        ),
      ),

    db
      .select({ total: count() })
      .from(staff)
      .where(
        and(
          eq(staff.departmentId, departmentId),
          eq(staff.isActive, true),
        ),
      ),

    db
      .select({ total: count() })
      .from(coordinatorAssignments)
      .innerJoin(
        clubs,
        eq(coordinatorAssignments.clubId, clubs.id),
      )
      .where(eq(clubs.departmentId, departmentId)),

    db
      .select({ total: count() })
      .from(events)
      .innerJoin(
        clubs,
        eq(events.clubId, clubs.id),
      )
      .where(
        and(
          eq(events.status, "pending"),
          eq(clubs.departmentId, departmentId),
        ),
      ),
  ]);

  return {
    totalStudents: studentResult[0].total,
    totalStaff: staffResult[0].total,
    totalCoordinators: coordinatorResult[0].total,
    pendingApprovals: approvalResult[0].total,
  };
};

// Get students with department filtering, search, and pagination.
export const getHodStudents = async (
  departmentId?: number,
  semester?: number,
  search?: string,
  page = 1,
  limit = 10,
) => {
  const conditions: SQL[] = [
    eq(StudentProfile.isDeleted, false),
  ];

  if (departmentId !== undefined) {
    conditions.push(
      eq(StudentProfile.departmentId, departmentId),
    );
  }

  if (semester !== undefined) {
    conditions.push(
      eq(StudentProfile.semester, semester),
    );
  }

  if (search?.trim()) {
    const searchTerm = `%${search.trim()}%`;

    const searchCondition = or(
      ilike(StudentProfile.name, searchTerm),
      ilike(StudentProfile.admissionNumber, searchTerm),
      ilike(user.email, searchTerm),
    );

    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }

  const whereCondition = and(...conditions);
  const offset = (page - 1) * limit;

  const [students, totalResult] = await Promise.all([
    db
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
      )
      .where(whereCondition)
      .limit(limit)
      .offset(offset),

    db
      .select({ total: count() })
      .from(StudentProfile)
      .innerJoin(
        user,
        eq(StudentProfile.userId, user.id),
      )
      .where(whereCondition),
  ]);

  const total = totalResult[0].total;

  return {
    students,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get clubs belonging to the HOD's department.
export const getHodClubs = async (
  departmentId: number,
  search = "",
  page = 1,
  limit = 10,
) => {
  const conditions: SQL[] = [
    eq(clubs.departmentId, departmentId),
  ];

  if (search.trim()) {
    conditions.push(
      ilike(clubs.name, `%${search.trim()}%`),
    );
  }

  const whereCondition = and(...conditions);
  const offset = (page - 1) * limit;

  const [clubList, totalResult] = await Promise.all([
    db
      .select({
        id: clubs.id,
        name: clubs.name,
        departmentId: clubs.departmentId,
      })
      .from(clubs)
      .where(whereCondition)
      .limit(limit)
      .offset(offset),

    db
      .select({ total: count() })
      .from(clubs)
      .where(whereCondition),
  ]);

  const total = totalResult[0].total;

  return {
    clubs: clubList,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get pending events belonging to the HOD's department.
export const getPendingEvents = async (
  departmentId: number,
  search = "",
  page = 1,
  limit = 10,
) => {
  const conditions: SQL[] = [
    eq(events.status, "pending"),
    eq(clubs.departmentId, departmentId),
  ];

  if (search.trim()) {
    const searchTerm = `%${search.trim()}%`;

    const searchCondition = or(
      ilike(events.title, searchTerm),
      ilike(events.description, searchTerm),
      ilike(events.location, searchTerm),
      ilike(clubs.name, searchTerm),
    );

    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }

  const whereCondition = and(...conditions);
  const offset = (page - 1) * limit;

  const [eventList, totalResult] = await Promise.all([
    db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        location: events.location,
        startTime: events.startTime,
        endTime: events.endTime,
        status: events.status,
        clubId: clubs.id,
        clubName: clubs.name,
      })
      .from(events)
      .innerJoin(
        clubs,
        eq(events.clubId, clubs.id),
      )
      .where(whereCondition)
      .limit(limit)
      .offset(offset),

    db
      .select({ total: count() })
      .from(events)
      .innerJoin(
        clubs,
        eq(events.clubId, clubs.id),
      )
      .where(whereCondition),
  ]);

  const total = totalResult[0].total;

  return {
    events: eventList,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Approve or reject a pending event within the HOD's department.
export const reviewEvent = async (
  eventId: number,
  reviewerId: string,
  departmentId: number,
  decision: "approved" | "rejected",
  comments?: string,
) => {
  return db.transaction(async (tx) => {
    const [event] = await tx
      .select({
        id: events.id,
      })
      .from(events)
      .innerJoin(
        clubs,
        eq(events.clubId, clubs.id),
      )
      .where(
        and(
          eq(events.id, eventId),
          eq(events.status, "pending"),
          eq(clubs.departmentId, departmentId),
        ),
      )
      .limit(1);

    if (!event) {
      throw new Error("EVENT_NOT_PENDING_OR_FORBIDDEN");
    }

    // Update only if the event is still pending and belongs
    // to the HOD's department.
    const updatedEvents = await tx
      .update(events)
      .set({
        status: decision,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(events.id, eventId),
          eq(events.status, "pending"),
        ),
      )
      .returning({
        id: events.id,
      });

    if (
      !Array.isArray(updatedEvents) ||
      updatedEvents.length === 0
    ) {
      throw new Error("EVENT_NOT_PENDING_OR_FORBIDDEN");
    }

    await tx.insert(eventApprovals).values({
      eventId,
      reviewerId,
      reviewerRole: "hod",
      decision,
      comments: comments || null,
      reviewedAt: new Date().toISOString(),
    });

    return {
      id: eventId,
      status: decision,
    };
  });
};
