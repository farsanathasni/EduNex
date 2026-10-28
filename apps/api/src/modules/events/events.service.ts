
import { and, asc, eq, inArray } from "drizzle-orm";

// import { db } from "../../db/index.js";
import { events, clubs } from "../../db/schema/others-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import { coordinatorAssignments } from "../../db/schema/coordinator-schema.js";
import { db } from "../../config/database.js";

export const getAllEvents = async () => {
  return db
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
    .where(eq(events.status, "published"))
    .orderBy(asc(events.startTime));
};

export const getMyEvents = async (userId: string) => {
  // Find the student profile belonging to the logged-in user.
  const [student] = await db
    .select({ id: StudentProfile.id })
    .from(StudentProfile)
    .where(eq(StudentProfile.userId, userId))
    .limit(1);

  if (!student) {
    return [];
  }

  // Find the clubs assigned to this student as a coordinator.
  const assignments = await db
    .select({ clubId: coordinatorAssignments.clubId })
    .from(coordinatorAssignments)
    .where(eq(coordinatorAssignments.studentId, student.id));

  const clubIds = [
    ...new Set(assignments.map((assignment) => assignment.clubId)),
  ];

  if (clubIds.length === 0) {
    return [];
  }

  // Return published events belonging only to assigned clubs.
  return db
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
    .where(
      and(
        inArray(events.clubId, clubIds),
        eq(events.status, "published"),
      ),
    )
    .orderBy(asc(events.startTime));
};
