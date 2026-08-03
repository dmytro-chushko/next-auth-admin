import { acceptClientHintsHeader } from '@teispace/next-themes/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function proxy(
  ...args: Parameters<typeof intlMiddleware>
): ReturnType<typeof intlMiddleware> {
  const response = intlMiddleware(...args);

  response.headers.set('Accept-CH', acceptClientHintsHeader());

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
