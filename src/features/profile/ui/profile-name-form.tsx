'use client';

import { useTranslations } from 'next-intl';

import type { UserMe } from '@/shared/api';
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

import { useProfileNameForm } from '../hooks/use-profile-name-form';

type ProfileNameFormProps = {
  user: UserMe;
};

export function ProfileNameForm({ user }: ProfileNameFormProps) {
  const t = useTranslations('profile');
  const { form, handleSubmit, isPending } = useProfileNameForm(user);

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('name')}</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} aria-busy={isPending}>
          {isPending ? t('savingName') : t('saveName')}
        </Button>
      </form>
    </Form>
  );
}
