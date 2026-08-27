import { prisma } from '@/shared/db/prisma';

import { CREDENTIAL_PROVIDER_ID } from './oauth-providers';

export type RegisterEligibilityStatus =
  'allowed' | 'oauth_only' | 'pending_verification' | 'already_registered';

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
