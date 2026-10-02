import { z } from 'zod';

import { createPasswordFieldSchema } from '@/shared/auth/password-policy';

type EmailPasswordMessages = {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMin: string;
  passwordMax: string;
};

type NameMessages = {
  nameRequired: string;
  nameMin: string;
};

function emailSchema(
  messages: Pick<EmailPasswordMessages, 'emailRequired' | 'emailInvalid'>,
) {
  return z
    .string()
    .trim()
    .min(1, { error: messages.emailRequired })
    .pipe(z.email({ error: messages.emailInvalid }));
}

export function createLoginSchema(messages: EmailPasswordMessages) {
  return z.object({
    email: emailSchema(messages),
    password: createPasswordFieldSchema({
      passwordRequired: messages.passwordRequired,
      passwordMin: messages.passwordMin,
      passwordMax: messages.passwordMax,
    }),
  });
}

export function createRegisterSchema(
  messages: EmailPasswordMessages & NameMessages,
) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, { error: messages.nameRequired })
      .min(2, { error: messages.nameMin }),
    email: emailSchema(messages),
    password: createPasswordFieldSchema({
      passwordRequired: messages.passwordRequired,
      passwordMin: messages.passwordMin,
      passwordMax: messages.passwordMax,
    }),
  });
}

export function createResendVerificationSchema(
  messages: Pick<EmailPasswordMessages, 'emailRequired' | 'emailInvalid'>,
) {
  return z.object({
    email: emailSchema(messages),
  });
}

export function createForgotPasswordSchema(
  messages: Pick<EmailPasswordMessages, 'emailRequired' | 'emailInvalid'>,
) {
  return z.object({
    email: emailSchema(messages),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
export type ResendVerificationFormValues = z.infer<
  ReturnType<typeof createResendVerificationSchema>
>;
export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;
