import type { AuthUser } from '@/shared/auth/auth';
import {
  CREDENTIAL_PROVIDER_ID,
  OAUTH_PROVIDER_IDS,
  type OAuthProviderId,
} from '@/shared/auth/oauth-providers';
import { isManagedUserAvatar } from '@/shared/storage';

import type { ConnectedProvider, UserMe } from '../contracts';

export function normalizeRole(role: string | null | undefined): UserMe['role'] {
  return role === 'admin' ? 'admin' : 'user';
}

function isOAuthProviderId(value: string): value is OAuthProviderId {
  return (OAUTH_PROVIDER_IDS as readonly string[]).includes(value);
}

export type AccountSource = {
  providerId: string;
  password?: string | null;
};

type UserMeSource = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean | Date;
  role?: string | null;
  createdAt?: Date | string;
  accounts?: AccountSource[];
};

export function resolveConnectedProviders(
  accounts: AccountSource[] | undefined,
): ConnectedProvider[] {
  if (!accounts?.length) {
    return [];
  }

  const providers = new Set<ConnectedProvider>();

  for (const account of accounts) {
    if (isOAuthProviderId(account.providerId)) {
      providers.add(account.providerId);
    }
  }

  return [...providers];
}

export function resolveHasPassword(
  accounts: AccountSource[] | undefined,
): boolean {
  if (!accounts?.length) {
    return false;
  }

  return accounts.some(
    (account) =>
      account.providerId === CREDENTIAL_PROVIDER_ID &&
      typeof account.password === 'string' &&
      account.password.length > 0,
  );
}

/** Map DB / session user → domain `UserMe` DTO. */
export function mapUserToMe(user: UserMeSource): UserMe {
  const image = user.image ?? null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image,
    hasManagedAvatar: isManagedUserAvatar(image),
    role: normalizeRole(user.role),
    emailVerified: Boolean(user.emailVerified),
    createdAt: user.createdAt ? new Date(user.createdAt) : new Date(0),
    hasPassword: resolveHasPassword(user.accounts),
    connectedProviders: resolveConnectedProviders(user.accounts),
  };
}

/**
 * Map Better Auth session user → domain `UserMe` DTO.
 *
 * Session cookies do not include linked `Account` rows, so `hasPassword` and
 * `connectedProviders` are empty here. Prefer `getUserMeById` / `GET /api/users/me`
 * when those fields must be accurate (header, profile).
 */
export function mapSessionUserToMe(user: AuthUser): UserMe {
  return mapUserToMe({
    ...user,
    createdAt: user.createdAt,
  });
}
