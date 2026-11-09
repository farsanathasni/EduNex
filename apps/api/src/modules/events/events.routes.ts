import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";

import {
  createEventRequestController,
  getAllEventsController,
  getMyEventRequestsController,
  getMyEventsController,
} from "./events.controller.js";

const eventsRouter = Router();

eventsRouter.get(
  "/",
  requireAuth,
  rbac("event", "view"),
  getAllEventsController,
);

eventsRouter.get(
  "/my",
  requireAuth,
  rbac("event", "view"),
  getMyEventsController,
);

eventsRouter.post(
  "/requests",
  requireAuth,
  rbac("event", "create"),
  createEventRequestController,
);


eventsRouter.get(
  "/requests/my",
  requireAuth,
  rbac("event", "view"),
  getMyEventRequestsController,
);

export default eventsRouter;