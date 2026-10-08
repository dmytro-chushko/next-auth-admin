'use client';

import { useTranslations } from 'next-intl';

import type { AdminUsersListQuery } from '@/shared/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

type UsersTableFiltersFieldsProps = {
  params: AdminUsersListQuery;
  onParamsChange: (patch: Partial<AdminUsersListQuery>) => void;
  fullWidth?: boolean;
};

const ALL_VALUE = 'all';

export function UsersTableFiltersFields({
  params,
  onParamsChange,
  fullWidth = false,
}: UsersTableFiltersFieldsProps) {
  const t = useTranslations('admin.users');
  const triggerClassName = fullWidth ? 'w-full' : 'w-[11rem] shrink-0';

  return (
    <>
      <Select
        value={params.role ?? ALL_VALUE}
        onValueChange={(value) => {
          onParamsChange({
            role:
              value === ALL_VALUE
                ? undefined
                : (value as AdminUsersListQuery['role']),
          });
        }}
      >
        <SelectTrigger
          aria-label={t('filters.role')}
          className={triggerClassName}
        >
          <SelectValue placeholder={t('filters.roleAll')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{t('filters.roleAll')}</SelectItem>
          <SelectItem value="user">{t('filters.roleUser')}</SelectItem>
          <SelectItem value="admin">{t('filters.roleAdmin')}</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={
          params.verified === undefined
            ? ALL_VALUE
            : params.verified
              ? 'true'
              : 'false'
        }
        onValueChange={(value) => {
          onParamsChange({
            verified: value === ALL_VALUE ? undefined : value === 'true',
          });
        }}
      >
        <SelectTrigger
          aria-label={t('filters.verified')}
          className={triggerClassName}
        >
          <SelectValue placeholder={t('filters.verifiedAll')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{t('filters.verifiedAll')}</SelectItem>
          <SelectItem value="true">{t('filters.verifiedYes')}</SelectItem>
          <SelectItem value="false">{t('filters.verifiedNo')}</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
