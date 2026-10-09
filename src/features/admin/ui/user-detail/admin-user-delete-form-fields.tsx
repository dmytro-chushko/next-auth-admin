'use client';

import { useTranslations } from 'next-intl';
import type { UseFormReturn } from 'react-hook-form';

import type { AdminUserDeleteFormValues } from '@/features/admin/model/admin-user-delete.schema';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

type AdminUserDeleteFormFieldsProps = {
  form: UseFormReturn<AdminUserDeleteFormValues>;
  email: string;
};

export function AdminUserDeleteFormFields({
  form,
  email,
}: AdminUserDeleteFormFieldsProps) {
  const t = useTranslations('admin.actions');

  return (
    <FormField
      control={form.control}
      name="emailConfirmation"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('deleteConfirmEmailLabel')}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="email"
              autoComplete="off"
              placeholder={t('deleteConfirmEmailPlaceholder')}
              aria-describedby="admin-delete-user-email-hint"
            />
          </FormControl>
          <p
            id="admin-delete-user-email-hint"
            className="text-muted-foreground text-xs"
          >
            {email}
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
