
import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  getAllEventsController,
  getMyEventsController,
} from "./events.controller.js";

const eventsRouter = Router();

eventsRouter.get("/", requireAuth, getAllEventsController);
eventsRouter.get("/my", requireAuth, getMyEventsController);

export default eventsRouter;
