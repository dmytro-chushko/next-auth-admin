'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/shared/auth/auth-client';

import { buildAuthCallbackUrl } from '../lib/build-auth-callback-url';
import { createLoginSchema, type LoginFormValues } from '../model/auth-schemas';

export function useLoginForm() {
  const t = useTranslations('auth.login');
  const tCommon = useTranslations('auth.common');
  const tValidation = useTranslations('auth.validation');
  const locale = useLocale();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createLoginSchema({
        emailRequired: tValidation('emailRequired'),
        emailInvalid: tValidation('emailInvalid'),
        passwordRequired: tValidation('passwordRequired'),
        passwordMin: tValidation('passwordMin'),
      }),
    [tValidation],
  );

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setUnverifiedEmail(null);

    const email = values.email.toLowerCase();
    const result = await authClient.signIn.email({
      email,
      password: values.password,
      callbackURL: buildAuthCallbackUrl(
        locale,
        window.location.origin,
        '/dashboard',
      ),
    });

    if (result.error) {
      if (result.error.status === 403) {
        setUnverifiedEmail(email);
        setFormError(t('emailNotVerifiedHint'));

        return;
      }

      setFormError(result.error.message ?? tCommon('unknownError'));

      return;
    }

    router.replace('/dashboard');
    router.refresh();
  });

  return {
    form,
    handleSubmit,
    formError,
    unverifiedEmail,
    isPending: form.formState.isSubmitting,
  };
}
