'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { authClient } from '@/shared/auth/auth-client';

import { buildAuthCallbackUrl } from '../lib/build-auth-callback-url';
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '../model/auth-schemas';

export function useForgotPasswordForm() {
  const t = useTranslations('auth.forgotPassword');
  const tCommon = useTranslations('auth.common');
  const tValidation = useTranslations('auth.validation');
  const locale = useLocale();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const schema = useMemo(
    () =>
      createForgotPasswordSchema({
        emailRequired: tValidation('emailRequired'),
        emailInvalid: tValidation('emailInvalid'),
      }),
    [tValidation],
  );

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    const result = await authClient.requestPasswordReset({
      email: values.email.toLowerCase(),
      redirectTo: buildAuthCallbackUrl(
        locale,
        window.location.origin,
        '/reset-password',
      ),
    });

    if (result.error) {
      toast.error(result.error.message ?? tCommon('unknownError'));

      return;
    }

    setIsSubmitted(true);
    toast.success(t('success'));
  });

  return {
    form,
    handleSubmit,
    isPending: form.formState.isSubmitting,
    isSubmitted,
  };
}
