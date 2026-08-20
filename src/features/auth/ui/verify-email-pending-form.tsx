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

import { useVerifyEmailPendingForm } from '../hooks/use-verify-email-pending-form';

type VerifyEmailPendingFormProps = {
  initialEmail: string;
};

export function VerifyEmailPendingForm({
  initialEmail,
}: VerifyEmailPendingFormProps) {
  const t = useTranslations('auth.verifyEmailPending');
  const {
    form,
    handleSubmit,
    isPending,
    isCooldownActive,
    resendCooldownSeconds,
  } = useVerifyEmailPendingForm(initialEmail);

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

        <Button type="submit" disabled={isPending || isCooldownActive}>
          {isPending
            ? t('resending')
            : isCooldownActive
              ? t('resendCooldown', { seconds: resendCooldownSeconds })
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
