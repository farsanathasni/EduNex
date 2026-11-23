import { NextFunction, Request, Response } from "express";
import asyncHandler from "./asyncHandler.js";
import { auth } from "../auth.js";
import { fromNodeHeaders } from "better-auth/node";

import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { staff } from "../db/schema/staff-schema.js";

const isDatabaseConnectionError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;

  const code = (error as NodeJS.ErrnoException).code;
  const message = error.message.toLowerCase();

  return (
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "ECONNREFUSED" ||
    code === "ENOTFOUND" ||
    code === "EPIPE" ||
    message.includes("econnreset") ||
    message.includes("econnrefused") ||
    message.includes("enotfound") ||
    message.includes("connection terminated") ||
    message.includes("socket hang up") ||
    message.includes("timeout")
  );
};

export const requireAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { headers, response: session } = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
        returnHeaders: true,
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Please log in.",
        });
      }

      for (const cookie of headers.getSetCookie?.() ?? []) {
        res.appendHeader("Set-Cookie", cookie);
      }

      const authUser = session.user as typeof session.user & {
        banned?: boolean | null;
        banExpires?: Date | string | null;
      };

      if (
        authUser.banned &&
        (!authUser.banExpires ||
          new Date(authUser.banExpires).getTime() > Date.now())
      ) {
        return res.status(403).json({
          success: false,
          message: "Account is banned.",
        });
      }

      const [staffMember] = await db
        .select({ isActive: staff.isActive })
        .from(staff)
        .where(eq(staff.userId, session.user.id))
        .limit(1);

      if (staffMember && !staffMember.isActive) {
        return res.status(403).json({
          success: false,
          message: "Account is deactivated.",
        });
      }

      res.locals.user = session.user;
      return next();
    } catch (error) {
      if (isDatabaseConnectionError(error)) {
        res.setHeader("Retry-After", "5");
        return next(new Error("DB_UNAVAILABLE"));
      }
      throw error;
    }
  },
);

type StaffRole = "principal" | "hod" | "faculty";

export const requireStaffRole = (...allowedRoles: StaffRole[]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const [staffMember] = await db
      .select({
        role: staff.role,
        isActive: staff.isActive,
      })
      .from(staff)
      .where(eq(staff.userId, user.id))
      .limit(1);

    if (!staffMember || !staffMember.isActive) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Active staff account required.",
      });
    }

    if (!allowedRoles.includes(staffMember.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission.",
      });
    }

    return next();
  });