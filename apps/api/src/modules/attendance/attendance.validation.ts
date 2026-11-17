
import z from "zod";

export const attendanceParamsSchema = z.object({
  eventId: z.coerce.number().int().positive(),
});

const attendanceItemSchema = z.object({
  studentId: z.number().int().positive(),
  status: z.enum(["present", "absent"]),
});

export const saveAttendanceSchema = z.object({
  attendance: z.array(attendanceItemSchema).min(1),
});

// Search and pagination for attendance events and members.
export const attendanceQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().default(""),
});
