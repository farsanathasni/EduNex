
import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  CreateClub,
  GetAllClubs,
} from "./clubs.controller.js";

const clubsRouter = Router();

clubsRouter.post("/", requireAuth, CreateClub);
clubsRouter.get("/", requireAuth, GetAllClubs);

export default clubsRouter;
