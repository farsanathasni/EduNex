import { z } from "zod";

export const createHodSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  employeeId: z.string().trim().min(1, "Employee ID is required"),
  departmentId: z.string().trim().min(1, "Department is required"),
  designation: z.string().trim().min(1, "Designation is required"),
  phone: z.string().trim().optional(),
});

export const getHodStudentsSchema = z.object({
  departmentId: z
    .string()
    .regex(/^[1-9]\d*$/, "Department ID must be a positive integer.")
    .optional(),

  semester: z
    .string()
    .regex(/^[1-8]$/, "Semester must be between 1 and 8.")
    .optional(),
});



export type GetHodStudentsInput = z.infer<
  typeof getHodStudentsSchema
>

export type CreateHodInput = z.infer<typeof createHodSchema>;