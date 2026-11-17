import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  StreamNotifications,
  GetNotifications,
  MarkNotificationRead,
  MarkAllNotificationsRead,
 
} from "./notifications.controller.js";

const notificationsRouter = Router();

notificationsRouter.get("/stream", requireAuth, StreamNotifications);
notificationsRouter.get("/", requireAuth, GetNotifications);




notificationsRouter.patch("/read-all", requireAuth, MarkAllNotificationsRead);
notificationsRouter.patch("/:id/read", requireAuth, MarkNotificationRead);




export default notificationsRouter;