'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { UserAvatar } from '@/shared/ui/user-avatar';

import { useUserDropdown } from '../hooks/use-user-dropdown';

type UserDropdownProps = {
  isAdmin: boolean;
  name?: string | null;
  email: string;
  avatarUrl?: string | null;
};

export function UserDropdown({
  isAdmin,
  name,
  email,
  avatarUrl,
}: UserDropdownProps) {
  const t = useTranslations('header');
  const { handleLogout, isLoggingOut } = useUserDropdown();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="icon"
          aria-label={t('userMenuAriaLabel')}
          className="size-10 shrink-0 overflow-hidden rounded-full p-0"
        >
          <UserAvatar
            name={name}
            email={email}
            avatarUrl={avatarUrl}
            size="md"
            className="size-10"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile">{t('profile')}</Link>
        </DropdownMenuItem>
        {isAdmin ? (
          <DropdownMenuItem asChild>
            <Link href="/admin">{t('admin')}</Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isLoggingOut}
          onSelect={(event) => {
            event.preventDefault();
            void handleLogout();
          }}
        >
          {isLoggingOut ? t('signingOut') : t('logOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
