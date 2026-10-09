'use client';

import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';

import type { AdminUsersTableFeatures } from '@/features/admin/model/admin-users-table-features';
import { UsersTableColumnHeader } from '@/features/admin/ui/users-table/users-table-column-header';
import { Link } from '@/i18n/navigation';
import type { AdminUserListItem } from '@/shared/api';
import { Badge } from '@/shared/ui/badge';
import { UserAvatar } from '@/shared/ui/user-avatar';

export type UsersTableTranslator = (
  key: string,
  values?: Record<string, string | number>,
) => string;

type CreateUsersTableColumnsOptions = {
  t: UsersTableTranslator;
  formatJoinedDate: (value: Date) => string;
};

const columnHelper = createColumnHelper<
  AdminUsersTableFeatures,
  AdminUserListItem
>();

function UsersTableAuthBadges({
  connectedProviders,
  hasPassword,
  t,
}: {
  connectedProviders: AdminUserListItem['connectedProviders'];
  hasPassword: boolean;
  t: UsersTableTranslator;
}) {
  const badges: string[] = [];

  if (connectedProviders.includes('google')) {
    badges.push(t('auth.google'));
  }

  if (connectedProviders.includes('github')) {
    badges.push(t('auth.github'));
  }

  if (hasPassword) {
    badges.push(t('auth.password'));
  }

  if (badges.length === 0) {
    return (
      <span className="text-muted-foreground text-sm">{t('auth.none')}</span>
    );
  }

  return (
    <ul className="flex flex-wrap gap-1" role="list">
      {badges.map((label) => (
        <li key={label}>
          <Badge variant="secondary">{label}</Badge>
        </li>
      ))}
    </ul>
  );
}

export function createUsersTableColumns({
  t,
  formatJoinedDate,
}: CreateUsersTableColumnsOptions): ColumnDef<
  AdminUsersTableFeatures,
  AdminUserListItem,
  any
>[] {
  return [
    columnHelper.accessor('email', {
      id: 'user',
      header: ({ column }) => (
        <UsersTableColumnHeader column={column} title={t('columns.user')} />
      ),
      enableSorting: true,
      cell: ({ row }) => {
        const user = row.original;
        const displayName = user.name.trim() || user.email;

        return (
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar
              name={user.name}
              email={user.email}
              avatarUrl={user.image}
              size="sm"
            />
            <div className="min-w-0">
              <p className="truncate font-medium">{displayName}</p>
              {user.name.trim() ? (
                <p className="text-muted-foreground truncate text-sm">
                  {user.email}
                </p>
              ) : null}
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('role', {
      header: ({ column }) => (
        <UsersTableColumnHeader column={column} title={t('columns.role')} />
      ),
      enableSorting: false,
      cell: ({ getValue }) => (
        <Badge variant="secondary">
          {getValue() === 'admin' ? t('roleAdmin') : t('roleUser')}
        </Badge>
      ),
    }),
    columnHelper.accessor('emailVerified', {
      id: 'verified',
      header: ({ column }) => (
        <UsersTableColumnHeader column={column} title={t('columns.verified')} />
      ),
      enableSorting: false,
      cell: ({ getValue }) => {
        const isVerified = getValue();

        return (
          <Badge variant={isVerified ? 'secondary' : 'outline'}>
            {isVerified ? t('verifiedYes') : t('verifiedNo')}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: 'auth',
      header: ({ column }) => (
        <UsersTableColumnHeader column={column} title={t('columns.auth')} />
      ),
      enableSorting: false,
      cell: ({ row }) => (
        <UsersTableAuthBadges
          connectedProviders={row.original.connectedProviders}
          hasPassword={row.original.hasPassword}
          t={t}
        />
      ),
    }),
    columnHelper.accessor('createdAt', {
      id: 'joined',
      header: ({ column }) => (
        <UsersTableColumnHeader column={column} title={t('columns.joined')} />
      ),
      enableSorting: true,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground tabular-nums">
          {formatJoinedDate(getValue())}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: ({ column }) => (
        <UsersTableColumnHeader column={column} title={t('columns.actions')} />
      ),
      enableSorting: false,
      cell: ({ row }) => (
        <Link
          href={`/admin/users/${row.original.id}`}
          className="text-primary font-medium hover:underline"
          aria-label={t('viewUserAriaLabel', { email: row.original.email })}
        >
          {t('viewUser')}
        </Link>
      ),
    }),
  ];
}
