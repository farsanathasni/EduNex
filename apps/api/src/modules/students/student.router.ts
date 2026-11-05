
import { Router } from "express";

import {
  CreateStudentProfile,
  GetStudentProfile,
  GetStudentById,
  GetStudents,
  UpdateStudentProfile,
  DeleteStudentProfile,
  CreateCoordinator,
  GetCoordinatorAssignments,
  UpdateCoordinator,
} from "./student.Controller.js";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";

const router = Router();

// Student profile routes
router.post("/profile", requireAuth, CreateStudentProfile);
router.get("/profile", requireAuth, GetStudentProfile);

// Student management routes
router.get(
  "/",
  requireAuth,
  rbac("student", "view"),
  GetStudents,
);

router.patch(
  "/:studentId",
  requireAuth,
  rbac("student", "update"),
  UpdateStudentProfile,
);

router.delete(
  "/:studentId",
  requireAuth,
  rbac("student", "delete"),
  DeleteStudentProfile,
);

// Coordinator assignment routes
router.post(
  "/coordinators",
  requireAuth,
  rbac("coordinator", "create"),
  CreateCoordinator,
);

router.get(
  "/coordinators",
  requireAuth,
  rbac("coordinator", "view"),
  GetCoordinatorAssignments,
);

router.patch(
  "/coordinators/:assignmentId",
  requireAuth,
  rbac("coordinator", "update"),
  UpdateCoordinator,
);

// Keep static coordinator paths above this parameterized student details route.
router.get(
  "/:studentId",
  requireAuth,
  rbac("student", "view"),
  GetStudentById,
);

export default router;
