'use client';

import { useTranslations } from 'next-intl';

import { useModal } from '@/shared/modal/use-modal';
import { Button } from '@/shared/ui/button';

type ProfileDeleteAccountSectionProps = {
  email: string;
  hasPassword: boolean;
  isAdmin: boolean;
};

export function ProfileDeleteAccountSection({
  email,
  hasPassword,
  isAdmin,
}: ProfileDeleteAccountSectionProps) {
  const t = useTranslations('profile.dangerZone');
  const { open } = useModal('profile-deletion');

  if (isAdmin) {
    return (
      <p className="text-muted-foreground text-sm">{t('adminCannotDelete')}</p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">{t('description')}</p>
      <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
        <li>{t('consequences.profile')}</li>
        <li>{t('consequences.sessions')}</li>
        <li>{t('consequences.connectedAccounts')}</li>
      </ul>
      <Button
        type="button"
        variant="destructive"
        onClick={() =>
          open('profile-deletion', {
            email,
            hasPassword,
          })
        }
      >
        {t('deleteAccount')}
      </Button>
    </div>
  );
}
