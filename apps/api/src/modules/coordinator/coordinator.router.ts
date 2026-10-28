
import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { getCoordinatorStatusController } from "./coordinator.controller.js";

const CoordinatorRouter = Router();

CoordinatorRouter.get(
  "/",
  requireAuth,
  getCoordinatorStatusController,
);

export default CoordinatorRouter;
