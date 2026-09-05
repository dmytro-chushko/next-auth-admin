'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { currentUserQueryKey, useCurrentUserQuery } from '@/entities/user';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import type { UserMe } from '@/shared/api';
import { authClient } from '@/shared/auth/auth-client';
import { isVerifyEmailPath } from '@/shared/auth/auth-routes';
import { Button } from '@/shared/ui/button';

type AuthNavActionsProps = {
  initialUser?: UserMe | null;
};

export function AuthNavActions({ initialUser = null }: AuthNavActionsProps) {
  const t = useTranslations('header');
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const { data: user } = useCurrentUserQuery({
    initialData: initialUser,
  });

  async function handleSignOut() {
    setIsPending(true);
    await authClient.signOut();
    queryClient.setQueryData(currentUserQueryKey, null);
    setIsPending(false);
    router.replace('/login');
    router.refresh();
  }

  if (!user) {
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
      <span className="text-muted-foreground hidden max-w-28 truncate text-sm sm:inline">
        {user.name}
      </span>
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
