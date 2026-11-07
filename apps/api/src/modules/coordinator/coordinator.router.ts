
import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";
import { getCoordinatorStatusController } from "./coordinator.controller.js";

const CoordinatorRouter = Router();

CoordinatorRouter.get(
  "/",
  requireAuth,
  rbac("coordinator", "view"),
  getCoordinatorStatusController,
);

export default CoordinatorRouter;
