import { z } from "zod";

export const principalLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const principalProfileSchema = z.object({
  designation: z
    .string()
    .trim()
    .min(1, "Designation is required")
    .max(100, "Designation must be 100 characters or fewer"),

  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Please enter a valid phone number")
    .optional(),
});

export type PrincipalLoginInput = z.infer<
  typeof principalLoginSchema
>;

export type PrincipalProfileInput = z.infer<
  typeof principalProfileSchema
>;