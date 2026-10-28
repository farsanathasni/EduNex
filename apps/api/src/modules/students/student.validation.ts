import { isPossiblePhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const createStudentProfileSchema = z.object({
  admissionNumber: z
    .string()
    .trim()
    .min(1, "Admission number is required")
    .max(30, "Admission number cannot exceed 30 characters"),

  departmentId: z
    .string()
    .trim()
    .min(1, "Department is required")
    .regex(/^[1-9]\d*$/, "Department ID must be a positive integer"),

  semester: z
    .string()
    .trim()
    .min(1, "Semester is required")
    .regex(/^[1-9]\d*$/, "Semester must be a positive integer"),

  phone: z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .refine(
    (phone) => isPossiblePhoneNumber(phone),
    "Enter a valid international phone number."
  ),
});

export type CreateStudentProfileInput = z.infer<
  typeof createStudentProfileSchema
>;
