import { getTranslations } from 'next-intl/server';

import { AppHeaderBar } from './app-header-bar';

export async function AppHeader() {
  const t = await getTranslations('header');

  return (
    <AppHeaderBar
      title={t('appTitle')}
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
