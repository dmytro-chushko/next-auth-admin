'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/shared/auth/auth-client';

import { buildVerifyCallbackUrl } from '../lib/build-verify-callback-url';
import {
  createRegisterSchema,
  type RegisterFormValues,
} from '../model/auth-schemas';

export function useRegisterForm() {
  const tCommon = useTranslations('auth.common');
  const tValidation = useTranslations('auth.validation');
  const locale = useLocale();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createRegisterSchema({
        emailRequired: tValidation('emailRequired'),
        emailInvalid: tValidation('emailInvalid'),
        passwordRequired: tValidation('passwordRequired'),
        passwordMin: tValidation('passwordMin'),
        nameRequired: tValidation('nameRequired'),
        nameMin: tValidation('nameMin'),
      }),
    [tValidation],
  );

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setFormError(null);

    const email = values.email.toLowerCase();
    const result = await authClient.signUp.email({
      name: values.name.trim(),
      email,
      password: values.password,
      callbackURL: buildVerifyCallbackUrl(locale, window.location.origin),
    });

    if (result.error) {
      setFormError(result.error.message ?? tCommon('unknownError'));

      return;
    }

    router.replace(`/verify-email/pending?email=${encodeURIComponent(email)}`);
    router.refresh();
  });

  return {
    form,
    handleSubmit,
    formError,
    isPending: form.formState.isSubmitting,
  };
}
