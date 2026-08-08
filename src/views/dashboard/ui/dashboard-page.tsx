import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import type { Session } from '@/shared/auth/auth';
import { Button } from '@/shared/ui/button';

type DashboardPageProps = {
  session: Session;
};

export async function DashboardPage({ session }: DashboardPageProps) {
  const t = await getTranslations('dashboard');

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="text-muted-foreground text-base">
        {t('greeting', { name: session.user.name })}
      </p>
      <p className="text-sm">
        {t('roleLabel')}:{' '}
        <span className="font-medium">{session.user.role}</span>
      </p>
      <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
      <div>
        <Button asChild variant="outline">
          <Link href="/">{t('backHome')}</Link>
        </Button>
      </div>
    </section>
  );
}
