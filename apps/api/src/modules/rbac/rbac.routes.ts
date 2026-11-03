import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { attachAccess, rbac } from "../../middleware/rbac.middleware.js";
import {
  CreateRole,
  DeleteRole,
  GetMe,
  GetPermissionCatalog,
  GetRole,
  GetRoles,
  UpdateRole,
} from "./rbac.controller.js";

export const meRouter = Router();
meRouter.get("/", requireAuth, attachAccess, GetMe);

const rolesRouter = Router();

// "/permissions" must be registered before "/:id".
rolesRouter.get("/permissions", requireAuth, rbac("role", "view"), GetPermissionCatalog);
rolesRouter.get("/", requireAuth, rbac("role", "view"), GetRoles);
rolesRouter.get("/:id", requireAuth, rbac("role", "view"), GetRole);
rolesRouter.post("/", requireAuth, rbac("role", "create"), CreateRole);
rolesRouter.patch("/:id", requireAuth, rbac("role", "update"), UpdateRole);
rolesRouter.delete("/:id", requireAuth, rbac("role", "delete"), DeleteRole);

export default rolesRouter;
