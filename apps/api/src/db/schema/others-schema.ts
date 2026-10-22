import { pgTable, index, foreignKey, unique, text, timestamp, bigint, varchar, boolean, check, integer, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { user } from "./auth-schema.js";
import { StudentProfile } from "./student-profile.js";


export const departments = pgTable("departments", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "departments_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    name: varchar({ length: 100 }).notNull(),
    code: varchar({ length: 20 }).notNull(),
    description: text(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    unique("departments_name_key").on(table.name),
    unique("departments_code_key").on(table.code),
]);





export const clubs = pgTable("clubs", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "clubs_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    name: varchar({ length: 150 }).notNull(),
    description: text(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    departmentId: bigint("department_id", { mode: "number" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    foreignKey({
            columns: [table.departmentId],
            foreignColumns: [departments.id],
            name: "clubs_department_id_fkey"
        }).onDelete("set null"),
    unique("clubs_name_key").on(table.name),
]);

export const clubMemberships = pgTable("club_memberships", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "club_memberships_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    clubId: bigint("club_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    studentId: bigint("student_id", { mode: "number" }).notNull(),
    status: varchar({ length: 20 }).default('pending').notNull(),
    requestedAt: timestamp("requested_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
  foreignKey({
    columns: [table.clubId],
    foreignColumns: [clubs.id],
    name: "club_memberships_club_id_fkey",
  }).onDelete("cascade"),

  foreignKey({
    columns: [table.studentId],
    foreignColumns: [StudentProfile.id],
    name: "club_memberships_student_id_fkey",
  }).onDelete("cascade"),

  unique("club_memberships_club_id_student_id_key").on(
    table.clubId,
    table.studentId,
  ),

  check(
    "club_memberships_status_check",
    sql`status IN ('pending', 'approved', 'rejected')`,
  ),
]);

export const events = pgTable("events", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "events_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    clubId: bigint("club_id", { mode: "number" }).notNull(),
    title: varchar({ length: 200 }).notNull(),
    description: text(),
    location: varchar({ length: 255 }),
    startTime: timestamp("start_time", { withTimezone: true, mode: 'string' }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true, mode: 'string' }).notNull(),
    status: varchar({ length: 20 }).default('draft').notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    foreignKey({
            columns: [table.clubId],
            foreignColumns: [clubs.id],
            name: "events_club_id_fkey"
        }).onDelete("restrict"),
    check("events_status_check", sql`(status)::text = ANY ((ARRAY['draft'::character varying, 'pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'published'::character varying, 'cancelled'::character varying, 'completed'::character varying])::text[])`),
    check("valid_event_time", sql`end_time > start_time`),
]);

export const eventApprovals = pgTable("event_approvals", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "event_approvals_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    eventId: bigint("event_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    reviewerId: bigint("reviewer_id", { mode: "number" }).notNull(),
    reviewerRole: varchar("reviewer_role", { length: 20 }).notNull(),
    decision: varchar({ length: 20 }).notNull(),
    comments: text(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true, mode: 'string' }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    foreignKey({
            columns: [table.eventId],
            foreignColumns: [events.id],
            name: "event_approvals_event_id_fkey"
        }).onDelete("cascade"),
    check("event_approvals_reviewer_role_check", sql`(reviewer_role)::text = ANY ((ARRAY['hod'::character varying, 'admin'::character varying])::text[])`),
    check("event_approvals_decision_check", sql`(decision)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[])`),
]);

export const attendance = pgTable("attendance", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "attendance_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    eventId: bigint("event_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    studentId: bigint("student_id", { mode: "number" }).notNull(),
    status: varchar({ length: 20 }).default('present').notNull(),
    markedAt: timestamp("marked_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    foreignKey({
            columns: [table.eventId],
            foreignColumns: [events.id],
            name: "attendance_event_id_fkey"
        }).onDelete("cascade"),
    unique("attendance_event_id_student_id_key").on(table.eventId, table.studentId),
    check("attendance_status_check", sql`(status)::text = ANY ((ARRAY['present'::character varying, 'absent'::character varying])::text[])`),
]);

