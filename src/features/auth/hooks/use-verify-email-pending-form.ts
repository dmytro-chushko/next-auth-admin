'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { authClient } from '@/shared/auth/auth-client';

import { buildAuthCallbackUrl } from '../lib/build-auth-callback-url';
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

    const result = await authClient.sendVerificationEmail({
      email: values.email.toLowerCase(),
      callbackURL: buildAuthCallbackUrl(
        locale,
        window.location.origin,
        '/verify-email',
      ),
    });

    if (result.error) {
      toast.error(result.error.message ?? tCommon('unknownError'));

      return;
    }

    toast.success(t('resendSuccess'));
    startCooldown();
  });

  return {
    form,
    handleSubmit,
    isPending: form.formState.isSubmitting,
    isCooldownActive,
    resendCooldownSeconds: secondsLeft,
  };
}
