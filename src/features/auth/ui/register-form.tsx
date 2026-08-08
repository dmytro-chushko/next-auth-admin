'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Link, useRouter } from '@/i18n/navigation';
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

import {
  createRegisterSchema,
  type RegisterFormValues,
} from '../model/auth-schemas';

export function RegisterForm() {
  const t = useTranslations('auth.register');
  const tCommon = useTranslations('auth.common');
  const tValidation = useTranslations('auth.validation');
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createRegisterSchema({
        emailRequired: tValidation('emailRequired'),
        emailInvalid: tValidation('emailInvalid'),
        passwordRequired: tValidation('passwordRequired'),
        passwordMin: tValidation('passwordMin'),
        nameRequired: tValidation('nameRequired'),
        nameMin: tValidation('nameMin'),
      }),
    [tValidation],
  );

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setFormError(null);

    const result = await authClient.signUp.email({
      name: values.name.trim(),
      email: values.email.toLowerCase(),
      password: values.password,
    });

    if (result.error) {
      setFormError(result.error.message ?? tCommon('unknownError'));

      return;
    }

    router.replace('/dashboard');
    router.refresh();
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
          <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('nameLabel')}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autoComplete="name"
                  placeholder={t('namePlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  autoComplete="new-password"
                  placeholder={t('passwordPlaceholder')}
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

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? t('submitting') : t('submit')}
        </Button>

        <p className="text-muted-foreground text-sm">
          {t('hasAccount')}{' '}
          <Link
            href="/login"
            className="text-foreground underline underline-offset-4"
          >
            {t('signIn')}
          </Link>
        </p>
      </form>
    </Form>
  );
}
