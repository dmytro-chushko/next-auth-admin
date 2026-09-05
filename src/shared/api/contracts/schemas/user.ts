import { z } from 'zod';

/** Better Auth admin plugin roles (lowercase). */
export const roleSchema = z.enum(['user', 'admin']);

export const userMeSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  image: z.string().nullable(),
  role: roleSchema,
  emailVerified: z.boolean(),
});

export type UserMe = z.infer<typeof userMeSchema>;
export type Role = z.infer<typeof roleSchema>;
