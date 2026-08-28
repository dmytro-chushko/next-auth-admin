'use client';

import { Github } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { OAuthProviderId } from '@/shared/auth/oauth-providers';
import { Button } from '@/shared/ui/button';

import { useOAuthSignIn } from '../hooks/use-oauth-sign-in';

type OAuthButtonsProps = {
  providers: OAuthProviderId[];
};

export function OAuthButtons({ providers }: OAuthButtonsProps) {
  const t = useTranslations('auth.oauth');
  const { signInWithOAuth, isPending, pendingProvider, signingInLabel } =
    useOAuthSignIn();

  if (providers.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            {t('divider')}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {providers.includes('google') ? (
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => signInWithOAuth('google')}
          >
            {pendingProvider === 'google' ? signingInLabel : t('google')}
          </Button>
        ) : null}

        {providers.includes('github') ? (
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            disabled={isPending}
            onClick={() => signInWithOAuth('github')}
          >
            {pendingProvider === 'github' ? (
              signingInLabel
            ) : (
              <>
                <Github className="size-4" />
                {t('github')}
              </>
            )}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
