import { Router } from "express";
import { getCoordinatorStatusController } from "./coordinator.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const CoordinatorRouter=Router()

CoordinatorRouter.get("/",requireAuth,getCoordinatorStatusController)

export default CoordinatorRouter