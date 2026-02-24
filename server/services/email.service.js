import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST) {
    console.warn("[email] SMTP not configured. Emails are logged only.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });

  return transporter;
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const tx = getTransporter();

  if (!tx) {
    console.log("[email:mock]", { to, subject, text });
    return { mocked: true };
  }

  return tx.sendMail({
    from: process.env.MAIL_FROM || "no-reply@peerlearn.app",
    to,
    subject,
    text,
    html,
  });
};
