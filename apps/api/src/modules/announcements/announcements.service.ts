
import {
  and,
  count,
  desc,
  eq,
  ilike,
  inArray,
  or,
} from "drizzle-orm";

import { db } from "../../config/database.js";
import {announcements,clubMemberships,} from "../../db/schema/others-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import { coordinatorAssignments } from "../../db/schema/coordinator-schema.js";
import { staff } from "../../db/schema/staff-schema.js";

import {hasRole,loadAccess,} from "../rbac/rbac.access.js";

import type {
  AnnouncementsQuery,
  CreateAnnouncement,
  UpdateAnnouncement,
} from "./announcements.validation.js";
import { notifyMany } from "../../lib/notify.js";


// Search announcements by title or content.
const getAnnouncementSearchCondition = (search: string) => {
  if (!search) return undefined;

  return or(
    ilike(announcements.title, `%${search}%`),
    ilike(announcements.content, `%${search}%`),
  );
};

// Pagination helper, following the Events service.
const getPagination = (
  page: number,
  limit: number,
  total: number,
) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

// Get announcements visible to the logged-in user.
export const getAnnouncements = async (
  userId: string,
  { search = "", page = 1, limit = 10 }: AnnouncementsQuery,
) => {
  const access = await loadAccess(userId);

  if (!access) {
    return null;
  }

  // Super Admin can view every announcement.
  let visibilityCondition;

  if (!access.isSuperAdmin) {
    const visibilityConditions = [
      eq(announcements.audience, "campus"),
    ];

    // Find the user's department through their staff profile.
    const [staffRow] = await db
      .select({ departmentId: staff.departmentId })
      .from(staff)
      .where(eq(staff.userId, userId))
      .limit(1);

    // Find the user's department through their student profile.
    const [student] = await db
      .select({
        id: StudentProfile.id,
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

    const departmentId =
      staffRow?.departmentId ?? student?.departmentId;

    if (departmentId) {
      visibilityConditions.push(
        and(
          eq(announcements.audience, "department"),
          eq(announcements.departmentId, departmentId),
        )!,
      );
    }

    // Collect clubs where the user is an approved member.
    const membershipRows = student
      ? await db
          .select({ clubId: clubMemberships.clubId })
          .from(clubMemberships)
          .where(
            and(
              eq(clubMemberships.studentId, student.id),
              eq(clubMemberships.status, "approved"),
            ),
          )
      : [];

    // Collect clubs where the user is an assigned coordinator.
    const assignmentRows = student
      ? await db
          .select({ clubId: coordinatorAssignments.clubId })
          .from(coordinatorAssignments)
          .where(eq(coordinatorAssignments.studentId, student.id))
      : [];

    const clubIds = [
      ...new Set([
        ...membershipRows.map((row) => row.clubId),
        ...assignmentRows.map((row) => row.clubId),
      ]),
    ];

    if (clubIds.length > 0) {
      visibilityConditions.push(
        and(
          eq(announcements.audience, "club"),
          inArray(announcements.clubId, clubIds),
        )!,
      );
    }

    visibilityCondition = or(...visibilityConditions);
  }

  const whereCondition = and(
    getAnnouncementSearchCondition(search),
    visibilityCondition,
  );

  const [announcementList, totalResult] = await Promise.all([
    db
      .select()
      .from(announcements)
      .where(whereCondition)
      .orderBy(desc(announcements.publishedAt))
      .limit(limit)
      .offset((page - 1) * limit),

    db
      .select({ total: count() })
      .from(announcements)
      .where(whereCondition),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return {
    announcements: announcementList,
    pagination: getPagination(page, limit, total),
  };
};


const getAnnouncementRecipientIds = async (
  audience: "campus" | "department" | "club",
  senderId: string,
  departmentId: number | null,
  clubId: number | null,
): Promise<string[]> => {
  let userIds: string[] = [];

  // CAMPUS: All active students and active staff.
  if (audience === "campus") {
    const studentRows = await db
      .select({ userId: StudentProfile.userId })
      .from(StudentProfile)
      .where(eq(StudentProfile.isDeleted, false));

    const staffRows = await db
      .select({ userId: staff.userId })
      .from(staff)
      .where(eq(staff.isActive, true));

    userIds = [
      ...studentRows.map((row) => row.userId),
      ...staffRows.map((row) => row.userId),
    ];
  }

  // DEPARTMENT: Students and staff in the selected department.
  if (audience === "department" && departmentId !== null) {
    const studentRows = await db
      .select({ userId: StudentProfile.userId })
      .from(StudentProfile)
      .where(
        and(
          eq(StudentProfile.departmentId, departmentId),
          eq(StudentProfile.isDeleted, false),
        ),
      );

    const staffRows = await db
      .select({ userId: staff.userId })
      .from(staff)
      .where(
        and(
          eq(staff.departmentId, departmentId),
          eq(staff.isActive, true),
        ),
      );

    userIds = [
      ...studentRows.map((row) => row.userId),
      ...staffRows.map((row) => row.userId),
    ];
  }

  // CLUB: Approved members and assigned coordinators.
  if (audience === "club" && clubId !== null) {
    const memberRows = await db
      .select({ userId: StudentProfile.userId })
      .from(clubMemberships)
      .innerJoin(
        StudentProfile,
        eq(clubMemberships.studentId, StudentProfile.id),
      )
      .where(
        and(
          eq(clubMemberships.clubId, clubId),
          eq(clubMemberships.status, "approved"),
          eq(StudentProfile.isDeleted, false),
        ),
      );

    const coordinatorRows = await db
      .select({ userId: StudentProfile.userId })
      .from(coordinatorAssignments)
      .innerJoin(
        StudentProfile,
        eq(coordinatorAssignments.studentId, StudentProfile.id),
      )
      .where(
        and(
          eq(coordinatorAssignments.clubId, clubId),
          eq(StudentProfile.isDeleted, false),
        ),
      );

    userIds = [
      ...memberRows.map((row) => row.userId),
      ...coordinatorRows.map((row) => row.userId),
    ];
  }

  // Remove duplicates and exclude the announcement publisher.
  return [
    ...new Set(userIds.filter((id) => id !== senderId)),
  ];
};



// Create an announcement according to the user's role and scope.
export const createAnnouncement = async (
  userId: string,
  data: CreateAnnouncement,
) => {
  const access = await loadAccess(userId);

  if (!access) {
    return null;
  }

  let departmentId: number | null = null;
  let clubId: number | null = null;

  // CAMPUS ANNOUNCEMENT
  if (data.audience === "campus") {
    // Only Super Admin can publish campus announcements.
    if (!access.isSuperAdmin) {
      return null;
    }
  }

  // DEPARTMENT ANNOUNCEMENT
  if (data.audience === "department") {
    if (access.isSuperAdmin) {
      // Super Admin must select the target department.
      if (!data.departmentId) return null;

      departmentId = data.departmentId;
    } else {
      // Only HOD can publish department announcements.
      if (!hasRole(access, "hod")) {
        return null;
      }

      const [hod] = await db
        .select({ departmentId: staff.departmentId })
        .from(staff)
        .where(eq(staff.userId, userId))
        .limit(1);

      if (!hod?.departmentId) return null;

      // HOD can publish only to their own department.
      departmentId = hod.departmentId;
    }
  }

  // CLUB ANNOUNCEMENT
  if (data.audience === "club") {
    if (access.isSuperAdmin) {
      if (!data.clubId) return null;

      clubId = data.clubId;
    } else {
      // Only assigned student coordinators can publish club announcements.
      if (!hasRole(access, "student") || !data.clubId) {
        return null;
      }

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

      if (!student) return null;

      const [assignment] = await db
        .select({ id: coordinatorAssignments.id })
        .from(coordinatorAssignments)
        .where(
          and(
            eq(coordinatorAssignments.studentId, student.id),
            eq(coordinatorAssignments.clubId, data.clubId),
          ),
        )
        .limit(1);

      if (!assignment) return null;

      clubId = data.clubId;
    }
  }

  // CREATE ANNOUNCEMENT
  const [newAnnouncement] = await db
    .insert(announcements)
    .values({
      title: data.title,
      content: data.content,
      audience: data.audience,
      departmentId,
      clubId,
      publishedBy: userId,
      publishedAt: new Date().toISOString(),
    })
    .returning();

  if (!newAnnouncement) {
    return null;
  }

  // FIND RECIPIENTS
  const recipientIds = await getAnnouncementRecipientIds(
    data.audience,
    userId,
    departmentId,
    clubId,
  );

  // SEND NOTIFICATIONS
  try {
    await notifyMany(recipientIds, {
      title: "New Announcement",
      message: newAnnouncement.title,
      notificationType: "announcement",
      referenceType: "announcement",
      referenceId: newAnnouncement.id,
    });
  } catch (error) {
    // The announcement is already saved.
    // A notification failure should not undo the announcement.
    console.error(
      "Failed to send announcement notifications:",
      error,
    );
  }

  return newAnnouncement;
};



const canManageAnnouncement = async (
  userId: string,
  announcement: typeof announcements.$inferSelect,
  access: Awaited<ReturnType<typeof loadAccess>>,
) => {
  if (!access) return false;

  if (access.isSuperAdmin) return true;

  if (announcement.audience === "department" && hasRole(access, "hod")) {
    const [hod] = await db
      .select({ departmentId: staff.departmentId })
      .from(staff)
      .where(eq(staff.userId, userId))
      .limit(1);

    return (
      !!hod?.departmentId &&
      hod.departmentId === announcement.departmentId
    );
  }

  if (announcement.audience === "club" && hasRole(access, "student")) {
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

    if (!student || !announcement.clubId) return false;

    const [assignment] = await db
      .select({ id: coordinatorAssignments.id })
      .from(coordinatorAssignments)
      .where(
        and(
          eq(coordinatorAssignments.studentId, student.id),
          eq(coordinatorAssignments.clubId, announcement.clubId),
        ),
      )
      .limit(1);

    return !!assignment;
  }

  return false;
};



export const updateAnnouncement = async (
  userId: string,
  announcementId: number,
  data: UpdateAnnouncement,
) => {
  const access = await loadAccess(userId);
  if (!access) return null;

  const [announcement] = await db
    .select()
    .from(announcements)
    .where(eq(announcements.id, announcementId))
    .limit(1);

  if (!announcement) return null;

  const allowed = await canManageAnnouncement(
    userId,
    announcement,
    access,
  );

  if (!allowed) return null;

  const [updatedAnnouncement] = await db
    .update(announcements)
    .set({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(announcements.id, announcementId))
    .returning();

  return updatedAnnouncement;
};



export const deleteAnnouncement = async (
  userId: string,
  announcementId: number,
) => {
  const access = await loadAccess(userId);
  if (!access) return null;

  const [announcement] = await db
    .select()
    .from(announcements)
    .where(eq(announcements.id, announcementId))
    .limit(1);

  if (!announcement) return null;

  const allowed = await canManageAnnouncement(
    userId,
    announcement,
    access,
  );

  if (!allowed) return null;

  const [deletedAnnouncement] = await db
    .delete(announcements)
    .where(eq(announcements.id, announcementId))
    .returning();

  return deletedAnnouncement;
};
