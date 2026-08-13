import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { getSession } from '@/shared/auth/session';
import { VerifyEmailPage } from '@/views/auth';

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

async function resolveStatus(
  error: string | undefined,
): Promise<'success' | 'invalid_token' | 'missing'> {
  if (error) {
    return 'invalid_token';
  }

  const session = await getSession();

  if (session?.user.emailVerified) {
    return 'success';
  }

  return 'missing';
}

export default async function LocaleVerifyEmailPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { error } = await searchParams;

  setRequestLocale(locale);

  return <VerifyEmailPage status={await resolveStatus(error)} />;
}
