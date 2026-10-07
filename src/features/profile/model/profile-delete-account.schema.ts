import { z } from 'zod';

import { PASSWORD_MAX_LENGTH } from '@/shared/auth/password-policy';

type ProfileDeleteAccountFormMessages = {
  emailMismatch: string;
  currentPasswordRequired: string;
};

export function createProfileDeleteAccountFormSchema(
  expectedEmail: string,
  hasPassword: boolean,
  messages: ProfileDeleteAccountFormMessages,
) {
  return z
    .object({
      emailConfirmation: z.string().trim().min(1),
      currentPassword: z.string().max(PASSWORD_MAX_LENGTH).optional(),
    })
    .superRefine((values, ctx) => {
      if (values.emailConfirmation !== expectedEmail) {
        ctx.addIssue({
          code: 'custom',
          path: ['emailConfirmation'],
          message: messages.emailMismatch,
        });
      }

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
    });
}

export type ProfileDeleteAccountFormValues = z.infer<
  ReturnType<typeof createProfileDeleteAccountFormSchema>
>;
