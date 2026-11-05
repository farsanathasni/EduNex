import { z } from "zod";

export const departmentFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Department name must be at least 2 characters.")
    .max(100, "Department name cannot exceed 100 characters."),
  code: z
    .string()
    .trim()
    .min(2, "Department code must be at least 2 characters.")
    .max(10, "Department code cannot exceed 10 characters.")
    .regex(/^[A-Za-z0-9]+$/, "Use letters and numbers only for the code."),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters."),
});

export const createDepartmentsFormSchema = z
  .array(departmentFormSchema)
  .min(1, "Add at least one department.")
  .max(50, "You can add a maximum of 50 departments at once.")
  .superRefine((departments, context) => {
    const seenNames = new Set<string>();
    const seenCodes = new Set<string>();

    departments.forEach((department, index) => {
      const normalizedName = department.name.trim().toLocaleLowerCase();
      const normalizedCode = department.code.trim().toLocaleUpperCase();

      if (normalizedName && seenNames.has(normalizedName)) {
        context.addIssue({
          code: "custom",
          path: [index, "name"],
          message: "Department names in this form must be unique.",
        });
      }
      if (normalizedCode && seenCodes.has(normalizedCode)) {
        context.addIssue({
          code: "custom",
          path: [index, "code"],
          message: "Department codes in this form must be unique.",
        });
      }

      if (normalizedName) seenNames.add(normalizedName);
      if (normalizedCode) seenCodes.add(normalizedCode);
    });
  });

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;
