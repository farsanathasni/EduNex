import { z } from "zod";

export const studentQuerySchema = z.object({
  semester: z.coerce.number().int().min(1).max(12).optional(),
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