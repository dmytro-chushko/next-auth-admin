import { headers } from 'next/headers';
import { getLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';
import { auth, type Session } from '@/shared/auth/auth';

export async function getSession(): Promise<Session | null> {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireUser(): Promise<Session> {
  const session = await getSession();

  if (session) {
    return session;
  }

  redirect({ href: '/login', locale: await getLocale() });

  // next-intl `redirect` is typed without `never`
  throw new Error('Unreachable: redirect to login');
}

export async function requireAdmin(): Promise<Session> {
  const session = await requireUser();

  if (session.user.role === 'admin') {
    return session;
  }

  redirect({ href: '/dashboard', locale: await getLocale() });

  throw new Error('Unreachable: redirect to dashboard');
}

/** Redirect signed-in users away from login/register (validates session, not just cookie). */
export async function requireGuest(): Promise<void> {
  const session = await getSession();

  if (!session) {
    return;
  }

  redirect({ href: '/dashboard', locale: await getLocale() });

  throw new Error('Unreachable: redirect to dashboard');
}
