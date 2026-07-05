import ejs from "ejs";
import status from "http-status";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

import { envVars } from "../config/env.js";
import { AppError } from "../errors/app.error.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: envVars.EMAIL_SENDER.SMTP_PORT,
  secure: envVars.EMAIL_SENDER.SMTP_PORT === 465,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  text: string;
  template: string;
  templateData?: object;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }[];
  replyTo?: string;
}

export const sendEmail = async ({
  to,
  cc,
  bcc,
  replyTo,
  subject,
  text,
  template,
  templateData,
  attachments,
}: SendEmailOptions) => {
  try {
    const templatePath = path.join(__dirname, `templates/${template}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);

    await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM_EMAIL,
      to,
      cc,
      bcc,
      replyTo,
      subject,
      text,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      `Failed to send email: ${message}`,
    );
  }
};
