import { z } from "zod";

export const createHodSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  employeeId: z.string().trim().min(1, "Employee ID is required"),
  departmentId: z.string().trim().min(1, "Department is required"),
  designation: z.string().trim().min(1, "Designation is required"),
  phone: z.string().trim().optional(),
});

export type CreateHodInput = z.infer<typeof createHodSchema>;