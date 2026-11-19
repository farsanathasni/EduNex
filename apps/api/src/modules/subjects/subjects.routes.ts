import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";

import validate from "../../middleware/validate.middleware.js";
import { assignFacultySchema, createSubjectSchema, facultyQuerySchema, subjectFacultyParamsSchema, subjectParamsSchema, subjectQuerySchema, updateSubjectSchema } from "./subjects.validation.js";
import { assignFacultyController, createSubjectController, deleteSubjectController, listAvailableFacultyController, listSubjectFacultyController, listSubjectsController, removeFacultyController, updateSubjectController } from "./subjects.controller.js";

// ...keep your validation and controller imports exactly as they are

const subjectsRouter = Router();

// Only login is required here. Each route checks its own permission.
subjectsRouter.use(requireAuth);

// Subjects
subjectsRouter.get(
  "/",
  rbac("subject", "view"),
  validate(subjectQuerySchema, "query"),
  listSubjectsController,
);

subjectsRouter.post(
  "/",
  rbac("subject", "create"),
  validate(createSubjectSchema, "body"),
  createSubjectController,
);

subjectsRouter.patch(
  "/:id",
  rbac("subject", "update"),
  validate(subjectParamsSchema, "params"),
  validate(updateSubjectSchema, "body"),
  updateSubjectController,
);

subjectsRouter.delete(
  "/:id",
  rbac("subject", "delete"),
  validate(subjectParamsSchema, "params"),
  deleteSubjectController,
);

// Faculty assignments
subjectsRouter.get(
  "/:id/faculty",
  rbac("subject", "assign"),
  validate(subjectParamsSchema, "params"),
  validate(facultyQuerySchema, "query"),
  listSubjectFacultyController,
);

subjectsRouter.get(
  "/:id/faculty/available",
  rbac("subject", "assign"),
  validate(subjectParamsSchema, "params"),
  validate(facultyQuerySchema, "query"),
  listAvailableFacultyController,
);

subjectsRouter.post(
  "/:id/faculty",
  rbac("subject", "assign"),
  validate(subjectParamsSchema, "params"),
  validate(assignFacultySchema, "body"),
  assignFacultyController,
);

subjectsRouter.delete(
  "/:id/faculty/:staffId",
  rbac("subject", "assign"),
  validate(subjectFacultyParamsSchema, "params"),
  removeFacultyController,
);

export default subjectsRouter;