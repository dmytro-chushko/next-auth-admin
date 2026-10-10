'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient, ApiRequestError, getApiErrorMessage } from '@/shared/api';

import {
  adminUserQueryKey,
  adminUsersQueryKeyRoot,
} from '../keys/admin-users-query-key';

export type AdminDeleteUserPayload = {
  userId: string;
};

export function useAdminDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: AdminDeleteUserPayload) => {
      const result = await apiClient.admin.deleteUser({
        params: { id: userId },
      });

      if (result.status !== 204) {
        throw new ApiRequestError(
          result.status,
          getApiErrorMessage(result.status, result.body),
        );
      }
    },
    onSuccess: async (_data, { userId }) => {
      await queryClient.cancelQueries({ queryKey: adminUserQueryKey(userId) });
      queryClient.removeQueries({ queryKey: adminUserQueryKey(userId) });
      await queryClient.invalidateQueries({
        queryKey: [...adminUsersQueryKeyRoot, 'list'],
      });
    },
  });
}
