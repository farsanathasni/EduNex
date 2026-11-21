
import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";
import { createAnnouncementController, deleteAnnouncementController, getAnnouncementsController, updateAnnouncementController } from "./announcements.contoller.js";



const announcementsRouter = Router();

announcementsRouter.get(
  "/",
  requireAuth,
  rbac("announcement", "view"),
  getAnnouncementsController,
);

announcementsRouter.post(
  "/",
  requireAuth,
  rbac("announcement", "create"),
  createAnnouncementController,
);

announcementsRouter.patch(
  "/:id",
  requireAuth,
  rbac("announcement", "update"),
  updateAnnouncementController,
);

announcementsRouter.delete(
  "/:id",
  requireAuth,
  rbac("announcement", "delete"),
  deleteAnnouncementController,
);

export default announcementsRouter;
