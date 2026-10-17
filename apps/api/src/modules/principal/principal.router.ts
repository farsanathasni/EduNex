import { Router } from "express";
import { GetPrincipalDashboard } from "./principal.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const principalRouter = Router();

principalRouter.get(
  "/dashboard",
  requireAuth,
  GetPrincipalDashboard
);

export default principalRouter;