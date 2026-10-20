
import { Router } from "express";
import {
  GetHodDashboard,
  GetHodStudents,
  
  CreateCoordinator,
  GetCoordinatorAssignments,
} from "./hod.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const hodRouter = Router();

hodRouter.get("/dashboard", requireAuth, GetHodDashboard);
hodRouter.get("/students", requireAuth, GetHodStudents);


hodRouter.post("/coordinators", requireAuth, CreateCoordinator);
hodRouter.get(
  "/coordinators",
  requireAuth,
  GetCoordinatorAssignments,
);

export default hodRouter;
