import { isPossiblePhoneNumber } from "react-phone-number-input";
import z from "zod";


export const studentProfileSchema =z.object({
    admissionNumber:z
    .string().trim()
    .min(1, "Admission number is required.")
    .max(30, "Admission number must be at most 30 characters.")
    .regex(/^[a-zA-Z0-9/-]+$/,"Use only letters, numbers, hyphens, and slashes."),

    departmentId:z
    .string().min(1, "Please select a department.")
    .regex(/^[1-9]\d*$/, "Please select a valid department."),

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
    .refine(
      (value) => isPossiblePhoneNumber(value),
      "Enter a valid international phone number."),

})


export type StudentProfileFormValues=z.infer<typeof studentProfileSchema >