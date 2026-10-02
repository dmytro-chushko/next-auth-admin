import { z } from 'zod';

import {
  createPasswordFieldSchema,
  PASSWORD_MAX_LENGTH,
} from '@/shared/auth/password-policy';

type ProfilePasswordFormMessages = {
  currentPasswordRequired: string;
  passwordMin: string;
  passwordMax: string;
  passwordsMismatch: string;
};

export function createProfilePasswordFormSchema(
  hasPassword: boolean,
  messages: ProfilePasswordFormMessages,
) {
  const passwordField = createPasswordFieldSchema({
    passwordMin: messages.passwordMin,
    passwordMax: messages.passwordMax,
  });

  return z
    .object({
      currentPassword: z.string().max(PASSWORD_MAX_LENGTH).optional(),
      newPassword: passwordField,
      confirmPassword: passwordField,
    })
    .superRefine((values, ctx) => {
      if (
        hasPassword &&
        (values.currentPassword === undefined ||
          values.currentPassword.trim().length === 0)
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['currentPassword'],
          message: messages.currentPasswordRequired,
        });
      }
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
      message: messages.passwordsMismatch,
      path: ['confirmPassword'],
    });
}

export type ProfilePasswordFormValues = z.infer<
  ReturnType<typeof createProfilePasswordFormSchema>
>;
