'use server';

import {
  getRegisterEligibility,
  type RegisterEligibilityStatus,
} from '@/shared/auth/register-eligibility';

export async function checkRegisterEligibilityAction(
  email: string,
): Promise<RegisterEligibilityStatus> {
  return getRegisterEligibility(email);
}
