import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { requireUser } from '@/shared/auth/session';
import { DashboardPage } from '@/views/dashboard';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleDashboardPage({ params }: PageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const session = await requireUser();

  return <DashboardPage session={session} />;
}
