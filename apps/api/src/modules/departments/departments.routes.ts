
import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";
import {
  createDepartments,
  editDepartment,
  getDepartment,
  getDepartments,
  removeDepartment,
} from "./departments.controller.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  rbac("department", "view"),
  getDepartments,
);

router.get(
  "/:id",
  requireAuth,
  rbac("department", "view"),
  getDepartment,
);

router.post(
  "/add",
  requireAuth,
  rbac("department", "create"),
  createDepartments,
);

router.patch(
  "/:id",
  requireAuth,
  rbac("department", "update"),
  editDepartment,
);

router.delete(
  "/:id",
  requireAuth,
  rbac("department", "delete"),
  removeDepartment,
);

export default router;
