
import type { Request, Response } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} from "./departments.service.js";

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
export const createDepartments= asyncHandler(
  async (req: Request, res: Response) => {
    const { name, code, description } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof code !== "string" ||
      !code.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Department name and code are required",
      });
    }

    const department = await createDepartment({
      name: name.trim(),
      code: code.trim(),
      description:
        typeof description === "string"
          ? description.trim() || null
          : null,
    });

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
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

    const { name, code, description } = req.body;

    if (
      name !== undefined &&
      (typeof name !== "string" || !name.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Department name must be a non-empty string",
      });
    }

    if (
      code !== undefined &&
      (typeof code !== "string" || !code.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Department code must be a non-empty string",
      });
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string or null",
      });
    }

    const input: {
      name?: string;
      code?: string;
      description?: string | null;
    } = {};

    if (name !== undefined) input.name = name.trim();
    if (code !== undefined) input.code = code.trim();

    if (description !== undefined) {
      input.description =
        typeof description === "string"
          ? description.trim() || null
          : null;
    }

    if (Object.keys(input).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
    }

    const department = await updateDepartment(id, input);

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
