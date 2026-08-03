import { defineRouting } from 'next-intl/routing';

import { defaultLocale, locales } from '@/shared/lib/get-messages';

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});
