import { z } from "zod";

export const createStaffSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(150),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  employeeId: z.string().trim().min(1, "Employee ID is required.").max(100),
  role: z.enum(["hod", "faculty"]),
  departmentId: z.coerce.number().int().positive("Select a valid department."),
  designation: z.string().trim().min(1, "Designation is required.").max(150),
  phone: z.string().trim().max(30).optional(),
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;

export const updateStaffSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required.").max(150).optional(),
    email: z.string().trim().email("Enter a valid email address.").max(254).optional(),
    employeeId: z.string().trim().min(1, "Employee ID is required.").max(100).optional(),
    designation: z.string().trim().max(150).nullable().optional(),
    phone: z.string().trim().max(30).nullable().optional(),
    departmentId: z.coerce.number().int().positive("Select a valid department.").optional(),
  })
  .strict()
  .refine((input) => Object.keys(input).length > 0, {
    message: "Provide at least one staff field to update.",
  });

export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;

export const staffListQuerySchema = z.object({
  type: z.enum(["all", "hod", "faculty"]).default("all"),
  departmentId: z.coerce.number().int().positive().optional(),
  search: z.string().trim().max(150).default(""),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type StaffListQuery = z.infer<typeof staffListQuerySchema>;
