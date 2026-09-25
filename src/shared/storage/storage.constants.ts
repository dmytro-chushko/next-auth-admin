export const AVATAR_SIGNED_URL_TTL_SECONDS = 120;

export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;

export const AVATAR_ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export type AvatarContentType = (typeof AVATAR_ALLOWED_CONTENT_TYPES)[number];

export const CONTENT_TYPE_TO_EXTENSION: Record<AvatarContentType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export type AvatarUploadIntentResult = {
  uploadUrl: string;
  path: string;
  publicUrl: string;
  expiresAt: Date;
  /** HMAC token required on confirm (binds path + userId + expiry). */
  confirmToken: string;
};
