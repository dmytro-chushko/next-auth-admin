'use client';

import { useTranslations } from 'next-intl';

import type { UserMe } from '@/shared/api';
import { Badge } from '@/shared/ui/badge';

type ConnectedAccountsListProps = {
  connectedProviders?: UserMe['connectedProviders'];
};

export function ConnectedAccountsList({
  connectedProviders = [],
}: ConnectedAccountsListProps) {
  const t = useTranslations('profile.connectedAccounts');

  if (connectedProviders.length === 0) {
    return <p className="text-muted-foreground text-sm">{t('none')}</p>;
  }

  return (
    <ul className="flex flex-wrap gap-2" role="list">
      {connectedProviders.includes('google') ? (
        <li>
          <Badge variant="secondary">{t('google')}</Badge>
        </li>
      ) : null}
      {connectedProviders.includes('github') ? (
        <li>
          <Badge variant="secondary">{t('github')}</Badge>
        </li>
      ) : null}
    </ul>
  );
}
