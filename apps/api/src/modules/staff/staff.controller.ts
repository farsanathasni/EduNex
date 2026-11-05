import type { Request, Response } from "express";

import asyncHandler from "../../middleware/asyncHandler.js";
import {
  resolveDepartmentScope,
  type Access,
} from "../rbac/rbac.access.js";
import {
  deactivateStaff,
  listStaff,
  StaffDeactivationError,
  StaffUpdateError,
  updateStaff,
} from "./staff.service.js";
import { staffListQuerySchema, updateStaffSchema } from "./staff.validation.js";

export const GetStaff = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = staffListQuerySchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid staff search or pagination parameters.",
        errors: validation.error.flatten(),
      });
    }

    const access = res.locals.access as Access;
    const scope = await resolveDepartmentScope(access);
    if (!scope) {
      return res.status(403).json({
        success: false,
        message: "No department is assigned to your account.",
      });
    }

    let departmentId: number | undefined;
    if (scope.kind === "department") {
      if (
        validation.data.departmentId !== undefined &&
        validation.data.departmentId !== scope.departmentId
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only view staff in your own department.",
        });
      }
      departmentId = scope.departmentId;
    } else {
      departmentId = validation.data.departmentId;
    }

    const result = await listStaff(validation.data, departmentId);
    return res.status(200).json({
      success: true,
      message: "Staff fetched successfully.",
      data: result.staff,
      pagination: result.pagination,
    });
  },
);

export const UpdateStaff = asyncHandler(
  async (req: Request, res: Response) => {
    const staffIdParam = req.params.staffId;
    const staffId = Array.isArray(staffIdParam)
      ? staffIdParam[0]
      : staffIdParam;
    if (typeof staffId !== "string" || !staffId.trim()) {
      return res.status(400).json({
        success: false,
        message: "A staff ID is required.",
      });
    }

    const validation = updateStaffSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid staff update details.",
        errors: validation.error.flatten(),
      });
    }

    const access = res.locals.access as Access;
    const scope = await resolveDepartmentScope(access);
    if (!scope) {
      return res.status(403).json({
        success: false,
        message: "No department is assigned to your account.",
      });
    }

    try {
      const updated = await updateStaff(staffId, validation.data, scope);
      return res.status(200).json({
        success: true,
        message: "Staff member updated successfully.",
        data: updated,
      });
    } catch (error) {
      if (error instanceof StaffUpdateError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      throw error;
    }
  },
);

export const DeactivateStaff = asyncHandler(
  async (req: Request, res: Response) => {
    const staffIdParam = req.params.staffId;
    const staffId = Array.isArray(staffIdParam)
      ? staffIdParam[0]
      : staffIdParam;
    if (typeof staffId !== "string" || !staffId.trim()) {
      return res.status(400).json({
        success: false,
        message: "A staff ID is required.",
      });
    }

    const access = res.locals.access as Access;
    if (!access.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only the Principal can deactivate staff accounts.",
      });
    }

    try {
      const result = await deactivateStaff(staffId);
      return res.status(200).json({
        success: true,
        message: "Staff account deactivated successfully.",
        data: result,
      });
    } catch (error) {
      if (error instanceof StaffDeactivationError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      throw error;
    }
  },
);
