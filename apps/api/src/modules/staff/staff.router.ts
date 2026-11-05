import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";
import { DeactivateStaff, GetStaff, UpdateStaff } from "./staff.controller.js";

const staffRouter = Router();

staffRouter.get("/", requireAuth, rbac("staff", "view"), GetStaff);
staffRouter.patch("/:staffId", requireAuth, rbac("staff", "update"), UpdateStaff);
staffRouter.delete("/:staffId", requireAuth, rbac("staff", "delete"), DeactivateStaff);

export default staffRouter;
