
import { Router } from "express";
import {
  GetHodDashboard,
  GetHodStudents,
  CreateCoordinator,
  GetCoordinatorAssignments,
  GetPendingEvents,
  ReviewEvent
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

// Event approvals
hodRouter.get(
  "/events/pending",
  requireAuth,
  GetPendingEvents,
);

hodRouter.patch(
  "/events/:eventId/review",
  requireAuth,
  ReviewEvent,
);

export default hodRouter;
