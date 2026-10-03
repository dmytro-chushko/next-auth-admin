'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

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

import { useProfilePasswordForm } from '../hooks/use-profile-password-form';

type ProfilePasswordSectionProps = {
  hasPassword: boolean;
  onExpanded?: () => void;
};

export function ProfilePasswordSection({
  hasPassword,
  onExpanded,
}: ProfilePasswordSectionProps) {
  const t = useTranslations('profile.password');
  const tProfile = useTranslations('profile');
  const [isExpanded, setIsExpanded] = useState(false);
  const { form, handleSubmit, isPending } = useProfilePasswordForm({
    hasPassword,
    onSuccess: () => {
      setIsExpanded(false);
    },
  });

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    onExpanded?.();
  }, [isExpanded, onExpanded]);

  if (!isExpanded) {
    return (
      <div className="space-y-3">
        {!hasPassword ? (
          <p className="text-muted-foreground text-sm">
            {t('oauthSetPasswordHint')}
          </p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsExpanded(true);
          }}
        >
          {hasPassword ? t('changePassword') : t('setPassword')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!hasPassword ? (
        <p className="text-muted-foreground text-sm">
          {t('oauthSetPasswordHint')}
        </p>
      ) : null}
      <Form {...form}>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {hasPassword ? (
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('currentPassword')}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('newPassword')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
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
                <FormLabel>{t('confirmPassword')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={isPending} aria-busy={isPending}>
              {isPending ? t('savingPassword') : t('savePassword')}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => {
                form.reset();
                setIsExpanded(false);
              }}
            >
              {tProfile('cancel')}
            </Button>
          </div>
          {hasPassword ? (
            <p className="text-sm">
              <Link
                href="/forgot-password"
                className="text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                {t('forgotCurrentPassword')}
              </Link>
            </p>
          ) : null}
        </form>
      </Form>
    </div>
  );
}
