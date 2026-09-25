import { createHmac, timingSafeEqual } from 'node:crypto';

import { AvatarStorageError } from './avatar-storage-error';

type AvatarConfirmPayload = {
  userId: string;
  path: string;
  exp: number;
};

function getSigningSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET?.trim();

  if (!secret) {
    throw new AvatarStorageError(500, 'Signing secret is not configured.');
  }

  return secret;
}

function signPayload(payloadBase64Url: string): string {
  return createHmac('sha256', getSigningSecret())
    .update(payloadBase64Url)
    .digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

/** One-time-ish capability: bind this path to this user until `expiresAt`. */
export function createAvatarConfirmToken(
  userId: string,
  path: string,
  expiresAt: Date,
): string {
  const payload: AvatarConfirmPayload = {
    userId,
    path,
    exp: Math.floor(expiresAt.getTime() / 1000),
  };
  const payloadBase64Url = Buffer.from(
    JSON.stringify(payload),
    'utf8',
  ).toString('base64url');
  const signature = signPayload(payloadBase64Url);

  return `${payloadBase64Url}.${signature}`;
}

/**
 * Verifies the confirm token was issued for this session user + path and is not expired.
 */
export function verifyAvatarConfirmToken(
  token: string,
  userId: string,
  path: string,
): void {
  const [payloadBase64Url, signature] = token.split('.');

  if (!payloadBase64Url || !signature) {
    throw new AvatarStorageError(400, 'Invalid avatar confirm token.');
  }

  const expectedSignature = signPayload(payloadBase64Url);

  if (!safeEqual(signature, expectedSignature)) {
    throw new AvatarStorageError(400, 'Invalid avatar confirm token.');
  }

  let payload: AvatarConfirmPayload;

  try {
    payload = JSON.parse(
      Buffer.from(payloadBase64Url, 'base64url').toString('utf8'),
    ) as AvatarConfirmPayload;
  } catch {
    throw new AvatarStorageError(400, 'Invalid avatar confirm token.');
  }

  if (
    typeof payload.userId !== 'string' ||
    typeof payload.path !== 'string' ||
    typeof payload.exp !== 'number'
  ) {
    throw new AvatarStorageError(400, 'Invalid avatar confirm token.');
  }

  if (payload.exp * 1000 < Date.now()) {
    throw new AvatarStorageError(400, 'Avatar upload intent has expired.');
  }

  if (payload.userId !== userId || payload.path !== path) {
    throw new AvatarStorageError(400, 'Avatar confirm token mismatch.');
  }
}
