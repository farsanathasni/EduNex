import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";

import studentRoutes from "./modules/students/student.router.js";
import hodRouter from "./modules/hod/hod.router.js";
import principalRouter from "./modules/principal/principal.router.js";
import departmentRoter from "./modules/departments/departments.routes.js";
import clubsRouter from "./modules/clubs/clubs.routes.js";
import coordinatorRouter from "./modules/coordinator/coordinator.router.js";
import eventsRouter from "./modules/events/events.routes.js";
import attendenceRouter from "./modules/attendance/attendance.routes.js";
import staffRouter from "./modules/staff/staff.router.js";
import notificationsRouter from "./modules/notifications/notifications.routes.js";
import announcementsRouter from "./modules/announcements/announcements.routes.js";

import errorHandler from "./middleware/error.middleware.js";
import rolesRouter, { meRouter } from "./modules/rbac/rbac.routes.js";
import teacherRouter from "./modules/teacher/teacher.routes.js";
import subjectsRouter from "./modules/subjects/subjects.routes.js";
import classAttendanceRouter from "./modules/class-attendence/class-attendance.routes.js";
import attendanceReportsRouter from "./modules/attendance-reports/attendance-reports.routes.js";
import resourcesRouter from "./modules/resources/resources.routes.js";
import issuesRouter from "./modules/issues/issues.routes.js";
import lostFoundRouter from "./modules/lost-and-found/lost-found.routes.js";

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("running");
})

app.use("/api/students", studentRoutes);
app.use("/api/hod", hodRouter);
app.use("/api/principal", principalRouter);
app.use("/api/department", departmentRoter);
app.use("/api/clubs", clubsRouter);
app.use("/api/coordinator", coordinatorRouter);
app.use("/api/events", eventsRouter);
app.use("/api/attendance", attendenceRouter);
app.use("/api/staff", staffRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/announcements", announcementsRouter);
app.use("/api/subjects", subjectsRouter);
app.use("/api/class-attendance", classAttendanceRouter);
app.use("/api/attendance-reports", attendanceReportsRouter);
app.use("/api/resources", resourcesRouter);
app.use("/api/issues", issuesRouter);
app.use("/api/lost-found", lostFoundRouter);


app.use("/api/me", meRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/teacher", teacherRouter);

app.use("/api", (_req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
