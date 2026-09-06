'use client';

import { useQuery } from '@tanstack/react-query';

import { apiClient, ApiRequestError, getApiErrorMessage } from '@/shared/api';
import type { RegisterEligibilityStatus } from '@/shared/api/contracts/schemas/register-eligibility';

import { registerEligibilityQueryKey } from '../keys/register-eligibility-query-key';

type UseRegisterEligibilityQueryOptions = {
  email: string;
  enabled?: boolean;
};

async function fetchRegisterEligibility(
  email: string,
): Promise<RegisterEligibilityStatus> {
  const result = await apiClient.registration.checkEligibility({
    query: { email },
  });

  if (result.status !== 200) {
    throw new ApiRequestError(
      result.status,
      getApiErrorMessage(result.status, result.body),
    );
  }

  return result.body.status;
}

export function useRegisterEligibilityQuery({
  email,
  enabled = true,
}: UseRegisterEligibilityQueryOptions) {
  const normalizedEmail = email.trim().toLowerCase();

  return useQuery({
    queryKey: registerEligibilityQueryKey(normalizedEmail),
    queryFn: () => fetchRegisterEligibility(normalizedEmail),
    enabled: enabled && normalizedEmail.length > 0,
    staleTime: 30_000,
  });
}
