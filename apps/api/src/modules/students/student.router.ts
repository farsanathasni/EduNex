
import { Router } from "express";

import {
  CreateStudentProfile,
  GetStudentProfile,
  UpdateStudentProfile,
  DeleteStudentProfile,
} from "./student.Controller.js";

import { requireAuth } from "../../middleware/auth.middleware.js";

const router = Router();

// Student profile routes
router.post("/profile", requireAuth, CreateStudentProfile);
router.get("/profile", requireAuth, GetStudentProfile);

// Staff routes for managing student profiles
router.patch("/:studentId", requireAuth, UpdateStudentProfile);
router.delete("/:studentId", requireAuth, DeleteStudentProfile);

export default router;
