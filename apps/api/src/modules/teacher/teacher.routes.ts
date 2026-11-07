import { Router } from "express";

import {
  requireAuth,
  requireStaffRole,
} from "../../middleware/auth.middleware.js";

import validate from "../../middleware/validate.middleware.js";

import {
  studentQuerySchema,
  materialParamsSchema,
  createMaterialSchema,
} from "./teacher.validation.js";

import {
  getTeacherDashboardController,
  getTeacherClassesController,
  getTeacherStudentsController,
  getTeacherMaterialsController,
  createTeacherMaterialController,
  deleteTeacherMaterialController,
} from "./teacher.controller.js";

const teacherRouter = Router();

teacherRouter.use(requireAuth, requireStaffRole("faculty"));

// Dashboard
teacherRouter.get(
  "/dashboard",
  getTeacherDashboardController,
);

// My Classes
teacherRouter.get(
  "/classes",
  getTeacherClassesController,
);

// My Students
teacherRouter.get(
  "/students",
  validate(studentQuerySchema, "query"),
  getTeacherStudentsController,
);

// Study Materials
teacherRouter.get(
  "/study-materials",
  getTeacherMaterialsController,
);

teacherRouter.post(
  "/study-materials",
  validate(createMaterialSchema, "body"),
  createTeacherMaterialController,
);

teacherRouter.delete(
  "/study-materials/:id",
  validate(materialParamsSchema, "params"),
  deleteTeacherMaterialController,
);

export default teacherRouter;