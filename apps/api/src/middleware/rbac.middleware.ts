

import type { NextFunction, Request, RequestHandler, Response } from "express";
import { can, loadAccess, type Access } from "../modules/rbac/rbac.access.js";

// Loads the caller's roles + permissions once per request into res.locals.access.
export const attachAccess: RequestHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (res.locals.access) return next();

    const userId = res.locals.user?.id as string | undefined;

    if (!userId) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const access = await loadAccess(userId);

    if (!access) {
      res.status(403).json({
        success: false,
        message: "Your account is deactivated.",
      });
      return;
    }

    res.locals.access = access;
    next();
  } catch (error) {
    next(error);
  }
};

// Same signature as before: rbac("event", "approve"). Use after requireAuth.
export const rbac = (resource: string, action: string): RequestHandler => {
  return async (req, res, next) => {
    await attachAccess(req, res, (error?: unknown) => {
      if (error) return next(error);
      if (res.headersSent) return;

      if (!can(res.locals.access as Access, resource, action)) {
        res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action",
        });
        return;
      }

      next();
    });
  };
};

// Passes when the caller holds at least one of the given permissions.
export const rbacAny = (
  ...pairs: Array<[resource: string, action: string]>
): RequestHandler => {
  return async (req, res, next) => {
    await attachAccess(req, res, (error?: unknown) => {
      if (error) return next(error);
      if (res.headersSent) return;

      const access = res.locals.access as Access;

      if (!pairs.some(([resource, action]) => can(access, resource, action))) {
        res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action",
        });
        return;
      }

      next();
    });
  };
};


// Checks membership permission based on the requested decision.
export const rbacMembershipDecision: RequestHandler = (
  req,
  res,
  next,
) => {
  const decision = req.body?.decision;

  let action: string;

  if (decision === "approved") {
    action = "approve";
  } else if (decision === "rejected") {
    action = "reject";
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid membership decision",
    });
    return;
  }

  attachAccess(req, res, (error?: unknown) => {
    if (error) return next(error);
    if (res.headersSent) return;

    const access = res.locals.access as Access;

    if (!can(access, "membership", action)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
      return;
    }

    next();
  });
};