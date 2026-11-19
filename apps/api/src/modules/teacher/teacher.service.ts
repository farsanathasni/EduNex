
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  or,
  type SQL,
} from "drizzle-orm";

import { db } from "../../config/database.js";
import { staff } from "../../db/schema/staff-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import {
  departments,
  resources,
} from "../../db/schema/others-schema.js";
import { notifyMany } from "../../lib/notify.js";

type MaterialInput = {
  title: string;
  description?: string;
  fileUrl: string;
  fileType?: string;
  visibility: "department" | "campus";
};

type TeacherContext = {
  id: string;
  departmentId: number;
  departmentName: string | null;
};

// Get logged-in teacher details
async function getTeacherContext(
  userId: string,
): Promise<TeacherContext> {
  const [teacher] = await db
    .select({
      id: staff.id,
      departmentId: staff.departmentId,
      departmentName: departments.name,
    })
    .from(staff)
    .leftJoin(
      departments,
      eq(staff.departmentId, departments.id),
    )
    .where(
      and(
        eq(staff.userId, userId),
        eq(staff.role, "faculty"),
        eq(staff.isActive, true),
      ),
    )
    .limit(1);

  if (!teacher) {
    throw new Error("TEACHER_NOT_FOUND");
  }

  if (teacher.departmentId === null) {
    throw new Error("TEACHER_DEPARTMENT_NOT_ASSIGNED");
  }

  return {
    id: teacher.id,
    departmentId: teacher.departmentId,
    departmentName: teacher.departmentName,
  };
}

// Dashboard overview
export async function getTeacherDashboard(userId: string) {
  const teacher = await getTeacherContext(userId);

  const [studentCount] = await db
    .select({ total: count() })
    .from(StudentProfile)
    .where(
      and(
        eq(StudentProfile.departmentId, teacher.departmentId),
        eq(StudentProfile.isDeleted, false),
      ),
    );

  const [materialCount] = await db
    .select({ total: count() })
    .from(resources)
    .where(
      eq(resources.departmentId, teacher.departmentId),
    );

  const semesters = await getTeacherClasses(userId);

  return {
    teacher,
    totalStudents: studentCount.total,
    totalMaterials: materialCount.total,
    totalSemesters: semesters.length,
  };
}

// My Classes
// Currently, semesters are used as classes because
// separate class and faculty-assignment tables do not exist.
export async function getTeacherClasses(userId: string) {
  const teacher = await getTeacherContext(userId);

  return db
    .selectDistinct({
      semester: StudentProfile.semester,
    })
    .from(StudentProfile)
    .where(
      and(
        eq(StudentProfile.departmentId, teacher.departmentId),
        eq(StudentProfile.isDeleted, false),
      ),
    )
    .orderBy(asc(StudentProfile.semester));
}

// My Students
export async function getTeacherStudents(
  userId: string,
  semester?: number,
  search = "",
  page = 1,
  limit = 10,
) {
  const teacher = await getTeacherContext(userId);

  const conditions: SQL[] = [
    eq(StudentProfile.departmentId, teacher.departmentId),
    eq(StudentProfile.isDeleted, false),
  ];

  if (semester !== undefined) {
    conditions.push(
      eq(StudentProfile.semester, semester),
    );
  }

  if (search.trim()) {
    const searchTerm = `%${search.trim()}%`;

    const searchCondition = or(
      ilike(StudentProfile.name, searchTerm),
      ilike(StudentProfile.admissionNumber, searchTerm),
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
        name: StudentProfile.name,
        admissionNumber: StudentProfile.admissionNumber,
        semester: StudentProfile.semester,
        phone: StudentProfile.phone,
      })
      .from(StudentProfile)
      .where(whereCondition)
      .orderBy(asc(StudentProfile.name))
      .limit(limit)
      .offset(offset),

    db
      .select({ total: count() })
      .from(StudentProfile)
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
}

// List study materials
export async function getTeacherMaterials(userId: string) {
  const teacher = await getTeacherContext(userId);

  return db
    .select({
      id: resources.id,
      title: resources.title,
      description: resources.description,
      fileUrl: resources.fileUrl,
      fileType: resources.fileType,
      visibility: resources.visibility,
      createdAt: resources.createdAt,
    })
    .from(resources)
    .where(
      eq(resources.departmentId, teacher.departmentId),
    )
    .orderBy(desc(resources.createdAt));
}

// Create study material record
export async function createTeacherMaterial(
  userId: string,
  input: MaterialInput,
) {
  const teacher = await getTeacherContext(userId);

  const [material] = await db
    .insert(resources)
    .values({
      title: input.title,
      description: input.description,
      fileUrl: input.fileUrl,
      fileType: input.fileType,
      departmentId: teacher.departmentId,
      uploadedBy: teacher.id,
      visibility: input.visibility,
    })
    .returning();

      try {
    const students = await db
      .select({ userId: StudentProfile.userId })
      .from(StudentProfile)
      .where(
        and(
          eq(StudentProfile.isDeleted, false),
          input.visibility === "department"
            ? eq(StudentProfile.departmentId, teacher.departmentId)
            : undefined,
        ),
      );

    await notifyMany(
      students.map((s) => s.userId),
      {
        title: "New study material",
        message: `"${material.title}" was added.`,
        notificationType: "resource_added",
        referenceType: "resource",
        referenceId: material.id,
      },
    );
  } catch (err) {
    console.error("Failed to send study material notification", err);
  }

  return material;

}

// Delete only materials uploaded by this teacher
export async function deleteTeacherMaterial(
  userId: string,
  materialId: number,
) {
  const teacher = await getTeacherContext(userId);

  const [deleted] = await db
    .delete(resources)
    .where(
      and(
        eq(resources.id, materialId),
        eq(resources.departmentId, teacher.departmentId),
        eq(resources.uploadedBy, teacher.id),
      ),
    )
    .returning({
      id: resources.id,
    });

  if (!deleted) {
    throw new Error("MATERIAL_NOT_FOUND_OR_FORBIDDEN");
  }

  return deleted;
}
  
