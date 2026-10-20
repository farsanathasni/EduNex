import { Router } from "express";
import {
  GetHodDashboard,
  GetHodStudents,
} from "./hod.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const hodRouter = Router();

hodRouter.get("/dashboard", requireAuth, GetHodDashboard);
hodRouter.get("/students", requireAuth, GetHodStudents);

export default hodRouter;