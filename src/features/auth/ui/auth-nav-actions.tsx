'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { authClient } from '@/shared/auth/auth-client';
import { isVerifyEmailPath } from '@/shared/auth/auth-routes';
import { Button } from '@/shared/ui/button';

type AuthNavActionsProps = {
  isAuthenticated: boolean;
  userName?: string | null;
};

export function AuthNavActions({
  isAuthenticated,
  userName,
}: AuthNavActionsProps) {
  const t = useTranslations('header');
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, setIsPending] = useState(false);

  async function handleSignOut() {
    setIsPending(true);
    await authClient.signOut();
    setIsPending(false);
    router.replace('/login');
    router.refresh();
  }

  if (!isAuthenticated) {
    if (isVerifyEmailPath(pathname)) {
      return null;
    }

    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">{t('signIn')}</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/register">{t('signUp')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {userName ? (
        <span className="text-muted-foreground hidden max-w-28 truncate text-sm sm:inline">
          {userName}
        </span>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={handleSignOut}
      >
        {isPending ? t('signingOut') : t('signOut')}
      </Button>
    </div>
  );
}
