'use client';

import type { UserMe } from '@/shared/api';
import { Separator } from '@/shared/ui/separator';

import { useProfileView } from '../hooks/use-profile-view';

import { AvatarEditor } from './avatar-editor';
import { ProfileNameForm } from './profile-name-form';
import { ProfileSettingsSection } from './profile-settings-section';

type ProfileViewProps = {
  initialUser: UserMe;
};

export function ProfileView({ initialUser }: ProfileViewProps) {
  const { user, t, roleLabel, emailVerifiedLabel } =
    useProfileView(initialUser);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8 md:max-w-4xl lg:max-w-5xl">
      <header className="mb-2">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
      </header>

      <div className="divide-border divide-y">
        <ProfileSettingsSection
          title={t('avatarSectionTitle')}
          description={t('avatarSectionDescription')}
        >
          <AvatarEditor initialUser={initialUser} />
        </ProfileSettingsSection>

        <ProfileSettingsSection title={t('detailsSectionTitle')}>
          <div className="space-y-6">
            <div className="md:max-w-md">
              <ProfileNameForm user={user} />
            </div>
            <Separator />
            <dl className="grid gap-4 text-sm md:grid-cols-2">
              <div className="grid gap-1">
                <dt className="font-medium">{t('email')}</dt>
                <dd className="text-muted-foreground">{user.email}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="font-medium">{t('role')}</dt>
                <dd className="text-muted-foreground">{roleLabel}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="font-medium">{t('emailStatus')}</dt>
                <dd className="text-muted-foreground">{emailVerifiedLabel}</dd>
              </div>
            </dl>
          </div>
        </ProfileSettingsSection>
      </div>
    </div>
  );
}
