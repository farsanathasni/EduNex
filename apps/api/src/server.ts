
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
