import { z } from "zod";

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

const validDateRange = <T extends { from?: string; to?: string }>(value: T) =>
  !value.from || !value.to || value.from <= value.to;

const pagination = {
  page: z.coerce.number().int().positive("Page must be a positive integer").default(1),
  limit: z.coerce
    .number()
    .int()
    .positive("Limit must be a positive integer")
    .max(100, "Limit cannot exceed 100")
    .default(10),
};

const semester = z.coerce.number().int().min(1).max(12).optional();
const departmentId = z.coerce.number().int().positive().optional();
const subjectId = z.coerce.number().int().positive().optional();
const from = dateString.optional();
const to = dateString.optional();

const belowThreshold = z
  .enum(["true", "false", "1", "0"])
  .transform((value) => value === "true" || value === "1")
  .default(false);

export const overviewQuerySchema = z.object({ semester, departmentId });

export const studentsQuerySchema = z
  .object({
    search: z.string().trim().max(100).optional(),
    semester,
    departmentId,
    subjectId,
    from,
    to,
    belowThreshold,
    sort: z.enum(["percentage", "name", "admissionNumber"]).default("percentage"),
    order: z.enum(["asc", "desc"]).default("desc"),
    ...pagination,
  })
  .refine(validDateRange, {
    message: "from must be on or before to",
    path: ["from"],
  });

export const subjectsQuerySchema = z
  .object({ semester, departmentId, from, to })
  .refine(validDateRange, {
    message: "from must be on or before to",
    path: ["from"],
  });

export const studentParamsSchema = z.object({
  studentId: z.coerce.number().int().positive(),
});

export type OverviewQuery = z.infer<typeof overviewQuerySchema>;
export type StudentsQuery = z.infer<typeof studentsQuerySchema>;
export type SubjectsQuery = z.infer<typeof subjectsQuerySchema>;
