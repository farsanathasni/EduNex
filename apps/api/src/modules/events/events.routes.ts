
import { Router } from "express";

// import requireAuth from "../../middleware/requireAuth.js";
import {
  getAllEventsController,
  getMyEventsController,
} from "./events.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const eventsRouter = Router();

eventsRouter.get("/", requireAuth, getAllEventsController);
eventsRouter.get("/my", requireAuth, getMyEventsController);

export default eventsRouter;
