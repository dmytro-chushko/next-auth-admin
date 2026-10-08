'use client';

import { ListFilter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { hasAdminUsersActiveFilters } from '@/features/admin/lib/has-admin-users-active-filters';
import { UsersTableFiltersFields } from '@/features/admin/ui/users-table/users-table-filters-fields';
import type { AdminUsersListQuery } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';

const SEARCH_DEBOUNCE_MS = 300;

type UsersTableToolbarProps = {
  params: AdminUsersListQuery;
  onParamsChange: (patch: Partial<AdminUsersListQuery>) => void;
  onClearFilters: () => void;
};

function countSheetFilters(params: AdminUsersListQuery): number {
  return [params.role, params.verified].filter((value) => value !== undefined)
    .length;
}

export function UsersTableToolbar({
  params,
  onParamsChange,
  onClearFilters,
}: UsersTableToolbarProps) {
  const t = useTranslations('admin.users');
  const [searchInput, setSearchInput] = useState(params.search ?? '');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const searchTimeoutRef = useRef<number | undefined>(undefined);
  const activeFiltersCount = countSheetFilters(params);
  const hasFilters = hasAdminUsersActiveFilters(params);

  useEffect(
    () => () => {
      window.clearTimeout(searchTimeoutRef.current);
    },
    [],
  );

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    window.clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = window.setTimeout(() => {
      onParamsChange({ search: value.trim() || undefined });
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleClearFilters = () => {
    window.clearTimeout(searchTimeoutRef.current);
    setSearchInput('');
    onClearFilters();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        value={searchInput}
        onChange={(event) => {
          handleSearchChange(event.target.value);
        }}
        placeholder={t('searchPlaceholder')}
        aria-label={t('searchAriaLabel')}
        className="w-full max-w-none min-w-0 flex-1 md:max-w-sm md:min-w-[12rem]"
      />
      <div className="hidden items-center gap-2 md:flex">
        <UsersTableFiltersFields
          params={params}
          onParamsChange={onParamsChange}
        />
        {hasFilters ? (
          <Button type="button" variant="outline" onClick={handleClearFilters}>
            {t('clearFilters')}
          </Button>
        ) : null}
      </div>
      <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="shrink-0 md:hidden"
            aria-label={t('filtersButton')}
          >
            <ListFilter className="size-4" aria-hidden="true" />
            <span>
              {activeFiltersCount > 0
                ? t('filtersButtonWithCount', { count: activeFiltersCount })
                : t('filtersButton')}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="gap-0 md:hidden">
          <SheetHeader>
            <SheetTitle>{t('filtersTitle')}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-3 px-4 py-2">
            <UsersTableFiltersFields
              params={params}
              onParamsChange={onParamsChange}
              fullWidth
            />
          </div>
          <SheetFooter className="gap-2 sm:flex-col">
            {hasFilters ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
              >
                {t('clearFilters')}
              </Button>
            ) : null}
            <Button
              type="button"
              onClick={() => {
                setIsFiltersOpen(false);
              }}
            >
              {t('filtersDone')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
