import { Router } from "express";
import { attendanceParamsSchema, saveAttendanceSchema } from "./attendance.validation.js";
import validate from "../../middleware/validate.middleware.js";
import { getEventAttendanceController, saveAttendanceController } from "./attendance.controller.js";


const  attendanceRouter=Router()

attendanceRouter.get("event/:id",validate(attendanceParamsSchema, "params"),getEventAttendanceController)
attendanceRouter.post("event/:id",validate(attendanceParamsSchema, "params"),validate(saveAttendanceSchema, "body"),saveAttendanceController)

export default attendanceRouter   