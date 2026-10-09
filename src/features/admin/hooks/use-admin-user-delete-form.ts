'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAdminDeleteUserMutation } from '@/entities/admin';
import { mapAdminUsersApiError } from '@/features/admin/lib/map-admin-users-api-error';
import {
  createAdminUserDeleteFormSchema,
  type AdminUserDeleteFormValues,
} from '@/features/admin/model/admin-user-delete.schema';
import { useRouter } from '@/i18n/navigation';

type UseAdminUserDeleteFormOptions = {
  userId: string;
  email: string;
  onSuccess?: () => void;
};

export function useAdminUserDeleteForm({
  userId,
  email,
  onSuccess,
}: UseAdminUserDeleteFormOptions) {
  const t = useTranslations('admin.actions');
  const tErrors = useTranslations('admin.errors');
  const router = useRouter();
  const deleteUserMutation = useAdminDeleteUserMutation();
  const schema = useMemo(
    () =>
      createAdminUserDeleteFormSchema(email, {
        emailMismatch: t('deleteConfirmEmailMismatch'),
      }),
    [email, t],
  );
  const form = useForm<AdminUserDeleteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      emailConfirmation: '',
    },
  });

  const handleSubmit = form.handleSubmit(async () => {
    try {
      await deleteUserMutation.mutateAsync({ userId });
      form.reset();
      toast.success(t('deleteUserSuccess'));
      onSuccess?.();
      router.replace('/admin/users');
      router.refresh();
    } catch (error: unknown) {
      toast.error(mapAdminUsersApiError(error, tErrors));
    }
  });

  return {
    form,
    handleSubmit,
    isPending: deleteUserMutation.isPending,
  };
}
