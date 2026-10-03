'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

import { useResetPasswordForm } from '../hooks/use-reset-password-form';

type ResetPasswordFormProps = {
  token: string;
  hasInvalidTokenError?: boolean;
};

export function ResetPasswordForm({
  token,
  hasInvalidTokenError = false,
}: ResetPasswordFormProps) {
  const t = useTranslations('auth.resetPassword');
  const { form, handleSubmit, isPending } = useResetPasswordForm(token);
  const isTokenMissing = token.trim() === '' || hasInvalidTokenError;

  if (isTokenMissing) {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-muted-foreground text-sm">
            {hasInvalidTokenError ? t('invalidToken') : t('missingToken')}
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="text-foreground text-sm underline underline-offset-4"
        >
          {t('backToForgot')}
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-sm flex-col gap-4"
        noValidate
      >
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
        </div>

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('newPasswordLabel')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder={t('newPasswordPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('confirmPasswordLabel')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder={t('confirmPasswordPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="token"
          render={({ field }) => <input type="hidden" {...field} />}
        />

        <Button type="submit" disabled={isPending} aria-busy={isPending}>
          {isPending ? t('submitting') : t('submit')}
        </Button>
      </form>
    </Form>
  );
}
