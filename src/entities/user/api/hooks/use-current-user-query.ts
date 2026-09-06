'use client';

import { useQuery } from '@tanstack/react-query';

import {
  apiClient,
  ApiRequestError,
  getApiErrorMessage,
  type UserMe,
} from '@/shared/api';

import { currentUserQueryKey } from '../keys/current-user-query-key';

type UseCurrentUserQueryOptions = {
  initialData?: UserMe | null;
  enabled?: boolean;
};

export function useCurrentUserQuery(options: UseCurrentUserQueryOptions = {}) {
  return useQuery<UserMe | null>({
    queryKey: currentUserQueryKey,
    initialData: options.initialData,
    enabled: options.enabled ?? true,
    queryFn: async () => {
      const result = await apiClient.users.me();

      if (result.status === 401) {
        return null;
      }

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
