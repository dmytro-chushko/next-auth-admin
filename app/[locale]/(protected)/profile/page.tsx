import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { requireUser } from '@/shared/auth/session';
import { ProfilePage } from '@/views/profile';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleProfilePage({ params }: PageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const session = await requireUser();

  return <ProfilePage session={session} />;
}
