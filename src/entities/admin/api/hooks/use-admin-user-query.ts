'use client';

import { useQuery } from '@tanstack/react-query';

import {
  apiClient,
  ApiRequestError,
  getApiErrorMessage,
  type AdminUserDetail,
} from '@/shared/api';

import { adminUserQueryKey } from '../keys/admin-users-query-key';

type UseAdminUserQueryOptions = {
  userId: string;
  enabled?: boolean;
};

export function useAdminUserQuery({
  userId,
  enabled = true,
}: UseAdminUserQueryOptions) {
  return useQuery<AdminUserDetail>({
    queryKey: adminUserQueryKey(userId),
    enabled: enabled && userId.length > 0,
    retry: false,
    queryFn: async () => {
      const result = await apiClient.admin.getUser({
        params: { id: userId },
      });

      if (result.status !== 200) {
        throw new ApiRequestError(
          result.status,
          getApiErrorMessage(result.status, result.body),
        );
      }

      return result.body;
    },
  });
}
