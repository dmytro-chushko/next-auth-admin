'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Link } from '@/i18n/navigation';
import { authClient } from '@/shared/auth/auth-client';
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

import { useResendCooldown } from '../hooks/use-resend-cooldown';
import { buildVerifyCallbackUrl } from '../lib/build-verify-callback-url';
import {
  createResendVerificationSchema,
  type ResendVerificationFormValues,
} from '../model/auth-schemas';

type VerifyEmailPendingFormProps = {
  initialEmail: string;
};

export function VerifyEmailPendingForm({
  initialEmail,
}: VerifyEmailPendingFormProps) {
  const t = useTranslations('auth.verifyEmailPending');
  const tCommon = useTranslations('auth.common');
  const tValidation = useTranslations('auth.validation');
  const locale = useLocale();
  const { isCooldownActive, secondsLeft, startCooldown } = useResendCooldown();
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createResendVerificationSchema({
        emailRequired: tValidation('emailRequired'),
        emailInvalid: tValidation('emailInvalid'),
      }),
    [tValidation],
  );

  const form = useForm<ResendVerificationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: initialEmail,
    },
  });

  async function onSubmit(values: ResendVerificationFormValues) {
    if (isCooldownActive) {
      return;
    }

    setFormError(null);
    setFormSuccess(null);

    const result = await authClient.sendVerificationEmail({
      email: values.email.toLowerCase(),
      callbackURL: buildVerifyCallbackUrl(locale, window.location.origin),
    });

    if (result.error) {
      setFormError(result.error.message ?? tCommon('unknownError'));

      return;
    }

    setFormSuccess(t('resendSuccess'));
    startCooldown();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-sm flex-col gap-4"
        noValidate
      >
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-muted-foreground text-sm">{t('description')}</p>
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

        {formError ? (
          <p className="text-destructive text-sm">{formError}</p>
        ) : null}

        {formSuccess ? (
          <p className="text-muted-foreground text-sm">{formSuccess}</p>
        ) : null}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting || isCooldownActive}
        >
          {form.formState.isSubmitting
            ? t('resending')
            : isCooldownActive
              ? t('resendCooldown', { seconds: secondsLeft })
              : t('resendButton')}
        </Button>

        <Link
          href="/login"
          className="text-muted-foreground text-sm underline underline-offset-4"
        >
          {t('goToLogin')}
        </Link>
      </form>
    </Form>
  );
}
