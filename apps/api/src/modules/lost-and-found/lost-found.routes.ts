import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { rbac, rbacAny } from "../../middleware/rbac.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import {
  confirmReceiptController,
  createItemController,
  decideClaimController,
  getItemByIdController,
  listAuditController,
  listItemsController,
  listMyClaimsController,
  markReturnedController,
  submitClaimController,
  updateItemController,
  withdrawClaimController,
} from "./lost-found.controller.js";
import {
  auditQuerySchema,
  claimDecisionSchema,
  claimParamsSchema,
  createItemSchema,
  itemListQuerySchema,
  itemParamsSchema,
  submitClaimSchema,
  updateItemSchema,
} from "./lost-and-found.validation.js";
import { uploadLostFoundPhotos } from "./lost-found.upload.js";

const lostFoundRouter = Router();

lostFoundRouter.get(
  "/",
  requireAuth,
  rbac("lost_found", "view"),
  validate(itemListQuerySchema, "query"),
  listItemsController,
);

lostFoundRouter.post(
  "/",
  requireAuth,
  rbac("lost_found", "create"),
  uploadLostFoundPhotos,
  validate(createItemSchema, "body"),
  createItemController,
);

lostFoundRouter.get(
  "/my-claims",
  requireAuth,
  rbac("lost_found", "claim"),
  listMyClaimsController,
);

lostFoundRouter.get(
  "/audit",
  requireAuth,
  rbac("lost_found", "moderate"),
  validate(auditQuerySchema, "query"),
  listAuditController,
);

lostFoundRouter.get(
  "/:id",
  requireAuth,
  rbac("lost_found", "view"),
  validate(itemParamsSchema, "params"),
  getItemByIdController,
);

lostFoundRouter.patch(
  "/:id",
  requireAuth,
  rbacAny(["lost_found", "create"], ["lost_found", "moderate"]),
  validate(itemParamsSchema, "params"),
  validate(updateItemSchema, "body"),
  updateItemController,
);

lostFoundRouter.post(
  "/:id/claims",
  requireAuth,
  rbac("lost_found", "claim"),
  validate(itemParamsSchema, "params"),
  validate(submitClaimSchema, "body"),
  submitClaimController,
);

lostFoundRouter.post(
  "/claims/:id/decide",
  requireAuth,
  rbacAny(["lost_found", "create"], ["lost_found", "moderate"]),
  validate(claimParamsSchema, "params"),
  validate(claimDecisionSchema, "body"),
  decideClaimController,
);

lostFoundRouter.post(
  "/:id/return",
  requireAuth,
  rbacAny(["lost_found", "create"], ["lost_found", "moderate"]),
  validate(itemParamsSchema, "params"),
  markReturnedController,
);

lostFoundRouter.post(
  "/:id/receipt",
  requireAuth,
  rbac("lost_found", "claim"),
  validate(itemParamsSchema, "params"),
  confirmReceiptController,
);

lostFoundRouter.delete(
  "/claims/:id",
  requireAuth,
  rbac("lost_found", "claim"),
  validate(claimParamsSchema, "params"),
  withdrawClaimController,
);

export default lostFoundRouter;
