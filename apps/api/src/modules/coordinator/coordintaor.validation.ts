
import { z } from "zod";

export const coordinatorQuerySchema = z.object({
  page: z.coerce
    .number()
    .int("Page must be an integer.")
    .positive("Page must be greater than 0.")
    .default(1),

  limit: z.coerce
    .number()
    .int("Limit must be an integer.")
    .min(1, "Limit must be at least 1.")
    .max(100, "Limit cannot exceed 100.")
    .default(10),

  search: z
    .string()
    .trim()
    .max(150, "Search cannot exceed 150 characters.")
    .default(""),
});

export type CoordinatorQuery = z.infer<
  typeof coordinatorQuerySchema
>;
