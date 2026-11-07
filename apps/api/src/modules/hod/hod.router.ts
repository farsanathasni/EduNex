
// import { Router } from "express";

// import {
//   GetHodDashboard,
//   GetStudentsByDepartment,
//   GetPendingEvents,
//   ReviewEvent,
//   GetHodClubs
// } from "./hod.controller.js";

// import {
//   CreateCoordinator,
//   GetCoordinatorAssignments,
//   UpdateCoordinator,
// } from "../students/student.Controller.js";

// import { requireAuth } from "../../middleware/auth.middleware.js";
// import { rbac } from "../../middleware/rbac.middleware.js";

// const hodRouter = Router();

// // HOD dashboard
// hodRouter.get(
//   "/dashboard",
//   requireAuth,
//   rbac("staff", "view"),
//   GetHodDashboard,
// );

// // Students
// hodRouter.get(
//   "/students",
//   requireAuth,
//   rbac("student", "view"),
//   GetStudentsByDepartment,
// );

// hodRouter.get(
//   "/clubs",
//   requireAuth,
//   rbac("club", "view"),
//   GetHodClubs,
// );


// hodRouter.post(
//   "/coordinators",
//   requireAuth,
//   rbac("coordinator", "create"),
//   CreateCoordinator,
// );



// hodRouter.get(
//   "/coordinators",
//   requireAuth,
//   rbac("coordinator", "view"),
//   GetCoordinatorAssignments,
// );

// hodRouter.patch(
//   "/coordinators/:assignmentId",
//   requireAuth,
//   rbac("coordinator", "update"),
//   UpdateCoordinator,
// );

// // Event approvals
// hodRouter.get(
//   "/events/pending",
//   requireAuth,
//   rbac("event", "view"),
//   GetPendingEvents,
// );

// hodRouter.get("/events/pending", rbac("event", "approve"), /* your handler */);
// hodRouter.patch("/events/:eventId/review", rbac("event", "approve"), /* your handler */);

// hodRouter.patch(
//   "/events/:eventId/review",
//   requireAuth,
//   rbac("event", "update"),
//   ReviewEvent,
// );

// export default hodRouter;

import { Router } from "express";

import {
  GetHodDashboard,
  GetStudentsByDepartment,
  GetPendingEvents,
  ReviewEvent,
  GetHodClubs,
} from "./hod.controller.js";

import {
  CreateCoordinator,
  GetCoordinatorAssignments,
  UpdateCoordinator,
} from "../students/student.Controller.js";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac } from "../../middleware/rbac.middleware.js";

const hodRouter = Router();

// HOD dashboard
hodRouter.get(
  "/dashboard",
  requireAuth,
  rbac("staff", "view"),
  GetHodDashboard,
);

// Students
hodRouter.get(
  "/students",
  requireAuth,
  rbac("student", "view"),
  GetStudentsByDepartment,
);

// Clubs
hodRouter.get(
  "/clubs",
  requireAuth,
  rbac("club", "view"),
  GetHodClubs,
);

// Coordinators
hodRouter.post(
  "/coordinators",
  requireAuth,
  rbac("coordinator", "create"),
  CreateCoordinator,
);

hodRouter.get(
  "/coordinators",
  requireAuth,
  rbac("coordinator", "view"),
  GetCoordinatorAssignments,
);

hodRouter.patch(
  "/coordinators/:assignmentId",
  requireAuth,
  rbac("coordinator", "update"),
  UpdateCoordinator,
);

// Event approvals: only roles with event:approve (HOD, Super Admin).
hodRouter.get(
  "/events/pending",
  requireAuth,
  rbac("event", "approve"),
  GetPendingEvents,
);

hodRouter.patch(
  "/events/:eventId/review",
  requireAuth,
  rbac("event", "approve"),
  ReviewEvent,
);

export default hodRouter;