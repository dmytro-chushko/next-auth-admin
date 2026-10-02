import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { requireGuest } from '@/shared/auth/session';
import { ResetPasswordPage } from '@/views/auth';

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string; error?: string }>;
};

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleResetPasswordPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { token, error } = await searchParams;

  setRequestLocale(locale);
  await requireGuest();

  return (
    <ResetPasswordPage
      token={token ?? ''}
      hasInvalidTokenError={Boolean(error)}
    />
  );
}
