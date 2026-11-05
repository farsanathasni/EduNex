import { isPossiblePhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const studentEditSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100, "Name cannot exceed 100 characters."),
  admissionNumber: z
    .string()
    .trim()
    .min(1, "Admission number is required.")
    .max(30, "Admission number cannot exceed 30 characters."),
  departmentId: z
    .string()
    .regex(/^[1-9]\d*$/, "Select a valid department."),
  semester: z
    .string()
    .regex(/^[1-8]$/, "Semester must be between 1 and 8."),
  phone: z
    .string()
    .trim()
    .refine(
      (phone) => !phone || isPossiblePhoneNumber(phone),
      "Enter a valid international phone number.",
    ),
});

export const studentCreateSchema = studentEditSchema.extend({
  email: z.string().trim().email("Enter a valid email address.").max(254),
});

export type StudentEditValues = z.infer<typeof studentEditSchema>;
