'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { currentUserQueryKey } from '@/entities/user';
import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/shared/auth/auth-client';

import { buildAuthCallbackUrl } from '../lib/build-auth-callback-url';
import { createLoginSchema, type LoginFormValues } from '../model/auth-schemas';

export function useLoginForm() {
  const tCommon = useTranslations('auth.common');
  const tValidation = useTranslations('auth.validation');
  const locale = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();

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
        router.replace(
          `/verify-email/pending?email=${encodeURIComponent(email)}`,
        );

        return;
      }

      toast.error(result.error.message ?? tCommon('unknownError'));

      return;
    }

    await queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
    router.replace('/dashboard');
    router.refresh();
  });

  return {
    form,
    handleSubmit,
    isPending: form.formState.isSubmitting,
  };
}
