import { z } from 'zod';

type ProfileNameMessages = {
  nameRequired: string;
  nameMin: string;
  nameMax: string;
};

export function createProfileNameSchema(messages: ProfileNameMessages) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, { error: messages.nameRequired })
      .min(2, { error: messages.nameMin })
      .max(120, { error: messages.nameMax }),
  });
}

export type ProfileNameFormValues = z.infer<
  ReturnType<typeof createProfileNameSchema>
>;
