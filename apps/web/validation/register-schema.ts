import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address"),

    department: z.string().min(1, "Please select a department"),

    semester: z.string().min(1, "Please select a semester"),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters"),
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;