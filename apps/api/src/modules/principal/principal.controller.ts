import type { Request, Response } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import { getActivePrincipal, createHod,getDepartments } from "./principal.service.js";
import { createHodSchema } from "../hod/hod.validation.js";

export const GetPrincipalDashboard = asyncHandler(
  async (_req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const principal = await getActivePrincipal(user.id);

    if (!principal) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Active Principal permission required.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Principal dashboard fetched successfully.",
      data: {
        staffId: principal.id,
        employeeId: principal.employeeId,
        role: principal.role,
        designation: principal.designation,
      },
    });
  }
);

export const CreateHod = asyncHandler(
  async (req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please log in first.",
      });
    }

    const principal = await getActivePrincipal(user.id);

    if (!principal) {
      return res.status(403).json({
        success: false,
        message: "Only an active Principal can create HOD accounts.",
      });
    }

    const validation = createHodSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid HOD details.",
        errors: validation.error.flatten(),
      });
    }

    try {
      const hod = await createHod(validation.data);

      return res.status(201).json({
        success: true,
        message: "HOD account created successfully.",
        data: hod,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create HOD.";

      if (
        message.includes("already registered") ||
        message.toLowerCase().includes("already exists")
      ) {
        return res.status(409).json({
          success: false,
          message,
        });
      }

      throw error;
    }
  },
);

export const GetDepartments = asyncHandler(
  async (_req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please log in first.",
      });
    }

    const principal = await getActivePrincipal(user.id);

    if (!principal) {
      return res.status(403).json({
        success: false,
        message: "Only an active Principal can view departments.",
      });
    }

    const departmentsList = await getDepartments();

    return res.status(200).json({
      success: true,
      data: departmentsList,
    });
  },
);