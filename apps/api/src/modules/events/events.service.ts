
import {
  and,
  asc,
  count,
  eq,
  ilike,
  inArray,
  or,
} from "drizzle-orm";

import { db } from "../../config/database.js";
import {
  clubs,
  events,
} from "../../db/schema/others-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import { coordinatorAssignments } from "../../db/schema/coordinator-schema.js";

const getEventSearchCondition = (search: string) => {
  if (!search) {
    return undefined;
  }

  return or(
    ilike(events.title, `%${search}%`),
    ilike(events.description, `%${search}%`),
    ilike(events.location, `%${search}%`),
  );
};

const getPagination = (
  page: number,
  limit: number,
  total: number,
) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

export const getAllEvents = async (
  search = "",
  page = 1,
  limit = 10,
) => {
  const whereCondition = and(
    eq(events.status, "published"),
    getEventSearchCondition(search),
  );

  const [eventList, totalResult] = await Promise.all([
    db
      .select({
        id: events.id,
        clubId: events.clubId,
        clubName: clubs.name,
        title: events.title,
        description: events.description,
        location: events.location,
        startTime: events.startTime,
        endTime: events.endTime,
        status: events.status,
        createdAt: events.createdAt,
      })
      .from(events)
      .innerJoin(clubs, eq(events.clubId, clubs.id))
      .where(whereCondition)
      .orderBy(asc(events.startTime))
      .limit(limit)
      .offset((page - 1) * limit),

    db
      .select({ total: count() })
      .from(events)
      .where(whereCondition),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return {
    events: eventList,
    pagination: getPagination(page, limit, total),
  };
};

export const getMyEvents = async (
  userId: string,
  search = "",
  page = 1,
  limit = 10,
) => {
  const studentResult = await db
    .select({ id: StudentProfile.id })
    .from(StudentProfile)
    .where(eq(StudentProfile.userId, userId))
    .limit(1);

  const student = Array.isArray(studentResult)
    ? studentResult[0]
    : undefined;

  if (!student) {
    return {
      events: [],
      pagination: getPagination(page, limit, 0),
    };
  }

  const assignments = await db
    .select({
      clubId: coordinatorAssignments.clubId,
    })
    .from(coordinatorAssignments)
    .where(eq(coordinatorAssignments.studentId, student.id));

  const clubIds = [
    ...new Set(assignments.map((assignment) => assignment.clubId)),
  ];

  if (clubIds.length === 0) {
    return {
      events: [],
      pagination: getPagination(page, limit, 0),
    };
  }

  const whereCondition = and(
    inArray(events.clubId, clubIds),
    eq(events.status, "published"),
    getEventSearchCondition(search),
  );

  const [eventList, totalResult] = await Promise.all([
    db
      .select({
        id: events.id,
        clubId: events.clubId,
        clubName: clubs.name,
        title: events.title,
        description: events.description,
        location: events.location,
        startTime: events.startTime,
        endTime: events.endTime,
        status: events.status,
        createdAt: events.createdAt,
      })
      .from(events)
      .innerJoin(clubs, eq(events.clubId, clubs.id))
      .where(whereCondition)
      .orderBy(asc(events.startTime))
      .limit(limit)
      .offset((page - 1) * limit),

    db
      .select({ total: count() })
      .from(events)
      .where(whereCondition),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return {
    events: eventList,
    pagination: getPagination(page, limit, total),
  };
};
