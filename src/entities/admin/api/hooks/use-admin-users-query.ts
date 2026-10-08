'use client';

import { useQuery } from '@tanstack/react-query';

import {
  apiClient,
  ApiRequestError,
  getApiErrorMessage,
  toAdminUsersListQueryParams,
  type AdminUserListResult,
  type AdminUsersListQuery,
} from '@/shared/api';

import { adminUsersQueryKey } from '../keys/admin-users-query-key';

type UseAdminUsersQueryOptions = {
  params: AdminUsersListQuery;
  enabled?: boolean;
};

export function useAdminUsersQuery({
  params,
  enabled = true,
}: UseAdminUsersQueryOptions) {
  return useQuery<AdminUserListResult>({
    queryKey: adminUsersQueryKey(params),
    enabled,
    queryFn: async () => {
      const result = await apiClient.admin.listUsers({
        query: toAdminUsersListQueryParams(params),
      });

      if (result.status !== 200) {
        throw new ApiRequestError(
          result.status,
          getApiErrorMessage(result.status, result.body),
        );
      }

      return result.body;
    },
    placeholderData: (previousData) => previousData,
  });
}
