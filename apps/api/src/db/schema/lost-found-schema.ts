import {
  bigint,
  check,
  date,
  foreignKey,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { user } from "./auth-schema.js";
import { departments } from "./others-schema.js";

export type LostFoundPhoto = {
  url: string;
  publicId: string;
  resourceType: string;
  bytes: number;
};

export type LostFoundQuestion = {
  id: string;
  prompt: string;
};

export type LostFoundExpectedAnswer = {
  id: string;
  answer: string;
};

export type LostFoundClaimAnswer = {
  id: string;
  answer: string;
};

export type LostFoundAuditDetails = Record<string, unknown>;

const identity = (name: string) =>
  bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity({
      name,
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    });

export const lostFoundItems = pgTable(
  "lost_found_items",
  {
    id: identity("lost_found_items_id_seq"),
    finderUserId: text("finder_user_id").notNull(),
    finderDepartmentId: bigint("finder_department_id", { mode: "number" }),
    itemType: varchar("item_type", { length: 10 }).default("found").notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    category: varchar("category", { length: 30 }).notNull(),
    place: varchar("place", { length: 255 }).notNull(),
    dateFound: date("date_found", { mode: "string" }).notNull(),
    photos: jsonb("photos").$type<LostFoundPhoto[]>().notNull(),
    status: varchar("status", { length: 20 }).default("active").notNull(),
    verificationQuestions: jsonb("verification_questions")
      .$type<LostFoundQuestion[]>()
      .notNull(),
    expectedAnswers: jsonb("expected_answers")
      .$type<LostFoundExpectedAnswer[]>()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.finderUserId],
      foreignColumns: [user.id],
      name: "lost_found_items_finder_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.finderDepartmentId],
      foreignColumns: [departments.id],
      name: "lost_found_items_finder_department_id_fkey",
    }).onDelete("set null"),
    check(
      "lost_found_items_item_type_check",
      sql`(item_type)::text = ANY ((ARRAY['found'::character varying, 'lost'::character varying])::text[])`,
    ),
    check(
      "lost_found_items_category_check",
      sql`(category)::text = ANY ((ARRAY['bags'::character varying, 'electronics'::character varying, 'documents'::character varying, 'books'::character varying, 'clothing'::character varying, 'accessories'::character varying, 'keys'::character varying, 'other'::character varying])::text[])`,
    ),
    check(
      "lost_found_items_status_check",
      sql`(status)::text = ANY ((ARRAY['active'::character varying, 'claimed'::character varying, 'returned'::character varying, 'closed'::character varying])::text[])`,
    ),
    check(
      "lost_found_items_photos_check",
      sql`jsonb_array_length(photos) BETWEEN 1 AND 3`,
    ),
    check(
      "lost_found_items_questions_check",
      sql`jsonb_array_length(verification_questions) BETWEEN 1 AND 3`,
    ),
    index("lost_found_items_finder_user_id_idx").on(table.finderUserId),
    index("lost_found_items_status_created_at_idx").on(
      table.status,
      table.createdAt,
    ),
    index("lost_found_items_category_status_idx").on(
      table.category,
      table.status,
    ),
  ],
);

export const lostFoundClaims = pgTable(
  "lost_found_claims",
  {
    id: identity("lost_found_claims_id_seq"),
    itemId: bigint("item_id", { mode: "number" }).notNull(),
    claimantUserId: text("claimant_user_id").notNull(),
    answers: jsonb("answers").$type<LostFoundClaimAnswer[]>().notNull(),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    decisionNote: text("decision_note"),
    decidedBy: text("decided_by"),
    decidedAt: timestamp("decided_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.itemId],
      foreignColumns: [lostFoundItems.id],
      name: "lost_found_claims_item_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.claimantUserId],
      foreignColumns: [user.id],
      name: "lost_found_claims_claimant_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.decidedBy],
      foreignColumns: [user.id],
      name: "lost_found_claims_decided_by_fkey",
    }).onDelete("set null"),
    check(
      "lost_found_claims_status_check",
      sql`(status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'withdrawn'::character varying])::text[])`,
    ),
    uniqueIndex("lost_found_claims_pending_item_claimant_key")
      .on(table.itemId, table.claimantUserId)
      .where(sql`status = 'pending'`),
    index("lost_found_claims_item_id_status_idx").on(
      table.itemId,
      table.status,
    ),
    index("lost_found_claims_claimant_user_id_status_idx").on(
      table.claimantUserId,
      table.status,
    ),
  ],
);

export const lostFoundAuditEvents = pgTable(
  "lost_found_audit_events",
  {
    id: identity("lost_found_audit_events_id_seq"),
    itemId: bigint("item_id", { mode: "number" }).notNull(),
    claimId: bigint("claim_id", { mode: "number" }),
    actorUserId: text("actor_user_id"),
    action: varchar("action", { length: 50 }).notNull(),
    details: jsonb("details").$type<LostFoundAuditDetails>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.itemId],
      foreignColumns: [lostFoundItems.id],
      name: "lost_found_audit_events_item_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.claimId],
      foreignColumns: [lostFoundClaims.id],
      name: "lost_found_audit_events_claim_id_fkey",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.actorUserId],
      foreignColumns: [user.id],
      name: "lost_found_audit_events_actor_user_id_fkey",
    }).onDelete("set null"),
    index("lost_found_audit_events_item_id_created_at_idx").on(
      table.itemId,
      table.createdAt,
    ),
  ],
);
