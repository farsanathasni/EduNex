import { NextFunction, Request, Response } from "express";
import asyncHandler from "./asyncHandler.js";
import { auth } from "../auth.js";
import { fromNodeHeaders } from "better-auth/node";

import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { staff } from "../db/schema/staff-schema.js";

export const requireAuth =asyncHandler(async(
    req:Request,res:Response,next:NextFunction)=>{
        const session=await auth.api.getSession({
            headers:fromNodeHeaders(req.headers)
        })

        if(!session){
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please log in.",
            })
        }

        res.locals.user=session.user
        return next()
})



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