'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { currentUserQueryKey } from '@/entities/user';
import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/shared/auth/auth-client';

export function useUserDropdown() {
  const t = useTranslations('header');
  const tCommon = useTranslations('auth.common');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message || tCommon('unknownError'));

        return;
      }

      queryClient.setQueryData(currentUserQueryKey, null);
      toast.success(t('logOutSuccess'));
      router.replace('/');
      router.refresh();
    } catch {
      toast.error(tCommon('unknownError'));
    } finally {
      setIsLoggingOut(false);
    }
  }

  return {
    handleLogout,
    isLoggingOut,
  };
}
