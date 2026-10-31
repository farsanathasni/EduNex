import z from "zod";


export const attendanceParamsSchema=z.object({
    eventId:z.number().int().positive()
})

const attendanceItemSchema=z.object({
    studentId:z.number().int().positive(),
    status:z.enum(["present","absent"])
})

export const saveAttendanceSchema =z.object({
    attendance:z.array(attendanceItemSchema).min(1)
})