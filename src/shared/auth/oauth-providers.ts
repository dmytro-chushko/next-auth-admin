export const CREDENTIAL_PROVIDER_ID = 'credential';

export const OAUTH_PROVIDER_IDS = ['google', 'github'] as const;

export type OAuthProviderId = (typeof OAUTH_PROVIDER_IDS)[number];

export function getEnabledOAuthProviders(): OAuthProviderId[] {
  const providers: OAuthProviderId[] = [];

  if (
    process.env.GOOGLE_CLIENT_ID?.trim() &&
    process.env.GOOGLE_CLIENT_SECRET?.trim()
  ) {
    providers.push('google');
  }

  if (
    process.env.GITHUB_CLIENT_ID?.trim() &&
    process.env.GITHUB_CLIENT_SECRET?.trim()
  ) {
    providers.push('github');
  }

  return providers;
}
