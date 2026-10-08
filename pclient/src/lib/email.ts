// Transactional email client using Resend
import { Resend } from "resend";
import type { ReactElement } from "react";
import { logger } from "@/lib/logger";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS || "Poste <onboarding@resend.dev>";

interface SendEmailParams {
  to: string;
  subject: string;
  react: ReactElement;
}

// Sends a transactional email via Resend; returns success status and email ID or error
export async function sendEmail({ to, subject, react }: SendEmailParams) {
  const { data, error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject,
    react,
  });

  if (error) {
    logger.error("Failed to send email", { to, subject, error });
    return { success: false, error };
  }

  logger.info("Email sent", { to, subject, emailId: data?.id });
  return { success: true, id: data?.id };
}