export const resources = pgTable("resources", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "resources_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    title: varchar({ length: 200 }).notNull(),
    description: text(),
    fileUrl: text("file_url").notNull(),
    fileType: varchar("file_type", { length: 50 }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    departmentId: bigint("department_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    uploadedBy: bigint("uploaded_by", { mode: "number" }).notNull(),
    visibility: varchar({ length: 20 }).default('department').notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    foreignKey({
            columns: [table.departmentId],
            foreignColumns: [departments.id],
            name: "resources_department_id_fkey"
        }).onDelete("set null"),
    check("resources_visibility_check", sql`(visibility)::text = ANY ((ARRAY['department'::character varying, 'campus'::character varying])::text[])`),
]);

export const announcements = pgTable("announcements", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "announcements_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    title: varchar({ length: 200 }).notNull(),
    content: text().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    departmentId: bigint("department_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    publishedBy: bigint("published_by", { mode: "number" }).notNull(),
    audience: varchar({ length: 20 }).default('campus').notNull(),
    clubId: bigint("club_id", { mode: "number" }),
    publishedAt: timestamp("published_at", { withTimezone: true, mode: 'string' }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    foreignKey({
            columns: [table.clubId],
  foreignColumns: [clubs.id],
  name: "announcements_club_id_fkey",
        }).onDelete("cascade"),
    check(
  "announcements_audience_check",
  sql`(audience)::text = ANY (
    (ARRAY['campus', 'department', 'club']::varchar[])::text[]
  )`,
),
]);

export const issues = pgTable("issues", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "issues_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    title: varchar({ length: 200 }).notNull(),
    description: text().notNull(),
    category: varchar({ length: 100 }),
    status: varchar({ length: 20 }).default('open').notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    reportedBy: bigint("reported_by", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    assignedTo: bigint("assigned_to", { mode: "number" }),
    response: text(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
    check("issues_status_check", sql`(status)::text = ANY ((ARRAY['open'::character varying, 'in_progress'::character varying, 'resolved'::character varying, 'rejected'::character varying])::text[])`),
]);

export const studyGroups = pgTable("study_groups", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "study_groups_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    name: varchar({ length: 150 }).notNull(),
    description: text(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    departmentId: bigint("department_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    createdBy: bigint("created_by", { mode: "number" }).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    foreignKey({
            columns: [table.departmentId],
            foreignColumns: [departments.id],
            name: "study_groups_department_id_fkey"
        }).onDelete("set null"),
]);

export const studyGroupMembers = pgTable("study_group_members", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "study_group_members_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    studyGroupId: bigint("study_group_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    studentId: bigint("student_id", { mode: "number" }).notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    foreignKey({
            columns: [table.studyGroupId],
            foreignColumns: [studyGroups.id],
            name: "study_group_members_study_group_id_fkey"
        }).onDelete("cascade"),
    unique("study_group_members_study_group_id_student_id_key").on(table.studentId, table.studyGroupId),
]);

export const lostAndFound = pgTable("lost_and_found", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "lost_and_found_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    title: varchar({ length: 200 }).notNull(),
    description: text(),
    category: varchar({ length: 100 }),
    itemType: varchar("item_type", { length: 10 }).notNull(),
    location: varchar({ length: 255 }),
    imageUrl: text("image_url"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    reportedBy: bigint("reported_by", { mode: "number" }).notNull(),
    status: varchar({ length: 20 }).default('active').notNull(),
    reportedAt: timestamp("reported_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    check("lost_and_found_item_type_check", sql`(item_type)::text = ANY ((ARRAY['lost'::character varying, 'found'::character varying])::text[])`),
    check("lost_and_found_status_check", sql`(status)::text = ANY ((ARRAY['active'::character varying, 'claimed'::character varying, 'returned'::character varying, 'closed'::character varying])::text[])`),
]);

export const notifications = pgTable("notifications", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "notifications_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    userId: text("user_id").notNull(),
    title: varchar({ length: 200 }).notNull(),
    message: text().notNull(),
    notificationType: varchar("notification_type", { length: 50 }).notNull(),
    referenceType: varchar("reference_type", { length: 50 }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    referenceId: bigint("reference_id", { mode: "number" }),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    readAt: timestamp("read_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
    foreignKey({
            columns: [table.userId],
            foreignColumns: [user.id],
            name: "notifications_user_id_user_id_fk"
        }).onDelete("cascade"),
]);




