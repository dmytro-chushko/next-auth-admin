import type { AuthUser } from '@/shared/auth/auth';

import type { UserMe } from './contracts';

function normalizeRole(role: string | null | undefined): UserMe['role'] {
  return role === 'admin' ? 'admin' : 'user';
}

/** Map Better Auth session user → domain `UserMe` DTO. */
export function mapSessionUserToMe(user: AuthUser): UserMe {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image ?? null,
    role: normalizeRole(user.role),
    emailVerified: Boolean(user.emailVerified),
  };
}
