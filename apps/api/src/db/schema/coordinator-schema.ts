import {
  bigint,
  pgTable,
  timestamp,
  unique,
  foreignKey,
  text,
} from "drizzle-orm/pg-core";

import { StudentProfile } from "./student-profile.js";
import { clubs } from "./others-schema.js";
import { user } from "./auth-schema.js";

export const coordinatorAssignments = pgTable(
  "coordinator_assignments",
  {
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    studentId: bigint("student_id", { mode: "number" })
      .notNull(),

    clubId: bigint("club_id", { mode: "number" })
      .notNull(),

    appointedBy: text("appointed_by").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.studentId],
      foreignColumns: [StudentProfile.id],
      name: "coordinator_assignments_student_id_fkey",
    }).onDelete("cascade"),

    foreignKey({
      columns: [table.clubId],
      foreignColumns: [clubs.id],
      name: "coordinator_assignments_club_id_fkey",
    }).onDelete("cascade"),

    foreignKey({
      columns: [table.appointedBy],
      foreignColumns: [user.id],
      name: "coordinator_assignments_appointed_by_fkey",
    }).onDelete("restrict"),

    unique("coordinator_assignments_student_club_key").on(
      table.studentId,
      table.clubId,
    ),
  ],
);