
import type { Request, Response } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import { getActiveHod } from "../hod/hod.service.js";
import {
  createClub,
  getAllClubs,
} from "./clubs.service.js";
import { createClubSchema } from "./clubs.validation.js";

export const CreateClub = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Please log in.",
      });
    }

    const hod = await getActiveHod(currentUser.id);

    if (!hod) {
      return res.status(403).json({
        success: false,
        message: "Active HOD permission required.",
      });
    }

    const validation = createClubSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid club details.",
        errors: validation.error.flatten(),
      });
    }

    const { name, description, departmentId } = validation.data;

    const club = await createClub(name, description, departmentId);

    return res.status(201).json({
      success: true,
      message: "Club created successfully.",
      data: club,
    });
  },
);

export const GetAllClubs = asyncHandler(
  async (_req: Request, res: Response) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Please log in.",
      });
    }

    const hod = await getActiveHod(currentUser.id);

    if (!hod) {
      return res.status(403).json({
        success: false,
        message: "Active HOD permission required.",
      });
    }

    const data = await getAllClubs();

    return res.status(200).json({
      success: true,
      message: "Clubs fetched successfully.",
      data,
    });
  },
);
