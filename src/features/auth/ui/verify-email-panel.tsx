'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';

type VerifyEmailPanelProps = {
  status: 'success' | 'invalid_token' | 'missing';
};

export function VerifyEmailPanel({ status }: VerifyEmailPanelProps) {
  const t = useTranslations('auth.verifyEmail');

  const message =
    status === 'success'
      ? t('success')
      : status === 'invalid_token'
        ? t('invalidToken')
        : t('missingToken');

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>

      <Button asChild>
        <Link href={status === 'success' ? '/dashboard' : '/login'}>
          {status === 'success' ? t('goToDashboard') : t('goToLogin')}
        </Link>
      </Button>

      {status !== 'success' ? (
        <Link
          href="/verify-email/pending"
          className="text-muted-foreground text-sm underline underline-offset-4"
        >
          {t('goToPending')}
        </Link>
      ) : null}
    </div>
  );
}
