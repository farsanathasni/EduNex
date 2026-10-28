
import type { Request, Response } from "express";

import asyncHandler from "../../middleware/asyncHandler.js";
import { getCoordinatorStatus } from "./coordinator.service.js";
import { coordinatorQuerySchema } from "./coordintaor.validation.js";

export const getCoordinatorStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const validation = coordinatorQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid search or pagination parameters.",
        errors: validation.error.flatten(),
      });
    }

    const { page, limit, search } = validation.data;

    const result = await getCoordinatorStatus(
      userId,
      search,
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Coordinator status fetched successfully.",
      data: result,
    });
  },
);
