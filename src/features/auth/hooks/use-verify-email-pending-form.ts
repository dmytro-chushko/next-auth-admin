'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { authClient } from '@/shared/auth/auth-client';

import { buildVerifyCallbackUrl } from '../lib/build-verify-callback-url';
import {
  createResendVerificationSchema,
  type ResendVerificationFormValues,
} from '../model/auth-schemas';

import { useResendCooldown } from './use-resend-cooldown';

export function useVerifyEmailPendingForm(initialEmail: string) {
  const t = useTranslations('auth.verifyEmailPending');
  const tCommon = useTranslations('auth.common');
  const tValidation = useTranslations('auth.validation');
  const locale = useLocale();
  const { isCooldownActive, secondsLeft, startCooldown } = useResendCooldown();
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createResendVerificationSchema({
        emailRequired: tValidation('emailRequired'),
        emailInvalid: tValidation('emailInvalid'),
      }),
    [tValidation],
  );

  const form = useForm<ResendVerificationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: initialEmail,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    if (isCooldownActive) {
      return;
    }

    setFormError(null);
    setFormSuccess(null);

    const result = await authClient.sendVerificationEmail({
      email: values.email.toLowerCase(),
      callbackURL: buildVerifyCallbackUrl(locale, window.location.origin),
    });

    if (result.error) {
      setFormError(result.error.message ?? tCommon('unknownError'));

      return;
    }

    setFormSuccess(t('resendSuccess'));
    startCooldown();
  });

  return {
    form,
    handleSubmit,
    formError,
    formSuccess,
    isPending: form.formState.isSubmitting,
    isCooldownActive,
    resendCooldownSeconds: secondsLeft,
  };
}
