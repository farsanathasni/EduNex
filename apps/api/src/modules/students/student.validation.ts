
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
      "Enter a valid international phone number.",
    ),
});

export type CreateStudentProfileInput = z.infer<
  typeof createStudentProfileSchema
>;

export const getStudentsSchema = z.object({
  departmentId: z
    .string()
    .regex(/^[1-9]\d*$/, "Department ID must be a positive integer")
    .transform(Number)
    .optional(),

  semester: z
    .string()
    .regex(/^[1-8]$/, "Semester must be between 1 and 8")
    .transform(Number)
    .optional(),

  search: z
    .string()
    .trim()
    .max(100, "Search cannot exceed 100 characters")
    .optional(),

  page: z
    .string()
    .regex(/^[1-9]\d*$/, "Page must be a positive integer")
    .transform(Number)
    .optional()
    .default(1),

  limit: z
    .string()
    .regex(/^[1-9]\d*$/, "Limit must be a positive integer")
    .transform(Number)
    .refine((value) => value <= 100, "Limit cannot exceed 100")
    .optional()
    .default(10),
});

export type GetStudentsInput = z.infer<typeof getStudentsSchema>;

// Update student profile.
// All fields are optional, so you can update only the fields you need.
export const updateStudentProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name cannot exceed 100 characters")
      .optional(),

    admissionNumber: z
      .string()
      .trim()
      .min(1, "Admission number is required")
      .max(30, "Admission number cannot exceed 30 characters")
      .optional(),

    departmentId: z.number().int().positive().optional(),

    semester: z.number().int().min(1).max(8).optional(),

    phone: z
      .string()
      .trim()
      .refine(
        (phone) => isPossiblePhoneNumber(phone),
        "Enter a valid international phone number.",
      )
      .nullable()
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "Provide at least one field to update.",
  );

export type UpdateStudentProfileInput = z.infer<
  typeof updateStudentProfileSchema
>;
