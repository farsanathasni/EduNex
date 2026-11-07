import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";
import {
  attendanceParamsSchema,
  saveAttendanceSchema,
} from "./attendance.validation.js";
import validate from "../../middleware/validate.middleware.js";
import {
  getEventAttendanceController,
  saveAttendanceController,
} from "./attendance.controller.js";

const attendanceRouter = Router();

attendanceRouter.get(
  "/event/:eventId",
  requireAuth,
  rbac("attendance", "view"),
  validate(attendanceParamsSchema, "params"),
  getEventAttendanceController,
);

attendanceRouter.post(
  "/event/:eventId",
  requireAuth,
  rbac("attendance", "mark"),
  validate(attendanceParamsSchema, "params"),
  validate(saveAttendanceSchema, "body"),
  saveAttendanceController,
);

export default attendanceRouter;
