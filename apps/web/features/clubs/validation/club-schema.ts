
import { z } from "zod";

export const createClubSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Club name is required.")
    .max(150, "Club name cannot exceed 150 characters."),
  description: z.string().trim().optional(),
  departmentId: z
    .string()
    .trim()
    .min(1, "Select a department.")
    .refine(
      (value) =>
        Number.isSafeInteger(Number(value)) && Number(value) > 0,
      "Select a valid department.",
    ),
});

export const createHodClubSchema = createClubSchema.omit({
  departmentId: true,
});

export const updateClubSchema = z
  .object({
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
  })
  .refine(
    (data) =>
      data.name !== undefined || data.description !== undefined,
    "Provide at least one field to update.",
  );

export type CreateClubInput = z.infer<typeof createClubSchema>;
export type CreateHodClubInput = z.infer<typeof createHodClubSchema>;
export type UpdateClubInput = z.infer<typeof updateClubSchema>;
