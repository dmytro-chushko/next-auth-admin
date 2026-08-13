import { VerifyEmailPanel } from '@/features/auth';

type VerifyEmailPageProps = {
  status: 'success' | 'invalid_token' | 'missing';
};

export function VerifyEmailPage({ status }: VerifyEmailPageProps) {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <VerifyEmailPanel status={status} />
    </section>
  );
}
