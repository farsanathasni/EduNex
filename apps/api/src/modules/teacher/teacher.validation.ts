import { z } from "zod";

export const studentQuerySchema = z.object({
  semester: z.coerce.number().int().min(1).max(12).optional(),

  search: z
    .string()
    .trim()
    .max(100, "Search cannot exceed 100 characters")
    .optional(),

  page: z.coerce
    .number()
    .int()
    .positive("Page must be a positive integer")
    .optional()
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .positive("Limit must be a positive integer")
    .max(100, "Limit cannot exceed 100")
    .optional()
    .default(10),
});

export const materialParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createMaterialSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().optional(),
  fileUrl: z.string().url(),
  fileType: z.string().max(50).optional(),
  visibility: z.enum(["department", "campus"]).default("department"),
});

export const uploadMaterialFieldsSchema =
  createMaterialSchema.omit({ fileUrl: true });

export const updateMaterialSchema = createMaterialSchema.partial();