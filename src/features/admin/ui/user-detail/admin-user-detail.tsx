'use client';

import { notFound } from 'next/navigation';
import { useFormatter, useTranslations } from 'next-intl';

import { useAdminUserQuery } from '@/entities/admin';
import { AdminUserActions } from '@/features/admin/ui/user-detail/admin-user-actions';
import { AdminUserSessionsList } from '@/features/admin/ui/user-detail/admin-user-sessions-list';
import { ApiRequestError, type AdminUserDetail } from '@/shared/api';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { UserAvatar } from '@/shared/ui/user-avatar';

type AdminUserDetailViewProps = {
  userId: string;
};

function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiRequestError && error.status === 404;
}

function AdminUserDetailSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="flex items-center gap-4">
        <Skeleton className="size-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-28 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}

function AdminUserAuthProviders({ user }: { user: AdminUserDetail }) {
  const t = useTranslations('admin.userDetail.auth');
  const tUsers = useTranslations('admin.users');
  const badges: string[] = [];

  if (user.connectedProviders.includes('google')) {
    badges.push(tUsers('auth.google'));
  }

  if (user.connectedProviders.includes('github')) {
    badges.push(tUsers('auth.github'));
  }

  if (badges.length === 0) {
    return <span className="text-muted-foreground text-sm">{t('none')}</span>;
  }

  return (
    <ul className="flex flex-wrap gap-1" role="list">
      {badges.map((label) => (
        <li key={label}>
          <Badge variant="secondary">{label}</Badge>
        </li>
      ))}
    </ul>
  );
}

function AdminUserDetailContent({ user }: { user: AdminUserDetail }) {
  const t = useTranslations('admin.userDetail');
  const tUsers = useTranslations('admin.users');
  const format = useFormatter();
  const displayName = user.name.trim() || t('profile.noName');
  const roleLabel =
    user.role === 'admin' ? tUsers('roleAdmin') : tUsers('roleUser');
  const verifiedLabel = user.emailVerified
    ? tUsers('verifiedYes')
    : tUsers('verifiedNo');

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start gap-4">
        <UserAvatar
          name={user.name}
          email={user.email}
          avatarUrl={user.image}
          size="lg"
        />
        <div className="min-w-0 space-y-2">
          <h1 className="truncate text-2xl font-semibold">{displayName}</h1>
          <p className="text-muted-foreground truncate">{user.email}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{roleLabel}</Badge>
            <Badge variant={user.emailVerified ? 'secondary' : 'outline'}>
              {verifiedLabel}
            </Badge>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t('profile.title')}</h2>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="grid gap-1">
            <dt className="font-medium">{t('profile.name')}</dt>
            <dd className="text-muted-foreground">{displayName}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-medium">{t('profile.email')}</dt>
            <dd className="text-muted-foreground">{user.email}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-medium">{t('profile.role')}</dt>
            <dd className="text-muted-foreground">{roleLabel}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-medium">{t('profile.verified')}</dt>
            <dd className="text-muted-foreground">{verifiedLabel}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-medium">{t('profile.memberSince')}</dt>
            <dd className="text-muted-foreground">
              {format.dateTime(user.createdAt, { dateStyle: 'medium' })}
            </dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-medium">{t('profile.updatedAt')}</dt>
            <dd className="text-muted-foreground">
              {format.dateTime(user.updatedAt, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </dd>
          </div>
        </dl>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t('auth.title')}</h2>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="grid gap-1">
            <dt className="font-medium">{t('auth.providers')}</dt>
            <dd>
              <AdminUserAuthProviders user={user} />
            </dd>
          </div>
          <div className="grid gap-1">
            <dt className="font-medium">{t('auth.password')}</dt>
            <dd className="text-muted-foreground">
              {user.hasPassword ? t('auth.hasPassword') : t('auth.noPassword')}
            </dd>
          </div>
        </dl>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t('sessions.title')}</h2>
        <AdminUserSessionsList sessions={user.sessions} />
      </section>

      <AdminUserActions user={user} />
    </div>
  );
}

export function AdminUserDetailView({ userId }: AdminUserDetailViewProps) {
  const t = useTranslations('admin.userDetail');
  const query = useAdminUserQuery({ userId });

  if (query.isPending) {
    return <AdminUserDetailSkeleton />;
  }

  if (query.isError) {
    if (isNotFoundError(query.error)) {
      notFound();
    }

    return (
      <div className="space-y-3" role="alert">
        <p className="text-destructive text-sm">{t('loadError')}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            void query.refetch();
          }}
        >
          {t('retry')}
        </Button>
      </div>
    );
  }

  return <AdminUserDetailContent user={query.data} />;
}
