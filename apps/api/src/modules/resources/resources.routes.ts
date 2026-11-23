import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";
import { getStudentMaterialsController } from "./resources.controller.js";

const resourcesRouter = Router();

resourcesRouter.get(
  "/study-materials",
  requireAuth,
  rbac("resource", "view"),
  getStudentMaterialsController,
);

export default resourcesRouter;
