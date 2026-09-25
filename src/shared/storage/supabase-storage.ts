import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { createAvatarConfirmToken } from './avatar-confirm-token';
import { AvatarStorageError } from './avatar-storage-error';
import {
  AVATAR_MAX_BYTES,
  AVATAR_SIGNED_URL_TTL_SECONDS,
  CONTENT_TYPE_TO_EXTENSION,
  type AvatarContentType,
  type AvatarUploadIntentResult,
} from './storage.constants';
import {
  detectAvatarContentType,
  extractStoragePathFromPublicUrl,
  isAvatarPathOwnedByUser,
  isManagedAvatarPublicUrl,
} from './storage.utils';
import {
  getSupabaseStorageConfig,
  type SupabaseStorageConfig,
} from './supabase-config';

export { AvatarStorageError } from './avatar-storage-error';

type StorageContext = {
  config: SupabaseStorageConfig;
  client: SupabaseClient;
};

let storage: StorageContext | null = null;

/**
 * Lazy singleton for the whole storage context.
 * Callers need both `config` (bucket/prefix) and `client` on every op,
 * so we cache the pair — not only the client.
 * Missing env → AvatarStorageError (single place for "not configured").
 */
function getStorage(): StorageContext {
  if (storage !== null) {
    return storage;
  }

  const config = getSupabaseStorageConfig();

  if (!config) {
    throw new AvatarStorageError(500, 'Supabase storage is not configured.');
  }

  const client = createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  storage = { config, client };

  return storage;
}

export function isStorageConfigured(): boolean {
  return getSupabaseStorageConfig() !== null;
}

export function isManagedUserAvatar(image: string | null | undefined): boolean {
  const config = getSupabaseStorageConfig();

  if (!config) {
    return false;
  }

  return isManagedAvatarPublicUrl(image, config.url, config.bucket);
}

export async function createAvatarUploadIntent(
  userId: string,
  input: { contentType: AvatarContentType; contentLength: number },
): Promise<AvatarUploadIntentResult> {
  if (input.contentLength > AVATAR_MAX_BYTES) {
    throw new AvatarStorageError(400, 'Avatar file is too large.');
  }

  const { config, client: supabase } = getStorage();
  const extension = CONTENT_TYPE_TO_EXTENSION[input.contentType];
  const path = `${config.avatarsPrefix}/${userId}/${crypto.randomUUID()}.${extension}`;

  const { data, error } = await supabase.storage
    .from(config.bucket)
    .createSignedUploadUrl(path, { upsert: true });

  if (error !== null || data === null) {
    console.error('[storage] signed upload URL failed', error?.message);
    throw new AvatarStorageError(500, 'Could not prepare avatar upload.');
  }

  const { data: publicData } = supabase.storage
    .from(config.bucket)
    .getPublicUrl(data.path);

  const expiresAt = new Date(Date.now() + AVATAR_SIGNED_URL_TTL_SECONDS * 1000);

  return {
    uploadUrl: data.signedUrl,
    path: data.path,
    publicUrl: publicData.publicUrl,
    expiresAt,
    confirmToken: createAvatarConfirmToken(userId, data.path, expiresAt),
  };
}

export async function assertUploadedAvatar(
  path: string,
  userId: string,
): Promise<void> {
  const { config, client: supabase } = getStorage();

  if (!isAvatarPathOwnedByUser(path, userId, config.avatarsPrefix)) {
    throw new AvatarStorageError(400, 'Invalid avatar path.');
  }

  const { data, error } = await supabase.storage
    .from(config.bucket)
    .download(path);

  if (error !== null || data === null) {
    throw new AvatarStorageError(400, 'Uploaded avatar was not found.');
  }

  if (data.size > AVATAR_MAX_BYTES) {
    throw new AvatarStorageError(400, 'Avatar file is too large.');
  }

  const headerBytes = new Uint8Array(await data.slice(0, 12).arrayBuffer());
  const detectedContentType = detectAvatarContentType(headerBytes);

  if (detectedContentType === null) {
    throw new AvatarStorageError(400, 'Unsupported avatar file format.');
  }
}

export function getAvatarPublicUrl(path: string): string {
  const { config, client: supabase } = getStorage();
  const { data } = supabase.storage.from(config.bucket).getPublicUrl(path);

  return data.publicUrl;
}

export async function deleteManagedAvatarIfPresent(
  imageUrl: string | null | undefined,
): Promise<void> {
  const config = getSupabaseStorageConfig();

  if (
    !config ||
    !isManagedAvatarPublicUrl(imageUrl, config.url, config.bucket)
  ) {
    return;
  }

  const path = extractStoragePathFromPublicUrl(
    imageUrl as string,
    config.url,
    config.bucket,
  );

  if (!path) {
    return;
  }

  const { client: supabase } = getStorage();
  const { error } = await supabase.storage.from(config.bucket).remove([path]);

  if (error !== null) {
    console.error('[storage] delete object failed', error.message);
    throw new AvatarStorageError(500, 'Could not delete avatar file.');
  }
}
