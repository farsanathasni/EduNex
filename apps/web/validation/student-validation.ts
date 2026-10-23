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

    phone:z
    .string().trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),

})



export const studentUpdateSchema = z.object({
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
    .min(1, "Department is required")
    .regex(/^[1-9]\d*$/, "Select a valid department"),

  semester: z
    .string()
    .min(1, "Semester is required")
    .regex(/^[1-9]\d*$/, "Select a valid semester")
    .refine(
      (value) => Number(value) >= 1 && Number(value) <= 8,
      "Semester must be between 1 and 8",
    ),

  phone: z
    .string()
    .trim()
    .regex(
      /^$|^\+?[0-9\s()-]{7,20}$/,
      "Enter a valid phone number",
    ),
});

export type StudentUpdateInput = z.infer<
  typeof studentUpdateSchema
>;



export type StudentProfileFormValues=z.infer<typeof studentProfileSchema >