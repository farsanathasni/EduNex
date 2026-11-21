import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";

import validate from "../../middleware/validate.middleware.js";

import {
  rosterQuerySchema,
  saveAttendanceSchema,
} from "./class-attendance.validation.js";

import {
  getMySubjectsController,
  getAttendanceRosterController,
  saveAttendanceController,
  getMyAttendanceSummaryController,
} from "./class-attendance.controller.js";

const classAttendanceRouter = Router();

classAttendanceRouter.use(requireAuth);

// Faculty: subjects I teach
classAttendanceRouter.get(
  "/subjects",
  rbac("class_attendance", "mark"),
  getMySubjectsController,
);

// Faculty: students of a class (?subjectId=&date=&period=)
classAttendanceRouter.get(
  "/roster",
  rbac("class_attendance", "mark"),
  validate(rosterQuerySchema, "query"),
  getAttendanceRosterController,
);

// Faculty: save attendance for one class
classAttendanceRouter.put(
  "/sessions",
  rbac("class_attendance", "mark"),
  validate(saveAttendanceSchema, "body"),
  saveAttendanceController,
);

// Student: my attendance summary
// (the service returns 404 if the logged-in user has no student profile)
classAttendanceRouter.get(
  "/my-summary",
  rbac("class_attendance", "view_own"),
  getMyAttendanceSummaryController,
);

export default classAttendanceRouter;