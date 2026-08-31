'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import type { OAuthProviderId } from '@/shared/auth/oauth-providers';
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

import { useLoginForm } from '../hooks/use-login-form';

import { OAuthButtons } from './oauth-buttons';

type LoginFormProps = {
  oauthProviders: OAuthProviderId[];
};

export function LoginForm({ oauthProviders }: LoginFormProps) {
  const t = useTranslations('auth.login');
  const { form, handleSubmit, isPending } = useLoginForm();

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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('passwordLabel')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder={t('passwordPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? t('submitting') : t('submit')}
        </Button>

        <OAuthButtons providers={oauthProviders} />

        <p className="text-muted-foreground text-sm">
          {t('noAccount')}{' '}
          <Link
            href="/register"
            className="text-foreground underline underline-offset-4"
          >
            {t('signUp')}
          </Link>
        </p>
      </form>
    </Form>
  );
}
