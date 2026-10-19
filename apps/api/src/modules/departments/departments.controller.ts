
import type { Request, Response } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import {
  
    createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} from "./departments.service.js";
import { createDepartmentsSchema, updateDepartmentSchema } from "./departments.validation.js";

// Get all departments
export const getDepartments = asyncHandler(
  async (_req: Request, res: Response) => {
    const departments = await getAllDepartments();

    return res.status(200).json({
      success: true,
      message: "Departments fetched successfully",
      data: departments,
    });
  }
);



// Get department by ID
export const getDepartment = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID",
      });
    }

    const department = await getDepartmentById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department fetched successfully",
      data: department,
    });
  }
);



// Create department
export const createDepartments = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = createDepartmentsSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Department validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const createdDepartments = await createDepartment(validation.data);

    return res.status(201).json({
      success: true,
      message: "Departments created successfully",
      data: createdDepartments,
    });
  }
);



// Update department
export const editDepartment = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID",
      });
    }

    const validation = updateDepartmentSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Department validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const department = await updateDepartment(id, validation.data);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  }
);



// Delete department
export const removeDepartment = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID",
      });
    }

    const department = await deleteDepartment(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
      data: department,
    });
  }
);
