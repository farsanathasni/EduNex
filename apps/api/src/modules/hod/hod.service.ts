import { eq, and, count } from "drizzle-orm";
import { db } from "../../config/database.js";
import { staff } from "../../db/schema/staff-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import { departments, clubs, events,eventApprovals } from "../../db/schema/others-schema.js";
import { user } from "../../db/schema/auth-schema.js";
import { coordinatorAssignments } from "../../db/schema/coordinator-schema.js";
import { sendEmail } from "../../utils/email.js";
import { auth } from "../../auth.js";



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
  .from(StudentProfile)
  .where(eq(StudentProfile.isActive, true)),

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
  const conditions = [
    eq(StudentProfile.isActive, true),
  ];

  if (departmentId !== undefined) {
    conditions.push(eq(StudentProfile.departmentId, departmentId));
  }

  if (semester !== undefined) {
    conditions.push(eq(StudentProfile.semester, semester));
  }

  return db
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
    .where(and(...conditions));
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
  // 1. Find the student and their registered email address.
  const [student] = await db
    .select({
      id: StudentProfile.id,
      name: StudentProfile.name,
      email: user.email,
    })
    .from(StudentProfile)
    .innerJoin(user, eq(StudentProfile.userId, user.id))
    .where(eq(StudentProfile.id, studentId))
    .limit(1);

  if (!student) {
    throw new Error("STUDENT_NOT_FOUND");
  }

  // 2. Find the club.
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

  // 3. Prevent duplicate coordinator assignments.
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

  // 4. Save the assignment first.
  const [assignment] = await db
    .insert(coordinatorAssignments)
    .values({
      studentId,
      clubId,
      appointedBy,
    })
    .returning();

  // Escape dynamic values before inserting them into HTML.
  const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (character) => {
      const entities: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return entities[character];
    });

  // 5. Send the appointment email without undoing the assignment
  // if the email service is unavailable.
  let emailSent = false;

  if (student.email?.trim()) {
    try {
      await sendEmail({
        to: student.email,
        subject: "Club Coordinator Appointment - EduNex",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #243247; max-width: 600px; margin: auto;">
            <div style="background-color: #234c96; padding: 24px; color: white; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0;">EduNex</h1>
              <p style="margin-bottom: 0;">Club Management</p>
            </div>

            <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
              <h2>Congratulations, ${escapeHtml(student.name)}!</h2>

              <p>
                You have been appointed as a
                <strong>Club Coordinator</strong> at EduNex.
              </p>

              <div style="background-color: #f5f7fc; padding: 16px; border-radius: 8px;">
                <p style="margin-top: 0;">
                  <strong>Student:</strong>
                  ${escapeHtml(student.name)}
                </p>
                <p style="margin-bottom: 0;">
                  <strong>Club:</strong>
                  ${escapeHtml(club.name)}
                </p>
              </div>

              <p>
                Please log in to your EduNex account to view your
                club-related activities and responsibilities.
              </p>

              <p>
                Best regards,<br />
                <strong>EduNex Team</strong>
              </p>
            </div>
          </div>
        `,
      });

      emailSent = true;
    } catch (error) {
      console.error(
        "Coordinator assignment saved, but appointment email failed:",
        error,
      );
    }
  } else {
    console.warn(
      `Coordinator assignment ${assignment.id} saved, but the student has no registered email.`,
    );
  }

  // Send the secure password setup email.
let passwordSetupEmailSent = false;

if (student.email?.trim()) {
  try {
    await auth.api.requestPasswordReset({
  body: {
    email: student.email,
    redirectTo: `${
      process.env.WEB_URL || "http://localhost:3000"
    }/resetPassword?redirectTo=%2Fclub-coordinator-login`,
  },
});

    passwordSetupEmailSent = true;
  } catch (error) {
    console.error(
      "Coordinator appointment was saved, but the password setup email request failed:",
      error,
    );
  }
}

  // Return the saved assignment and email delivery status.
  return {
    assignment,
    emailSent,
  };
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

export const updateCoordinator = async (
  assignmentId: number,
  studentId: number,
  clubId: number,
) => {
  // 1. Check whether the coordinator assignment exists.
  const [existingAssignment] = await db
    .select()
    .from(coordinatorAssignments)
    .where(eq(coordinatorAssignments.id, assignmentId))
    .limit(1);

  if (!existingAssignment) {
    throw new Error("COORDINATOR_ASSIGNMENT_NOT_FOUND");
  }

  // 2. Check whether the selected student exists.
  const [student] = await db
    .select({ id: StudentProfile.id })
    .from(StudentProfile)
    .where(eq(StudentProfile.id, studentId))
    .limit(1);

  if (!student) {
    throw new Error("STUDENT_NOT_FOUND");
  }

  // 3. Check whether the selected club exists.
  const [club] = await db
    .select({ id: clubs.id })
    .from(clubs)
    .where(eq(clubs.id, clubId))
    .limit(1);

  if (!club) {
    throw new Error("CLUB_NOT_FOUND");
  }

  // 4. Prevent duplicate student-club assignments.
  const [duplicateAssignment] = await db
    .select({ id: coordinatorAssignments.id })
    .from(coordinatorAssignments)
    .where(
      and(
        eq(coordinatorAssignments.studentId, studentId),
        eq(coordinatorAssignments.clubId, clubId),
      ),
    )
    .limit(1);

  if (
    duplicateAssignment &&
    duplicateAssignment.id !== assignmentId
  ) {
    throw new Error("COORDINATOR_ALREADY_ASSIGNED");
  }

  // 5. Update the existing assignment.
  const [updatedAssignment] = await db
    .update(coordinatorAssignments)
    .set({
      studentId,
      clubId,
    })
    .where(eq(coordinatorAssignments.id, assignmentId))
    .returning();

  return updatedAssignment;
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