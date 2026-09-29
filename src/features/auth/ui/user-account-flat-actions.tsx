'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { UserAvatar } from '@/shared/ui/user-avatar';

import { useUserDropdown } from '../hooks/use-user-dropdown';

type UserAccountFlatActionsProps = {
  isAdmin: boolean;
  name?: string | null;
  email: string;
  avatarUrl?: string | null;
  onNavigate?: () => void;
};

const itemClassName =
  'hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1.5 text-sm';

export function UserAccountFlatActions({
  isAdmin,
  name,
  email,
  avatarUrl,
  onNavigate,
}: UserAccountFlatActionsProps) {
  const t = useTranslations('header');
  const { handleLogout, isLoggingOut } = useUserDropdown();

  function handleLogoutClick() {
    void handleLogout();
    onNavigate?.();
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-3">
        <UserAvatar name={name} email={email} avatarUrl={avatarUrl} size="sm" />
        <p className="text-sm font-medium">{name?.trim() || email}</p>
      </div>
      <ul className="flex flex-col items-start gap-1" role="list">
        <li>
          <Link href="/profile" className={itemClassName} onClick={onNavigate}>
            {t('profile')}
          </Link>
        </li>
        {isAdmin ? (
          <li>
            <Link href="/admin" className={itemClassName} onClick={onNavigate}>
              {t('admin')}
            </Link>
          </li>
        ) : null}
        <li>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive h-auto justify-start px-2 py-1.5 font-normal"
            disabled={isLoggingOut}
            onClick={handleLogoutClick}
          >
            {isLoggingOut ? t('signingOut') : t('logOut')}
          </Button>
        </li>
      </ul>
    </div>
  );
}
