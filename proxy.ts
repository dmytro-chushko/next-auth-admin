import { acceptClientHintsHeader } from '@teispace/next-themes/server';
import { getSessionCookie } from 'better-auth/cookies';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './src/i18n/routing';
import {
  isProtectedPath,
  stripLocalePrefix,
} from './src/shared/auth/auth-routes';

const intlMiddleware = createMiddleware(routing);

function resolveLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];

  if (
    maybeLocale !== undefined &&
    routing.locales.includes(maybeLocale as (typeof routing.locales)[number])
  ) {
    return maybeLocale;
  }

  return routing.defaultLocale;
}

function buildLocalizedUrl(request: NextRequest, path: string): URL {
  const locale = resolveLocaleFromPathname(request.nextUrl.pathname);

  return new URL(`/${locale}${path}`, request.url);
}

export default function proxy(request: NextRequest) {
  const pathnameWithoutLocale = stripLocalePrefix(
    request.nextUrl.pathname,
    routing.locales,
  );
  const sessionCookie = getSessionCookie(request);

  // Cookie presence only — do not redirect auth pages here (stale cookie → loop).
  if (isProtectedPath(pathnameWithoutLocale) && !sessionCookie) {
    return NextResponse.redirect(buildLocalizedUrl(request, '/login'));
  }

  const response = intlMiddleware(request);

  response.headers.set('Accept-CH', acceptClientHintsHeader());

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
