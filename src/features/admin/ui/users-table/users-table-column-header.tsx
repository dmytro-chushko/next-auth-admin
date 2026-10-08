'use client';

import type { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { AdminUsersTableFeatures } from '@/features/admin/model/admin-users-table-features';
import type { AdminUserListItem } from '@/shared/api';
import { Button } from '@/shared/ui/button';

type UsersTableColumnHeaderProps = {
  title: string;
  column: Column<AdminUsersTableFeatures, AdminUserListItem, unknown>;
};

export function UsersTableColumnHeader({
  title,
  column,
}: UsersTableColumnHeaderProps) {
  const t = useTranslations('admin.users');

  if (!column.getCanSort()) {
    return <span>{title}</span>;
  }

  const sorted = column.getIsSorted();
  const sortLabel =
    sorted === 'asc'
      ? t('sort.asc')
      : sorted === 'desc'
        ? t('sort.desc')
        : t('sort.none');

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-2 h-8 gap-1 px-2 has-[>svg]:px-2"
      onClick={column.getToggleSortingHandler()}
      aria-label={`${title}: ${sortLabel}`}
    >
      <span>{title}</span>
      {sorted === 'asc' ? (
        <ArrowUp className="size-3.5" aria-hidden="true" />
      ) : sorted === 'desc' ? (
        <ArrowDown className="size-3.5" aria-hidden="true" />
      ) : (
        <ArrowUpDown
          className="text-muted-foreground size-3.5"
          aria-hidden="true"
        />
      )}
    </Button>
  );
}
