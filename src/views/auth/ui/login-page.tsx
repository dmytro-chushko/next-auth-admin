import { LoginForm } from '@/features/auth';
import type { OAuthProviderId } from '@/shared/auth/oauth-providers';

type LoginPageProps = {
  oauthProviders: OAuthProviderId[];
};

export function LoginPage({ oauthProviders }: LoginPageProps) {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <LoginForm oauthProviders={oauthProviders} />
    </section>
  );
}
