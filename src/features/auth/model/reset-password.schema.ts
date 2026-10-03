import { z } from 'zod';

import { createPasswordFieldSchema } from '@/shared/auth/password-policy';

type ResetPasswordMessages = {
  passwordMin: string;
  passwordMax: string;
  passwordsMismatch: string;
  tokenRequired: string;
};

export function createResetPasswordSchema(messages: ResetPasswordMessages) {
  const passwordField = createPasswordFieldSchema({
    passwordMin: messages.passwordMin,
    passwordMax: messages.passwordMax,
  });

  return z
    .object({
      token: z.string().min(1, { error: messages.tokenRequired }),
      newPassword: passwordField,
      confirmPassword: passwordField,
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
      message: messages.passwordsMismatch,
      path: ['confirmPassword'],
    });
}

export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;
