import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { getSession } from '@/shared/auth/session';
import { Button } from '@/shared/ui/button';

export async function HomePage() {
  const t = await getTranslations('home');
  const session = await getSession();

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-balance">
        {t('title')}
      </h1>
      <p className="text-muted-foreground text-base text-pretty">
        {t('subtitle')}
      </p>
      <div className="flex flex-wrap gap-2">
        {session ? (
          <Button asChild>
            <Link href="/dashboard">{t('goDashboard')}</Link>
          </Button>
        ) : (
          <>
            <Button asChild>
              <Link href="/login">{t('goLogin')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">{t('goRegister')}</Link>
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
