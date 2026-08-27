import { RegisterForm } from '@/features/auth';
import type { OAuthProviderId } from '@/shared/auth/oauth-providers';

type RegisterPageProps = {
  oauthProviders: OAuthProviderId[];
};

export function RegisterPage({ oauthProviders }: RegisterPageProps) {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <RegisterForm oauthProviders={oauthProviders} />
    </section>
  );
}
