'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { useRegisterEligibilityQuery } from '@/entities/user';
import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/shared/auth/auth-client';

import { buildAuthCallbackUrl } from '../lib/build-auth-callback-url';
import {
  createRegisterSchema,
  type RegisterFormValues,
} from '../model/auth-schemas';

export function useRegisterForm() {
  const t = useTranslations('auth.register');
  const tCommon = useTranslations('auth.common');
  const tValidation = useTranslations('auth.validation');
  const locale = useLocale();
  const router = useRouter();

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

  const email = useWatch({ control: form.control, name: 'email' });
  const eligibilityQuery = useRegisterEligibilityQuery({
    email: email ?? '',
    enabled: false,
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    const normalizedEmail = values.email.toLowerCase();

    const eligibilityResult = await eligibilityQuery.refetch();

    if (eligibilityResult.error || eligibilityResult.data == null) {
      toast.error(tCommon('unknownError'));

      return;
    }

    const eligibility = eligibilityResult.data;

    if (eligibility === 'oauth_only') {
      toast.error(t('oauthAccountExists'));

      return;
    }

    if (eligibility === 'pending_verification') {
      router.replace(
        `/verify-email/pending?email=${encodeURIComponent(normalizedEmail)}`,
      );

      return;
    }

    if (eligibility === 'already_registered') {
      toast.error(t('alreadyRegistered'));

      return;
    }

    const result = await authClient.signUp.email({
      name: values.name.trim(),
      email: normalizedEmail,
      password: values.password,
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

    router.replace(
      `/verify-email/pending?email=${encodeURIComponent(normalizedEmail)}`,
    );
    router.refresh();
  });

  return {
    form,
    handleSubmit,
    isPending: form.formState.isSubmitting || eligibilityQuery.isFetching,
  };
}
