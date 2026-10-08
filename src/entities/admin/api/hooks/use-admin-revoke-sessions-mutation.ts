'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient, ApiRequestError, getApiErrorMessage } from '@/shared/api';

import { adminUserQueryKey } from '../keys/admin-users-query-key';

export type AdminRevokeSessionsPayload = {
  userId: string;
};

export function useAdminRevokeSessionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: AdminRevokeSessionsPayload) => {
      const result = await apiClient.admin.revokeUserSessions({
        params: { id: userId },
        body: {},
      });

      if (result.status !== 200) {
        throw new ApiRequestError(
          result.status,
          getApiErrorMessage(result.status, result.body),
        );
      }

      return result.body;
    },
    onSuccess: async (_data, { userId }) => {
      await queryClient.invalidateQueries({
        queryKey: adminUserQueryKey(userId),
      });
    },
  });
}
