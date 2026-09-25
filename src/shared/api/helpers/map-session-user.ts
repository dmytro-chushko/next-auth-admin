import type { AuthUser } from '@/shared/auth/auth';
import { isManagedUserAvatar } from '@/shared/storage';

import type { UserMe } from '../contracts';

function normalizeRole(role: string | null | undefined): UserMe['role'] {
  return role === 'admin' ? 'admin' : 'user';
}

type UserMeSource = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean | Date;
  role?: string | null;
};

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
  };
}

/** Map Better Auth session user → domain `UserMe` DTO. */
export function mapSessionUserToMe(user: AuthUser): UserMe {
  return mapUserToMe(user);
}
