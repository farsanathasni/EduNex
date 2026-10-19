import { Router } from "express";
import { getDepartments,getDepartment,createDepartments,removeDepartment ,editDepartment } from "./departments.controller.js"
import { requireAuth } from "../../middleware/auth.middleware.js";
import { from } from "node:stream/iter";


const router=Router()

router.get("/",requireAuth,getDepartments)
router.get("/:id",requireAuth,getDepartment)
router.post("/",requireAuth,createDepartments)
router.patch("/:id",requireAuth,editDepartment)
router.delete("/:id",requireAuth,removeDepartment)

export default router