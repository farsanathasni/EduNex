import { Router } from "express";
import { CreateStudentProfile,GetStudentProfile } from "./student.Controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router=Router()

router.post("/profile",requireAuth,CreateStudentProfile)
router.get("/profile",requireAuth,GetStudentProfile)


export default router