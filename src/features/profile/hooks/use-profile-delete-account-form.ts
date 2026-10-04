'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { currentUserQueryKey } from '@/entities/user';
import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/shared/auth/auth-client';

import {
  createProfileDeleteAccountFormSchema,
  type ProfileDeleteAccountFormValues,
} from '../model/profile-delete-account.schema';

type UseProfileDeleteAccountFormOptions = {
  email: string;
  hasPassword: boolean;
  onSuccess?: () => void;
};

export function useProfileDeleteAccountForm({
  email,
  hasPassword,
  onSuccess,
}: UseProfileDeleteAccountFormOptions) {
  const t = useTranslations('profile.dangerZone');
  const tCommon = useTranslations('auth.common');
  const router = useRouter();
  const queryClient = useQueryClient();
  const schema = useMemo(
    () =>
      createProfileDeleteAccountFormSchema(email, hasPassword, {
        emailMismatch: t('errors.emailMismatch'),
        currentPasswordRequired: t('errors.currentPasswordRequired'),
      }),
    [email, hasPassword, t],
  );
  const form = useForm<ProfileDeleteAccountFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      emailConfirmation: '',
      currentPassword: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const result = hasPassword
        ? await authClient.deleteUser({
            password: values.currentPassword ?? '',
          })
        : await authClient.deleteUser();

      if (result.error) {
        toast.error(mapDeleteUserError(result.error.message, t, tCommon));

        return;
      }

      queryClient.setQueryData(currentUserQueryKey, null);
      form.reset();
      toast.success(t('deleteSuccess'));
      onSuccess?.();
      router.replace('/');
      router.refresh();
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

function mapDeleteUserError(
  apiMessage: string | undefined,
  t: ReturnType<typeof useTranslations<'profile.dangerZone'>>,
  tCommon: ReturnType<typeof useTranslations<'auth.common'>>,
): string {
  if (!apiMessage) {
    return t('deleteError');
  }

  const normalized = apiMessage.toLowerCase();

  if (
    normalized.includes('password') &&
    (normalized.includes('invalid') ||
      normalized.includes('incorrect') ||
      normalized.includes('wrong'))
  ) {
    return t('errors.invalidPassword');
  }

  if (
    normalized.includes('admin') ||
    normalized.includes('cannot be deleted') ||
    normalized.includes("can't be deleted")
  ) {
    return t('adminCannotDelete');
  }

  if (
    normalized.includes('fresh') ||
    normalized.includes('session') ||
    normalized.includes('expired') ||
    normalized.includes('recent')
  ) {
    return t('errors.freshSessionRequired');
  }

  return apiMessage || tCommon('unknownError');
}
