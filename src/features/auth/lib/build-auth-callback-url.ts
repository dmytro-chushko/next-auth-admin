/** Absolute callback URL (Better Auth requires origin). */
export function buildAuthCallbackUrl(
  locale: string,
  origin: string,
  path: '/dashboard' | '/verify-email',
): string {
  return `${origin}/${locale}${path}`;
}
