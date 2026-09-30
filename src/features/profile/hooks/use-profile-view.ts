'use client';

import { useTranslations } from 'next-intl';

import { useCurrentUserQuery } from '@/entities/user';
import type { UserMe } from '@/shared/api';

export function useProfileView(initialUser: UserMe) {
  const { data } = useCurrentUserQuery({ initialData: initialUser });
  const user: UserMe = data ?? initialUser;
  const t = useTranslations('profile');
  const roleLabel = user.role === 'admin' ? t('roleAdmin') : t('roleUser');
  const emailVerifiedLabel = user.emailVerified
    ? t('emailVerified')
    : t('emailNotVerified');

  return {
    user,
    t,
    roleLabel,
    emailVerifiedLabel,
  };
}
