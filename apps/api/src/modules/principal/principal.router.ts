import { Router } from "express";
import {
  GetPrincipalDashboard,
  CreateHod,
  GetDepartments
} from "./principal.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const principalRouter = Router();

// Principal dashboard
principalRouter.get(
  "/dashboard",
  requireAuth,
  GetPrincipalDashboard,
);

// Create HOD
principalRouter.post(
  "/hods",
  requireAuth,
  CreateHod,
);

// Get departments
principalRouter.get(
  "/departments",
  requireAuth,
  GetDepartments,
);

export default principalRouter;