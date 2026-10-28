
import {
  eq,
  and,
  count,
  ilike,
  or,
  type SQL,
} from "drizzle-orm";

import { db } from "../../config/database.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import { departments, clubs } from "../../db/schema/others-schema.js";
import { user } from "../../db/schema/auth-schema.js";
import { coordinatorAssignments } from "../../db/schema/coordinator-schema.js";
import { roles, userRoles } from "../../db/schema/rbac-schema.js";
import { sendEmail } from "../../utils/email.js";

type CreateStudentProfileData = {
  userId: string;
  name: string;
  admissionNumber: string;
  departmentId: number;
  semester: number;
  phone: string | null;
};

type GetStudentsParams = {
  departmentId?: number;
  semester?: number;
  search?: string;
  page?: number;
  limit?: number;
};

// Find the club-coordinator role.
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

// Assign the coordinator role if the student does not already have it.
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

// Escape HTML values before inserting them into an email template.
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

export const studentService = {
  // Create a student profile.
  createProfile: async (data: CreateStudentProfileData) => {
    const existingStudent = await db
      .select()
      .from(StudentProfile)
      .where(eq(StudentProfile.userId, data.userId))
      .limit(1);

    if (existingStudent.length > 0) {
      return {
        alreadyExists: true,
        student: existingStudent[0],
      };
    }

    const [student] = await db
      .insert(StudentProfile)
      .values({
        userId: data.userId,
        name: data.name,
        admissionNumber: data.admissionNumber,
        departmentId: data.departmentId,
        semester: data.semester,
        phone: data.phone,
      })
      .returning();

    return {
      alreadyExists: false,
      student,
    };
  },

  // Get the logged-in student's profile.
  getProfile: async (userId: string) => {
    const [student] = await db
      .select()
      .from(StudentProfile)
      .where(
        and(
          eq(StudentProfile.userId, userId),
          eq(StudentProfile.isDeleted, false),
        ),
      )
      .limit(1);

    return student ?? null;
  },

  // Get students with search, filters, and pagination.
  getStudents: async ({
    departmentId,
    semester,
    search,
    page = 1,
    limit = 10,
  }: GetStudentsParams = {}) => {
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
          userId: StudentProfile.userId,
          name: StudentProfile.name,
          admissionNumber: StudentProfile.admissionNumber,
          departmentId: StudentProfile.departmentId,
          departmentName: departments.name,
          semester: StudentProfile.semester,
          phone: StudentProfile.phone,
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
  },

  // Update a student's profile.
  updateProfile: async (
    studentId: number,
    data: {
      name?: string;
      admissionNumber?: string;
      departmentId?: number;
      semester?: number;
      phone?: string | null;
    },
  ) => {
    const result = await db
      .update(StudentProfile)
      .set(data)
      .where(
        and(
          eq(StudentProfile.id, studentId),
          eq(StudentProfile.isDeleted, false),
        ),
      )
      .returning();

    return Array.isArray(result)
      ? result[0] ?? null
      : null;
  },

  // Soft-delete a student's profile.
  softDelete: async (studentId: number) => {
    const result = await db
      .update(StudentProfile)
      .set({
        isDeleted: true,
      })
      .where(
        and(
          eq(StudentProfile.id, studentId),
          eq(StudentProfile.isDeleted, false),
        ),
      )
      .returning();

    return Array.isArray(result)
      ? result[0] ?? null
      : null;
  },

  // Create a coordinator assignment within the HOD's department.
  createCoordinator: async (
    studentId: number,
    clubId: number,
    appointedBy: string,
    departmentId: number,
  ) => {
    const [student] = await db
      .select({
        id: StudentProfile.id,
        userId: StudentProfile.userId,
        name: StudentProfile.name,
        email: user.email,
      })
      .from(StudentProfile)
      .innerJoin(
        user,
        eq(StudentProfile.userId, user.id),
      )
      .where(
        and(
          eq(StudentProfile.id, studentId),
          eq(StudentProfile.isDeleted, false),
          eq(StudentProfile.departmentId, departmentId),
        ),
      )
      .limit(1);

    if (!student) {
      throw new Error("STUDENT_NOT_FOUND_OR_FORBIDDEN");
    }

    const [club] = await db
      .select({
        id: clubs.id,
        name: clubs.name,
      })
      .from(clubs)
      .where(
        and(
          eq(clubs.id, clubId),
          eq(clubs.departmentId, departmentId),
        ),
      )
      .limit(1);

    if (!club) {
      throw new Error("CLUB_NOT_FOUND_OR_FORBIDDEN");
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

    // Save the assignment and role in one transaction.
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

    // Send the appointment email after saving the assignment.
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
                  <p>
                    <strong>Student:</strong>
                    ${escapeHtml(student.name)}
                  </p>
                  <p>
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
  },

  // Get coordinator assignments with department filtering, search, and pagination.
  getCoordinatorAssignments: async (
    departmentId: number,
    search = "",
    page = 1,
    limit = 10,
  ) => {
    const conditions: SQL[] = [
      eq(StudentProfile.isDeleted, false),
      eq(clubs.departmentId, departmentId),
    ];

    if (search.trim()) {
      const searchTerm = `%${search.trim()}%`;

      const searchCondition = or(
        ilike(StudentProfile.name, searchTerm),
        ilike(StudentProfile.admissionNumber, searchTerm),
        ilike(clubs.name, searchTerm),
      );

      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    const whereCondition = and(...conditions);
    const offset = (page - 1) * limit;

    const [assignments, totalResult] = await Promise.all([
      db
        .select({
          id: coordinatorAssignments.id,
          studentId: coordinatorAssignments.studentId,
          studentName: StudentProfile.name,
          admissionNumber: StudentProfile.admissionNumber,
          clubId: coordinatorAssignments.clubId,
          clubName: clubs.name,
          appointedBy: coordinatorAssignments.appointedBy,
          createdAt: coordinatorAssignments.createdAt,
        })
        .from(coordinatorAssignments)
        .innerJoin(
          StudentProfile,
          eq(
            coordinatorAssignments.studentId,
            StudentProfile.id,
          ),
        )
        .innerJoin(
          clubs,
          eq(coordinatorAssignments.clubId, clubs.id),
        )
        .where(whereCondition)
        .limit(limit)
        .offset(offset),

      db
        .select({ total: count() })
        .from(coordinatorAssignments)
        .innerJoin(
          StudentProfile,
          eq(
            coordinatorAssignments.studentId,
            StudentProfile.id,
          ),
        )
        .innerJoin(
          clubs,
          eq(coordinatorAssignments.clubId, clubs.id),
        )
        .where(whereCondition),
    ]);

    const total = totalResult[0].total;

    return {
      assignments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Update a coordinator assignment within the HOD's department.

  // Update a coordinator assignment within the HOD's department.
  updateCoordinator: async (
    assignmentId: number,
    studentId: number,
    clubId: number,
    departmentId: number,
  ) => {
    const [existingAssignment] = await db
      .select({
        id: coordinatorAssignments.id,
        studentId: coordinatorAssignments.studentId,
        clubId: coordinatorAssignments.clubId,
        appointedBy: coordinatorAssignments.appointedBy,
      })
      .from(coordinatorAssignments)
      .innerJoin(
        clubs,
        eq(coordinatorAssignments.clubId, clubs.id),
      )
      .where(
        and(
          eq(coordinatorAssignments.id, assignmentId),
          eq(clubs.departmentId, departmentId),
        ),
      )
      .limit(1);

    if (!existingAssignment) {
      throw new Error("COORDINATOR_ASSIGNMENT_NOT_FOUND");
    }

    const [student] = await db
      .select({
        id: StudentProfile.id,
        userId: StudentProfile.userId,
      })
      .from(StudentProfile)
      .where(
        and(
          eq(StudentProfile.id, studentId),
          eq(StudentProfile.isDeleted, false),
          eq(StudentProfile.departmentId, departmentId),
        ),
      )
      .limit(1);

    if (!student) {
      throw new Error("STUDENT_NOT_FOUND_OR_FORBIDDEN");
    }

    const [club] = await db
      .select({
        id: clubs.id,
      })
      .from(clubs)
      .where(
        and(
          eq(clubs.id, clubId),
          eq(clubs.departmentId, departmentId),
        ),
      )
      .limit(1);

    if (!club) {
      throw new Error("CLUB_NOT_FOUND_OR_FORBIDDEN");
    }

    const [duplicateAssignment] = await db
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

    if (
      duplicateAssignment &&
      duplicateAssignment.id !== assignmentId
    ) {
      throw new Error("COORDINATOR_ALREADY_ASSIGNED");
    }

    const coordinatorRole = await getClubCoordinatorRole();

    return db.transaction(async (tx) => {
      const result = await tx
        .update(coordinatorAssignments)
        .set({
          studentId,
          clubId,
        })
        .where(
          and(
            eq(coordinatorAssignments.id, assignmentId),
          ),
        )
        .returning();

      const assignment = Array.isArray(result)
        ? result[0] ?? null
        : null;

      if (!assignment) {
        throw new Error("COORDINATOR_ASSIGNMENT_NOT_FOUND");
      }

      await assignCoordinatorRole(
        tx,
        student.userId,
        coordinatorRole.id,
        existingAssignment.appointedBy,
      );

      // Remove the old student's role only if they have no
      // remaining coordinator assignments.
      if (existingAssignment.studentId !== studentId) {
        const [oldStudent] = await tx
          .select({
            userId: StudentProfile.userId,
          })
          .from(StudentProfile)
          .where(
            eq(
              StudentProfile.id,
              existingAssignment.studentId,
            ),
          )
          .limit(1);

        if (oldStudent) {
          const [otherAssignment] = await tx
            .select({
              id: coordinatorAssignments.id,
            })
            .from(coordinatorAssignments)
            .where(
              eq(
                coordinatorAssignments.studentId,
                existingAssignment.studentId,
              ),
            )
            .limit(1);

          if (!otherAssignment) {
            await tx
              .delete(userRoles)
              .where(
                and(
                  eq(userRoles.userId, oldStudent.userId),
                  eq(userRoles.roleId, coordinatorRole.id),
                ),
              );
          }
        }
      }

      return assignment;
    });
  },

};
