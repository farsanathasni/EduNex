import nodemailer from "nodemailer";

const emailUser = process.env.SMTP_USER;
const emailPassword = process.env.SMTP_APP_PASSWORD;

if (!emailUser || !emailPassword) {
  throw new Error("SMTP email environment variables are missing");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE !== "false",
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailOptions) {
  const result = await transporter.sendMail({
    from: `"EduNex" <${emailUser}>`,
    to,
    subject,
    html,
  });

  return result;
}