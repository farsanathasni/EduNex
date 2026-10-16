import {
  pgTable,
  pgEnum,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

import { user } from "./auth-schema.js";

export const staffRole = pgEnum("staff_role", [
  "faculty",
  "hod",
  "principal",
]);

export const staff = pgTable(
  "staff",
  {
    id: text("id").primaryKey(),

    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),

    employeeId: text("employee_id").notNull().unique(),

    role: staffRole("role").default("faculty").notNull(),

    departmentId: text("department_id"),

    designation: text("designation"),

    phone: text("phone"),

    isActive: boolean("is_active").default(true).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("staff_role_idx").on(table.role),
    index("staff_department_idx").on(table.departmentId),
  ],
);