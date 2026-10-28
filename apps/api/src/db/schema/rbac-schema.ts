
import {
  pgTable,
  bigint,
  text,
  boolean,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { user } from "./auth-schema.js";

// 1. Stores all available roles
export const roles = pgTable(
  "roles",
  {
    id: bigint("id", { mode: "number" })
      .generatedAlwaysAsIdentity()
      .primaryKey(),

    name: text("name").notNull(),

    slug: text("slug").notNull().unique(),

    description: text("description"),

    isSystem: boolean("is_system").default(false).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
);

// 2. Stores individual permissions
export const permissions = pgTable(
  "permissions",
  {
    id: bigint("id", { mode: "number" })
      .generatedAlwaysAsIdentity()
      .primaryKey(),

    resource: text("resource").notNull(),

    action: text("action").notNull(),

    description: text("description"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("permissions_resource_action_unique").on(
      table.resource,
      table.action,
    ),
  ],
);

// 3. Connects roles to their permissions
export const rolePermissions = pgTable(
  "role_permissions",
  {
    id: bigint("id", { mode: "number" })
      .generatedAlwaysAsIdentity()
      .primaryKey(),

    roleId: bigint("role_id", { mode: "number" })
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),

    permissionId: bigint("permission_id", { mode: "number" })
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("role_permissions_role_permission_unique").on(
      table.roleId,
      table.permissionId,
    ),
  ],
);

// 4. Connects users to one or more roles
export const userRoles = pgTable(
  "user_roles",
  {
    id: bigint("id", { mode: "number" })
      .generatedAlwaysAsIdentity()
      .primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    roleId: bigint("role_id", { mode: "number" })
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),

    assignedBy: text("assigned_by").references(() => user.id, {
      onDelete: "set null",
    }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("user_roles_user_role_unique").on(
      table.userId,
      table.roleId,
    ),
  ],
);
