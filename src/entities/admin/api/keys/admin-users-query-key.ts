import type { AdminUsersListQuery } from '@/shared/api';

export const adminUsersQueryKeyRoot = ['admin', 'users'] as const;

export function adminUsersQueryKey(params: AdminUsersListQuery) {
  return [...adminUsersQueryKeyRoot, 'list', params] as const;
}

export function adminUserQueryKey(userId: string) {
  return [...adminUsersQueryKeyRoot, 'detail', userId] as const;
}
