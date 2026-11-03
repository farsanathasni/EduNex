import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "../../config/database.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import {attendance,clubMemberships, events,} from "../../db/schema/others-schema.js";
import { coordinatorAssignments } from "../../db/schema/coordinator-schema.js";



export const getEventAttendance = async (
  eventId: number,
  userId: string,
) => {
  const [student] = await db
    .select({id: StudentProfile.id,})
    .from(StudentProfile)
    .where(
      and(
        eq(StudentProfile.userId, userId),
        eq(StudentProfile.isDeleted, false),
      ),
    )
    .limit(1);

  if (!student) {
    throw new Error("STUDENT_PROFILE_NOT_FOUND");
  }

  const [event] = await db
    .select({
      id: events.id,
      clubId: events.clubId,
      title: events.title,
      startTime: events.startTime,
      endTime: events.endTime,
    })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event) {
    throw new Error("EVENT_NOT_FOUND");
  }



  const [assignment] = await db
    .select({id: coordinatorAssignments.id,})
    .from(coordinatorAssignments)
    .where(
      and(
        eq(coordinatorAssignments.studentId, student.id),
        eq(coordinatorAssignments.clubId, event.clubId),
      ),
    )
    .limit(1);

  if (!assignment) {
    throw new Error("UNAUTHORIZED_EVENT_ACCESS");
  }



  const members = await db
    .select({
      studentId: StudentProfile.id,
      name: StudentProfile.name,
      admissionNumber: StudentProfile.admissionNumber,
      status: attendance.status,
      markedAt: attendance.markedAt,
    })
    .from(clubMemberships)
    .innerJoin(StudentProfile,
      eq(clubMemberships.studentId, StudentProfile.id),
    )
    .leftJoin(attendance,
      and(
        eq(attendance.studentId, StudentProfile.id),
        eq(attendance.eventId, eventId),
      ),
    )
    .where(
      and(
        eq(clubMemberships.clubId, event.clubId),
        eq(clubMemberships.status, "approved"),
        eq(StudentProfile.isDeleted, false),
      ),
    );

  return {
    event,
    members,
  };
};



export const saveAttendance = async (
  eventId: number,
  userId: string,
  attendanceList: {
    studentId: number;
    status: "present" | "absent";
  }[],
) => {
  const [student] = await db
    .select({id: StudentProfile.id,})
    .from(StudentProfile)
    .where(
      and(
        eq(StudentProfile.userId, userId),
        eq(StudentProfile.isDeleted, false),
      ),
    )
    .limit(1);

  if (!student) {
    throw new Error("STUDENT_PROFILE_NOT_FOUND");
  }


  const [event] = await db
    .select({id: events.id,clubId: events.clubId})
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event) {
    throw new Error("EVENT_NOT_FOUND");
  }


  const [assignment] = await db
    .select({id: coordinatorAssignments.id,})
    .from(coordinatorAssignments)
    .where(
      and(
        eq(coordinatorAssignments.studentId, student.id),
        eq(coordinatorAssignments.clubId, event.clubId),
      ),
    )
    .limit(1);

  if (!assignment) {
    throw new Error("UNAUTHORIZED_EVENT_ACCESS");
  }



  const studentIds = [
    ...new Set(attendanceList.map((item) => item.studentId)),
  ];


  if (studentIds.length !== attendanceList.length) {
    throw new Error("DUPLICATE_STUDENT_IDS");
  }



  const approvedMembers = await db
    .select({studentId: StudentProfile.id,})
    .from(clubMemberships)
    .innerJoin(StudentProfile,
      eq(clubMemberships.studentId, StudentProfile.id),
    )
    .where(
      and(
        eq(clubMemberships.clubId, event.clubId),
        eq(clubMemberships.status, "approved"),
        eq(StudentProfile.isDeleted, false),
        inArray(StudentProfile.id, studentIds),
      ),
    );

  if (approvedMembers.length !== studentIds.length) {
    throw new Error("INVALID_CLUB_MEMBERS");
  }


  const result = await db
    .insert(attendance)
    .values(
      attendanceList.map((item) => ({
        eventId,
        studentId: item.studentId,
        status: item.status,
      })),
    )
    .onConflictDoUpdate({
      target: [attendance.eventId, attendance.studentId],
      set: {
        status: sql`excluded.status`,
        markedAt: new Date().toISOString(),
      },
    })
    .returning();

  return result;
};