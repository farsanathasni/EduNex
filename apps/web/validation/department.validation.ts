
import { z } from "zod";

export const studentProfileSchema = z.object({
  admissionNumber: z
    .string()
    .trim()
    .min(1, "Admission number is required")
    .max(30, "Admission number cannot exceed 30 characters"),

  departmentId: z
    .string()
    .min(1, "Please select your department")
    .regex(/^[1-9]\d*$/, "Please select a valid department"),

  semester: z
    .string()
    .min(1, "Please select your semester")
    .regex(/^[1-9]\d*$/, "Please select a valid semester")
    .refine(
      (value) => Number(value) <= 8,
      "Semester must be between 1 and 8"
    ),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(
      /^\+?[0-9\s()-]{7,20}$/,
      "Please enter a valid phone number"
    ),
});
