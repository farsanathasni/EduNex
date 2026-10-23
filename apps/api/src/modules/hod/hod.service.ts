import { eq, and, count } from "drizzle-orm";
import { db } from "../../config/database.js";
import { staff } from "../../db/schema/staff-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import { departments, clubs, events,eventApprovals } from "../../db/schema/others-schema.js";
import { user } from "../../db/schema/auth-schema.js";
import { coordinatorAssignments } from "../../db/schema/coordinator-schema.js";
import { sendEmail } from "../../utils/email.js";



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

export const getHodDashboardStats = async () => {
  const [
    studentResult,
    staffResult,
    coordinatorResult,
    approvalResult,
  ] = await Promise.all([
    // Count all students
    db
      .select({ total: count() })
      .from(StudentProfile),

    // Count all staff members
    db
      .select({ total: count() })
      .from(staff),

    // Count coordinator assignments
    db
      .select({ total: count() })
      .from(coordinatorAssignments),

    // Count events awaiting approval
    db
      .select({ total: count() })
      .from(events)
      .where(eq(events.status, "pending")),
  ]);

  return {
    totalStudents: studentResult[0].total,
    totalStaff: staffResult[0].total,
    totalCoordinators: coordinatorResult[0].total,
    pendingApprovals: approvalResult[0].total,
  };
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
  // 1. Check whether the student exists and get their email.
  const [student] = await db
    .select({
      id: StudentProfile.id,
      email: user.email,
    })
    .from(StudentProfile)
    .innerJoin(user, eq(StudentProfile.userId, user.id))
    .where(eq(StudentProfile.id, studentId))
    .limit(1);

  if (!student) {
    throw new Error("STUDENT_NOT_FOUND");
  }

  // 2. Check whether the club exists.
  const [club] = await db
    .select({
      id: clubs.id,
      name: clubs.name,
    })
    .from(clubs)
    .where(eq(clubs.id, clubId))
    .limit(1);

  if (!club) {
    throw new Error("CLUB_NOT_FOUND");
  }

  // 3. Check whether this student is already assigned to this club.
  const [existingAssignment] = await db
    .select()
    .from(coordinatorAssignments)
    .where(
      and(
        eq(coordinatorAssignments.studentId, studentId),
        eq(coordinatorAssignments.clubId, clubId),
      ),
    )
    .limit(1);

  if (existingAssignment) {
    throw new Error("COORDINATOR_ALREADY_ASSIGNED");
  }

  // 4. Save the coordinator assignment.
  const [assignment] = await db
    .insert(coordinatorAssignments)
    .values({
      studentId,
      clubId,
      appointedBy,
    })
    .returning();

  // 5. Send the appointment notification.
  await sendEmail({
    to: student.email,
    subject: "You have been appointed as a Club Coordinator - EduNex",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Congratulations!</h2>

        <p>You have been appointed as a club coordinator at EduNex.</p>

        <p>
          <strong>Club:</strong> ${club.name}
        </p>

        <p>
          Please log in to your EduNex account to continue.
        </p>

        <p>Best regards,<br />EduNex Team</p>
      </div>
    `,
  });

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

// Get events waiting for HOD approval
export const getPendingEvents = async () => {
  return db
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
    .innerJoin(clubs, eq(events.clubId, clubs.id))
    .where(eq(events.status, "pending"));
};

// Approve or reject an event
export const reviewEvent = async (
  eventId: number,
  reviewerId: string,
  decision: "approved" | "rejected",
  comments?: string,
) => {
  return db.transaction(async (tx) => {
    const [event] = await tx
      .select({
        id: events.id,
        status: events.status,
      })
      .from(events)
      .where(
        and(
          eq(events.id, eventId),
          eq(events.status, "pending"),
        ),
      )
      .limit(1);

    if (!event) {
      throw new Error("EVENT_NOT_PENDING");
    }

    await tx
      .update(events)
      .set({
        status: decision,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(events.id, eventId));

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