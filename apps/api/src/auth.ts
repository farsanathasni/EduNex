
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
  student,
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
    subject: "Set Up or Reset Your EduNex Password",
    html: `
      <h2>EduNex Password Setup</h2>
      <p>Use the link below to set or reset your EduNex password.</p>
      <a href="${url}">Set Up or Reset Password</a>
      <p>If you did not request this, you can ignore this email.</p>
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
        student,
        club_coordinator: clubCoordinator,
      },
      defaultRole: "student",
      adminRoles: ["hod"],
    }),
  ],
});
