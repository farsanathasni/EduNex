
import { Router } from "express";

import {
  getDepartments,
  getDepartment,
  createDepartments,
  removeDepartment,
  editDepartment,
} from "./departments.controller.js";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";

const router = Router();

// View departments
router.get(
  "/",
  requireAuth,
  rbac("department", "view"),
  getDepartments,
);

// View one department
router.get(
  "/:id",
  requireAuth,
  rbac("department", "view"),
  getDepartment,
);

// Create department
router.post(
  "/add",
  requireAuth,
  rbac("department", "create"),
  createDepartments,
);

// Update department
router.patch(
  "/:id",
  requireAuth,
  rbac("department", "update"),
  editDepartment,
);

// Delete department
router.delete(
  "/:id",
  requireAuth,
  rbac("department", "delete"),
  removeDepartment,
);

export default router;
