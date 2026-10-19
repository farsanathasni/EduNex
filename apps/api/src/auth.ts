
import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { admin } from "better-auth/plugins";
import { db } from "./config/database.js";
import { sendEmail } from "./utils/email.js";

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



  minPasswordLength: 8,

    sendResetPassword: async ({ user, url }) => {
    await sendEmail({
      to: user.email,
      subject: "Set up your EduNex account",
      html: `
        <h2>Welcome to EduNex!</h2>
        <p>Your HOD account has been created.</p>
        <p>Click the link below to choose your password.</p>
        <a href="${url}">Set Your Password</a>
        <p>If you did not expect this email, you can ignore it.</p>
      `,
    });
  },

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
