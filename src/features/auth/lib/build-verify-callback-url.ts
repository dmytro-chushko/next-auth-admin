/** Absolute callback URL after email verification (Better Auth requires origin). */
export function buildVerifyCallbackUrl(locale: string, origin: string): string {
  return `${origin}/${locale}/verify-email`;
}
