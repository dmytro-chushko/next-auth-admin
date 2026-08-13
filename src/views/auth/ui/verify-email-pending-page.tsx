import { VerifyEmailPendingForm } from '@/features/auth';

type VerifyEmailPendingPageProps = {
  email: string;
};

export function VerifyEmailPendingPage({ email }: VerifyEmailPendingPageProps) {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <VerifyEmailPendingForm initialEmail={email} />
    </section>
  );
}
