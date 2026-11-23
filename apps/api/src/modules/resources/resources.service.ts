import { and, desc, eq, or } from "drizzle-orm";

import { db } from "../../config/database.js";
import { resources } from "../../db/schema/others-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";

export async function getStudentMaterials(userId: string) {
  const [student] = await db
    .select({
      departmentId: StudentProfile.departmentId,
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

  return db
    .select({
      id: resources.id,
      title: resources.title,
      description: resources.description,
      fileUrl: resources.fileUrl,
      fileType: resources.fileType,
      filePublicId: resources.filePublicId,
      fileResourceType: resources.fileResourceType,
      fileSize: resources.fileSize,
      fileName: resources.fileName,
      visibility: resources.visibility,
      createdAt: resources.createdAt,
    })
    .from(resources)
    .where(
      or(
        eq(resources.visibility, "campus"),
        and(
          eq(resources.visibility, "department"),
          eq(resources.departmentId, student.departmentId),
        ),
      ),
    )
    .orderBy(desc(resources.createdAt));
}
