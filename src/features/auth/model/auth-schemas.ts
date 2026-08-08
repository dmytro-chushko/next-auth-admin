import { z } from 'zod';

type EmailPasswordMessages = {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMin: string;
};

type NameMessages = {
  nameRequired: string;
  nameMin: string;
};

function emailSchema(messages: EmailPasswordMessages) {
  return z
    .string()
    .trim()
    .min(1, { error: messages.emailRequired })
    .pipe(z.email({ error: messages.emailInvalid }));
}

function passwordSchema(messages: EmailPasswordMessages) {
  return z
    .string()
    .min(1, { error: messages.passwordRequired })
    .min(8, { error: messages.passwordMin });
}

export function createLoginSchema(messages: EmailPasswordMessages) {
  return z.object({
    email: emailSchema(messages),
    password: passwordSchema(messages),
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
    password: passwordSchema(messages),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
