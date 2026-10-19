import { z } from "zod";

export const departmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name cannot exceed 100 characters"),

  code: z
    .string()
    .trim()
    .min(2, "Department code must be at least 2 characters")
    .max(10, "Department code cannot exceed 10 characters")
    .regex(
      /^[A-Za-z0-9]+$/,
      "Department code can contain only letters and numbers"
    ),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .nullable()
    .optional(),
});


export const createDepartmentsSchema = z
  .array(departmentSchema)
  .min(1, "At least one department is required")
  .max(50, "You can add a maximum of 50 departments at once")
  .superRefine((items, ctx) => {
    const codes = new Set<string>();

    items.forEach((department, index) => {
      const normalizedCode = department.code.toUpperCase();

      if (codes.has(normalizedCode)) {
        ctx.addIssue({
          code: "custom",
          path: [index, "code"],
          message: `Duplicate department code: ${department.code}`,
        });
      }

      codes.add(normalizedCode);
    });
  });

  

export const updateDepartmentSchema = departmentSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required to update"
  );

export type DepartmentInput = z.infer<typeof departmentSchema>;