import { getTranslations } from 'next-intl/server';

import { getUserMeById } from '@/entities/user/model/get-user-me';
import { getSession } from '@/shared/auth/session';

import { AppHeaderBar } from './app-header-bar';

export async function AppHeader() {
  const t = await getTranslations('header');
  const session = await getSession();
  const initialUser = session ? await getUserMeById(session.user.id) : null;

  return (
    <AppHeaderBar
      title={t('appTitle')}
      initialUser={initialUser}
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
        account: t('mobileMenuAccountSection'),
      }}
    />
  );
}
