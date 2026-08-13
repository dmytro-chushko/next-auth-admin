import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { VerifyEmailPendingPage } from '@/views/auth';

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string }>;
};

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleVerifyEmailPendingPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { email } = await searchParams;

  setRequestLocale(locale);

  return <VerifyEmailPendingPage email={email?.trim() ?? ''} />;
}
