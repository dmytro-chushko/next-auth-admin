import type { AdminUsersListQuery } from '@/shared/api';

export function hasAdminUsersActiveFilters(
  params: AdminUsersListQuery,
): boolean {
  return (
    params.search !== undefined ||
    params.role !== undefined ||
    params.verified !== undefined
  );
}
