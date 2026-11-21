import {
  pgTable,
  bigint,
  text,
  varchar,
  integer,
  date,
  timestamp,
  foreignKey,
  unique,
  index,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { departments } from "./others-schema.js";
import { staff } from "./staff-schema.js";
import { StudentProfile } from "./student-profile.js";

// A subject taught to one semester of one department.
export const subjects = pgTable(
  "subjects",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 150 }).notNull(),
    code: varchar({ length: 30 }).notNull(),
    departmentId: bigint("department_id", { mode: "number" }).notNull(),
    semester: integer().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.departmentId],
      foreignColumns: [departments.id],
      name: "subjects_department_id_fkey",
    }).onDelete("restrict"),
    unique("subjects_code_department_key").on(table.code, table.departmentId),
    index("subjects_department_semester_idx").on(
      table.departmentId,
      table.semester,
    ),
  ],
);

// Which faculty member teaches which subject.
export const facultySubjects = pgTable(
  "faculty_subjects",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    staffId: text("staff_id").notNull(),
    subjectId: bigint("subject_id", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.staffId],
      foreignColumns: [staff.id],
      name: "faculty_subjects_staff_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.subjectId],
      foreignColumns: [subjects.id],
      name: "faculty_subjects_subject_id_fkey",
    }).onDelete("cascade"),
    unique("faculty_subjects_staff_subject_key").on(
      table.staffId,
      table.subjectId,
    ),
  ],
);

// One class that was held: a subject, on a date, in a period.
export const classSessions = pgTable(
  "class_sessions",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    subjectId: bigint("subject_id", { mode: "number" }).notNull(),
    takenBy: text("taken_by").notNull(),
    sessionDate: date("session_date", { mode: "string" }).notNull(),
    period: integer().default(1).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.subjectId],
      foreignColumns: [subjects.id],
      name: "class_sessions_subject_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.takenBy],
      foreignColumns: [staff.id],
      name: "class_sessions_taken_by_fkey",
    }).onDelete("restrict"),
    unique("class_sessions_subject_date_period_key").on(
      table.subjectId,
      table.sessionDate,
      table.period,
    ),
    index("class_sessions_date_idx").on(table.sessionDate),
    check("class_sessions_period_check", sql`period >= 1 AND period <= 12`),
  ],
);

// One student's status in one class session.
export const classAttendance = pgTable(
  "class_attendance",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    sessionId: bigint("session_id", { mode: "number" }).notNull(),
    studentId: bigint("student_id", { mode: "number" }).notNull(),
    status: varchar({ length: 10 }).default("present").notNull(),
    remark: text(),
    markedAt: timestamp("marked_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.sessionId],
      foreignColumns: [classSessions.id],
      name: "class_attendance_session_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.studentId],
      foreignColumns: [StudentProfile.id],
      name: "class_attendance_student_id_fkey",
    }).onDelete("cascade"),
    unique("class_attendance_session_student_key").on(
      table.sessionId,
      table.studentId,
    ),
    index("class_attendance_student_idx").on(table.studentId),
    check(
      "class_attendance_status_check",
      sql`status IN ('present', 'absent', 'late')`,
    ),
  ],
);