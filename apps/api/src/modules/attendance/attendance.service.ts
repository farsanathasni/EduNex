import { and, eq, inArray, SQL, sql } from "drizzle-orm";
import { db } from "../../config/database.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import {attendance,clubMemberships, clubs, events,} from "../../db/schema/others-schema.js";
import { coordinatorAssignments } from "../../db/schema/coordinator-schema.js";
import { staff } from "../../db/schema/staff-schema.js";




export const getEventAttendance = async (
  eventId: number,
  userId: string,
  isSuperAdmin = false,
) => {
  const [event] = await db
    .select({
      id: events.id,
      clubId: events.clubId,
      clubName: clubs.name,
      departmentId: clubs.departmentId,
      title: events.title,
      startTime: events.startTime,
      endTime: events.endTime,
    })
    .from(events)
    .innerJoin(clubs, eq(events.clubId, clubs.id))
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event) {
    throw new Error("EVENT_NOT_FOUND");
  }

  if (!isSuperAdmin) {
    // First check whether the logged-in user is an active HOD.
    const [hod] = await db
      .select({
        departmentId: staff.departmentId,
      })
      .from(staff)
      .where(
        and(
          eq(staff.userId, userId),
          eq(staff.role, "hod"),
          eq(staff.isActive, true),
        ),
      )
      .limit(1);

    if (hod) {
      if (!hod.departmentId) {
        throw new Error("HOD_DEPARTMENT_NOT_ASSIGNED");
      }

      if (hod.departmentId !== event.departmentId) {
        throw new Error("UNAUTHORIZED_EVENT_ACCESS");
      }
    } else {
      // Otherwise, verify the assigned Club Coordinator.
      const [student] = await db
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

      if (!student) {
        throw new Error("STUDENT_PROFILE_NOT_FOUND");
      }

      const [assignment] = await db
        .select({
          id: coordinatorAssignments.id,
        })
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
    }
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
    .innerJoin(
      StudentProfile,
      eq(clubMemberships.studentId, StudentProfile.id),
    )
    .leftJoin(
      attendance,
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

  const total = members.length;

  const present = members.filter(
    (member) => member.status === "present",
  ).length;

  const absent = members.filter(
    (member) => member.status === "absent",
  ).length;

  const unmarked = members.filter(
    (member) => member.status === null,
  ).length;

  const percentage =
    total > 0 ? Math.round((present / total) * 100) : 0;

  return {
    event,
    summary: {
      total,
      present,
      absent,
      unmarked,
      percentage,
    },
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
  isSuperAdmin = false,
) => {
  let studentId: number | undefined;

  if (!isSuperAdmin) {
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

    if (!student) {
      throw new Error("STUDENT_PROFILE_NOT_FOUND");
    }

    studentId = student.id;
  }


  const [event] = await db
    .select({id: events.id,clubId: events.clubId})
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event) {
    throw new Error("EVENT_NOT_FOUND");
  }


  if (!isSuperAdmin) {
    const [assignment] = await db
      .select({ id: coordinatorAssignments.id })
      .from(coordinatorAssignments)
      .where(
        and(
          eq(coordinatorAssignments.studentId, studentId!),
          eq(coordinatorAssignments.clubId, event.clubId),
        ),
      )
      .limit(1);

    if (!assignment) {
      throw new Error("UNAUTHORIZED_EVENT_ACCESS");
    }
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


export const getStudentAttendance = async (userId: string) => {
  // Find the logged-in student's profile.
  const [student] = await db
    .select({
      id: StudentProfile.id,
      name: StudentProfile.name,
      admissionNumber: StudentProfile.admissionNumber,
    })
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

  // Fetch only this student's attendance records.
  const records = await db
    .select({
      id: attendance.id,
      eventId: events.id,
      eventTitle: events.title,
      clubName: clubs.name,
      eventDate: events.startTime,
      status: attendance.status,
      markedAt: attendance.markedAt,
    })
    .from(attendance)
    .innerJoin(events, eq(attendance.eventId, events.id))
    .innerJoin(clubs, eq(events.clubId, clubs.id))
    .where(eq(attendance.studentId, student.id));

  const total = records.length;
  const present = records.filter(
    (record) => record.status === "present",
  ).length;
  const absent = records.filter(
    (record) => record.status === "absent",
  ).length;

  const percentage =
    total > 0 ? Math.round((present / total) * 100) : 0;

  return {
    student,
    summary: {
      total,
      present,
      absent,
      percentage,
    },
    records,
  };
};



// Get events for the attendance reports page.
export const getHodAttendanceEvents = async (
  departmentId?: number,
) => {
  const conditions: SQL[] = [];

  if (departmentId !== undefined) {
    conditions.push(eq(clubs.departmentId, departmentId));
  }

  const eventList = await db
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
      departmentId: clubs.departmentId,
    })
    .from(events)
    .innerJoin(clubs, eq(events.clubId, clubs.id))
    .where(conditions.length ? and(...conditions) : undefined);

  return eventList;
};