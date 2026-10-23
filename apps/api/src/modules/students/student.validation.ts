
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
    .regex(/^\+?[0-9\s()-]{7,20}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export const updateStudentProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Student name is required")
    .max(100, "Student name cannot exceed 100 characters"),

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
    .regex(/^[1-9]\d*$/, "Semester must be a positive integer")
    .refine((value) => Number(value) <= 8, {
      message: "Semester must be between 1 and 8",
    }),

  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s()-]{7,20}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export type CreateStudentProfileInput = z.infer<
  typeof createStudentProfileSchema
>;

export type UpdateStudentProfileInput = z.infer<
  typeof updateStudentProfileSchema
>;
