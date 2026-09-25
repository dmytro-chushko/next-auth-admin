import { z } from 'zod';

/** Better Auth admin plugin roles (lowercase). */
export const roleSchema = z.enum(['user', 'admin']);

export const userMeSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  image: z.string().nullable(),
  /** True when `image` points at our Supabase avatars bucket. */
  hasManagedAvatar: z.boolean(),
  role: roleSchema,
  emailVerified: z.boolean(),
});

export type UserMe = z.infer<typeof userMeSchema>;
export type Role = z.infer<typeof roleSchema>;

export const avatarContentTypeSchema = z.enum([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;

export const avatarUploadIntentBodySchema = z.object({
  contentType: avatarContentTypeSchema,
  contentLength: z.number().int().positive().max(AVATAR_MAX_BYTES),
});

export const avatarUploadIntentSchema = z.object({
  uploadUrl: z.string(),
  path: z.string().min(1),
  publicUrl: z.string(),
  expiresAt: z.coerce.date(),
  confirmToken: z.string().min(1),
});

export const avatarConfirmBodySchema = z.object({
  path: z.string().min(1),
  confirmToken: z.string().min(1),
});

export type AvatarUploadIntent = z.infer<typeof avatarUploadIntentSchema>;
