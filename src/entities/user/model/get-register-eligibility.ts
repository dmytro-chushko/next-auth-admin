import type { RegisterEligibilityStatus } from '@/shared/api/contracts/schemas/register-eligibility';
import { CREDENTIAL_PROVIDER_ID } from '@/shared/auth/oauth-providers';
import { prisma } from '@/shared/db/prisma';

/**
 * Server-only: used by `GET /api/register/eligibility`.
 * Decides whether a password sign-up is allowed for this email.
 */
export async function getRegisterEligibility(
  email: string,
): Promise<RegisterEligibilityStatus> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return 'allowed';
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      emailVerified: true,
      accounts: {
        select: { providerId: true },
      },
    },
  });

  if (!user) {
    return 'allowed';
  }

  const hasCredentialAccount = user.accounts.some(
    (account) => account.providerId === CREDENTIAL_PROVIDER_ID,
  );

  if (!hasCredentialAccount) {
    return 'oauth_only';
  }

  if (!user.emailVerified) {
    return 'pending_verification';
  }

  return 'already_registered';
}
