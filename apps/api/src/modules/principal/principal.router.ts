
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
  CreateStaff,
  GetDepartments,
} from "./principal.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";

const principalRouter = Router();

// Access is decided by RBAC permissions; Principal accounts use Super Admin.

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

// Principal (Super Admin) creates either an HOD or Faculty account.
principalRouter.post(
  "/staff",
  requireAuth,
  rbac("staff", "create"),
  CreateStaff,
);

// Get departments
principalRouter.get(
  "/departments",
  requireAuth,
  rbac("department", "view"),
  GetDepartments,
);

export default principalRouter;
