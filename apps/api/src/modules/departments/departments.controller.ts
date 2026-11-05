
import type { Request, Response } from "express";

import asyncHandler from "../../middleware/asyncHandler.js";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} from "./departments.service.js";
import {
  createDepartmentsSchema,
  departmentQuerySchema,
  updateDepartmentSchema,
} from "./departments.validation.js";

const getDatabaseErrorCode = (error: unknown): string | undefined => {
  let current: unknown = error;
  const seen = new Set<object>();

  while (typeof current === "object" && current !== null && !seen.has(current)) {
    seen.add(current);
    const candidate = current as { code?: unknown; cause?: unknown };
    if (typeof candidate.code === "string") return candidate.code;
    current = candidate.cause;
  }

  return undefined;
};

export const getDepartments = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = departmentQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid department search or pagination parameters.",
        errors: validation.error.flatten(),
      });
    }

    const { search, page, limit } = validation.data;

    const result = await getAllDepartments(search, page, limit);

    return res.status(200).json({
      success: true,
      message: "Departments fetched successfully.",
      data: result.departments,
      pagination: result.pagination,
    });
  },
);

export const getDepartment = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID.",
      });
    }

    const department = await getDepartmentById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department fetched successfully.",
      data: department,
    });
  },
);

export const createDepartments = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = createDepartmentsSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Department validation failed.",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    let createdDepartments: Awaited<ReturnType<typeof createDepartment>>;
    try {
      createdDepartments = await createDepartment(validation.data);
    } catch (error) {
      if (getDatabaseErrorCode(error) === "23505") {
        return res.status(409).json({
          success: false,
          message: "A department with one of these names or codes already exists.",
        });
      }
      throw error;
    }

    return res.status(201).json({
      success: true,
      message: "Departments created successfully.",
      data: createdDepartments,
    });
  },
);

export const editDepartment = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID.",
      });
    }

    const validation = updateDepartmentSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Department validation failed.",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    let department: Awaited<ReturnType<typeof updateDepartment>>;
    try {
      department = await updateDepartment(id, validation.data);
    } catch (error) {
      if (getDatabaseErrorCode(error) === "23505") {
        return res.status(409).json({
          success: false,
          message: "A department with this name or code already exists.",
        });
      }
      throw error;
    }

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department updated successfully.",
      data: department,
    });
  },
);

export const removeDepartment = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID.",
      });
    }

    let department: Awaited<ReturnType<typeof deleteDepartment>>;
    try {
      department = await deleteDepartment(id);
    } catch (error) {
      if (getDatabaseErrorCode(error) === "23503") {
        return res.status(409).json({
          success: false,
          message:
            "This department is still referenced by existing records. Move or remove assigned students before deleting it.",
        });
      }
      throw error;
    }

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully.",
      data: department,
    });
  },
);
