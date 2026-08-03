import { getTranslations } from 'next-intl/server';

import { LocaleSwitcher } from '@/features/locale-switcher';
import { ThemeModeToggle } from '@/features/theme-toggle';

export async function AppHeader() {
  const t = await getTranslations('header');

  return (
    <div className="bg-background/80 border-border flex h-14 items-center justify-between gap-4 border-b px-4 backdrop-blur-md sm:px-6">
      <p className="text-foreground truncate text-sm font-semibold tracking-tight sm:text-base">
        {t('appTitle')}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <ThemeModeToggle
          darkLabel={t('themeDark')}
          lightLabel={t('themeLight')}
          systemLabel={t('themeSystem')}
          ariaLabel={t('themeModeAriaLabel')}
        />
        <LocaleSwitcher size="sm" />
      </div>
    </div>
  );
}
