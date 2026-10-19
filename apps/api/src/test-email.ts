import "dotenv/config";
import { sendEmail } from "./utils/email.js";

async function main() {
  try {
    const result = await sendEmail({
      to: process.env.SMTP_USER!,
      subject: "EduNex Email Test",
      html: `
        <h2>Welcome to EduNex!</h2>
        <p>Your email configuration is working.</p>
      `,
    });

    console.log("Email sent successfully!");
    console.log("Message ID:", result.messageId);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

main();