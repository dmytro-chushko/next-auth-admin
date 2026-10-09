'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { isAdminUserSessionActive } from '@/features/admin/lib/is-admin-user-session-active';
import type { AdminUserSessionSummary } from '@/shared/api';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { Badge } from '@/shared/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';

type AdminUserSessionsListProps = {
  sessions: AdminUserSessionSummary[];
};

const EMPTY_VALUE = '—';

export function AdminUserSessionsList({
  sessions,
}: AdminUserSessionsListProps) {
  const t = useTranslations('admin.userDetail.sessions');
  const format = useFormatter();
  const isMobile = useIsMobile();

  if (sessions.length === 0) {
    return <p className="text-muted-foreground text-sm">{t('empty')}</p>;
  }

  const formatDateTime = (value: Date) =>
    format.dateTime(value, { dateStyle: 'medium', timeStyle: 'short' });

  const renderStatusBadge = (expiresAt: Date) => {
    const isActive = isAdminUserSessionActive(expiresAt);

    return (
      <Badge variant={isActive ? 'secondary' : 'outline'}>
        {isActive ? t('active') : t('expired')}
      </Badge>
    );
  };

  if (isMobile) {
    return (
      <ul className="space-y-3" role="list">
        {sessions.map((session) => (
          <li key={session.id}>
            <div className="bg-card space-y-3 rounded-xl border p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 text-sm font-medium wrap-break-word">
                  {session.userAgent?.trim() || t('unknownAgent')}
                </p>
                {renderStatusBadge(session.expiresAt)}
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-muted-foreground shrink-0">{t('ip')}</dt>
                  <dd className="text-right tabular-nums">
                    {session.ipAddress ?? EMPTY_VALUE}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-muted-foreground shrink-0">
                    {t('createdAt')}
                  </dt>
                  <dd className="text-muted-foreground text-right tabular-nums">
                    {formatDateTime(session.createdAt)}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-muted-foreground shrink-0">
                    {t('expiresAt')}
                  </dt>
                  <dd className="text-muted-foreground text-right tabular-nums">
                    {formatDateTime(session.expiresAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Table className="min-w-160">
      <TableHeader>
        <TableRow>
          <TableHead>{t('userAgent')}</TableHead>
          <TableHead>{t('ip')}</TableHead>
          <TableHead>{t('createdAt')}</TableHead>
          <TableHead>{t('expiresAt')}</TableHead>
          <TableHead>{t('status')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow key={session.id}>
            <TableCell className="max-w-[16rem] whitespace-normal">
              {session.userAgent?.trim() || t('unknownAgent')}
            </TableCell>
            <TableCell className="text-muted-foreground tabular-nums">
              {session.ipAddress ?? EMPTY_VALUE}
            </TableCell>
            <TableCell className="text-muted-foreground tabular-nums">
              {formatDateTime(session.createdAt)}
            </TableCell>
            <TableCell className="text-muted-foreground tabular-nums">
              {formatDateTime(session.expiresAt)}
            </TableCell>
            <TableCell>{renderStatusBadge(session.expiresAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
