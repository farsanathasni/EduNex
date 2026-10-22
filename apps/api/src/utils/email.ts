
import nodemailer from "nodemailer";

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
  const emailUser = process.env.SMTP_USER;
  const emailPassword = process.env.SMTP_APP_PASSWORD;

  if (!emailUser || !emailPassword) {
    throw new Error(
      "SMTP_USER and SMTP_APP_PASSWORD are required to send emails",
    );
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

  return transporter.sendMail({
    from: `"EduNex" <${emailUser}>`,
    to,
    subject,
    html,
  });
}
