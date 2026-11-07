
import { and, count, desc, eq, ilike } from "drizzle-orm";

import { db } from "../../config/database.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import { coordinatorAssignments } from "../../db/schema/coordinator-schema.js";
import { clubs } from "../../db/schema/others-schema.js";

export const getCoordinatorStatus = async (
  userId: string,
  search = "",
  page = 1,
  limit = 10,
) => {
  const [student] = await db
    .select({
      id: StudentProfile.id,
    })
    .from(StudentProfile)
    .where(eq(StudentProfile.userId, userId))
    .limit(1);

  if (!student) {
    return {
      isCoordinator: false,
      assignments: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }

  const conditions = [
    eq(coordinatorAssignments.studentId, student.id),
  ];

  if (search) {
    conditions.push(
      ilike(clubs.name, `%${search}%`),
    );
  }

  const whereCondition = and(...conditions);

  const [assignments, totalResult] = await Promise.all([
    db
      .select({
        id: coordinatorAssignments.id,
        studentId: coordinatorAssignments.studentId,
        clubId: coordinatorAssignments.clubId,
        clubName: clubs.name,
        clubDescription: clubs.description,
        appointedBy: coordinatorAssignments.appointedBy,
        createdAt: coordinatorAssignments.createdAt,
      })
      .from(coordinatorAssignments)
      .innerJoin(
        clubs,
        eq(coordinatorAssignments.clubId, clubs.id),
      )
      .where(whereCondition)
      .orderBy(desc(coordinatorAssignments.createdAt))
      .limit(limit)
      .offset((page - 1) * limit),

    db
      .select({
        total: count(),
      })
      .from(coordinatorAssignments)
      .innerJoin(
        clubs,
        eq(coordinatorAssignments.clubId, clubs.id),
      )
      .where(whereCondition),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return {
    isCoordinator: total > 0,
    assignments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
