import { z } from "zod";

const pagination = {
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
};

export const subjectQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .max(100, "Search cannot exceed 100 characters")
    .optional(),
  semester: z.coerce.number().int().min(1).max(12).optional(),
  departmentId: z.coerce.number().int().positive().optional(),
  ...pagination,
});

export const facultyQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .max(100, "Search cannot exceed 100 characters")
    .optional(),
  ...pagination,
});

export const subjectParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const subjectFacultyParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  staffId: z.string().trim().min(1),
});

export const createSubjectSchema = z.object({
  name: z.string().trim().min(2).max(150),
  code: z
    .string()
    .trim()
    .min(2)
    .max(30)
    .transform((value) => value.toUpperCase()),
  semester: z.number().int().min(1).max(12),
  departmentId: z.number().int().positive().optional(),
});

export const updateSubjectSchema = z
  .object({
    name: z.string().trim().min(2).max(150).optional(),
    code: z
      .string()
      .trim()
      .min(2)
      .max(30)
      .transform((value) => value.toUpperCase())
      .optional(),
    semester: z.number().int().min(1).max(12).optional(),
    departmentId: z.number().int().positive().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const assignFacultySchema = z.object({
  staffId: z.string().trim().min(1),
});