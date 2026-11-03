import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().trim().min(2, "Role name is required").max(100),
  description: z.string().trim().max(500).optional(),
  permissionIds: z.array(z.coerce.number().int().positive()).default([]),
});

export const updateRoleSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().max(500).optional(),
  permissionIds: z.array(z.coerce.number().int().positive()).optional(),
});

export const roleIdSchema = z.coerce.number().int().positive();
