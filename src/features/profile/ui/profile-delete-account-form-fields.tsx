'use client';

import { useTranslations } from 'next-intl';
import type { UseFormReturn } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

import type { ProfileDeleteAccountFormValues } from '../model/profile-delete-account.schema';

type ProfileDeleteAccountFormFieldsProps = {
  form: UseFormReturn<ProfileDeleteAccountFormValues>;
  email: string;
  hasPassword: boolean;
};

export function ProfileDeleteAccountFormFields({
  form,
  email,
  hasPassword,
}: ProfileDeleteAccountFormFieldsProps) {
  const t = useTranslations('profile.dangerZone');

  return (
    <>
      <FormField
        control={form.control}
        name="emailConfirmation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('emailConfirmationLabel')}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                autoComplete="off"
                placeholder={email}
                aria-describedby="delete-account-email-hint"
              />
            </FormControl>
            <p
              id="delete-account-email-hint"
              className="text-muted-foreground text-xs"
            >
              {t('emailConfirmationHint')}
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
      {hasPassword ? (
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('currentPassword')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="current-password"
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <p className="text-muted-foreground text-sm">{t('oauthReauthHint')}</p>
      )}
    </>
  );
}
