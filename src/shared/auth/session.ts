import { headers } from 'next/headers';
import { getLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';
import { auth, type Session } from '@/shared/auth/auth';

function verifyEmailPendingHref(email: string): string {
  const params = new URLSearchParams({ email });

  return `/verify-email/pending?${params.toString()}`;
}

export async function getSession(): Promise<Session | null> {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireUser(): Promise<Session> {
  const session = await getSession();

  if (!session) {
    redirect({ href: '/login', locale: await getLocale() });

    throw new Error('Unreachable: redirect to login');
  }

  if (!session.user.emailVerified) {
    redirect({
      href: verifyEmailPendingHref(session.user.email),
      locale: await getLocale(),
    });

    throw new Error('Unreachable: redirect to verify-email pending');
  }

  return session;
}

export async function requireAdmin(): Promise<Session> {
  const session = await requireUser();

  if (session.user.role === 'admin') {
    return session;
  }

  redirect({ href: '/dashboard', locale: await getLocale() });

  throw new Error('Unreachable: redirect to dashboard');
}

/**
 * Redirect signed-in + verified users away from login/register.
 * Unverified sessions (edge cases) go to the pending page instead of the app.
 */
export async function requireGuest(): Promise<void> {
  const session = await getSession();

  if (!session) {
    return;
  }

  const locale = await getLocale();

  if (!session.user.emailVerified) {
    redirect({
      href: verifyEmailPendingHref(session.user.email),
      locale,
    });

    throw new Error('Unreachable: redirect to verify-email pending');
  }

  redirect({ href: '/dashboard', locale });

  throw new Error('Unreachable: redirect to dashboard');
}
