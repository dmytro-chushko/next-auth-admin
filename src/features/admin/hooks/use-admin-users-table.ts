'use client';

import {
  useTable,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';
import { useMemo } from 'react';

import {
  DEFAULT_ADMIN_USERS_LIST_QUERY,
  useAdminUsersQuery,
} from '@/entities/admin';
import { useAdminUsersListParams } from '@/features/admin/hooks/use-admin-users-list-params';
import { adminUsersTableFeatures } from '@/features/admin/model/admin-users-table-features';
import { createUsersTableColumns } from '@/features/admin/ui/users-table/users-table-columns';
import type { AdminUsersListQuery } from '@/shared/api';
import { resolveTableUpdater } from '@/shared/lib/resolve-table-updater';

type AdminUsersSortColumnId = 'user' | 'joined';

function resolveSortColumnId(
  sortBy: AdminUsersListQuery['sortBy'],
): AdminUsersSortColumnId {
  return sortBy === 'email' ? 'user' : 'joined';
}

function resolveSortBy(
  columnId: string,
): AdminUsersListQuery['sortBy'] | undefined {
  if (columnId === 'user') {
    return 'email';
  }

  if (columnId === 'joined') {
    return 'createdAt';
  }

  return undefined;
}

export function useAdminUsersTable() {
  const t = useTranslations('admin.users');
  const format = useFormatter();
  const { params, setParams, clearFilters } = useAdminUsersListParams();
  const query = useAdminUsersQuery({ params });

  const columns = useMemo(
    () =>
      createUsersTableColumns({
        t,
        formatJoinedDate: (value) =>
          format.dateTime(value, { dateStyle: 'medium' }),
      }),
    [format, t],
  );

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: params.page - 1,
      pageSize: params.pageSize,
    }),
    [params.page, params.pageSize],
  );

  const sorting = useMemo<SortingState>(
    () => [
      {
        id: resolveSortColumnId(params.sortBy),
        desc: params.sortOrder === 'desc',
      },
    ],
    [params.sortBy, params.sortOrder],
  );

  const pageCount = useMemo(() => {
    if (query.data === undefined) {
      return -1;
    }

    return Math.max(1, Math.ceil(query.data.total / params.pageSize));
  }, [params.pageSize, query.data]);

  const table = useTable({
    features: adminUsersTableFeatures,
    data: query.data?.items ?? [],
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
    },
    manualPagination: true,
    manualSorting: true,
    enableSortingRemoval: false,
    onPaginationChange: (updater) => {
      const next = resolveTableUpdater(updater, pagination);

      setParams({
        page: next.pageIndex + 1,
        pageSize: next.pageSize,
      });
    },
    onSortingChange: (updater) => {
      const next = resolveTableUpdater(updater, sorting);
      const primarySort = next[0];

      if (primarySort === undefined) {
        setParams({
          sortBy: DEFAULT_ADMIN_USERS_LIST_QUERY.sortBy,
          sortOrder: DEFAULT_ADMIN_USERS_LIST_QUERY.sortOrder,
        });

        return;
      }

      const sortBy = resolveSortBy(primarySort.id);

      if (sortBy === undefined) {
        return;
      }

      setParams({
        sortBy,
        sortOrder: primarySort.desc ? 'desc' : 'asc',
      });
    },
  });

  return {
    table,
    query,
    params,
    setParams,
    clearFilters,
    total: query.data?.total ?? 0,
  };
}
