import { getRequestConfig } from 'next-intl/server';

import { getMessagesForLocale, type Locale } from '@/shared/lib/get-messages';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale =
    requested && routing.locales.includes(requested as Locale)
      ? (requested as Locale)
      : routing.defaultLocale;

  return {
    locale,
    messages: getMessagesForLocale(locale),
  };
});
