import { ResetPasswordForm } from '@/features/auth';

type ResetPasswordPageProps = {
  token: string;
  hasInvalidTokenError?: boolean;
};

export function ResetPasswordPage({
  token,
  hasInvalidTokenError = false,
}: ResetPasswordPageProps) {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <ResetPasswordForm
        token={token}
        hasInvalidTokenError={hasInvalidTokenError}
      />
    </section>
  );
}
