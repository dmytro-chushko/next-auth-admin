import { ArrowLeft } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AdminUserDetailView } from '@/features/admin';
import { Link } from '@/i18n/navigation';

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { locale, id } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('admin.userDetail');

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t('backToUsers')}
      </Link>
      <AdminUserDetailView userId={id} />
    </div>
  );
}
