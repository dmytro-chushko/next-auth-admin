import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { getEnabledOAuthProviders } from '@/shared/auth/oauth-providers';
import { requireGuest } from '@/shared/auth/session';
import { LoginPage } from '@/views/auth';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLoginPage({ params }: PageProps) {
  const { locale } = await params;

  setRequestLocale(locale);
  await requireGuest();

  return <LoginPage oauthProviders={getEnabledOAuthProviders()} />;
}
