import { bigint, integer, pgTable, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema.js";
import { departments } from "./others-schema.js";

export const StudentProfile = pgTable("student-profile", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  name: text("name").notNull(),

  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),

  admissionNumber: text("admission-number")
    .notNull()
    .unique(),

  departmentId: bigint("department_id", { mode: "number" })
    .notNull()
    .references(() => departments.id, { onDelete: "restrict" }),

  semester: integer("semester").notNull(),

  phone: text("phone"),
});

export const StudentProfileRelation = relations(
  StudentProfile,
  ({ one }) => ({
    user: one(user, {
      fields: [StudentProfile.userId],
      references: [user.id],
    }),

    department: one(departments, {
      fields: [StudentProfile.departmentId],
      references: [departments.id],
    }),
  })
);