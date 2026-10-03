'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useFormatter, useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef } from 'react';

import { currentUserQueryKey, useCurrentUserQuery } from '@/entities/user';
import type { UserMe } from '@/shared/api';

export function useProfileView(initialUser: UserMe) {
  const queryClient = useQueryClient();
  const { data } = useCurrentUserQuery({ initialData: initialUser });
  const user: UserMe = data ?? initialUser;
  const t = useTranslations('profile');
  const format = useFormatter();
  const roleLabel = user.role === 'admin' ? t('roleAdmin') : t('roleUser');
  const emailVerifiedLabel = user.emailVerified
    ? t('emailVerified')
    : t('emailNotVerified');
  const memberSince = format.dateTime(new Date(user.createdAt), {
    dateStyle: 'medium',
  });
  const passwordCardRef = useRef<HTMLElement>(null);
  const scrollPasswordCardIntoView = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        passwordCardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      });
    });
  }, []);

  // RSC profile payload includes accounts; header may have seeded an incomplete cache first.
  useEffect(() => {
    queryClient.setQueryData(currentUserQueryKey, initialUser);
  }, [initialUser, queryClient]);

  return {
    user,
    t,
    roleLabel,
    emailVerifiedLabel,
    memberSince,
    passwordCardRef,
    scrollPasswordCardIntoView,
  };
}
