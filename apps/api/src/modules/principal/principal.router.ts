
import { Router } from "express";
import {
  GetPrincipalDashboard,
  CreateHod,
  GetDepartments,
} from "./principal.controller.js";
import {
  requireAuth,
  requireStaffRole,
} from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";

const principalRouter = Router();

// Principal dashboard
principalRouter.get(
  "/dashboard",
  requireAuth,
  requireStaffRole("principal"),
  rbac("admin", "view"),
  GetPrincipalDashboard,
);

// Create HOD
principalRouter.post(
  "/hods",
  requireAuth,
  requireStaffRole("principal"),
  rbac("staff", "create"),
  CreateHod,
);

// Get departments
principalRouter.get(
  "/departments",
  requireAuth,
  requireStaffRole("principal"),
  rbac("department", "view"),
  GetDepartments,
);

export default principalRouter;
