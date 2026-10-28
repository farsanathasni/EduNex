
import { z } from "zod";

export const createClubSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Club name is required.")
    .max(150, "Club name cannot exceed 150 characters."),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters.")
    .optional(),

  departmentId: z.coerce.number().int().positive().optional(),
});

export const clubListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(150).default(""),
});

export type CreateClubInput = z.infer<typeof createClubSchema>;
export type ClubListQuery = z.infer<typeof clubListQuerySchema>;
