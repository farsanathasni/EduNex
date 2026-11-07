
import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";
import {
  getAllEventsController,
  getMyEventsController,
} from "./events.controller.js";

const eventsRouter = Router();

eventsRouter.get("/", requireAuth, rbac("event", "view"), getAllEventsController);
eventsRouter.get("/my", requireAuth, rbac("event", "view"), getMyEventsController);

export default eventsRouter;
