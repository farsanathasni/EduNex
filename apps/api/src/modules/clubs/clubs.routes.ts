
import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac, rbacMembershipDecision } from "../../middleware/rbac.middleware.js";

import {
  AssignClubDepartment,
  CreateClub,
  CreateStudentMembershipRequest,
  GetAllClubs,
  GetCoordinatorClubMembers,
  GetCoordinatorMembershipRequests,
  GetMyStudentMembershipRequests,
  GetStudentClubAnnouncements,
  GetStudentClubById,
  GetStudentClubCoordinators,
  GetStudentClubEvents,
  GetStudentClubs,
  ReviewClubMembershipRequest,
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
  rbac("club", "view"),
  GetStudentClubs,
);

clubsRouter.get(
  "/student/:clubId",
  requireAuth,
  rbac("club", "view"),
  GetStudentClubById,
);

clubsRouter.get(
  "/student/:clubId/coordinators",
  requireAuth,
  rbac("club", "view"),
  GetStudentClubCoordinators,
);

clubsRouter.get(
  "/student/:clubId/events",
  requireAuth,
  rbac("club", "view"),
  GetStudentClubEvents,
);

clubsRouter.get(
  "/student/:clubId/announcements",
  requireAuth,
  rbac("club", "view"),
  GetStudentClubAnnouncements,
);

// Current student's membership requests.
clubsRouter.get(
  "/student/my/memberships",
  requireAuth,
  rbac("club", "view"),
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

// Assign a department to an existing unassigned club. The handler also
// requires the Principal/Super Admin role and refuses to change a club that
// already has a department.
clubsRouter.patch(
  "/:clubId/department",
  requireAuth,
  rbac("club", "update"),
  AssignClubDepartment,
);

// Submit a membership request.
clubsRouter.post(
  "/student/:clubId/membership",
  requireAuth,
  rbac("club", "view"),
  CreateStudentMembershipRequest,
);


// Coordinator: view pending membership requests.
clubsRouter.get(
  "/coordinator/membership-requests",
  requireAuth,
  rbac("membership", "view"),
  GetCoordinatorMembershipRequests,
);

clubsRouter.patch(
  "/coordinator/membership-requests/:requestId",
  requireAuth,
  rbacMembershipDecision,
  ReviewClubMembershipRequest,
);

clubsRouter.get(
  "/coordinator/members",
  requireAuth,
  rbac("member", "view"),
  GetCoordinatorClubMembers,
);


export default clubsRouter;
