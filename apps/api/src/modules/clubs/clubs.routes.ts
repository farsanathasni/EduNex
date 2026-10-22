
import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  CreateClub,
  CreateStudentMembershipRequest,
  GetAllClubs,
  GetMyStudentMembershipRequests,
  GetStudentClubAnnouncements,
  GetStudentClubById,
  GetStudentClubCoordinators,
  GetStudentClubEvents,
  GetStudentClubs,
} from "./clubs.controller.js";

const clubsRouter = Router();

clubsRouter.get("/", requireAuth, GetAllClubs);
clubsRouter.get("/student",requireAuth,GetStudentClubs)
clubsRouter.get("/student/:clubId",requireAuth,GetStudentClubById)
clubsRouter.get("/student/:clubId/coordinators",requireAuth,GetStudentClubCoordinators)
clubsRouter.get("/student/:clubId/events",requireAuth,GetStudentClubEvents)
clubsRouter.get("/student/:clubId/announcements",requireAuth,GetStudentClubAnnouncements)
clubsRouter.get("/student/my/memberships",requireAuth,GetMyStudentMembershipRequests)
clubsRouter.post("/", requireAuth, CreateClub);
clubsRouter.post("/student/:clubId/membership", requireAuth, CreateStudentMembershipRequest)



export default clubsRouter;
