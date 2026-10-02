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

import { useForgotPasswordForm } from '../hooks/use-forgot-password-form';

export function ForgotPasswordForm() {
  const t = useTranslations('auth.forgotPassword');
  const { form, handleSubmit, isPending, isSubmitted } =
    useForgotPasswordForm();

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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('emailLabel')}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder={t('emailPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} aria-busy={isPending}>
          {isPending ? t('submitting') : t('submit')}
        </Button>

        {isSubmitted ? (
          <p className="text-muted-foreground text-sm">{t('submittedHint')}</p>
        ) : null}

        <p className="text-muted-foreground text-sm">
          <Link
            href="/login"
            className="text-foreground underline underline-offset-4"
          >
            {t('backToLogin')}
          </Link>
        </p>
      </form>
    </Form>
  );
}
