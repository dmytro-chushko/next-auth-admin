import { Resend } from 'resend';

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set');
  }

  return new Resend(apiKey);
}

function getFromAddress(): string {
  const from = process.env.EMAIL_FROM;

  if (!from) {
    throw new Error('EMAIL_FROM is not set');
  }

  return from;
}

/**
 * Transactional email via Resend.
 * Callers should fire-and-forget (`void sendEmail(...)`) to avoid timing leaks.
 */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });

  if (error) {
    throw new Error(error.message);
  }
}
