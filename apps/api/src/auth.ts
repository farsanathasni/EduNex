
import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "./config/database.js";
import { sendEmail } from "./utils/email.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",

  trustedOrigins: ["http://localhost:3000"],

  emailAndPassword: {
    enabled: true,
  disableSignUp: true,
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
});
