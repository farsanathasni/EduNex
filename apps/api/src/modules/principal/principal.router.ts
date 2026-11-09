import { Router } from "express";
import {
  GetPrincipalDashboard,
  CreateHod,
  CreateStaff,
  CreateStudent,
  GetDepartments,
  GetPrincipalEvents,
  GetPrincipalAllEvents,
  PublishPrincipalEvent,
} from "./principal.controller.js";
import { ReviewEvent } from "../hod/hod.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";


const principalRouter = Router();

principalRouter.get(
  "/dashboard",
  requireAuth,
  rbac("admin", "view"),
  GetPrincipalDashboard,
);


principalRouter.get(
  "/events/all",
  requireAuth,
  rbac("event", "view"),
  GetPrincipalAllEvents,
);


principalRouter.post(
  "/hods",
  requireAuth,
  rbac("staff", "create"),
  CreateHod,
);


principalRouter.post(
  "/staff",
  requireAuth,
  rbac("staff", "create"),
  CreateStaff,
);

principalRouter.post(
  "/students",
  requireAuth,
  rbac("student", "create"),
  CreateStudent,
);


principalRouter.get(
  "/departments",
  requireAuth,
  rbac("department", "view"),
  GetDepartments,
);

principalRouter.get(
  "/events",
  requireAuth,
  rbac("event", "view"),
  GetPrincipalEvents,
);


principalRouter.patch(
  "/events/:eventId/review",
  requireAuth,
  rbac("event", "approve"),
  ReviewEvent,
);


principalRouter.patch(
  "/events/:eventId/publish",
  requireAuth,
  rbac("event", "publish"),
  PublishPrincipalEvent,
);

export default principalRouter;