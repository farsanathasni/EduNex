import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import {
  getOverviewController,
  getStudentReportController,
  getStudentsController,
  getSubjectsController,
} from "./attendance-reports.controller.js";
import {
  overviewQuerySchema,
  studentParamsSchema,
  studentsQuerySchema,
  subjectsQuerySchema,
} from "./attendance-reports.validation.js";

const attendanceReportsRouter = Router();

attendanceReportsRouter.use(requireAuth);

attendanceReportsRouter.get(
  "/overview",
  rbac("class_attendance", "report"),
  validate(overviewQuerySchema, "query"),
  getOverviewController,
);

attendanceReportsRouter.get(
  "/students",
  rbac("class_attendance", "report"),
  validate(studentsQuerySchema, "query"),
  getStudentsController,
);

attendanceReportsRouter.get(
  "/students/:studentId",
  rbac("class_attendance", "report"),
  validate(studentParamsSchema, "params"),
  validate(overviewQuerySchema, "query"),
  getStudentReportController,
);

attendanceReportsRouter.get(
  "/subjects",
  rbac("class_attendance", "report"),
  validate(subjectsQuerySchema, "query"),
  getSubjectsController,
);

export default attendanceReportsRouter;
