
import { eq, and, count,ilike,or } from "drizzle-orm";
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
import { roles, userRoles } from "../../db/schema/rbac-schema.js";
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
    db
      .select({ total: count() })
      .from(StudentProfile),

    db
      .select({ total: count() })
      .from(staff),

    db
      .select({ total: count() })
      .from(coordinatorAssignments),

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
  search?: string,
  page = 1,
  limit = 10,
) => {
  const conditions: SQL[] = [];

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

  const whereCondition =
    conditions.length > 0 ? and(...conditions) : undefined;

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
      .innerJoin(user, eq(StudentProfile.userId, user.id))
      .where(whereCondition)
      .limit(limit)
      .offset(offset),

    db
      .select({ total: count() })
      .from(StudentProfile)
      .innerJoin(user, eq(StudentProfile.userId, user.id))
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


export const getHodClubs = async () => {
  return db
    .select({
      id: clubs.id,
      name: clubs.name,
      departmentId: clubs.departmentId,
    })
    .from(clubs);
};



const getClubCoordinatorRole = async () => {
  const [role] = await db
    .select({
      id: roles.id,
    })
    .from(roles)
    .where(eq(roles.slug, "club-coordinator"))
    .limit(1);

  if (!role) {
    throw new Error(
      "CLUB_COORDINATOR_ROLE_NOT_FOUND: Run the RBAC seed script first.",
    );
  }

  return role;
};



const assignCoordinatorRole = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  userId: string,
  roleId: number,
  assignedBy: string,
) => {
  const [existingRole] = await tx
    .select({
      id: userRoles.id,
    })
    .from(userRoles)
    .where(
      and(
        eq(userRoles.userId, userId),
        eq(userRoles.roleId, roleId),
      ),
    )
    .limit(1);

  if (!existingRole) {
    await tx.insert(userRoles).values({
      userId,
      roleId,
      assignedBy,
    });
  }
};



const removeCoordinatorRoleIfUnused = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  studentId: number,
  roleId: number,
) => {
  const [remainingAssignment] = await tx
    .select({
      id: coordinatorAssignments.id,
    })
    .from(coordinatorAssignments)
    .where(eq(coordinatorAssignments.studentId, studentId))
    .limit(1);

  if (remainingAssignment) {
    return;
  }

  const [student] = await tx
    .select({
      userId: StudentProfile.userId,
    })
    .from(StudentProfile)
    .where(eq(StudentProfile.id, studentId))
    .limit(1);

  if (!student) {
    return;
  }

  await tx
    .delete(userRoles)
    .where(
      and(
        eq(userRoles.userId, student.userId),
        eq(userRoles.roleId, roleId),
      ),
    );
};



export const createCoordinator = async (
  studentId: number,
  clubId: number,
  appointedBy: string,
) => {
  const [student] = await db
    .select({
      id: StudentProfile.id,
      userId: StudentProfile.userId,
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

  const [existingAssignment] = await db
    .select({
      id: coordinatorAssignments.id,
    })
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

  const coordinatorRole = await getClubCoordinatorRole();


  const assignment = await db.transaction(async (tx) => {
    const [newAssignment] = await tx
      .insert(coordinatorAssignments)
      .values({
        studentId,
        clubId,
        appointedBy,
      })
      .returning();

    await assignCoordinatorRole(
      tx,
      student.userId,
      coordinatorRole.id,
      appointedBy,
    );

    return newAssignment;
  });

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
                Please log in to your existing EduNex account to view your
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

  return {
    assignment,
    emailSent,
  };
};




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
