
import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { admin } from "better-auth/plugins";
import { db } from "./config/database.js";

import {
  ac,
  hod,
  teacher,
  clubCoordinator,
} from "./modules/auth/permissions.js";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is missing");
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  baseURL:
    process.env.BETTER_AUTH_URL || "http://localhost:5000",

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: ["http://localhost:3000"],

  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 8,
  },

  plugins: [
    admin({
      ac,
      roles: {
        hod,
        teacher,
        club_coordinator: clubCoordinator,
      },
      defaultRole: "teacher",
      adminRoles: ["hod"],
    }),
  ],
});
