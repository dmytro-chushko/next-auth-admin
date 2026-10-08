'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  apiClient,
  ApiRequestError,
  getApiErrorMessage,
  type AdminUserDetail,
  type Role,
} from '@/shared/api';

import {
  adminUserQueryKey,
  adminUsersQueryKeyRoot,
} from '../keys/admin-users-query-key';

export type AdminUpdateRolePayload = {
  userId: string;
  role: Role;
};

export function useAdminUpdateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: AdminUpdateRolePayload) => {
      const result = await apiClient.admin.updateUserRole({
        params: { id: userId },
        body: { role },
      });

      if (result.status !== 200) {
        throw new ApiRequestError(
          result.status,
          getApiErrorMessage(result.status, result.body),
        );
      }

      return result.body;
    },
    onSuccess: async (data: AdminUserDetail, { userId }) => {
      queryClient.setQueryData(adminUserQueryKey(userId), data);
      await queryClient.invalidateQueries({
        queryKey: adminUsersQueryKeyRoot,
      });
    },
  });
}
