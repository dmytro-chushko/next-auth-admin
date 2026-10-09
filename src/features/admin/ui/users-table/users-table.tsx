'use client';

import { flexRender } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import { useAdminUsersTable } from '@/features/admin/hooks/use-admin-users-table';
import { hasAdminUsersActiveFilters } from '@/features/admin/lib/has-admin-users-active-filters';
import { UsersTableCards } from '@/features/admin/ui/users-table/users-table-cards';
import { UsersTablePagination } from '@/features/admin/ui/users-table/users-table-pagination';
import { UsersTableToolbar } from '@/features/admin/ui/users-table/users-table-toolbar';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';

const SKELETON_ROW_COUNT = 5;
const SKELETON_COLUMN_COUNT = 6;
const SKELETON_CARD_COUNT = 3;

function getHeaderAriaSort(
  canSort: boolean,
  sorted: false | 'asc' | 'desc',
): 'ascending' | 'descending' | 'none' | undefined {
  if (!canSort) {
    return undefined;
  }

  if (sorted === 'asc') {
    return 'ascending';
  }

  if (sorted === 'desc') {
    return 'descending';
  }

  return 'none';
}

function UsersTableSkeleton({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <div className="space-y-3" aria-hidden="true">
        {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-44 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2" aria-hidden="true">
      <Skeleton className="h-10 w-full rounded-md" />
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-3">
          {Array.from({ length: SKELETON_COLUMN_COUNT }, (_, columnIndex) => (
            <Skeleton key={columnIndex} className="h-12 flex-1 rounded-md" />
          ))}
        </div>
      ))}
    </div>
  );
}

function UsersTableEmptyState({
  onClearFilters,
  showClearFilters,
}: {
  onClearFilters: () => void;
  showClearFilters: boolean;
}) {
  const t = useTranslations('admin.users');

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border px-4 py-10 text-center">
      <p className="text-muted-foreground text-sm">{t('empty')}</p>
      {showClearFilters ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClearFilters}
        >
          {t('clearFilters')}
        </Button>
      ) : null}
    </div>
  );
}

export function UsersTable() {
  const t = useTranslations('admin.users');
  const isMobile = useIsMobile();
  const { table, query, params, setParams, clearFilters, total } =
    useAdminUsersTable();
  const rows = table.getRowModel().rows;
  const sortableHeaders =
    table
      .getHeaderGroups()[0]
      ?.headers.filter((header) => header.column.getCanSort()) ?? [];

  if (query.isPending && query.data === undefined) {
    return <UsersTableSkeleton isMobile={isMobile} />;
  }

  if (query.isError && query.data === undefined) {
    return (
      <div className="space-y-4">
        <UsersTableToolbar
          params={params}
          onParamsChange={setParams}
          onClearFilters={clearFilters}
        />
        <div className="space-y-3" role="alert">
          <p className="text-destructive text-sm">{t('loadError')}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              void query.refetch();
            }}
          >
            {t('retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UsersTableToolbar
        params={params}
        onParamsChange={setParams}
        onClearFilters={clearFilters}
      />
      <div
        aria-busy={query.isFetching || undefined}
        className={
          query.isFetching ? 'opacity-60 transition-opacity' : undefined
        }
      >
        {rows.length === 0 ? (
          <UsersTableEmptyState
            onClearFilters={clearFilters}
            showClearFilters={hasAdminUsersActiveFilters(params)}
          />
        ) : isMobile ? (
          <div className="space-y-3">
            {sortableHeaders.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {sortableHeaders.map((header) => (
                  <div key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </div>
                ))}
              </div>
            ) : null}
            <UsersTableCards table={table} />
          </div>
        ) : (
          <Table className="min-w-160">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      aria-sort={getHeaderAriaSort(
                        header.column.getCanSort(),
                        header.column.getIsSorted(),
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <UsersTablePagination
        page={params.page}
        pageSize={params.pageSize}
        total={total}
        onPageChange={(page) => {
          setParams({ page });
        }}
      />
    </div>
  );
}
