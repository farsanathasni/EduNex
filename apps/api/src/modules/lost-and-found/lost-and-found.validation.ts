import { z } from "zod";

import {
  LOST_FOUND_CATEGORIES,
  LOST_FOUND_CLAIM_STATUSES,
  LOST_FOUND_STATUSES,
} from "./lost-and-found.types.js";

const jsonArray = <T extends z.ZodTypeAny>(
  element: T,
  min: number,
  max: number,
) =>
  z.preprocess((value) => {
    if (typeof value !== "string") return value;

    try {
      return JSON.parse(value) as unknown;
    } catch {
      return value;
    }
  }, z.array(element).min(min).max(max));

const dateFoundSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date format YYYY-MM-DD.")
  .refine((value) => value <= new Date().toISOString().slice(0, 10), {
    message: "The date cannot be in the future.",
  });

const questionInputSchema = z.object({
  prompt: z.string().trim().min(3).max(300),
  answer: z.string().trim().min(1).max(200),
});

const claimAnswerSchema = z.object({
  id: z.string().trim().min(1).max(50),
  answer: z.string().trim().min(1).max(200),
});

const booleanish = z.preprocess((value) => {
  if (value === "true" || value === true) return true;
  if (value === "false" || value === false || value === undefined) return false;
  return value;
}, z.boolean());

export const createItemSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(5000),
  category: z.enum(LOST_FOUND_CATEGORIES),
  place: z.string().trim().min(2).max(255),
  dateFound: dateFoundSchema,
  questions: jsonArray(questionInputSchema, 1, 3),
  answers: jsonArray(claimAnswerSchema, 1, 3),
});

export const itemListQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  category: z.enum(LOST_FOUND_CATEGORIES).optional(),
  status: z.enum(LOST_FOUND_STATUSES).optional(),
  mine: booleanish.default(false),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const itemParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const claimParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateItemSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  description: z.string().trim().min(10).max(5000).optional(),
  category: z.enum(LOST_FOUND_CATEGORIES).optional(),
  place: z.string().trim().min(2).max(255).optional(),
  dateFound: dateFoundSchema.optional(),
  close: booleanish.optional().default(false),
});

export const submitClaimSchema = z.object({
  answers: jsonArray(claimAnswerSchema, 1, 3),
});

export const claimDecisionSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  note: z.string().trim().max(2000).optional(),
});

export const auditQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const claimStatuses = LOST_FOUND_CLAIM_STATUSES;
