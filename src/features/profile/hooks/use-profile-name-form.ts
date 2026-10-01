'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { currentUserQueryKey } from '@/entities/user';
import { useRouter } from '@/i18n/navigation';
import type { UserMe } from '@/shared/api';
import { authClient } from '@/shared/auth/auth-client';

import {
  createProfileNameSchema,
  type ProfileNameFormValues,
} from '../model/profile-name.schema';

export function useProfileNameForm(user: UserMe) {
  const t = useTranslations('profile');
  const tCommon = useTranslations('auth.common');
  const queryClient = useQueryClient();
  const router = useRouter();

  const schema = useMemo(
    () =>
      createProfileNameSchema({
        nameRequired: t('validation.nameRequired'),
        nameMin: t('validation.nameMin'),
        nameMax: t('validation.nameMax'),
      }),
    [t],
  );

  const form = useForm<ProfileNameFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
    },
  });

  useEffect(() => {
    form.reset({ name: user.name });
  }, [form, user.name]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const result = await authClient.updateUser({
      name: values.name,
    });

    if (result.error) {
      toast.error(result.error.message ?? tCommon('unknownError'));

      return;
    }

    queryClient.setQueryData<UserMe | null>(currentUserQueryKey, (previous) =>
      previous ? { ...previous, name: values.name } : previous,
    );
    form.reset({ name: values.name });
    toast.success(t('nameUpdateSuccess'));
    router.refresh();
  });

  return {
    form,
    handleSubmit,
    isPending: form.formState.isSubmitting,
  };
}
