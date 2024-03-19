import { createTransport } from "nodemailer";

/**
 * Sends an email using SMTP
 * @param {string} email - The recipient's email address
 * @param {string} subject - The subject of the email
 * @param {string} text - The body of the email
 */
export const sendMail = async (email, subject, text = "", html = "") => {
  // Create SMTP transport
  const transport = createTransport({
    service: "Gmail",
    port: process.env.SMTP_PORT,
    host: process.env.SMTP_HOST,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Send email
  await transport.sendMail({
    from: `Project Peak <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    text,
    html,
  });
};
