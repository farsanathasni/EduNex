
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import studentRoutes from "./modules/students/student.router.js"
import hodRouter from "./modules/hod/hod.router.js";

import errorHandler from "./middleware/error.middleware.js";

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Better Auth handler must come before express.json()
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("running");
});

app.use("/api/students",studentRoutes)
app.use("/api/hod", hodRouter);



app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
