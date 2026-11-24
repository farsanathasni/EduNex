import { z } from "zod";

import { ISSUE_CATEGORIES, ISSUE_STATUSES } from "./issues.types.js";

export const createIssueSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(5000),
  category: z.enum(ISSUE_CATEGORIES),
  recipientId: z.string().trim().min(1),
});

export const issueListQuerySchema = z.object({
  box: z.enum(["sent", "received"]).default("received"),
  status: z.enum(ISSUE_STATUSES).optional(),
  search: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const issueParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createIssueResponseSchema = z.object({
  body: z.string().trim().min(1).max(2000),
});

export const resolveIssueSchema = z.object({
  status: z.enum(["resolved", "rejected"]),
  note: z.string().trim().max(2000).optional(),
});
