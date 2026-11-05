import { z } from "zod";

export const editStaffSchema = z.object({
  name: z.string().trim().min(1, "Full name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  employeeId: z.string().trim().min(1, "Employee ID is required."),
  designation: z.string().trim(),
  phone: z.string().trim(),
  departmentId: z.string().optional(),
});

export type EditStaffFormValues = z.infer<typeof editStaffSchema>;
