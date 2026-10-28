
import type { RequestHandler } from "express";
import { and, eq } from "drizzle-orm";

import { db } from "../config/database.js";
import {
  userRoles,
  rolePermissions,
  permissions,
} from "../db/schema/rbac-schema.js";

export const rbac = (
  resource: string,
  action: string,
): RequestHandler => {
  return async (_req, res, next) => {
    try {
      // Get the logged-in user's ID from requireAuth.
      const userId = res.locals.user?.id as string | undefined;

      if (!userId) {
        res.status(401).json({
          message: "Authentication required",
        });
        return;
      }

      // Check whether this user has the requested permission.
      const [permission] = await db
        .select({
          id: permissions.id,
        })
        .from(userRoles)
        .innerJoin(
          rolePermissions,
          eq(userRoles.roleId, rolePermissions.roleId),
        )
        .innerJoin(
          permissions,
          eq(rolePermissions.permissionId, permissions.id),
        )
        .where(
          and(
            eq(userRoles.userId, userId),
            eq(permissions.resource, resource),
            eq(permissions.action, action),
          ),
        )
        .limit(1);

      if (!permission) {
        res.status(403).json({
          message: "You do not have permission to perform this action",
        });
        return;
      }

      // Permission exists; allow the request to continue.
      next();
    } catch (error) {
      next(error);
    }
  };
};
