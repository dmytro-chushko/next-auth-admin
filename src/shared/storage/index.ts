export {
  AVATAR_ALLOWED_CONTENT_TYPES,
  AVATAR_MAX_BYTES,
  AVATAR_SIGNED_URL_TTL_SECONDS,
  CONTENT_TYPE_TO_EXTENSION,
  type AvatarContentType,
  type AvatarUploadIntentResult,
} from './storage.constants';
export {
  detectAvatarContentType,
  extractStoragePathFromPublicUrl,
  isAvatarPathOwnedByUser,
  isManagedAvatarPublicUrl,
} from './storage.utils';
export {
  getSupabaseStorageConfig,
  requireSupabaseStorageConfig,
} from './supabase-config';
export {
  assertUploadedAvatar,
  AvatarStorageError,
  createAvatarUploadIntent,
  deleteManagedAvatarIfPresent,
  getAvatarPublicUrl,
  isManagedUserAvatar,
  isStorageConfigured,
} from './supabase-storage';
export {
  createAvatarConfirmToken,
  verifyAvatarConfirmToken,
} from './avatar-confirm-token';
