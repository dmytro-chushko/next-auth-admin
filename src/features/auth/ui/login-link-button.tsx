'use client';

import { LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';

type LoginLinkButtonProps = {
  onNavigate?: () => void;
};

export function LoginLinkButton({ onNavigate }: LoginLinkButtonProps) {
  const t = useTranslations('header');

  return (
    <Button variant="default" size="icon" className="shrink-0" asChild>
      <Link href="/login" aria-label={t('signIn')} onClick={onNavigate}>
        <LogIn />
      </Link>
    </Button>
  );
}
