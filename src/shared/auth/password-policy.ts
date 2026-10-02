import { z } from 'zod';

/** Keep in sync with Better Auth `emailAndPassword` min/max. */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

type PasswordLengthMessages = {
  passwordRequired?: string;
  passwordMin: string;
  passwordMax: string;
};

type PasswordPairMessages = PasswordLengthMessages & {
  passwordsMismatch: string;
};

/** Single password field (login / register / set-password body). */
export function createPasswordFieldSchema(messages: PasswordLengthMessages) {
  let schema = z.string();

  if (messages.passwordRequired) {
    schema = schema.min(1, { error: messages.passwordRequired });
  }

  return schema
    .min(PASSWORD_MIN_LENGTH, { error: messages.passwordMin })
    .max(PASSWORD_MAX_LENGTH, { error: messages.passwordMax });
}

/** New + confirm password pair (profile change/set, reset password). */
export function createNewPasswordPairSchema(messages: PasswordPairMessages) {
  return z
    .object({
      newPassword: createPasswordFieldSchema(messages),
      confirmPassword: createPasswordFieldSchema(messages),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
      message: messages.passwordsMismatch,
      path: ['confirmPassword'],
    });
}
