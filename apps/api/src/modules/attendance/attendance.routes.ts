import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";
import {attendanceParamsSchema,saveAttendanceSchema} from "./attendance.validation.js";
import validate from "../../middleware/validate.middleware.js";
import {getEventAttendanceController,GetHodAttendanceEvents,getStudentAttendanceController,saveAttendanceController} from "./attendance.controller.js";

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


attendanceRouter.get(
  "/student",
  requireAuth,
  getStudentAttendanceController,
);


attendanceRouter.get(
  "/events",
  requireAuth,
  rbac("attendance", "view"),
  GetHodAttendanceEvents,
);

export default attendanceRouter;
