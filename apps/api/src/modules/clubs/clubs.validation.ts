
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
    .optional(),

  departmentId: z
    .coerce
    .number()
    .int()
    .positive()
    .optional(),
});

export type CreateClubInput = z.infer<typeof createClubSchema>;
