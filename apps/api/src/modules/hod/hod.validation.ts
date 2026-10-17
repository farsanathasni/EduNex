import { z } from "zod";

export const hodSchema = z.object({
  employeeId: z
    .string()
    .trim()
    .min(1, "Employee ID is required"),

  departmentId: z
    .string()
    .trim()
    .min(1, "Department ID is required"),

  designation: z
    .string()
    .trim()
    .min(1, "Designation is required"),

  phone: z
    .string()
    .trim()
    .optional(),
});

export type HodInput = z.infer<typeof hodSchema>;