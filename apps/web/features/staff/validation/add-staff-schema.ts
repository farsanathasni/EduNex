import { z } from "zod";

export const addStaffSchema = z.object({
  staffType: z.enum(["hod", "faculty"]),
  name: z.string().trim().min(1, "Full name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  employeeId: z.string().trim().min(1, "Employee ID is required."),
  departmentId: z.string().min(1, "Select a department."),
  designation: z.string().trim().min(1, "Designation is required."),
  phone: z.string().trim().optional(),
});

export type AddStaffFormValues = z.infer<typeof addStaffSchema>;
