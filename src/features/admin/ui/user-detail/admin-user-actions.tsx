'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { useCurrentUserQuery } from '@/entities/user';
import { isAdminUserSessionActive } from '@/features/admin/lib/is-admin-user-session-active';
import { AdminUserRoleForm } from '@/features/admin/ui/user-detail/admin-user-role-form';
import type { AdminUserDetail } from '@/shared/api';
import { useModal } from '@/shared/modal/use-modal';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';

type AdminUserActionsProps = {
  user: AdminUserDetail;
};

type AdminDangerActionRowProps = {
  title: string;
  description: string;
  descriptionId?: string;
  action: ReactNode;
};

const REVOKE_HINT_ID = 'admin-revoke-sessions-hint';

function AdminDangerActionRow({
  title,
  description,
  descriptionId,
  action,
}: AdminDangerActionRowProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p id={descriptionId} className="text-muted-foreground text-sm">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function AdminUserActions({ user }: AdminUserActionsProps) {
  const t = useTranslations('admin.actions');
  const tErrors = useTranslations('admin.errors');
  const { data: currentUser } = useCurrentUserQuery();
  const { open } = useModal();
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

        <div className="space-y-4">
          <AdminDangerActionRow
            title={t('revokeSessions')}
            description={
              hasActiveSessions
                ? t('revokeSessionsDescription')
                : t('revokeSessionsUnavailable')
            }
            descriptionId={REVOKE_HINT_ID}
            action={
              <Button
                type="button"
                variant="outline"
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
            }
          />

          <Separator />

          <AdminDangerActionRow
            title={t('deleteUser')}
            description={
              isSelf ? tErrors('cannotDeleteSelf') : t('deleteUserDescription')
            }
            action={
              isSelf ? null : (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    open('admin-user-deletion', {
                      userId: user.id,
                      email: user.email,
                    });
                  }}
                >
                  {t('deleteUser')}
                </Button>
              )
            }
          />
        </div>
      </section>
    </div>
  );
}
