import { getTranslations } from 'next-intl/server';

import { getSession } from '@/shared/auth/session';

import { AppHeaderBar } from './app-header-bar';

export async function AppHeader() {
  const t = await getTranslations('header');
  const session = await getSession();

  return (
    <AppHeaderBar
      title={t('appTitle')}
      isAuthenticated={Boolean(session)}
      userName={session?.user.name}
      themeLabels={{
        darkLabel: t('themeDark'),
        lightLabel: t('themeLight'),
        systemLabel: t('themeSystem'),
        ariaLabel: t('themeModeAriaLabel'),
      }}
      mobileMenuLabels={{
        closeLabel: t('mobileMenuCloseLabel'),
        openAriaLabel: t('mobileMenuOpenAriaLabel'),
        title: t('mobileMenuTitle'),
      }}
      sectionLabels={{
        theme: t('mobileMenuThemeSection'),
        locale: t('mobileMenuLocaleSection'),
      }}
    />
  );
}
