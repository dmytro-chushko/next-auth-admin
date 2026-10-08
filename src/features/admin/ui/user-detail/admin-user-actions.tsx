'use client';

import { useTranslations } from 'next-intl';

import { useCurrentUserQuery } from '@/entities/user';
import { isAdminUserSessionActive } from '@/features/admin/lib/is-admin-user-session-active';
import { AdminUserRoleForm } from '@/features/admin/ui/user-detail/admin-user-role-form';
import type { AdminUserDetail } from '@/shared/api';
import { useModal } from '@/shared/modal/use-modal';
import { Button } from '@/shared/ui/button';

type AdminUserActionsProps = {
  user: AdminUserDetail;
};

const REVOKE_HINT_ID = 'admin-revoke-sessions-hint';

export function AdminUserActions({ user }: AdminUserActionsProps) {
  const t = useTranslations('admin.actions');
  const { data: currentUser } = useCurrentUserQuery();
  const { open } = useModal('admin-revoke-sessions');
  const isSelf = currentUser?.id === user.id;
  const hasActiveSessions = user.sessions.some((session) =>
    isAdminUserSessionActive(session.expiresAt),
  );

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold">{t('accessTitle')}</h2>
          <p className="text-muted-foreground text-sm">
            {t('accessDescription')}
          </p>
        </div>
        <AdminUserRoleForm user={user} isSelf={isSelf} />
      </section>

      <section
        className="bg-card border-destructive/40 space-y-4 rounded-xl border p-6 shadow-sm"
        aria-labelledby="admin-user-danger-zone-title"
      >
        <div className="space-y-1.5">
          <h2
            id="admin-user-danger-zone-title"
            className="text-destructive text-lg font-semibold"
          >
            {t('dangerZoneTitle')}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t('dangerZoneDescription')}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium">{t('revokeSessions')}</p>
            <p id={REVOKE_HINT_ID} className="text-muted-foreground text-sm">
              {hasActiveSessions
                ? t('revokeSessionsDescription')
                : t('revokeSessionsUnavailable')}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="shrink-0"
            disabled={!hasActiveSessions}
            aria-describedby={REVOKE_HINT_ID}
            onClick={() => {
              open('admin-revoke-sessions', {
                userId: user.id,
                email: user.email,
              });
            }}
          >
            {t('revokeSessions')}
          </Button>
        </div>
      </section>
    </div>
  );
}
