import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac, rbacAny } from "../../middleware/rbac.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import {
  addIssueResponseController,
  createIssueController,
  getIssueByIdController,
  getIssueRecipientsController,
  listIssuesController,
  resolveIssueController,
} from "./issues.controller.js";
import {
  createIssueResponseSchema,
  createIssueSchema,
  issueParamsSchema,
  resolveIssueSchema,
} from "./issues.validation.js";

const issuesRouter = Router();

issuesRouter.get(
  "/recipients",
  requireAuth,
  rbac("issue", "create"),
  getIssueRecipientsController,
);

issuesRouter.post(
  "/",
  requireAuth,
  rbac("issue", "create"),
  validate(createIssueSchema, "body"),
  createIssueController,
);

issuesRouter.get(
  "/",
  requireAuth,
  rbac("issue", "view"),
  listIssuesController,
);

issuesRouter.get(
  "/:id",
  requireAuth,
  rbac("issue", "view"),
  validate(issueParamsSchema, "params"),
  getIssueByIdController,
);

issuesRouter.post(
  "/:id/responses",
  requireAuth,
  rbacAny(["issue", "view"], ["issue", "respond"]),
  validate(issueParamsSchema, "params"),
  validate(createIssueResponseSchema, "body"),
  addIssueResponseController,
);

issuesRouter.patch(
  "/:id/resolve",
  requireAuth,
  rbac("issue", "resolve"),
  validate(issueParamsSchema, "params"),
  validate(resolveIssueSchema, "body"),
  resolveIssueController,
);

export default issuesRouter;
