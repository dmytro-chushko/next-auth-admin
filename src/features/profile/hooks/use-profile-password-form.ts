'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { currentUserQueryKey } from '@/entities/user';
import type { UserMe } from '@/shared/api';
import { authClient } from '@/shared/auth/auth-client';

import {
  createProfilePasswordFormSchema,
  type ProfilePasswordFormValues,
} from '../model/profile-password.schema';

type UseProfilePasswordFormOptions = {
  hasPassword: boolean;
  onSuccess?: () => void;
};

async function setPasswordOnServer(newPassword: string): Promise<UserMe> {
  const response = await fetch('/api/users/me/set-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ newPassword }),
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      body &&
      typeof body === 'object' &&
      'error' in body &&
      typeof body.error === 'string'
        ? body.error
        : 'Failed to set password';

    throw new Error(message);
  }

  return body as UserMe;
}

export function useProfilePasswordForm({
  hasPassword,
  onSuccess,
}: UseProfilePasswordFormOptions) {
  const t = useTranslations('profile.password');
  const tCommon = useTranslations('auth.common');
  const queryClient = useQueryClient();

  const schema = useMemo(
    () =>
      createProfilePasswordFormSchema(hasPassword, {
        currentPasswordRequired: t('errors.currentPasswordRequired'),
        passwordMin: t('errors.passwordMin'),
        passwordMax: t('errors.passwordMax'),
        passwordsMismatch: t('errors.mismatch'),
      }),
    [hasPassword, t],
  );

  const form = useForm<ProfilePasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      if (hasPassword) {
        const result = await authClient.changePassword({
          currentPassword: values.currentPassword ?? '',
          newPassword: values.newPassword,
          revokeOtherSessions: false,
        });

        if (result.error) {
          toast.error(result.error.message ?? tCommon('unknownError'));

          return;
        }

        await queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
      } else {
        const user = await setPasswordOnServer(values.newPassword);
        queryClient.setQueryData(currentUserQueryKey, user);
      }

      form.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success(t('updateSuccess'));
      onSuccess?.();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : tCommon('unknownError');
      toast.error(message);
    }
  });

  return {
    form,
    handleSubmit,
    isPending: form.formState.isSubmitting,
  };
}
