import { Router } from "express";

import {
  requireAuth,
  requireStaffRole,
} from "../../middleware/auth.middleware.js";

import validate from "../../middleware/validate.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";

import {
  studentQuerySchema,
  materialParamsSchema,
  createMaterialSchema,
  uploadMaterialFieldsSchema,
  updateMaterialSchema,
} from "./teacher.validation.js";
import { uploadMaterialFile } from "./teacher.upload.js";

import {
  getTeacherDashboardController,
  getTeacherClassesController,
  getTeacherStudentsController,
  getTeacherMaterialsController,
  createTeacherMaterialController,
  uploadTeacherMaterialController,
  updateTeacherMaterialController,
  deleteTeacherMaterialController,
} from "./teacher.controller.js";

const teacherRouter = Router();

teacherRouter.post(
  "/study-materials/upload",
  requireAuth,
  rbac("resource", "create"),
  uploadMaterialFile,
  validate(uploadMaterialFieldsSchema, "body"),
  uploadTeacherMaterialController,
);

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

teacherRouter.patch(
  "/study-materials/:id",
  uploadMaterialFile,
  validate(updateMaterialSchema, "body"),
  validate(materialParamsSchema, "params"),
  updateTeacherMaterialController,
);

teacherRouter.delete(
  "/study-materials/:id",
  validate(materialParamsSchema, "params"),
  deleteTeacherMaterialController,
);

export default teacherRouter;