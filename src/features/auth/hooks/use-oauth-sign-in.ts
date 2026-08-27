'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { authClient } from '@/shared/auth/auth-client';
import type { OAuthProviderId } from '@/shared/auth/oauth-providers';

import { buildAuthCallbackUrl } from '../lib/build-auth-callback-url';

export function useOAuthSignIn() {
  const t = useTranslations('auth.oauth');
  const tCommon = useTranslations('auth.common');
  const locale = useLocale();
  const [pendingProvider, setPendingProvider] =
    useState<OAuthProviderId | null>(null);

  async function signInWithOAuth(provider: OAuthProviderId) {
    setPendingProvider(provider);

    const result = await authClient.signIn.social({
      provider,
      callbackURL: buildAuthCallbackUrl(
        locale,
        window.location.origin,
        '/dashboard',
      ),
    });

    setPendingProvider(null);

    if (result.error) {
      toast.error(result.error.message ?? tCommon('unknownError'));
    }
  }

  return {
    signInWithOAuth,
    isPending: pendingProvider !== null,
    pendingProvider,
    signingInLabel: t('signingIn'),
  };
}
