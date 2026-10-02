'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/shared/auth/auth-client';

import {
  createResetPasswordSchema,
  type ResetPasswordFormValues,
} from '../model/reset-password.schema';

export function useResetPasswordForm(tokenFromSearch: string) {
  const t = useTranslations('auth.resetPassword');
  const tCommon = useTranslations('auth.common');
  const tValidation = useTranslations('auth.validation');
  const router = useRouter();

  const schema = useMemo(
    () =>
      createResetPasswordSchema({
        passwordMin: tValidation('passwordMin'),
        passwordMax: tValidation('passwordMax'),
        passwordsMismatch: t('errors.mismatch'),
        tokenRequired: t('errors.tokenRequired'),
      }),
    [t, tValidation],
  );

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      token: tokenFromSearch,
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    const result = await authClient.resetPassword({
      newPassword: values.newPassword,
      token: values.token,
    });

    if (result.error) {
      toast.error(result.error.message ?? tCommon('unknownError'));

      return;
    }

    toast.success(t('success'));
    router.replace('/login');
  });

  return {
    form,
    handleSubmit,
    isPending: form.formState.isSubmitting,
  };
}
