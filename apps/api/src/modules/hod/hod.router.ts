import { Router } from "express";
import { GetHodDashboard, GetStudentsByDepartment } from "./hod.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const hodRouter = Router();

hodRouter.get("/dashboard", requireAuth, GetHodDashboard);
hodRouter.get("/students", requireAuth, GetStudentsByDepartment);


export default hodRouter;