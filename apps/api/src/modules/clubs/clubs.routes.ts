
import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";

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

// List all clubs. Access is controlled by the club:view permission.
clubsRouter.get(
  "/",
  requireAuth,
  rbac("club", "view"),
  GetAllClubs,
);

// Student-facing club listing and details.
clubsRouter.get(
  "/student",
  requireAuth,
  GetStudentClubs,
);

clubsRouter.get(
  "/student/:clubId",
  requireAuth,
  GetStudentClubById,
);

clubsRouter.get(
  "/student/:clubId/coordinators",
  requireAuth,
  GetStudentClubCoordinators,
);

clubsRouter.get(
  "/student/:clubId/events",
  requireAuth,
  GetStudentClubEvents,
);

clubsRouter.get(
  "/student/:clubId/announcements",
  requireAuth,
  GetStudentClubAnnouncements,
);

// Current student's membership requests.
clubsRouter.get(
  "/student/my/memberships",
  requireAuth,
  GetMyStudentMembershipRequests,
);

// Club creation requires club:create permission.
// Assign this permission exclusively to the Super Admin role.
clubsRouter.post(
  "/",
  requireAuth,
  rbac("club", "create"),
  CreateClub,
);

// Submit a membership request.
clubsRouter.post(
  "/student/:clubId/membership",
  requireAuth,
  CreateStudentMembershipRequest,
);

export default clubsRouter;
