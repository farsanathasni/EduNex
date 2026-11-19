import { z } from "zod";

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

export const rosterQuerySchema = z.object({
  subjectId: z.coerce.number().int().positive(),
  date: dateString,
  period: z.coerce.number().int().min(1).max(12).optional().default(1),
});

export const saveAttendanceSchema = z.object({
  subjectId: z.number().int().positive(),
  date: dateString,
  period: z.number().int().min(1).max(12).default(1),
  records: z
    .array(
      z.object({
        studentId: z.number().int().positive(),
        status: z.enum(["present", "absent", "late"]),
        remark: z.string().trim().max(255).nullable().optional(),
      }),
    )
    .min(1, "At least one student record is required"),
});