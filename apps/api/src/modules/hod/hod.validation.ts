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

  search: z
    .string()
    .max(100, "Search cannot exceed 100 characters.")
    .optional(),

  page: z
    .string()
    .regex(/^[1-9]\d*$/, "Page must be a positive integer.")
    .optional(),

  limit: z
    .string()
    .regex(/^[1-9]\d*$/, "Limit must be a positive integer.")
    .refine((value) => Number(value) <= 100, {
      message: "Limit cannot exceed 100.",
    })
    .optional(),
});


// export const createCoordinatorSchema = z.object({
//   studentId: z.coerce
//     .number()
//     .int()
//     .positive("Select a valid student."),
//   clubId: z.coerce
//     .number()
//     .int()
//     .positive("Select a valid club."),
// });

// export type CreateCoordinatorInput = z.infer<
//   typeof createCoordinatorSchema
// >;
// export const updateCoordinatorSchema = createCoordinatorSchema;

// export type UpdateCoordinatorInput = z.infer<
//   typeof updateCoordinatorSchema
// >;



export type GetHodStudentsInput = z.infer<
  typeof getHodStudentsSchema
>

export type CreateHodInput = z.infer<typeof createHodSchema>;