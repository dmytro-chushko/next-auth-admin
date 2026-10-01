'use client';

import { User } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useCurrentUserQuery } from '@/entities/user';
import { usePathname } from '@/i18n/navigation';
import type { UserMe } from '@/shared/api';
import { isPublicAuthPath } from '@/shared/auth/auth-routes';
import { Button } from '@/shared/ui/button';

import { LoginLinkButton } from './login-link-button';
import { UserAccountFlatActions } from './user-account-flat-actions';
import { UserDropdown } from './user-dropdown';

type AuthHeaderActionProps = {
  initialUser?: UserMe | null;
  onNavigate?: () => void;
  presentation?: 'dropdown' | 'flat-list';
};

export function AuthHeaderAction({
  initialUser = null,
  onNavigate,
  presentation = 'dropdown',
}: AuthHeaderActionProps) {
  const pathname = usePathname();
  const t = useTranslations('header');
  const { data: user, isPending } = useCurrentUserQuery({
    initialData: initialUser,
  });

  if (isPublicAuthPath(pathname)) {
    return null;
  }

  if (isPending && !user) {
    if (presentation === 'flat-list') {
      return (
        <div aria-busy="true" aria-live="polite">
          <span className="sr-only">{t('userMenuLoading')}</span>
        </div>
      );
    }

    return (
      <Button
        variant="default"
        size="icon"
        className="shrink-0"
        disabled
        aria-busy="true"
        aria-label={t('userMenuAriaLabel')}
      >
        <User />
      </Button>
    );
  }

  if (user) {
    const isAdmin = user.role === 'admin';

    if (presentation === 'flat-list') {
      return (
        <UserAccountFlatActions
          isAdmin={isAdmin}
          name={user.name}
          email={user.email}
          avatarUrl={user.image}
          onNavigate={onNavigate}
        />
      );
    }

    return (
      <UserDropdown
        isAdmin={isAdmin}
        name={user.name}
        email={user.email}
        avatarUrl={user.image}
      />
    );
  }

  return <LoginLinkButton onNavigate={onNavigate} />;
}
