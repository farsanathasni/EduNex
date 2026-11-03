
// import { Router } from "express";
// import {
//   GetPrincipalDashboard,
//   CreateHod,
//   GetDepartments,
// } from "./principal.controller.js";
// import {
//   requireAuth,
//   requireStaffRole,
// } from "../../middleware/auth.middleware.js";
// import { rbac } from "../../middleware/rbac.middleware.js";

// const principalRouter = Router();

// // Principal dashboard
// principalRouter.get(
//   "/dashboard",
//   requireAuth,
//   requireStaffRole("principal"),
//   rbac("admin", "view"),
//   GetPrincipalDashboard,
// );

// // Create HOD
// principalRouter.post(
//   "/hods",
//   requireAuth,
//   requireStaffRole("principal"),
//   rbac("staff", "create"),
//   CreateHod,
// );

// // Get departments
// principalRouter.get(
//   "/departments",
//   requireAuth,
//   requireStaffRole("principal"),
//   rbac("department", "view"),
//   GetDepartments,
// );

// export default principalRouter;

import { Router } from "express";
import {
  GetPrincipalDashboard,
  CreateHod,
  GetDepartments,
} from "./principal.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";

const principalRouter = Router();

// Access is decided only by RBAC permissions, so Super Admin
// (and the legacy Principal role) pass through the same check.

// Principal dashboard
principalRouter.get(
  "/dashboard",
  requireAuth,
  rbac("admin", "view"),
  GetPrincipalDashboard,
);

// Create HOD
principalRouter.post(
  "/hods",
  requireAuth,
  rbac("staff", "create"),
  CreateHod,
);

// Get departments
principalRouter.get(
  "/departments",
  requireAuth,
  rbac("department", "view"),
  GetDepartments,
);

export default principalRouter;