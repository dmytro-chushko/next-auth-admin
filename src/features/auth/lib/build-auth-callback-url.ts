/** Absolute callback URL (Better Auth requires origin). */
export function buildAuthCallbackUrl(
  locale: string,
  origin: string,
  path: '/dashboard' | '/verify-email' | '/reset-password',
): string {
  return `${origin}/${locale}${path}`;
}
