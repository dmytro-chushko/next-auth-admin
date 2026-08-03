import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { HomePage } from '@/views/home';

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <HomePage />;
}
